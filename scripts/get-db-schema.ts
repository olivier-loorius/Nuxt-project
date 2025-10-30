import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

config()

const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_KEY || ''

if (!supabaseUrl || !supabaseKey) {
  console.error('SUPABASE_URL and SUPABASE_KEY must be defined in .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function getDatabaseSchema() {
  try {
    const { data: tables, error: tablesError } = await supabase.rpc('get_all_tables_info')

    if (tablesError) {
      console.error('Error fetching tables:', tablesError)

      const { data: publicTables, error: pgError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')

      if (pgError) {
        console.error('Error:', pgError)
        return
      }

      return
    }

  } catch (error) {
    console.error('Error:', error)
  }
}

async function getDatabaseSchemaSQL() {
  const query = `
    SELECT
      t.table_name,
      c.column_name,
      c.data_type,
      c.is_nullable,
      c.column_default
    FROM
      information_schema.tables t
    JOIN
      information_schema.columns c ON t.table_name = c.table_name
    WHERE
      t.table_schema = 'public'
    ORDER BY
      t.table_name, c.ordinal_position;
  `

  const { data, error } = await supabase.rpc('exec_sql', { query })

  if (error) {
    console.error('SQL error:', error.message)
    await listKnownTables()
    return
  }
}

async function listKnownTables() {
  const knownTables = [
    'profiles',
    'products',
    'categories',
    'orders',
    'order_items',
    'addresses',
    'wishlists',
    'cart_items',
    'reviews'
  ]

  for (const tableName of knownTables) {
    try {
      const { data, error, count } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true })

      if (error) {
      }
    } catch (e) {
    }
  }
}

async function main() {
  await listKnownTables()
}

main()
