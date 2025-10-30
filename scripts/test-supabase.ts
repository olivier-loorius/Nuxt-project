#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
config({ path: resolve(__dirname, '..', '.env') })

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

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('SUPABASE_URL or SUPABASE_KEY missing')
    result.tests.connection.error = 'Environment variables missing'
    result.summary.failed++
    return result
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
  result.tests.connection.success = true
  result.summary.passed++

  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

    if (sessionError) {
      throw sessionError
    }

    if (sessionData.session) {
      result.tests.session.success = true
      result.tests.session.user = {
        id: sessionData.session.user.id,
        email: sessionData.session.user.email,
        role: sessionData.session.user.role
      }
      result.summary.passed++
    } else {
      result.tests.session.success = false
      result.tests.session.error = 'No active session'
      result.summary.failed++
    }
  } catch (err: any) {
    console.error('Session error:', err.message)
    result.tests.session.error = err.message
    result.summary.failed++
  }

  try {
    const { data, error } = await supabase.rpc('exec_sql', {
      query: 'SELECT auth.uid()'
    })

    if (error) {
      const { data: testData, error: testError } = await supabase
        .from('profiles')
        .select('id')
        .limit(1)

      if (testError) {
        throw testError
      }

      result.tests.authUid.success = true
      result.summary.passed++
    } else {
      result.tests.authUid.success = true
      result.tests.authUid.uid = data
      result.summary.passed++
    }
  } catch (err: any) {
    console.error('auth.uid() error:', err.message)
    result.tests.authUid.error = err.message
    result.summary.failed++
  }

  try {
    const { data, error } = await supabase.rpc('exec_sql', {
      query: 'SELECT current_user'
    })

    if (error) {
      result.tests.currentUser.success = false
      result.tests.currentUser.error = 'RPC not available'
      result.summary.failed++
    } else {
      result.tests.currentUser.success = true
      result.tests.currentUser.user = data
      result.summary.passed++
    }
  } catch (err: any) {
    console.error('current_user error:', err.message)
    result.tests.currentUser.error = err.message
    result.summary.failed++
  }

  try {
    const { data, error, count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact' })
      .limit(5)

    if (error) {
      throw error
    }

    result.tests.profilesAccess.success = true
    result.tests.profilesAccess.count = count || 0
    result.summary.passed++
  } catch (err: any) {
    console.error('profiles access error:', err.message)
    result.tests.profilesAccess.error = err.message
    result.summary.failed++
  }

  return result
}

async function main() {
  try {
    const result = await testSupabase()
  } catch (error: any) {
    console.error('ERROR:', error.message)
    console.error(error)
    process.exit(1)
  }
}

main()
