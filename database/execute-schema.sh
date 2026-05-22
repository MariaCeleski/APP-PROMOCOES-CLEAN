#!/bin/bash

# Database Migration Script for Supabase
# This script executes the schema.sql file in Supabase
#
# Usage: ./execute-schema.sh
# 
# Environment variables required:
# - SUPABASE_URL: Your Supabase project URL
# - SUPABASE_SERVICE_ROLE_KEY: Your Supabase service role key

set -e

# Check environment variables
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo "❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables"
  exit 1
fi

echo "🚀 Starting database migration..."
echo ""
echo "📍 Supabase URL: $SUPABASE_URL"
echo ""

# Extract project ID from URL
# Format: https://yncaphywduspgiinmsup.supabase.co
PROJECT_ID=$(echo "$SUPABASE_URL" | sed 's|https://||' | sed 's|\.supabase\.co||')

echo "📝 Reading schema.sql..."

# Read the schema file
SCHEMA_FILE="$(dirname "$0")/schema.sql"

if [ ! -f "$SCHEMA_FILE" ]; then
  echo "❌ schema.sql not found at $SCHEMA_FILE"
  exit 1
fi

# Read the entire schema
SCHEMA_SQL=$(cat "$SCHEMA_FILE")

echo ""
echo "✅ Schema file loaded successfully"
echo ""
echo "📌 IMPORTANT: To execute the migration, you need to:"
echo ""
echo "1️⃣  Go to Supabase SQL Editor:"
echo "   $SUPABASE_URL/project/sql"
echo ""
echo "2️⃣  Copy the entire contents of database/schema.sql"
echo ""
echo "3️⃣  Paste into the SQL Editor"
echo ""
echo "4️⃣  Click 'Run' button"
echo ""
echo "📊 This will create:"
echo "   ✓ profiles table with unique constraints on email and cpf"
echo "   ✓ promotions table with foreign key to profiles"
echo "   ✓ favorites table with composite primary key"
echo "   ✓ Indexes for optimized queries"
echo "   ✓ Row Level Security (RLS) policies"
echo ""
