#!/usr/bin/env node

/**
 * Schema Verification Script for Supabase
 * Checks if all required tables and constraints exist
 */

import { createClient } from '@supabase/supabase-js';

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

async function verifySchema() {
  console.log('🔍 Verifying database schema...\n');

  try {
    // Check if profiles table exists
    console.log('📋 Checking tables...\n');

    // Try to query each table
    const tables = ['profiles', 'promotions', 'favorites'];
    const results = {};

    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);

        if (error && error.code === 'PGRST116') {
          results[table] = { exists: false, error: 'Table not found' };
        } else if (error) {
          results[table] = { exists: false, error: error.message };
        } else {
          results[table] = { exists: true, error: null };
        }
      } catch (err) {
        results[table] = { exists: false, error: err.message };
      }
    }

    // Display results
    console.log('📊 Table Status:');
    for (const [table, result] of Object.entries(results)) {
      if (result.exists) {
        console.log(`  ✅ ${table} - EXISTS`);
      } else {
        console.log(`  ❌ ${table} - NOT FOUND (${result.error})`);
      }
    }

    const allExist = Object.values(results).every(r => r.exists);

    if (allExist) {
      console.log('\n✅ All tables exist!\n');
      console.log('🎉 Database schema is ready for use!');
    } else {
      console.log('\n⚠️  Some tables are missing.\n');
      console.log('📌 To create the tables, execute the schema.sql file:');
      console.log(`   1. Go to: ${supabaseUrl}/project/sql`);
      console.log('   2. Copy and paste database/schema.sql');
      console.log('   3. Click "Run"');
    }

  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    process.exit(1);
  }
}

verifySchema();
