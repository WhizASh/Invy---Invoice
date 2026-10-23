import React from 'react';
import { UserCheck } from 'lucide-react';
import { SectionCard } from '../ui/SectionCard.jsx';
import { Input } from '../ui/Input.jsx';
import { Textarea } from '../ui/Textarea.jsx';

export function ClientSection({ data, onChange }) {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <SectionCard title="Client Details" badge="Billed To" icon={UserCheck}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          id="client_name"
          label="Client / Company Name"
          value={data.client_name}
          onChange={(e) => handleChange('client_name', e.target.value)}
          placeholder="e.g. Vanguard Systems Pvt Ltd"
          required
        />

        <Input
          id="client_tax_id"
          label="Client Tax ID / GSTIN"
          value={data.client_tax_id}
          onChange={(e) => handleChange('client_tax_id', e.target.value)}
          placeholder="e.g. 27AABCV8791C1ZD"
        />

        <Input
          id="client_email"
          type="email"
          label="Client Email"
          value={data.client_email}
          onChange={(e) => handleChange('client_email', e.target.value)}
          placeholder="e.g. billing@vanguardsys.io"
        />

        <Input
          id="client_phone"
          label="Client Phone"
          value={data.client_phone}
          onChange={(e) => handleChange('client_phone', e.target.value)}
          placeholder="e.g. +91 91234 56789"
        />

        <div className="md:col-span-2">
          <Textarea
            id="client_address"
            label="Client Billing Address"
            value={data.client_address}
            onChange={(e) => handleChange('client_address', e.target.value)}
            placeholder="14th Floor, Maker Chambers V, Nariman Point, Mumbai, MH 400021"
            rows={2}
          />
        </div>
      </div>
    </SectionCard>
  );
}
