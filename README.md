# INVY — Minimalist Black & White Invoice Web App

A high-contrast, editorial black-and-white invoice generator built with **React 19, Vite, Tailwind CSS, Express, and PostgreSQL**.

---

## Features
- **Monochrome & High-Contrast Design**: Sharp editorial aesthetic (`#000000` on `#ffffff`), geometric borders, and high-visibility typography.
- **Single-Page Form Editor**: Structured form sections for Company & Letterhead, Client Details, Invoice Metadata, and Line Items.
- **Dynamic Line Items**: Real-time reactive subtotal, tax rate (%), discount, and grand total calculations.
- **High-Fidelity Printable Letterhead**: Browser-native print-to-PDF (`@media print` + `window.print()`) that renders a clean A4 letterhead invoice, hiding form controls and navigation.
- **PostgreSQL Persistence**: Transactional PostgreSQL schema (`invoices` and `invoice_items` with cascading delete) and in-memory fallback for offline/development environments.
- **Saved Invoices Drawer**: Browse and load previously saved invoices from the database.

---

## Project Structure
```
Invoice/
├── package.json               # Root scripts
├── spec/
│   └── SPEC-01-invoice-web-app.md  # Approved specification
├── plan/
│   ├── plan.md                # Architecture & implementation plan
│   └── todo.md                # Step-by-step verified task list
├── backend/
│   ├── src/
│   │   ├── config/db.js       # PostgreSQL pool & in-memory fallback
│   │   ├── controllers/       # Invoice controller
│   │   ├── routes/            # /api/invoices routes
│   │   ├── validators/        # Zod request validator
│   │   ├── db/migrate.js      # Schema DDL & migration runner
│   │   └── index.js           # Express app
│   └── test/                  # Node.js built-in tests
└── frontend/
    ├── src/
    │   ├── api/invoiceApi.js  # Frontend API client
    │   ├── components/
    │   │   ├── form/          # Form sections
    │   │   ├── invoice/       # LetterheadInvoice printable sheet
    │   │   └── ui/            # UI components (Input, Textarea, ActionBar, Modal)
    │   ├── utils/             # Precise financial calculations & sample data
    │   ├── App.jsx            # Split-screen responsive layout
    │   └── index.css          # Tailwind CSS & @media print rules
    └── test/                  # Unit tests
```

---

## Quickstart

### 1. Run Automated Test Suites
```bash
npm test
```

### 2. Start Backend API
```bash
npm run dev:backend
# Server runs on http://localhost:5000
```

### 3. Start Frontend Client
```bash
npm run dev:frontend
# Frontend runs on http://localhost:3000
```

### 4. Build for Production
```bash
npm run build:frontend
```
