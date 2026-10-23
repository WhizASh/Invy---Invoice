import React, { useState } from 'react';
import { ActionBar } from './components/ui/ActionBar.jsx';
import { CompanySection } from './components/form/CompanySection.jsx';
import { ClientSection } from './components/form/ClientSection.jsx';
import { InvoiceMetaSection } from './components/form/InvoiceMetaSection.jsx';
import { ItemsSection } from './components/form/ItemsSection.jsx';
import { LetterheadInvoice } from './components/invoice/LetterheadInvoice.jsx';
import { SavedInvoicesModal } from './components/ui/SavedInvoicesModal.jsx';
import { sampleInvoice, emptyInvoice } from './utils/sampleData.js';
import { saveInvoice } from './api/invoiceApi.js';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const [invoice, setInvoice] = useState(sampleInvoice);
  const [activeTab, setActiveTab] = useState('form'); // For mobile: 'form' | 'preview'
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message: string }
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback(null);
    }, 4000);
  };

  const handleFillSample = () => {
    setInvoice(sampleInvoice);
    showFeedback('success', 'Loaded sample invoice data.');
  };

  const handleReset = () => {
    if (window.confirm('Reset form to empty invoice?')) {
      setInvoice({
        ...emptyInvoice,
        invoice_number: `INV-${Date.now().toString().slice(-6)}`,
      });
      showFeedback('success', 'Form reset.');
    }
  };

  const handlePrint = () => {
    // If on mobile preview tab is not active, we still print fine since @media print isolates the invoice sheet
    window.print();
  };

  const handleSave = async () => {
    if (!invoice.company_name?.trim()) {
      showFeedback('error', 'Company name is required before saving.');
      return;
    }
    if (!invoice.client_name?.trim()) {
      showFeedback('error', 'Client name is required before saving.');
      return;
    }
    if (!invoice.items || invoice.items.length === 0 || !invoice.items[0].description) {
      showFeedback('error', 'At least one line item is required.');
      return;
    }

    try {
      setIsSaving(true);
      const saved = await saveInvoice(invoice);
      showFeedback('success', `Invoice #${saved.invoice_number} saved to PostgreSQL database!`);
    } catch (err) {
      showFeedback('error', `Save failed: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectSavedInvoice = (loadedInvoice) => {
    setInvoice({
      ...loadedInvoice,
      issue_date: loadedInvoice.issue_date?.slice(0, 10) || '',
      due_date: loadedInvoice.due_date?.slice(0, 10) || '',
      tax_rate: Number(loadedInvoice.tax_rate) || 0,
      discount_amount: Number(loadedInvoice.discount_amount) || 0,
    });
    showFeedback('success', `Loaded Invoice #${loadedInvoice.invoice_number}`);
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col font-sans selection:bg-black selection:text-white">
      {/* Top Action Bar */}
      <ActionBar
        onFillSample={handleFillSample}
        onReset={handleReset}
        onSave={handleSave}
        onPrint={handlePrint}
        onOpenHistory={() => setIsHistoryOpen(true)}
        isSaving={isSaving}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Floating Feedback Notification */}
      {feedback && (
        <div className="no-print fixed bottom-6 right-6 z-50 animate-bounce">
          <div
            className={`flex items-center gap-2 border-2 border-black px-4 py-3 text-xs font-bold uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
              feedback.type === 'success'
                ? 'bg-black text-white'
                : 'bg-white text-black'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-white" />
            ) : (
              <AlertCircle className="h-4 w-4 text-black" />
            )}
            <span>{feedback.message}</span>
          </div>
        </div>
      )}

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ================= LEFT COLUMN: FORM SECTIONS ================= */}
          <div
            className={`form-panel lg:col-span-6 space-y-6 ${
              activeTab === 'preview' ? 'hidden lg:block' : 'block'
            }`}
          >
            <div className="no-print bg-white border border-neutral-900 p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                1. Invoice Editor
              </span>
              <span className="text-[11px] text-neutral-500 font-mono">
                Live changes sync directly to preview
              </span>
            </div>

            <InvoiceMetaSection data={invoice} onChange={setInvoice} />
            <CompanySection data={invoice} onChange={setInvoice} />
            <ClientSection data={invoice} onChange={setInvoice} />
            <ItemsSection data={invoice} onChange={setInvoice} />
          </div>

          {/* ================= RIGHT COLUMN: LETTERHEAD PREVIEW ================= */}
          <div
            id="invoice-preview-container"
            className={`lg:col-span-6 sticky top-20 ${
              activeTab === 'form' ? 'hidden lg:block' : 'block'
            }`}
          >
            <div className="no-print mb-3 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                2. Letterhead Preview (Printable A4)
              </span>
              <button
                type="button"
                onClick={handlePrint}
                className="text-[11px] font-bold uppercase tracking-wider text-neutral-900 hover:underline inline-flex items-center gap-1"
              >
                Download PDF ↗
              </button>
            </div>

            <div className="overflow-x-auto p-1">
              <LetterheadInvoice data={invoice} />
            </div>
          </div>
        </div>
      </main>

      {/* Database History Modal */}
      <SavedInvoicesModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelectInvoice={handleSelectSavedInvoice}
      />
    </div>
  );
}
