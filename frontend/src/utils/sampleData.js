export const sampleInvoice = {
  invoice_number: 'INV-2026-0042',
  issue_date: new Date().toISOString().split('T')[0],
  due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  currency: 'INR',

  // Company details
  company_name: 'STUDIO NOIR DESIGN & TECH',
  company_email: 'accounts@studionoir.design',
  company_phone: '+91 (080) 4123-8890',
  company_address: 'Level 4, Signature Towers, Indiranagar, Bengaluru, KA 560038',
  company_tax_id: 'GSTIN: 29AAACS1429B1ZB',
  company_logo_url: '',

  // Client details
  client_name: 'Vanguard Systems Pvt Ltd',
  client_email: 'billing@vanguardsys.io',
  client_phone: '+91 (022) 6789-0123',
  client_address: '14th Floor, Maker Chambers V, Nariman Point, Mumbai, MH 400021',
  client_tax_id: 'GSTIN: 27AABCV8791C1ZD',

  // Financials
  tax_rate: 18,
  discount_amount: 5000,
  notes: 'Payment is due within 30 days of invoice date. Please transfer to HDFC A/C: 50200012345678 (IFSC: HDFC0000123).',
  terms: 'Late payments will be subject to a 1.5% monthly financing charge. All disputes subject to Bengaluru jurisdiction.',

  // Items
  items: [
    {
      id: '1',
      description: 'Fullstack Platform Development (Milestone 1: Auth & Billing Engine)',
      quantity: 1,
      unit_price: 65000,
    },
    {
      id: '2',
      description: 'High-Fidelity Design System & Component Library in Figma',
      quantity: 1,
      unit_price: 28000,
    },
    {
      id: '3',
      description: 'DevOps & Automated CI/CD Deployment Architecture (PostgreSQL + Docker)',
      quantity: 1,
      unit_price: 15000,
    },
    {
      id: '4',
      description: 'Technical Code Review & Security Hardening Audit',
      quantity: 12,
      unit_price: 1200,
    },
  ],
};

export const emptyInvoice = {
  invoice_number: `INV-${Date.now().toString().slice(-6)}`,
  issue_date: new Date().toISOString().split('T')[0],
  due_date: '',
  currency: 'INR',

  company_name: '',
  company_email: '',
  company_phone: '',
  company_address: '',
  company_tax_id: '',
  company_logo_url: '',

  client_name: '',
  client_email: '',
  client_phone: '',
  client_address: '',
  client_tax_id: '',

  tax_rate: 0,
  discount_amount: 0,
  notes: '',
  terms: '',

  items: [
    {
      id: '1',
      description: '',
      quantity: 1,
      unit_price: 0,
    },
  ],
};
