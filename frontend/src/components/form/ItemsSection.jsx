import React from 'react';
import { Plus, Trash2, Layers } from 'lucide-react';
import { SectionCard } from '../ui/SectionCard.jsx';
import { Input } from '../ui/Input.jsx';
import { Textarea } from '../ui/Textarea.jsx';
import {
  calculateItemTotal,
  calculateSubtotal,
  calculateTaxAmount,
  calculateGrandTotal,
  formatCurrency,
} from '../../utils/calculations.js';

export function ItemsSection({ data, onChange }) {
  const items = data.items || [];

  const handleItemChange = (index, field, value) => {
    const updatedItems = items.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    onChange({ ...data, items: updatedItems });
  };

  const addItem = () => {
    const newItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unit_price: 0,
    };
    onChange({ ...data, items: [...items, newItem] });
  };

  const removeItem = (index) => {
    if (items.length <= 1) return;
    const updatedItems = items.filter((_, i) => i !== index);
    onChange({ ...data, items: updatedItems });
  };

  const handleFinancialChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  // Reactive calculations
  const subtotal = calculateSubtotal(items);
  const taxAmount = calculateTaxAmount(subtotal, data.tax_rate);
  const grandTotal = calculateGrandTotal(subtotal, taxAmount, data.discount_amount);

  return (
    <SectionCard title="Line Items & Financials" badge="Calculations" icon={Layers}>
      {/* Line items list */}
      <div className="space-y-3">
        <div className="hidden md:grid md:grid-cols-12 gap-2 text-[11px] font-bold uppercase tracking-wider text-neutral-600 px-1">
          <div className="md:col-span-6">Description / Service</div>
          <div className="md:col-span-2">Qty</div>
          <div className="md:col-span-2">Unit Price</div>
          <div className="md:col-span-1 text-right">Total</div>
          <div className="md:col-span-1 text-center">Action</div>
        </div>

        {items.map((item, index) => {
          const lineTotal = calculateItemTotal(item.quantity, item.unit_price);
          return (
            <div
              key={item.id || index}
              className="grid grid-cols-1 md:grid-cols-12 gap-2 p-2 border border-neutral-300 bg-neutral-50/50 items-center hover:border-black transition-colors"
            >
              <div className="md:col-span-6">
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  placeholder="e.g. Design Consulting & Strategy"
                  className="w-full border border-neutral-900 bg-white px-2.5 py-1.5 text-sm text-neutral-900 focus:outline-none focus:ring-1 focus:ring-black"
                  required
                />
              </div>

              <div className="md:col-span-2 flex items-center gap-1">
                <span className="md:hidden text-xs font-semibold text-neutral-500 w-14">Qty:</span>
                <input
                  type="number"
                  min="0.01"
                  step="any"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                  className="w-full border border-neutral-900 bg-white px-2.5 py-1.5 text-sm text-neutral-900 focus:outline-none focus:ring-1 focus:ring-black font-mono"
                  required
                />
              </div>

              <div className="md:col-span-2 flex items-center gap-1">
                <span className="md:hidden text-xs font-semibold text-neutral-500 w-14">Price:</span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={item.unit_price}
                  onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)}
                  className="w-full border border-neutral-900 bg-white px-2.5 py-1.5 text-sm text-neutral-900 focus:outline-none focus:ring-1 focus:ring-black font-mono"
                  required
                />
              </div>

              <div className="md:col-span-1 text-right font-mono text-sm font-semibold text-neutral-900">
                <span className="md:hidden text-xs font-normal text-neutral-500 mr-2">Line Total:</span>
                {lineTotal.toFixed(2)}
              </div>

              <div className="md:col-span-1 flex justify-center">
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  disabled={items.length <= 1}
                  className="p-1.5 text-neutral-400 hover:text-black disabled:opacity-30 disabled:hover:text-neutral-400 transition-colors"
                  title="Delete item"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}

        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center gap-1.5 border border-neutral-900 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors mt-1"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Item
        </button>
      </div>

      {/* Tax, Discount, Notes, and Summary */}
      <div className="mt-6 pt-4 border-t border-neutral-300 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              id="tax_rate"
              type="number"
              min="0"
              max="100"
              step="0.1"
              label="Tax Rate (%)"
              value={data.tax_rate}
              onChange={(e) => handleFinancialChange('tax_rate', e.target.value)}
              placeholder="18"
            />

            <Input
              id="discount_amount"
              type="number"
              min="0"
              step="any"
              label="Discount Amount"
              value={data.discount_amount}
              onChange={(e) => handleFinancialChange('discount_amount', e.target.value)}
              placeholder="0.00"
            />
          </div>

          <Textarea
            id="notes"
            label="Notes / Bank Details"
            value={data.notes}
            onChange={(e) => handleFinancialChange('notes', e.target.value)}
            placeholder="Payment instructions, bank A/C details, or note to client..."
            rows={2}
          />

          <Textarea
            id="terms"
            label="Terms & Conditions"
            value={data.terms}
            onChange={(e) => handleFinancialChange('terms', e.target.value)}
            placeholder="Payment terms, late fee policy, validity..."
            rows={2}
          />
        </div>

        {/* Live Form Totals Card */}
        <div className="border border-neutral-900 bg-neutral-50 p-4 flex flex-col justify-between h-fit self-start">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-neutral-600">
              <span>Subtotal:</span>
              <span className="font-mono font-medium">{formatCurrency(subtotal, data.currency)}</span>
            </div>

            {Number(data.discount_amount) > 0 && (
              <div className="flex justify-between text-neutral-600">
                <span>Discount:</span>
                <span className="font-mono font-medium text-neutral-900">
                  - {formatCurrency(data.discount_amount, data.currency)}
                </span>
              </div>
            )}

            {Number(data.tax_rate) > 0 && (
              <div className="flex justify-between text-neutral-600">
                <span>Tax ({data.tax_rate}%):</span>
                <span className="font-mono font-medium">+{formatCurrency(taxAmount, data.currency)}</span>
              </div>
            )}

            <div className="pt-3 border-t-2 border-neutral-900 flex justify-between items-baseline">
              <span className="text-sm font-bold uppercase tracking-wider text-neutral-900">Grand Total:</span>
              <span className="font-mono text-xl font-bold text-neutral-900">
                {formatCurrency(grandTotal, data.currency)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
