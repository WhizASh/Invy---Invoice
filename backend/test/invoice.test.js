import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { app } from '../src/index.js';
import { invoiceSchema } from '../src/validators/invoiceValidator.js';

describe('Invoice Validator (Zod)', () => {
  it('validates a correct invoice payload', () => {
    const validData = {
      invoice_number: 'INV-001',
      issue_date: '2026-10-23',
      due_date: '2026-11-23',
      currency: 'INR',
      company_name: 'Acme Studio',
      company_email: 'hello@acme.com',
      company_phone: '+91 9876543210',
      company_address: '123 MG Road, Bengaluru',
      company_tax_id: '29ABCDE1234F1Z5',
      client_name: 'Global Tech Ltd',
      client_email: 'finance@globaltech.com',
      client_phone: '+91 9123456789',
      client_address: '456 Cyber City, Gurugram',
      tax_rate: 18,
      discount_amount: 100,
      notes: 'Payment due in 30 days',
      terms: 'Interest 2% per month on late payment',
      items: [
        { description: 'Web Development', quantity: 1, unit_price: 5000 },
        { description: 'UI/UX Design', quantity: 2, unit_price: 1500 }
      ]
    };

    const parsed = invoiceSchema.safeParse(validData);
    assert.equal(parsed.success, true);
    assert.equal(parsed.data.items.length, 2);
  });

  it('rejects payload missing company_name', () => {
    const invalidData = {
      invoice_number: 'INV-002',
      issue_date: '2026-10-23',
      client_name: 'Client A',
      items: [{ description: 'Service', quantity: 1, unit_price: 100 }]
    };

    const parsed = invoiceSchema.safeParse(invalidData);
    assert.equal(parsed.success, false);
    const errors = parsed.error.format();
    assert.ok(errors.company_name);
  });

  it('rejects payload with empty items array', () => {
    const invalidData = {
      invoice_number: 'INV-003',
      issue_date: '2026-10-23',
      company_name: 'Acme',
      client_name: 'Client',
      items: []
    };

    const parsed = invoiceSchema.safeParse(invalidData);
    assert.equal(parsed.success, false);
    assert.ok(parsed.error.errors.some(e => e.path.includes('items')));
  });
});

describe('Invoice API Endpoints', () => {
  let server;
  let port;
  let baseUrl;

  before(async () => {
    await new Promise((resolve) => {
      server = app.listen(0, () => {
        port = server.address().port;
        baseUrl = `http://127.0.0.1:${port}`;
        resolve();
      });
    });
  });

  after(async () => {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  });

  it('POST /api/invoices creates a new invoice and returns 201', async () => {
    const res = await fetch(`${baseUrl}/api/invoices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        invoice_number: `INV-API-${Date.now()}`,
        issue_date: '2026-10-23',
        due_date: '2026-11-23',
        currency: 'INR',
        company_name: 'Monochrome Labs',
        company_email: 'contact@monochrome.io',
        client_name: 'Test Client',
        items: [
          { description: 'Consulting', quantity: 10, unit_price: 150 }
        ]
      })
    });

    assert.equal(res.status, 201);
    const data = await res.json();
    assert.ok(data.id);
    assert.equal(data.company_name, 'Monochrome Labs');
    assert.equal(data.items.length, 1);
  });

  it('GET /api/invoices returns an array of invoices', async () => {
    const res = await fetch(`${baseUrl}/api/invoices`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data));
    assert.ok(data.length >= 1);
  });

  it('GET /api/invoices/:id returns 404 for non-existent invoice', async () => {
    const res = await fetch(`${baseUrl}/api/invoices/non-existent-id-9999`);
    assert.equal(res.status, 404);
  });
});
