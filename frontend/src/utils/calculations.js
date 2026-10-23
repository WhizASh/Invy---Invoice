/**
 * Calculates line total for a single item (qty * unit price) rounded to 2 decimals.
 */
export function calculateItemTotal(quantity, unitPrice) {
  const qty = Number(quantity) || 0;
  const price = Number(unitPrice) || 0;
  return Math.round(qty * price * 100) / 100;
}

/**
 * Calculates sum of line item totals.
 */
export function calculateSubtotal(items = []) {
  const sum = items.reduce((acc, item) => {
    return acc + calculateItemTotal(item.quantity, item.unit_price);
  }, 0);
  return Math.round(sum * 100) / 100;
}

/**
 * Calculates tax amount given a subtotal and percentage rate.
 */
export function calculateTaxAmount(subtotal, taxRate) {
  const sub = Number(subtotal) || 0;
  const rate = Number(taxRate) || 0;
  return Math.round(((sub * rate) / 100) * 100) / 100;
}

/**
 * Calculates grand total = subtotal + tax - discount (floored at 0).
 */
export function calculateGrandTotal(subtotal, taxAmount, discountAmount) {
  const sub = Number(subtotal) || 0;
  const tax = Number(taxAmount) || 0;
  const discount = Number(discountAmount) || 0;
  const total = sub + tax - discount;
  return Math.max(0, Math.round(total * 100) / 100);
}

/**
 * Formats numeric amount to currency string.
 */
export function formatCurrency(amount, currencyCode = 'INR') {
  const val = Number(amount) || 0;
  const symbols = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    CAD: 'CA$',
    AUD: 'AU$',
  };

  const symbol = symbols[currencyCode] || currencyCode;
  const formattedNumber = val.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `${symbol} ${formattedNumber}`;
}
