# Task List: Invoice Web App (PERN Stack)

## Phase 1: Backend Foundation & Database Layer
- [x] **Task 1: Server scaffolding & PostgreSQL connection**
  - **Acceptance:**
    - `server/` initialized with Express, `pg`, `zod`, `dotenv`, `cors`.
    - `server/src/config/db.js` initializes connection pool with `DATABASE_URL`.
    - `server/src/db/migrate.js` runs SQL migrations to create `invoices` and `invoice_items` tables with cascade delete.
  - **Verify:** Run migration script against Postgres; verify tables exist.
  - **Files:** `backend/package.json`, `backend/.env.example`, `backend/src/config/db.js`, `backend/src/db/migrate.js`

- [x] **Task 2: API routes & invoice controller with Zod validation**
  - **Acceptance:**
    - `backend/src/validators/invoiceValidator.js` validates payload.
    - `POST /api/invoices` creates invoice and line items in a transaction.
    - `GET /api/invoices/:id` and `GET /api/invoices` fetch records.
  - **Verify:** Execute curl or test script verifying 201 Created and 200 OK responses.
  - **Files:** `backend/src/validators/invoiceValidator.js`, `backend/src/controllers/invoiceController.js`, `backend/src/routes/invoiceRoutes.js`, `backend/src/index.js`

### Checkpoint: Backend Complete
- [x] Database tables exist.
- [x] Server starts cleanly.
- [x] Invoices can be saved and retrieved via HTTP API.

---

## Phase 2: Frontend Foundation & Theme Setup
- [x] **Task 3: Client initialization & Tailwind black-and-white theme**
  - **Acceptance:**
    - Vite React app created under `frontend/`.
    - Tailwind CSS configured for high-contrast monochrome design.
    - Global `@media print` rules set up in `frontend/src/index.css` for clean A4 printing and hiding `.no-print`.
  - **Verify:** `npm run build` passes; dev server displays clean typography and styling.
  - **Files:** `frontend/package.json`, `frontend/vite.config.js`, `frontend/tailwind.config.js`, `frontend/src/index.css`

- [x] **Task 4: State management, mock defaults & API client**
  - **Acceptance:**
    - `invoiceApi.js` provides methods for API communication.
    - `calculations.js` handles subtotal, discount, tax, and grand total with accurate 2-decimal rounding.
    - `sampleData.js` provides pre-fill demo data.
  - **Verify:** Calculation helpers tested with sample invoice data.
  - **Files:** `frontend/src/api/invoiceApi.js`, `frontend/src/utils/calculations.js`, `frontend/src/utils/sampleData.js`

---

## Phase 3: Modular Form & Interactive Components
- [x] **Task 5: Company & Client form sections**
  - **Acceptance:**
    - `CompanySection.jsx` captures company name, logo URL, tax ID, address, contact.
    - `ClientSection.jsx` captures client name, address, contact, tax ID.
    - Inputs use crisp black-and-white borders and typography.
  - **Verify:** Form updates reactive state correctly.
  - **Files:** `frontend/src/components/form/CompanySection.jsx`, `frontend/src/components/form/ClientSection.jsx`

- [x] **Task 6: Invoice Metadata & dynamic Line Items section**
  - **Acceptance:**
    - `InvoiceMetaSection.jsx` for invoice number, dates, currency selector.
    - `ItemsSection.jsx` allows adding, editing, and deleting line items with dynamic line item totals.
    - Tax rate and discount fields update grand total instantly.
  - **Verify:** Adding and removing items updates state and totals reactively.
  - **Files:** `frontend/src/components/form/InvoiceMetaSection.jsx`, `frontend/src/components/form/ItemsSection.jsx`

---

## Phase 4: High-Fidelity Letterhead Preview & Print Engine
- [x] **Task 7: Monochrome Letterhead Invoice component**
  - **Acceptance:**
    - `LetterheadInvoice.jsx` displays full invoice layout: company header with geometric border, dates, addresses, items table, and totals summary block.
    - Styled specifically for both screen preview and print output.
  - **Verify:** Matches live form data in real time.
  - **Files:** `frontend/src/components/invoice/LetterheadInvoice.jsx`

- [x] **Task 8: Layout integration, Save to DB & Browser Print trigger**
  - **Acceptance:**
    - `App.jsx` connects form and preview side-by-side on desktop.
    - Action bar with "Fill Sample Data", "Reset", "Save Invoice", and "Print / Download PDF".
    - `window.print()` triggers print dialog with clean letterhead and zero UI clutter.
  - **Verify:** Triggering print produces clean A4 printable invoice without form controls.
  - **Files:** `frontend/src/App.jsx`, `frontend/src/components/ui/ActionBar.jsx`

---

## Checkpoint: End-to-End Verification
- [x] Complete flow works: edit fields $\to$ see real-time preview $\to$ save to DB $\to$ print to PDF.
- [x] High-contrast black-and-white styling is consistent throughout.
- [x] Build and lint checks pass cleanly.
