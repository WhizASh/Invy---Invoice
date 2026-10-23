import React from 'react';
import {
  calculateItemTotal,
  calculateSubtotal,
  calculateTaxAmount,
  calculateGrandTotal,
  formatCurrency,
} from '../../utils/calculations.js';

export function LetterheadInvoice({ data }) {
  const items = data.items || [];
  const subtotal = calculateSubtotal(items);
  const taxAmount = calculateTaxAmount(subtotal, data.tax_rate);
  const grandTotal = calculateGrandTotal(subtotal, taxAmount, data.discount_amount);
  const currency = data.currency || 'INR';

  return (
    <div
      id="invoice-sheet"
      className="bg-white text-black p-8 md:p-10 border border-neutral-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-[800px] mx-auto min-h-[1050px] flex flex-col justify-between font-sans"
    >
      <div>
        {/* ================= LETTERHEAD TOP BAR ================= */}
        <div className="border-b-4 border-black pb-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              {data.company_logo_url ? (
                <img
                  src={data.company_logo_url}
                  alt={data.company_name || 'Logo'}
                  className="h-14 w-auto max-w-[160px] object-contain grayscale"
                />
              ) : (
                <div className="h-12 w-12 bg-black text-white flex items-center justify-center font-bold text-xl tracking-tighter">
                  {(data.company_name || 'IN')[0]}
                </div>
              )}
              <div>
                <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-black">
                  {data.company_name || 'COMPANY NAME'}
                </h1>
                {data.company_tax_id && (
                  <p className="text-xs font-mono text-neutral-600 tracking-wider">
                    {data.company_tax_id}
                  </p>
                )}
              </div>
            </div>

            <div className="text-left md:text-right">
              <span className="inline-block bg-black text-white text-xs font-black uppercase tracking-widest px-3 py-1 mb-1">
                Tax Invoice
              </span>
              <p className="font-mono text-lg font-bold text-black tracking-tight">
                #{data.invoice_number || 'INV-0001'}
              </p>
            </div>
          </div>
        </div>

        {/* ================= METADATA & DATES ================= */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-3 px-4 border border-black bg-neutral-100 text-xs font-mono mb-8 avoid-break">
          <div>
            <span className="block text-[10px] uppercase text-neutral-500 font-sans font-bold">Issue Date</span>
            <span className="font-bold text-neutral-900">{data.issue_date || '—'}</span>
          </div>
          <div>
            <span className="block text-[10px] uppercase text-neutral-500 font-sans font-bold">Due Date</span>
            <span className="font-bold text-neutral-900">{data.due_date || 'On Receipt'}</span>
          </div>
          <div>
            <span className="block text-[10px] uppercase text-neutral-500 font-sans font-bold">Currency</span>
            <span className="font-bold text-neutral-900">{currency}</span>
          </div>
          <div>
            <span className="block text-[10px] uppercase text-neutral-500 font-sans font-bold">Payment Status</span>
            <span className="font-bold text-neutral-900 uppercase">Payment Pending</span>
          </div>
        </div>

        {/* ================= SENDER & RECIPIENT ADDRESSES ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8 avoid-break text-xs">
          {/* Sender */}
          <div className="border-l-2 border-black pl-3 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block font-sans">
              From / Service Provider
            </span>
            <p className="font-bold text-sm text-neutral-900">{data.company_name || '—'}</p>
            {data.company_address && (
              <p className="text-neutral-700 whitespace-pre-line leading-relaxed">{data.company_address}</p>
            )}
            {data.company_email && <p className="text-neutral-700">{data.company_email}</p>}
            {data.company_phone && <p className="text-neutral-700 font-mono">{data.company_phone}</p>}
          </div>

          {/* Client */}
          <div className="border-l-2 border-black pl-3 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block font-sans">
              Billed To / Client
            </span>
            <p className="font-bold text-sm text-neutral-900">{data.client_name || '—'}</p>
            {data.client_address && (
              <p className="text-neutral-700 whitespace-pre-line leading-relaxed">{data.client_address}</p>
            )}
            {data.client_email && <p className="text-neutral-700">{data.client_email}</p>}
            {data.client_phone && <p className="text-neutral-700 font-mono">{data.client_phone}</p>}
            {data.client_tax_id && (
              <p className="text-neutral-600 font-mono text-[11px] pt-1">
                Tax ID: {data.client_tax_id}
              </p>
            )}
          </div>
        </div>

        {/* ================= LINE ITEMS TABLE ================= */}
        <div className="mb-8 avoid-break">
          <table className="w-full border-collapse border border-black text-xs">
            <thead>
              <tr className="bg-black text-white text-[11px] font-bold uppercase tracking-wider">
                <th className="py-2.5 px-3 text-left w-10">#</th>
                <th className="py-2.5 px-3 text-left">Description</th>
                <th className="py-2.5 px-3 text-right w-16">Qty</th>
                <th className="py-2.5 px-3 text-right w-24">Unit Price</th>
                <th className="py-2.5 px-3 text-right w-28">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-300">
              {items.map((item, index) => {
                const total = calculateItemTotal(item.quantity, item.unit_price);
                return (
                  <tr key={item.id || index} className="hover:bg-neutral-50/50">
                    <td className="py-2.5 px-3 text-neutral-500 font-mono">{index + 1}</td>
                    <td className="py-2.5 px-3 font-medium text-neutral-900">
                      {item.description || 'Item description'}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-neutral-800">
                      {item.quantity}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-neutral-800">
                      {formatCurrency(item.unit_price, currency)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-neutral-900">
                      {formatCurrency(total, currency)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ================= SUMMARY & TOTALS ================= */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-8 avoid-break">
          {/* Notes & Payment Terms */}
          <div className="flex-1 space-y-3 text-xs max-w-sm">
            {data.notes && (
              <div className="border border-neutral-300 bg-neutral-50/50 p-3">
                <span className="font-bold uppercase tracking-wider text-[10px] text-neutral-600 block mb-1">
                  Payment Instructions & Notes
                </span>
                <p className="text-neutral-700 whitespace-pre-line leading-relaxed">{data.notes}</p>
              </div>
            )}

            {data.terms && (
              <div className="border border-neutral-300 bg-neutral-50/50 p-3">
                <span className="font-bold uppercase tracking-wider text-[10px] text-neutral-600 block mb-1">
                  Terms & Conditions
                </span>
                <p className="text-neutral-700 whitespace-pre-line leading-relaxed">{data.terms}</p>
              </div>
            )}
          </div>

          {/* Totals Table */}
          <div className="w-full sm:w-72 border border-black divide-y divide-neutral-300 text-xs">
            <div className="flex justify-between py-2 px-3">
              <span className="text-neutral-600">Subtotal:</span>
              <span className="font-mono font-bold text-neutral-900">
                {formatCurrency(subtotal, currency)}
              </span>
            </div>

            {Number(data.discount_amount) > 0 && (
              <div className="flex justify-between py-2 px-3 text-neutral-800">
                <span>Discount:</span>
                <span className="font-mono font-bold">
                  - {formatCurrency(data.discount_amount, currency)}
                </span>
              </div>
            )}

            {Number(data.tax_rate) > 0 && (
              <div className="flex justify-between py-2 px-3 text-neutral-800">
                <span>Tax ({data.tax_rate}%):</span>
                <span className="font-mono font-bold">
                  + {formatCurrency(taxAmount, currency)}
                </span>
              </div>
            )}

            <div className="flex justify-between py-3 px-3 bg-black text-white font-bold text-sm">
              <span className="uppercase tracking-wider">Total Due:</span>
              <span className="font-mono text-base">
                {formatCurrency(grandTotal, currency)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= FOOTER / SIGN-OFF ================= */}
      <div className="border-t-2 border-black pt-6 mt-8 avoid-break">
        <div className="flex flex-col sm:flex-row justify-between items-end gap-6 text-[11px] text-neutral-600">
          <div>
            <p className="font-bold uppercase tracking-wider text-black">Thank you for your business!</p>
            <p className="text-neutral-500">For inquiries, contact {data.company_email || 'the finance department'}.</p>
          </div>

          <div className="text-right">
            <div className="w-44 border-b border-black mb-1"></div>
            <p className="uppercase tracking-wider font-bold text-black text-[10px]">Authorized Signature</p>
          </div>
        </div>
      </div>
    </div>
  );
}
