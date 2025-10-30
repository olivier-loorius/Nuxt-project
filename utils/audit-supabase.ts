#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'

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
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error('SUPABASE_URL or SUPABASE_KEY missing')
  }

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

  const { data: authUsers, error: authError } = await supabase
    .from('users')
    .select('id, email, raw_user_meta_data, created_at')
    .limit(5)

  if (authError) {
    console.error('auth.users error:', authError)
    const { data: rpcUsers, error: rpcError } = await supabase.rpc('get_auth_users', { limit_count: 5 })

    if (rpcError) {
      console.error('RPC error:', rpcError)
      result.auth_users = []
    } else {
      result.auth_users = rpcUsers || []
    }
  } else {
    result.auth_users = authUsers || []
  }

  result.summary.total_users = result.auth_users.length

  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('*')
    .limit(10)

  if (profilesError) {
    console.error('profiles error:', profilesError)
    result.profiles = []
  } else {
    result.profiles = profiles || []
  }

  result.summary.total_profiles = result.profiles.length

  const profileIds = new Set(result.profiles.map(p => p.id))
  const usersWithoutProfile = result.auth_users.filter(user => !profileIds.has(user.id))

  result.missing_profiles = usersWithoutProfile.map(user => ({
    user_id: user.id,
    email: user.email,
    created_at: user.created_at
  }))

  result.summary.users_without_profile = result.missing_profiles.length

  const { data: triggers, error: triggerError } = await supabase
    .rpc('check_trigger_exists', { trigger_name: 'on_auth_user_created' })

  if (triggerError) {
    console.warn('Trigger check failed:', triggerError.message)
    result.trigger_exists = false
    result.trigger_details = []
  } else {
    result.trigger_details = triggers || []
    result.trigger_exists = result.trigger_details.length > 0
  }

  result.summary.trigger_ok = result.trigger_exists

  const { data: policies, error: policiesError } = await supabase
    .rpc('get_table_policies', { table_name: 'profiles' })

  if (policiesError) {
    console.warn('Policies check failed:', policiesError.message)
    result.rls_policies = []
  } else {
    result.rls_policies = policies || []
  }

  result.summary.policies_count = result.rls_policies.length

  return result
}

async function main() {
  try {
    const result = await auditSupabase()
  } catch (error: any) {
    console.error('ERROR:', error.message)
    console.error(error)
    process.exit(1)
  }
}

main()
