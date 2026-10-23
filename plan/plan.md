# Implementation Plan: Invoice Web App (PERN Stack)

## Overview
Build a fullstack invoice generator web app in a minimalist black-and-white aesthetic. The application consists of a Node.js + Express + PostgreSQL backend with validation and endpoints for storing and fetching invoices, paired with a React + Vite + Tailwind CSS frontend featuring a modular single-page form, reactive financial calculations, live monochrome letterhead preview, and zero-dependency browser print-to-PDF (`@media print`).

---

## Architecture Decisions
- **Monochrome & High-Contrast Design**: High-contrast black, neutral grays, and white palette (`bg-black`, `text-white`, `border-black`, `border-neutral-300`, `font-mono`/`font-sans`) for a timeless editorial aesthetic that looks sharp on screen and prints with zero ink bleed on standard printers.
- **Database Layer**: Standard Node.js `pg` connection pool with parameterized SQL queries for fast, robust connection to PostgreSQL without heavy ORM overhead.
- **Validation**: Schema validation using `zod` on both server endpoints and client input boundaries.
- **PDF Export via Browser Print**: Pure CSS `@media print` with clean page-break rules, hiding interactive controls and rendering high-fidelity A4/Letter letterhead output directly via `window.print()`.
- **Live Preview Architecture**: Unidirectional state in React with reactive auto-calculation for subtotal, discount, tax, and grand total, synchronizing instantly with the printable letterhead component.

---

## Task Breakdown

### Phase 1: Backend Foundation & Database Layer
- [ ] **Task 1: Server scaffolding & PostgreSQL connection**
  - Initialize `backend/` with `package.json`, dependencies (`express`, `pg`, `zod`, `dotenv`, `cors`, `nodemon`).
  - Configure database connection pool in `backend/src/config/db.js` reading `DATABASE_URL` from `.env`.
  - Create database migration script `backend/src/db/migrate.js` to create `invoices` and `invoice_items` tables with indices and cascading delete.
  - *Verify*: Run migration script against PostgreSQL database; verify tables exist.

- [ ] **Task 2: API routes & invoice controller with Zod validation**
  - Implement request validation schema in `backend/src/validators/invoiceValidator.js` for invoice metadata and line items.
  - Implement controller in `backend/src/controllers/invoiceController.js`:
    - `POST /api/invoices`: Save new invoice and its line items inside a database transaction.
    - `GET /api/invoices/:id`: Fetch invoice with associated line items.
    - `GET /api/invoices`: Fetch recent invoices list.
  - Mount routes in `backend/src/routes/invoiceRoutes.js` and integrate into `backend/src/index.js`.
  - *Verify*: Automated test or curl request to create and retrieve an invoice returns HTTP 201 and 200 with matching payload.

### Checkpoint 1: Backend Verification
- [ ] Database tables created and migrated.
- [ ] Express server starts up cleanly on configured port.
- [ ] API successfully handles POST (create) and GET (retrieve) with proper validation and error handling.

---

### Phase 2: Frontend Foundation & Theme Setup
- [ ] **Task 3: Client initialization & Tailwind black-and-white theme**
  - Initialize React project using Vite in `frontend/`.
  - Install dependencies: `tailwindcss`, `@tailwindcss/vite` (or `postcss`/`autoprefixer`), `lucide-react`.
  - Configure Tailwind for custom monochrome palette, print styles, and font styling.
  - Set up global print rules in `frontend/src/index.css` (A4 margins, hiding `.no-print`, print color adjust).
  - *Verify*: `npm run build` succeeds and demo page displays crisp black-and-white typography and styles.

- [ ] **Task 4: State management, mock defaults & API client**
  - Create `frontend/src/api/invoiceApi.js` for communicating with backend `/api/invoices`.
  - Create invoice state structure with helper calculation utilities in `frontend/src/utils/calculations.js` (subtotal, tax amount, discount, grand total rounded accurately to 2 decimal places).
  - Provide a sample pre-fill data generator in `frontend/src/utils/sampleData.js` for quick demonstration.
  - *Verify*: Unit test or assertion for calculations; verify correct decimal rounding on sample line items.

---

### Phase 3: Modular Form & Interactive Components
- [ ] **Task 5: Company & Client form sections**
  - Build `CompanySection.jsx`: Company name, logo URL / upload placeholder, GSTIN/Tax ID, address, email, phone.
  - Build `ClientSection.jsx`: Client name, billing address, contact email, phone, tax ID.
  - Style with minimalist black-and-white bordered card inputs and clean focus rings.
  - *Verify*: Inputs update state cleanly without input lag; form labels are accessible.

- [ ] **Task 6: Invoice Metadata & dynamic Line Items section**
  - Build `InvoiceMetaSection.jsx`: Invoice number, issue date, due date, currency selector (INR ₹, USD $, EUR €, GBP £).
  - Build `ItemsSection.jsx`: Dynamic item rows allowing addition and removal of items (description, quantity, unit price, auto line total).
  - Add tax rate (%) and discount fields with instant calculation display.
  - *Verify*: Adding, modifying, and removing line items reactively recalculates all summary values.

---

### Phase 4: High-Fidelity Letterhead Preview & Print Engine
- [ ] **Task 7: Monochrome Letterhead Invoice component**
  - Build `LetterheadInvoice.jsx`:
    - Clean geometric header line and company logo/branding.
    - Prominent "INVOICE" label, invoice number, issue/due dates.
    - Two-column sender and client billing addresses.
    - Crisp tabular line item display with alternating subtle border separators.
    - Financial summary box (Subtotal, Tax, Discount, Grand Total) with bold border accent.
    - Notes and payment terms footer.
  - *Verify*: Component accurately reflects all live form inputs in real-time.

- [ ] **Task 8: Layout integration, Save to DB & Browser Print trigger**
  - Build `App.jsx` with a responsive two-column layout on desktop (Form on left, Sticky Letterhead Preview on right) and tabs/toggle on mobile.
  - Implement top action bar: "Fill Sample Data", "Reset", "Save Invoice" (calls backend API with status toast), and "Print / Download PDF" (`window.print()`).
  - Add print stylesheet tweaks: in print mode, `#invoice-preview` expands to full page width while hiding navigation, form panels, and action buttons.
  - *Verify*: Clicking "Print / Download PDF" opens browser print dialog showing ONLY the clean letterhead invoice formatted cleanly for A4.

---

## Checkpoint 2: End-to-End Verification
- [ ] Full user journey: user inputs company & client details, adds line items, and observes real-time calculations.
- [ ] Clicking "Save Invoice" stores records in PostgreSQL database.
- [ ] Clicking "Print / Download PDF" produces a pristine black-and-white letterhead invoice without UI clutter.
- [ ] Responsive UI works seamlessly on desktop and smaller screens.

---

## Risks and Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| Floating point precision issues with currency calculation | Med | Perform calculations with fixed precision arithmetic (`Number(val).toFixed(2)`) and validate numeric fields. |
| Browser print dialog clipping or adding unwanted headers/footers | Med | Use standard `@page { margin: 15mm; size: A4; }` and `@media print` rules with `.no-print` classes. |
| PostgreSQL connection issues in local environment | Low | Provide clear `.env.example` and fallback to graceful mock/offline mode if database is not connected. |

---

## Open Questions / Follow-ups
- Default currency defaults to Indian Rupee (`₹` INR) with option to switch to USD (`$`), EUR (`€`), etc.
