#!/usr/bin/env node

/**
 * 🔍 Script d'audit de la structure BDD Supabase
 *
 * Vérifie:
 * - Users dans auth.users
 * - Profils dans profiles
 * - Correspondance entre auth.users et profiles
 * - Triggers handle_new_user
 * - Policies RLS sur profiles
 *
 * Usage: node --loader tsx utils/audit-supabase.ts
 */

import { createClient } from '@supabase/supabase-js'

// Configuration
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY

interface AuditResult {
  timestamp: string
  auth_users: any[]
  profiles: any[]
  missing_profiles: {
    user_id: string
    email: string
    created_at: string
  }[]
  trigger_exists: boolean
  trigger_details: any[]
  rls_policies: any[]
  summary: {
    total_users: number
    total_profiles: number
    users_without_profile: number
    trigger_ok: boolean
    policies_count: number
  }
}

async function auditSupabase(): Promise<AuditResult> {
  console.log('🔍 Démarrage de l\'audit Supabase...\n')

  // 1. Connexion à Supabase
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error('❌ SUPABASE_URL ou SUPABASE_KEY manquant dans les variables d\'environnement')
  }

  console.log('✅ Connexion à Supabase...')
  console.log(`   URL: ${SUPABASE_URL}`)
  console.log(`   Key: ${SUPABASE_KEY.substring(0, 20)}...`)

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

  const result: AuditResult = {
    timestamp: new Date().toISOString(),
    auth_users: [],
    profiles: [],
    missing_profiles: [],
    trigger_exists: false,
    trigger_details: [],
    rls_policies: [],
    summary: {
      total_users: 0,
      total_profiles: 0,
      users_without_profile: 0,
      trigger_ok: false,
      policies_count: 0
    }
  }

  // 2. Query auth.users
  console.log('\n📊 Query 1: auth.users (LIMIT 5)')
  console.log('   SELECT id, email, raw_user_meta_data, created_at FROM auth.users LIMIT 5')

  const { data: authUsers, error: authError } = await supabase
    .from('users')
    .select('id, email, raw_user_meta_data, created_at')
    .limit(5)

  if (authError) {
    console.error('❌ Erreur auth.users:', authError)
    // Try with rpc call
    console.log('   Tentative avec RPC...')
    const { data: rpcUsers, error: rpcError } = await supabase.rpc('get_auth_users', { limit_count: 5 })

    if (rpcError) {
      console.error('❌ Erreur RPC:', rpcError)
      result.auth_users = []
    } else {
      result.auth_users = rpcUsers || []
    }
  } else {
    result.auth_users = authUsers || []
  }

  console.log(`   ✅ ${result.auth_users.length} users trouvés`)
  result.summary.total_users = result.auth_users.length

  // 3. Query profiles
  console.log('\n📊 Query 2: profiles (LIMIT 10)')
  console.log('   SELECT * FROM profiles LIMIT 10')

  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('*')
    .limit(10)

  if (profilesError) {
    console.error('❌ Erreur profiles:', profilesError)
    result.profiles = []
  } else {
    result.profiles = profiles || []
  }

  console.log(`   ✅ ${result.profiles.length} profils trouvés`)
  result.summary.total_profiles = result.profiles.length

  // 4. Compare ids - Users sans profil
  console.log('\n🔍 Analyse: Users sans profil correspondant')

  const profileIds = new Set(result.profiles.map(p => p.id))
  const usersWithoutProfile = result.auth_users.filter(user => !profileIds.has(user.id))

  result.missing_profiles = usersWithoutProfile.map(user => ({
    user_id: user.id,
    email: user.email,
    created_at: user.created_at
  }))

  console.log(`   ⚠️  ${result.missing_profiles.length} users sans profil`)
  result.summary.users_without_profile = result.missing_profiles.length

  if (result.missing_profiles.length > 0) {
    console.log('   Users concernés:')
    result.missing_profiles.forEach(u => {
      console.log(`   - ${u.email} (${u.user_id})`)
    })
  }

  // 5. Vérifier trigger handle_new_user
  console.log('\n🔧 Query 3: Trigger handle_new_user')
  console.log('   SELECT * FROM pg_trigger WHERE tgname = \'on_auth_user_created\'')

  const { data: triggers, error: triggerError } = await supabase
    .rpc('check_trigger_exists', { trigger_name: 'on_auth_user_created' })

  if (triggerError) {
    console.log('   ℹ️  Impossible de vérifier le trigger (permissions requises)')
    console.log('   Erreur:', triggerError.message)
    result.trigger_exists = false
    result.trigger_details = []
  } else {
    result.trigger_details = triggers || []
    result.trigger_exists = result.trigger_details.length > 0
  }

  if (result.trigger_exists) {
    console.log('   ✅ Trigger trouvé')
  } else {
    console.log('   ❌ Trigger non trouvé')
  }
  result.summary.trigger_ok = result.trigger_exists

  // 6. Vérifier RLS policies
  console.log('\n🔒 Query 4: RLS Policies sur profiles')
  console.log('   SELECT * FROM pg_policies WHERE tablename = \'profiles\'')

  const { data: policies, error: policiesError } = await supabase
    .rpc('get_table_policies', { table_name: 'profiles' })

  if (policiesError) {
    console.log('   ℹ️  Impossible de vérifier les policies (permissions requises)')
    console.log('   Erreur:', policiesError.message)
    result.rls_policies = []
  } else {
    result.rls_policies = policies || []
  }

  console.log(`   ✅ ${result.rls_policies.length} policies trouvées`)
  result.summary.policies_count = result.rls_policies.length

  if (result.rls_policies.length > 0) {
    console.log('   Policies:')
    result.rls_policies.forEach((p: any) => {
      console.log(`   - ${p.policyname} (${p.cmd})`)
    })
  }

  return result
}

// Fonction principale
async function main() {
  try {
    const result = await auditSupabase()

    // Afficher résultat formaté JSON
    console.log('\n' + '='.repeat(60))
    console.log('📋 RÉSULTAT AUDIT COMPLET (JSON)')
    console.log('='.repeat(60) + '\n')

    console.log(JSON.stringify(result, null, 2))

    console.log('\n' + '='.repeat(60))
    console.log('📊 RÉSUMÉ')
    console.log('='.repeat(60))
    console.log(`Total users auth.users: ${result.summary.total_users}`)
    console.log(`Total profiles: ${result.summary.total_profiles}`)
    console.log(`Users sans profil: ${result.summary.users_without_profile}`)
    console.log(`Trigger handle_new_user: ${result.summary.trigger_ok ? '✅ OK' : '❌ MANQUANT'}`)
    console.log(`RLS Policies: ${result.summary.policies_count}`)
    console.log('='.repeat(60))

    if (result.summary.users_without_profile > 0) {
      console.log('\n⚠️  ATTENTION: Certains users n\'ont pas de profil correspondant!')
      console.log('   → Vérifier que le trigger handle_new_user fonctionne correctement')
      console.log('   → Créer manuellement les profils manquants si nécessaire')
    }

    if (!result.summary.trigger_ok) {
      console.log('\n⚠️  ATTENTION: Trigger handle_new_user non trouvé!')
      console.log('   → Les nouveaux users ne créeront pas automatiquement de profil')
      console.log('   → Installer le trigger depuis supabase/migrations/handle_new_user.sql')
    }

    if (result.summary.policies_count === 0) {
      console.log('\n⚠️  ATTENTION: Aucune policy RLS trouvée!')
      console.log('   → La table profiles n\'est peut-être pas protégée')
      console.log('   → Vérifier les policies RLS dans Supabase Dashboard')
    }

  } catch (error: any) {
    console.error('\n❌ ERREUR:', error.message)
    console.error(error)
    process.exit(1)
  }
}

// Exécuter
main()
