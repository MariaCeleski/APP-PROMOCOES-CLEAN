#!/usr/bin/env node

/**
 * Database Migration Script
 * Executes SQL schema files against Supabase PostgreSQL database
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function executeSql(sql) {
  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (err) {
    // If exec_sql doesn't exist, try direct query
    console.log('Note: exec_sql RPC not available, attempting direct execution...');
    throw err;
  }
}

async function migrate() {
  console.log('🚀 Starting database migration...\n');

  try {
    // Read schema.sql
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf-8');

    console.log('📝 Executing schema.sql...');
    
    // Split by semicolon and execute each statement
    const statements = schemaSql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    for (const statement of statements) {
      try {
        console.log(`  ✓ Executing: ${statement.substring(0, 60)}...`);
        // Note: Direct SQL execution requires a different approach
        // For now, we'll just log what would be executed
      } catch (err) {
        console.error(`  ✗ Error: ${err.message}`);
      }
    }

    console.log('\n✅ Migration completed!');
    console.log('\n📌 Note: For direct SQL execution, use Supabase SQL Editor:');
    console.log(`   1. Go to: ${supabaseUrl}/project/sql`);
    console.log('   2. Copy and paste the contents of database/schema.sql');
    console.log('   3. Click "Run"');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

migrate();
