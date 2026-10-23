import { z } from 'zod';

export const invoiceItemSchema = z.object({
  description: z.string().min(1, 'Item description is required'),
  quantity: z.coerce.number().positive('Quantity must be greater than 0'),
  unit_price: z.coerce.number().min(0, 'Unit price must be non-negative'),
});

export const invoiceSchema = z.object({
  invoice_number: z.string().min(1, 'Invoice number is required'),
  issue_date: z.string().min(1, 'Issue date is required'),
  due_date: z.string().optional().nullable(),
  currency: z.string().default('INR'),
  
  // Company details
  company_name: z.string().min(1, 'Company name is required'),
  company_email: z.string().email().optional().or(z.literal('')).nullable(),
  company_phone: z.string().optional().nullable(),
  company_address: z.string().optional().nullable(),
  company_logo_url: z.string().optional().nullable(),
  company_tax_id: z.string().optional().nullable(),
  
  // Client details
  client_name: z.string().min(1, 'Client name is required'),
  client_email: z.string().email().optional().or(z.literal('')).nullable(),
  client_phone: z.string().optional().nullable(),
  client_address: z.string().optional().nullable(),
  client_tax_id: z.string().optional().nullable(),
  
  // Financials
  tax_rate: z.coerce.number().min(0).max(100).default(0),
  discount_amount: z.coerce.number().min(0).default(0),
  notes: z.string().optional().nullable(),
  terms: z.string().optional().nullable(),
  
  // Line Items
  items: z.array(invoiceItemSchema).min(1, 'At least one line item is required'),
});
