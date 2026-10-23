# Spec 01: Invoice Web App (PERN Stack)

## Objective
Build a web application that enables users to generate professional letterhead invoices via a clean, structured single-page form with a minimalist **black-and-white (monochrome / grayscale)** aesthetic. Users enter business information (company name, logo/details), client details, invoice metadata, and line items all in an intuitive organized form layout. The app calculates totals (subtotal, tax, discounts, grand total) in real-time, persists invoice records into a PostgreSQL database, displays a live high-contrast black-and-white letterhead invoice preview, and allows users to download/print the invoice as a PDF using browser print fidelity (`@media print`).

---

## Tech Stack
- **Frontend**:
  - React (v19 or v18) + Vite
  - Tailwind CSS (configured for a crisp monochrome/black-and-white theme & `@media print` rules)
  - Lucide React (icons, monochrome styling)
- **Backend**:
  - Node.js + Express
  - PostgreSQL driver: `pg` pool or Drizzle ORM
  - Validation: `zod`
  - CORS, dotenv
- **Database**:
  - PostgreSQL (table schema: `invoices`, `invoice_items`)

---

## Assumptions & Boundaries
### Assumptions
1. PostgreSQL connection details are provided via `.env` (`DATABASE_URL`).
2. Authentication is intentionally omitted for Phase 1: Invoices are identified and fetched by unique invoice ID or invoice number.
3. PDF export uses `@media print` and `window.print()` for pixel-perfect letterhead rendering without heavy external canvas/pdf dependencies.

### Boundaries
- **Always do**:
  - Validate invoice payloads on both frontend and backend using schema validation.
  - Implement clean printable CSS (`@media print`) that removes navigation buttons, wizard step headers, and background artifacts, ensuring clean letterhead printing on A4/Letter.
  - Handle decimal calculations cleanly without floating point precision errors (round currency to 2 decimal places).
- **Ask first**:
  - Introducing third-party PDF rendering microservices or cloud storage (AWS S3) for PDF files.
  - Introducing user authentication / multi-user tenancy models.
- **Never do**:
  - Hardcode database credentials or secrets in source files.
  - Delete user-generated invoices silently.

---

## Database Schema

```sql
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  issue_date DATE NOT NULL,
  due_date DATE,
  currency VARCHAR(10) DEFAULT 'INR',
  -- Company (Sender) Information
  company_name VARCHAR(255) NOT NULL,
  company_email VARCHAR(255),
  company_phone VARCHAR(50),
  company_address TEXT,
  company_logo_url TEXT,
  company_tax_id VARCHAR(100), -- GSTIN / Tax ID
  -- Client (Receiver) Information
  client_name VARCHAR(255) NOT NULL,
  client_email VARCHAR(255),
  client_phone VARCHAR(50),
  client_address TEXT,
  client_tax_id VARCHAR(100),
  -- Financials
  tax_rate NUMERIC(5, 2) DEFAULT 0, -- Percentage
  discount_amount NUMERIC(12, 2) DEFAULT 0,
  notes TEXT,
  terms TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity NUMERIC(10, 2) NOT NULL DEFAULT 1,
  unit_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## Application Architecture & Flow

### Form Sections & Visual Design (Monochrome / Black & White)
- **Design Philosophy**: High-contrast, clean typography, minimalist borders (`border-black` / `border-neutral-200` to `border-neutral-900`), stark black buttons with white text, crisp tabular layout, and clean geometric letterhead header lines.
1. **Section 1: Your Company / Letterhead**
   - Company Name, Tax ID / GSTIN, Address, Email, Phone, optional logo upload / image URL.
2. **Section 2: Client Details**
   - Client Name, Client Tax ID, Address, Email, Phone.
3. **Section 3: Invoice Metadata & Line Items**
   - Invoice Number, Issue Date, Due Date, Currency (INR `₹`, USD `$`, etc.).
   - Dynamic item list: Add/Remove items (`Description`, `Quantity`, `Unit Price`, calculated line total).
   - Tax Rate (%), Discount Amount.
   - Notes & Payment Terms.
4. **Action Bar & Letterhead Preview / Download**
   - Live interactive black-and-white letterhead invoice preview (split-screen or side-by-side view).
   - Instant reactive totals updates as form inputs change.
   - Actions: "Save to Database", "Print / Save as PDF" (`window.print()`), "Reset Form".

---

## Commands
```bash
# Backend Setup
cd backend
npm install
npm run dev

# Frontend Setup
cd frontend
npm install
npm run dev

# Tests
npm test
```

---

## Directory Structure
```
Invoice/
├── spec/
│   └── SPEC-01-invoice-web-app.md
├── backend/
│   ├── src/
│   │   ├── config/          # db connection (pg pool)
│   │   ├── controllers/     # invoice controller
│   │   ├── routes/          # /api/invoices
│   │   ├── validators/      # zod schemas
│   │   └── index.js         # express entry point
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── form/        # CompanySection, ClientSection, ItemsSection, InvoiceMetaSection
│   │   │   ├── invoice/     # LetterheadInvoice.jsx (styled for screen & print)
│   │   │   └── ui/          # Buttons, Inputs, Modal
│   │   ├── api/             # client API helpers
│   │   ├── App.jsx
│   │   ├── index.css        # includes @media print styles
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## Success Criteria
1. User can fill out all invoice sections (Company, Client, Invoice Details, Line Items) within a single structured form interface.
2. Totals (Subtotal, Tax, Discount, Grand Total) update reactively and accurately as inputs change.
3. Invoices are saved into PostgreSQL via Express API and return a persistent invoice record.
4. Preview features an elegant, high-contrast black-and-white letterhead design with crisp typography and geometric borders.
5. Clicking "Download / Print PDF" triggers `window.print()` with `@media print` rules hiding form inputs/action buttons and rendering a clean A4 black-and-white letterhead invoice.

---

## Open Questions & Next Steps
- Are there any specific letterhead accents or branding details (e.g. primary color theme options) you'd like added?
- Would you like sample mock data preloaded in step 1 for quick testing?
