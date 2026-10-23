import pg from 'pg';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const { Client } = pg;

export async function checkDatabaseConnection(customUrl = null) {
  const connectionString = customUrl || process.env.DATABASE_URL;

  if (!connectionString) {
    return {
      connected: false,
      error: 'DATABASE_URL is not set in backend/.env',
    };
  }

  // Parse connection string for display (safely masking password)
  let maskedUrl = connectionString;
  try {
    const parsed = new URL(connectionString);
    if (parsed.password) {
      parsed.password = '****';
    }
    maskedUrl = parsed.toString();
  } catch {
    // If not standard URL format, leave as is
  }

  const client = new Client({
    connectionString,
    connectionTimeoutMillis: 3000,
  });

  try {
    await client.connect();

    const infoRes = await client.query(`
      SELECT 
        current_database() AS db_name,
        current_user AS db_user,
        version() AS db_version,
        NOW() AS server_time;
    `);

    // Check if tables exist
    const tablesRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_name IN ('invoices', 'invoice_items');
    `);

    const existingTables = tablesRes.rows.map((r) => r.table_name);
    const hasInvoicesTable = existingTables.includes('invoices');
    const hasItemsTable = existingTables.includes('invoice_items');

    await client.end();

    return {
      connected: true,
      url: maskedUrl,
      dbName: infoRes.rows[0].db_name,
      dbUser: infoRes.rows[0].db_user,
      serverTime: infoRes.rows[0].server_time,
      version: infoRes.rows[0].db_version,
      tablesExist: hasInvoicesTable && hasItemsTable,
      existingTables,
    };
  } catch (err) {
    try {
      await client.end();
    } catch {
      // Ignore cleanup error
    }
    return {
      connected: false,
      url: maskedUrl,
      error: err.message,
      code: err.code,
    };
  }
}

// CLI Execution runner
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('\n========================================');
  console.log('   PostgreSQL Connection Health Check   ');
  console.log('========================================\n');

  checkDatabaseConnection().then((result) => {
    if (result.connected) {
      console.log('✅ Connection Status: SUCCESS');
      console.log(`   Database URL   : ${result.url}`);
      console.log(`   Database Name  : ${result.dbName}`);
      console.log(`   Connected User : ${result.dbUser}`);
      console.log(`   Server Time    : ${result.serverTime}`);
      console.log(`   Engine Version : ${result.version.split('\n')[0]}`);
      console.log('----------------------------------------');

      if (result.tablesExist) {
        console.log('✅ Tables Status    : All tables (invoices, invoice_items) exist.\n');
      } else {
        console.log('⚠️  Tables Warning   : Migration required.');
        console.log(`   Existing tables: ${result.existingTables.length > 0 ? result.existingTables.join(', ') : 'None'}`);
        console.log('   Run: npm run migrate\n');
      }
      process.exit(0);
    } else {
      console.error('❌ Connection Status: FAILED');
      console.error(`   Target URL    : ${result.url || 'Not defined'}`);
      console.error(`   Error Reason  : ${result.error}`);
      if (result.code) console.error(`   Error Code    : ${result.code}`);
      console.error('\n💡 Troubleshooting Tips:');
      console.error('   1. Verify PostgreSQL service is active:');
      console.error('      sudo service postgresql status   (Linux)');
      console.error('      brew services list               (macOS)');
      console.error('   2. Verify credentials in backend/.env:');
      console.error('      DATABASE_URL=postgresql://<user>:<password>@localhost:5432/<dbname>');
      console.error('   3. Ensure the database exists:');
      console.error('      createdb <dbname> -U <user>\n');
      process.exit(1);
    }
  });
}
