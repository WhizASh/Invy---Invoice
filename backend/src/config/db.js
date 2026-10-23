import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/invoicedb';

export const pool = new Pool({
  connectionString,
  connectionTimeoutMillis: 2000,
  idleTimeoutMillis: 10000,
});

let dbConnected = false;

// Attempt an initial health check
pool.connect()
  .then((client) => {
    dbConnected = true;
    client.release();
    console.log('[Database] Connected to PostgreSQL successfully.');
  })
  .catch((err) => {
    dbConnected = false;
    console.warn('[Database] PostgreSQL not accessible at DATABASE_URL:', err.message);
    console.warn('[Database] Running in fallback storage mode.');
  });

export const isConnected = () => dbConnected;

// In-memory fallback repository for environments without a running Postgres daemon
const inMemoryStore = {
  invoices: new Map(),
  invoiceItems: new Map(),
};

export const getInMemoryStore = () => inMemoryStore;

export const query = async (text, params = []) => {
  if (dbConnected) {
    return pool.query(text, params);
  }

  // Graceful fallback for queries if postgres is offline
  const trimmed = text.trim();

  // Handle invoice insertion
  if (trimmed.startsWith('INSERT INTO invoices')) {
    const [
      invoice_number, issue_date, due_date, currency,
      company_name, company_email, company_phone, company_address, company_logo_url, company_tax_id,
      client_name, client_email, client_phone, client_address, client_tax_id,
      tax_rate, discount_amount, notes, terms
    ] = params;

    const id = `inv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const invoice = {
      id,
      invoice_number,
      issue_date,
      due_date,
      currency: currency || 'INR',
      company_name,
      company_email,
      company_phone,
      company_address,
      company_logo_url,
      company_tax_id,
      client_name,
      client_email,
      client_phone,
      client_address,
      client_tax_id,
      tax_rate: Number(tax_rate || 0),
      discount_amount: Number(discount_amount || 0),
      notes,
      terms,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    inMemoryStore.invoices.set(id, invoice);
    return { rows: [invoice], rowCount: 1 };
  }

  // Handle invoice_items insertion
  if (trimmed.startsWith('INSERT INTO invoice_items')) {
    const [invoice_id, description, quantity, unit_price] = params;
    const itemId = `item_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const item = {
      id: itemId,
      invoice_id,
      description,
      quantity: Number(quantity),
      unit_price: Number(unit_price),
      created_at: new Date().toISOString(),
    };
    const items = inMemoryStore.invoiceItems.get(invoice_id) || [];
    items.push(item);
    inMemoryStore.invoiceItems.set(invoice_id, items);
    return { rows: [item], rowCount: 1 };
  }

  // Handle SELECT invoices by ID
  if (trimmed.includes('FROM invoices WHERE id = $1')) {
    const id = params[0];
    const invoice = inMemoryStore.invoices.get(id);
    return { rows: invoice ? [invoice] : [], rowCount: invoice ? 1 : 0 };
  }

  // Handle SELECT invoice_items by invoice_id
  if (trimmed.includes('FROM invoice_items WHERE invoice_id = $1')) {
    const invoiceId = params[0];
    const items = inMemoryStore.invoiceItems.get(invoiceId) || [];
    return { rows: items, rowCount: items.length };
  }

  // Handle SELECT all invoices
  if (trimmed.startsWith('SELECT') && trimmed.includes('FROM invoices')) {
    const invoices = Array.from(inMemoryStore.invoices.values()).sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
    return { rows: invoices, rowCount: invoices.length };
  }

  return { rows: [], rowCount: 0 };
};

export const getClient = async () => {
  if (dbConnected) {
    return pool.connect();
  }
  // Return a mock transaction client
  return {
    query,
    release: () => {},
  };
};
