import { query, getClient } from '../config/db.js';
import { invoiceSchema } from '../validators/invoiceValidator.js';

export async function createInvoice(req, res) {
  try {
    const parseResult = invoiceSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parseResult.error.format(),
      });
    }

    const data = parseResult.data;
    const client = await getClient();

    try {
      await client.query('BEGIN');

      const invoiceInsertQuery = `
        INSERT INTO invoices (
          invoice_number, issue_date, due_date, currency,
          company_name, company_email, company_phone, company_address, company_logo_url, company_tax_id,
          client_name, client_email, client_phone, client_address, client_tax_id,
          tax_rate, discount_amount, notes, terms
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
        RETURNING *
      `;

      const invoiceParams = [
        data.invoice_number,
        data.issue_date,
        data.due_date || null,
        data.currency || 'INR',
        data.company_name,
        data.company_email || null,
        data.company_phone || null,
        data.company_address || null,
        data.company_logo_url || null,
        data.company_tax_id || null,
        data.client_name,
        data.client_email || null,
        data.client_phone || null,
        data.client_address || null,
        data.client_tax_id || null,
        data.tax_rate || 0,
        data.discount_amount || 0,
        data.notes || null,
        data.terms || null,
      ];

      const invoiceResult = await client.query(invoiceInsertQuery, invoiceParams);
      const createdInvoice = invoiceResult.rows[0];

      const insertedItems = [];
      for (const item of data.items) {
        const itemInsertQuery = `
          INSERT INTO invoice_items (invoice_id, description, quantity, unit_price)
          VALUES ($1, $2, $3, $4)
          RETURNING *
        `;
        const itemResult = await client.query(itemInsertQuery, [
          createdInvoice.id,
          item.description,
          item.quantity,
          item.unit_price,
        ]);
        insertedItems.push(itemResult.rows[0]);
      }

      await client.query('COMMIT');

      return res.status(201).json({
        ...createdInvoice,
        items: insertedItems,
      });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error creating invoice:', error);
    return res.status(500).json({ error: 'Failed to create invoice', message: error.message });
  }
}

export async function getInvoiceById(req, res) {
  try {
    const { id } = req.params;

    const invoiceResult = await query('SELECT * FROM invoices WHERE id = $1', [id]);
    if (invoiceResult.rows.length === 0) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    const invoice = invoiceResult.rows[0];
    const itemsResult = await query(
      'SELECT * FROM invoice_items WHERE invoice_id = $1 ORDER BY created_at ASC',
      [id]
    );

    return res.status(200).json({
      ...invoice,
      items: itemsResult.rows,
    });
  } catch (error) {
    console.error('Error fetching invoice by id:', error);
    return res.status(500).json({ error: 'Failed to fetch invoice', message: error.message });
  }
}

export async function getAllInvoices(req, res) {
  try {
    const result = await query('SELECT * FROM invoices ORDER BY created_at DESC LIMIT 50');
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching all invoices:', error);
    return res.status(500).json({ error: 'Failed to fetch invoices', message: error.message });
  }
}
