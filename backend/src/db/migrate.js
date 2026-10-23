import { pool, isConnected } from '../config/db.js';

export const migrationSQL = `
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  issue_date DATE NOT NULL,
  due_date DATE,
  currency VARCHAR(10) DEFAULT 'INR',
  company_name VARCHAR(255) NOT NULL,
  company_email VARCHAR(255),
  company_phone VARCHAR(50),
  company_address TEXT,
  company_logo_url TEXT,
  company_tax_id VARCHAR(100),
  client_name VARCHAR(255) NOT NULL,
  client_email VARCHAR(255),
  client_phone VARCHAR(50),
  client_address TEXT,
  client_tax_id VARCHAR(100),
  tax_rate NUMERIC(5, 2) DEFAULT 0,
  discount_amount NUMERIC(12, 2) DEFAULT 0,
  notes TEXT,
  terms TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity NUMERIC(10, 2) NOT NULL DEFAULT 1,
  unit_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON invoices(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON invoice_items(invoice_id);
`;

export async function runMigration() {
  console.log('[Migration] Starting database migration...');
  try {
    const client = await pool.connect();
    try {
      await client.query(migrationSQL);
      console.log('[Migration] Migration completed successfully.');
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('[Migration] Migration error:', err.message);
    throw err;
  }
}

// If run directly: node src/db/migrate.js
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigration()
    .then(() => pool.end())
    .catch(() => process.exit(1));
}
