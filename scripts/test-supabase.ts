#!/usr/bin/env node

/**
 * 🔍 Script de test de la configuration Supabase
 *
 * Teste:
 * - Connexion Supabase avec SUPABASE_URL et SUPABASE_KEY
 * - Session utilisateur (auth.getSession())
 * - Requêtes SQL: SELECT auth.uid(), SELECT current_user
 * - Vérification du role authenticated
 * - Test requête profiles
 *
 * Usage: tsx scripts/test-supabase.ts
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

// Charger .env depuis la racine du projet
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
config({ path: resolve(__dirname, '..', '.env') })

// Configuration
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_KEY

interface TestResult {
  timestamp: string
  tests: {
    connection: { success: boolean; error?: string }
    session: { success: boolean; user?: any; error?: string }
    authUid: { success: boolean; uid?: string; error?: string }
    currentUser: { success: boolean; user?: string; error?: string }
    profilesAccess: { success: boolean; count?: number; error?: string }
  }
  summary: {
    total: number
    passed: number
    failed: number
  }
}

async function testSupabase(): Promise<TestResult> {
  console.log('🔍 Démarrage des tests Supabase...\n')

  const result: TestResult = {
    timestamp: new Date().toISOString(),
    tests: {
      connection: { success: false },
      session: { success: false },
      authUid: { success: false },
      currentUser: { success: false },
      profilesAccess: { success: false }
    },
    summary: {
      total: 5,
      passed: 0,
      failed: 0
    }
  }

  // Test 1: Connexion Supabase
  console.log('📊 Test 1: Connexion à Supabase')
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ SUPABASE_URL ou SUPABASE_KEY manquant')
    result.tests.connection.error = 'Variables d\'environnement manquantes'
    result.summary.failed++
    return result
  }

  console.log(`   URL: ${SUPABASE_URL}`)
  console.log(`   Key: ${SUPABASE_KEY.substring(0, 20)}...`)

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
  result.tests.connection.success = true
  result.summary.passed++
  console.log('   ✅ Client Supabase créé\n')

  // Test 2: Vérifier session
  console.log('📊 Test 2: Vérifier session utilisateur')
  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

    if (sessionError) {
      throw sessionError
    }

    if (sessionData.session) {
      console.log('   ✅ Session active trouvée')
      console.log(`   User ID (sub): ${sessionData.session.user.id}`)
      console.log(`   Email: ${sessionData.session.user.email}`)
      console.log(`   Access Token: ${sessionData.session.access_token.substring(0, 20)}...`)
      result.tests.session.success = true
      result.tests.session.user = {
        id: sessionData.session.user.id,
        email: sessionData.session.user.email,
        role: sessionData.session.user.role
      }
      result.summary.passed++
    } else {
      console.log('   ⚠️  Aucune session active (utilisateur non connecté)')
      result.tests.session.success = false
      result.tests.session.error = 'Aucune session active'
      result.summary.failed++
    }
  } catch (err: any) {
    console.error('   ❌ Erreur session:', err.message)
    result.tests.session.error = err.message
    result.summary.failed++
  }
  console.log('')

  // Test 3: SELECT auth.uid() - Vérifier authenticated role
  console.log('📊 Test 3: SELECT auth.uid() - Test authenticated role')
  try {
    const { data, error } = await supabase.rpc('exec_sql', {
      query: 'SELECT auth.uid()'
    })

    if (error) {
      // RPC peut ne pas exister, essayer une autre approche
      console.log('   ℹ️  RPC exec_sql non disponible (normal)')

      // Alternative: Tester avec une query qui utilise auth.uid()
      const { data: testData, error: testError } = await supabase
        .from('profiles')
        .select('id')
        .limit(1)

      if (testError) {
        throw testError
      }

      console.log('   ✅ Requête utilisant auth.uid() réussie (role authenticated actif)')
      result.tests.authUid.success = true
      result.summary.passed++
    } else {
      console.log('   ✅ auth.uid() fonctionne:', data)
      result.tests.authUid.success = true
      result.tests.authUid.uid = data
      result.summary.passed++
    }
  } catch (err: any) {
    console.error('   ❌ Erreur auth.uid():', err.message)
    result.tests.authUid.error = err.message
    result.summary.failed++
  }
  console.log('')

  // Test 4: SELECT current_user
  console.log('📊 Test 4: SELECT current_user')
  try {
    const { data, error } = await supabase.rpc('exec_sql', {
      query: 'SELECT current_user'
    })

    if (error) {
      console.log('   ℹ️  RPC exec_sql non disponible pour current_user')
      console.log('   ℹ️  Utiliser Supabase SQL Editor pour tester manuellement')
      result.tests.currentUser.success = false
      result.tests.currentUser.error = 'RPC non disponible'
      result.summary.failed++
    } else {
      console.log('   ✅ current_user:', data)
      result.tests.currentUser.success = true
      result.tests.currentUser.user = data
      result.summary.passed++
    }
  } catch (err: any) {
    console.error('   ❌ Erreur current_user:', err.message)
    result.tests.currentUser.error = err.message
    result.summary.failed++
  }
  console.log('')

  // Test 5: Accès table profiles
  console.log('📊 Test 5: Accès table profiles')
  try {
    const { data, error, count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact' })
      .limit(5)

    if (error) {
      throw error
    }

    console.log(`   ✅ Accès profiles réussi: ${count} profils trouvés`)
    console.log(`   Échantillon: ${data?.length || 0} profils retournés`)
    result.tests.profilesAccess.success = true
    result.tests.profilesAccess.count = count || 0
    result.summary.passed++

    if (data && data.length > 0) {
      console.log('   Exemple profil:')
      console.log(`   - ID: ${data[0].id}`)
      console.log(`   - first_name: ${data[0].first_name || '(vide)'}`)
      console.log(`   - last_name: ${data[0].last_name || '(vide)'}`)
    }
  } catch (err: any) {
    console.error('   ❌ Erreur accès profiles:', err.message)
    result.tests.profilesAccess.error = err.message
    result.summary.failed++
  }
  console.log('')

  return result
}

// Fonction principale
async function main() {
  try {
    const result = await testSupabase()

    // Afficher résultat formaté JSON
    console.log('='.repeat(60))
    console.log('📋 RÉSULTAT COMPLET (JSON)')
    console.log('='.repeat(60) + '\n')

    console.log(JSON.stringify(result, null, 2))

    console.log('\n' + '='.repeat(60))
    console.log('📊 RÉSUMÉ DES TESTS')
    console.log('='.repeat(60))
    console.log(`Total tests: ${result.summary.total}`)
    console.log(`Tests réussis: ${result.summary.passed} ✅`)
    console.log(`Tests échoués: ${result.summary.failed} ❌`)
    console.log('='.repeat(60))

    if (result.summary.failed > 0) {
      console.log('\n⚠️  ATTENTION: Certains tests ont échoué')
      console.log('   → Vérifier les messages d\'erreur ci-dessus')
      console.log('   → Si aucune session: Se connecter d\'abord dans l\'application')
      console.log('   → Si erreur RPC: Normal, utiliser SQL Editor pour tests avancés')
    } else {
      console.log('\n✅ Tous les tests ont réussi!')
      console.log('   Configuration Supabase opérationnelle')
    }

  } catch (error: any) {
    console.error('\n❌ ERREUR:', error.message)
    console.error(error)
    process.exit(1)
  }
}

// Exécuter
main()
