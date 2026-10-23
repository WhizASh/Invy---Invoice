import React from 'react';
import { Printer, Save, Sparkles, RotateCcw, FolderOpen } from 'lucide-react';

export function ActionBar({
  onFillSample,
  onReset,
  onSave,
  onPrint,
  onOpenHistory,
  isSaving,
  activeTab,
  onTabChange,
}) {
  return (
    <header className="no-print sticky top-0 z-40 bg-white border-b-2 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="bg-black text-white px-2.5 py-1 text-sm font-black tracking-widest uppercase">
            INVY
          </div>
          <span className="hidden sm:inline-block text-xs font-bold uppercase tracking-wider text-neutral-500 border-l border-neutral-300 pl-3">
            Monochrome Invoice Engine
          </span>
        </div>

        {/* Mobile View Toggle */}
        <div className="flex lg:hidden border border-black bg-neutral-100 p-0.5 text-xs font-bold uppercase">
          <button
            type="button"
            onClick={() => onTabChange('form')}
            className={`px-3 py-1 transition-colors ${
              activeTab === 'form' ? 'bg-black text-white' : 'text-neutral-700 hover:text-black'
            }`}
          >
            Form
          </button>
          <button
            type="button"
            onClick={() => onTabChange('preview')}
            className={`px-3 py-1 transition-colors ${
              activeTab === 'preview' ? 'bg-black text-white' : 'text-neutral-700 hover:text-black'
            }`}
          >
            Preview
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onFillSample}
            title="Pre-fill with sample invoice data"
            className="hidden sm:inline-flex items-center gap-1.5 border border-neutral-900 bg-white hover:bg-neutral-100 text-neutral-900 px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5 text-black" />
            Sample Data
          </button>

          <button
            type="button"
            onClick={onOpenHistory}
            title="View saved invoices from database"
            className="inline-flex items-center gap-1.5 border border-neutral-900 bg-white hover:bg-neutral-100 text-neutral-900 px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors"
          >
            <FolderOpen className="h-3.5 w-3.5 text-black" />
            <span className="hidden sm:inline">Saved Invoices</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            title="Reset form"
            className="hidden md:inline-flex items-center gap-1.5 border border-neutral-900 bg-white hover:bg-neutral-100 text-neutral-900 px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 border border-neutral-900 bg-neutral-900 hover:bg-black text-white px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
          >
            <Save className="h-3.5 w-3.5" />
            <span>{isSaving ? 'Saving...' : 'Save'}</span>
          </button>

          <button
            type="button"
            onClick={onPrint}
            className="inline-flex items-center gap-1.5 border-2 border-black bg-black hover:bg-neutral-800 text-white px-4 py-1.5 text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] transition-all"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>
    </header>
  );
}
