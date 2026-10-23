import React from 'react';
import { FileText } from 'lucide-react';
import { SectionCard } from '../ui/SectionCard.jsx';
import { Input } from '../ui/Input.jsx';

const CURRENCIES = [
  { code: 'INR', label: 'INR (₹)' },
  { code: 'USD', label: 'USD ($)' },
  { code: 'EUR', label: 'EUR (€)' },
  { code: 'GBP', label: 'GBP (£)' },
  { code: 'JPY', label: 'JPY (¥)' },
  { code: 'CAD', label: 'CAD (CA$)' },
  { code: 'AUD', label: 'AUD (AU$)' },
];

export function InvoiceMetaSection({ data, onChange }) {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <SectionCard title="Invoice Metadata" badge="Details" icon={FileText}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Input
          id="invoice_number"
          label="Invoice No."
          value={data.invoice_number}
          onChange={(e) => handleChange('invoice_number', e.target.value)}
          placeholder="INV-001"
          required
        />

        <Input
          id="issue_date"
          type="date"
          label="Issue Date"
          value={data.issue_date}
          onChange={(e) => handleChange('issue_date', e.target.value)}
          required
        />

        <Input
          id="due_date"
          type="date"
          label="Due Date"
          value={data.due_date}
          onChange={(e) => handleChange('due_date', e.target.value)}
        />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="currency" className="text-xs font-bold uppercase tracking-wider text-neutral-800">
            Currency
          </label>
          <select
            id="currency"
            value={data.currency || 'INR'}
            onChange={(e) => handleChange('currency', e.target.value)}
            className="w-full rounded-none border border-neutral-900 bg-white px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 transition-colors font-sans"
          >
            {CURRENCIES.map((curr) => (
              <option key={curr.code} value={curr.code}>
                {curr.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </SectionCard>
  );
}
