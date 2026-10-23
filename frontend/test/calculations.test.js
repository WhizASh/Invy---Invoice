import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateItemTotal,
  calculateSubtotal,
  calculateTaxAmount,
  calculateGrandTotal,
  formatCurrency,
} from '../src/utils/calculations.js';

describe('Invoice Calculations Utilities', () => {
  it('calculates item total with precision', () => {
    assert.equal(calculateItemTotal(2.5, 100), 250);
    assert.equal(calculateItemTotal(3, 19.99), 59.97);
  });

  it('calculates subtotal across multiple items', () => {
    const items = [
      { quantity: 2, unit_price: 50 },     // 100
      { quantity: 1, unit_price: 25.5 },   // 25.5
      { quantity: 4, unit_price: 10 },     // 40
    ];
    assert.equal(calculateSubtotal(items), 165.5);
  });

  it('calculates tax amount based on percentage', () => {
    // 18% of 1000 = 180
    assert.equal(calculateTaxAmount(1000, 18), 180);
    // 5% of 150.50 = 7.525 -> 7.53
    assert.equal(calculateTaxAmount(150.50, 5), 7.53);
  });

  it('calculates grand total with discount and tax', () => {
    // Subtotal 1000, Discount 100 -> Net 900, Tax (18% of 900) 162 -> Total 1062
    // Or Subtotal 1000 + Tax 180 - Discount 100 = 1080
    // Standard invoice formula: (Subtotal - Discount) + Tax on Net OR Subtotal + Tax - Discount.
    // Spec: Grand total = Subtotal - Discount + Tax
    const subtotal = 1000;
    const taxAmount = 180;
    const discountAmount = 100;
    assert.equal(calculateGrandTotal(subtotal, taxAmount, discountAmount), 1080);
  });

  it('prevents negative grand total if discount exceeds total', () => {
    assert.equal(calculateGrandTotal(100, 0, 500), 0);
  });

  it('formats currency strings properly', () => {
    const inr = formatCurrency(5000, 'INR');
    assert.ok(inr.includes('5,000') || inr.includes('5000'));
    assert.ok(inr.includes('₹') || inr.includes('INR'));
  });
});
