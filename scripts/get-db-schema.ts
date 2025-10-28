import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// Charger les variables d'environnement
config()

const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_KEY || ''

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ SUPABASE_URL et SUPABASE_KEY doivent être définis dans .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function getDatabaseSchema() {
  console.log('📊 Récupération de la structure de la base de données...\n')

  try {
    // Requête SQL pour obtenir toutes les tables et leurs colonnes
    const { data: tables, error: tablesError } = await supabase.rpc('get_all_tables_info')

    if (tablesError) {
      console.error('❌ Erreur lors de la récupération des tables:', tablesError)

      // Fallback: essayer de lire les tables connues
      console.log('\n📋 Tentative de lecture des tables publiques...\n')

      const { data: publicTables, error: pgError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')

      if (pgError) {
        console.error('❌ Erreur:', pgError)
        return
      }

      console.log('Tables trouvées:', publicTables)
      return
    }

    console.log('✅ Structure récupérée avec succès!\n')
    console.log(JSON.stringify(tables, null, 2))

  } catch (error) {
    console.error('❌ Erreur:', error)
  }
}

// Alternative: Requête SQL directe pour obtenir la structure
async function getDatabaseSchemaSQL() {
  console.log('📊 Récupération de la structure via SQL...\n')

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
    console.error('❌ Erreur SQL:', error.message)

    // Dernière tentative: lister manuellement les tables connues
    console.log('\n📋 Lecture manuelle des tables courantes...\n')
    await listKnownTables()
    return
  }

  console.log('✅ Structure SQL récupérée!\n')
  console.log(JSON.stringify(data, null, 2))
}

// Liste manuelle des tables pour inspection
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

  console.log('🔍 Inspection des tables connues:\n')

  for (const tableName of knownTables) {
    try {
      const { data, error, count } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true })

      if (error) {
        console.log(`❌ ${tableName}: n'existe pas ou erreur d'accès`)
      } else {
        console.log(`✅ ${tableName}: ${count || 0} lignes`)
      }
    } catch (e) {
      console.log(`❌ ${tableName}: erreur`)
    }
  }
}

// Fonction principale
async function main() {
  console.log('🚀 Début de l\'analyse de la base de données\n')
  console.log('=' .repeat(60))

  await listKnownTables()

  console.log('\n' + '='.repeat(60))
  console.log('\n✨ Analyse terminée!')
}

main()
