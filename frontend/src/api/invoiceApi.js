const API_BASE = '/api/invoices';

export async function saveInvoice(invoiceData) {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(invoiceData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export async function fetchInvoices() {
  const response = await fetch(API_BASE);
  if (!response.ok) {
    throw new Error('Failed to fetch invoice history');
  }
  return response.json();
}

export async function fetchInvoiceById(id) {
  const response = await fetch(`${API_BASE}/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch invoice with id ${id}`);
  }
  return response.json();
}
