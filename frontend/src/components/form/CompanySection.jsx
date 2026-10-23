import React from 'react';
import { Building2 } from 'lucide-react';
import { SectionCard } from '../ui/SectionCard.jsx';
import { Input } from '../ui/Input.jsx';
import { Textarea } from '../ui/Textarea.jsx';

export function CompanySection({ data, onChange }) {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <SectionCard title="Your Company / Letterhead" badge="Sender" icon={Building2}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          id="company_name"
          label="Company / Business Name"
          value={data.company_name}
          onChange={(e) => handleChange('company_name', e.target.value)}
          placeholder="e.g. STUDIO NOIR DESIGN & TECH"
          required
        />

        <Input
          id="company_tax_id"
          label="GSTIN / Tax ID"
          value={data.company_tax_id}
          onChange={(e) => handleChange('company_tax_id', e.target.value)}
          placeholder="e.g. 29AAACS1429B1ZB"
        />

        <Input
          id="company_email"
          type="email"
          label="Business Email"
          value={data.company_email}
          onChange={(e) => handleChange('company_email', e.target.value)}
          placeholder="e.g. accounts@studionoir.design"
        />

        <Input
          id="company_phone"
          label="Phone Number"
          value={data.company_phone}
          onChange={(e) => handleChange('company_phone', e.target.value)}
          placeholder="e.g. +91 98765 43210"
        />

        <div className="md:col-span-2">
          <Input
            id="company_logo_url"
            label="Logo Image URL (Optional)"
            value={data.company_logo_url}
            onChange={(e) => handleChange('company_logo_url', e.target.value)}
            placeholder="https://example.com/logo.png"
          />
        </div>

        <div className="md:col-span-2">
          <Textarea
            id="company_address"
            label="Official Registered Address"
            value={data.company_address}
            onChange={(e) => handleChange('company_address', e.target.value)}
            placeholder="Level 4, Signature Towers, Indiranagar, Bengaluru, KA 560038"
            rows={2}
          />
        </div>
      </div>
    </SectionCard>
  );
}
