import React, { useEffect, useState } from 'react';
import { X, Calendar, Building2, User, ArrowRight } from 'lucide-react';
import { fetchInvoices, fetchInvoiceById } from '../../api/invoiceApi.js';
import { formatCurrency } from '../../utils/calculations.js';

export function SavedInvoicesModal({ isOpen, onClose, onSelectInvoice }) {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadInvoices();
    }
  }, [isOpen]);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchInvoices();
      setInvoices(data);
    } catch (err) {
      setError(err.message || 'Failed to load saved invoices');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (id) => {
    try {
      setLoading(true);
      const fullInvoice = await fetchInvoiceById(id);
      onSelectInvoice(fullInvoice);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to load invoice');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="no-print fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-2xl border-2 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-black px-5 py-3.5 bg-neutral-100">
          <h3 className="text-sm font-black uppercase tracking-wider text-black">
            Saved Invoices (PostgreSQL)
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-neutral-500 hover:text-black transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {loading && (
            <div className="text-center py-8 text-neutral-500 text-sm font-mono">
              Fetching records from database...
            </div>
          )}

          {error && (
            <div className="border border-black bg-neutral-100 p-3 text-xs text-neutral-900">
              {error}
            </div>
          )}

          {!loading && invoices.length === 0 && !error && (
            <div className="text-center py-10 space-y-2">
              <p className="text-neutral-600 text-sm">No saved invoices found yet.</p>
              <p className="text-neutral-400 text-xs">Fill out the form and click "Save" to persist your first invoice.</p>
            </div>
          )}

          {!loading && invoices.length > 0 && (
            <div className="divide-y divide-neutral-200 border border-neutral-900">
              {invoices.map((inv) => (
                <div
                  key={inv.id}
                  onClick={() => handleSelect(inv.id)}
                  className="p-3.5 hover:bg-neutral-100 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold bg-black text-white px-1.5 py-0.5">
                        #{inv.invoice_number}
                      </span>
                      <span className="text-xs font-bold text-neutral-900">
                        {inv.company_name}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-[11px] text-neutral-500">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" /> {inv.client_name}
                      </span>
                      <span className="flex items-center gap-1 font-mono">
                        <Calendar className="h-3 w-3" /> {inv.issue_date}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <span className="text-xs font-bold text-neutral-900 font-mono">
                      {formatCurrency(inv.total_amount || 0, inv.currency)}
                    </span>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 bg-black text-white px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider hover:bg-neutral-800"
                    >
                      Load <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-neutral-900 px-5 py-3 bg-neutral-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="border border-neutral-900 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wider hover:bg-neutral-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
