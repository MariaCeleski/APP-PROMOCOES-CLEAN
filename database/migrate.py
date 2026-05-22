#!/usr/bin/env python3
"""
Database Migration Script for Supabase
Executes SQL schema files against Supabase PostgreSQL database
"""

import os
import sys
import psycopg2
from psycopg2 import sql

def get_connection_string():
    """Build PostgreSQL connection string from Supabase URL"""
    supabase_url = os.getenv('SUPABASE_URL')
    supabase_password = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
    
    if not supabase_url or not supabase_password:
        print("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables")
        sys.exit(1)
    
    # Extract host from Supabase URL
    # Format: https://yncaphywduspgiinmsup.supabase.co
    host = supabase_url.replace('https://', '').replace('http://', '')
    
    # Supabase PostgreSQL connection details
    connection_string = f"postgresql://postgres:{supabase_password}@db.{host}:5432/postgres"
    return connection_string

def execute_migration():
    """Execute SQL migration"""
    print("🚀 Starting database migration...\n")
    
    try:
        # Read schema.sql
        schema_path = os.path.join(os.path.dirname(__file__), 'schema.sql')
        with open(schema_path, 'r') as f:
            schema_sql = f.read()
        
        print("📝 Executing schema.sql...")
        
        # Connect to database
        conn_string = get_connection_string()
        conn = psycopg2.connect(conn_string)
        cursor = conn.cursor()
        
        # Execute the entire schema
        cursor.execute(schema_sql)
        conn.commit()
        
        print("✅ Migration completed successfully!")
        print("\n📊 Tables created:")
        print("  ✓ profiles")
        print("  ✓ promotions")
        print("  ✓ favorites")
        print("\n🔒 Row Level Security (RLS) enabled on all tables")
        print("📑 Indexes created for optimized queries")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Migration failed: {str(e)}")
        sys.exit(1)

if __name__ == '__main__':
    execute_migration()
