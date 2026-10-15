import type { Product } from '../data/productsData';
import { formatCurrency } from './money';

const WHATSAPP_NUMBER = '918219179738';

const normalizeQuantity = (quantity: number): number =>
  Number.isFinite(quantity) ? Math.max(1, Math.floor(quantity)) : 1;

const makeWhatsAppUrl = (message: string): string =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

export const getProductWhatsAppUrl = (product: Product, quantity = 1): string => {
  const safeQuantity = normalizeQuantity(quantity);
  const message = [
    'Hi! I’m interested in this product. Please share its availability and delivery details.',
    '',
    `Product: ${product.name}`,
    `Category: ${product.category}`,
    `Price: ${formatCurrency(product.price, product.currency)}`,
    `Quantity: ${safeQuantity}`,
    `Total: ${formatCurrency(product.price * safeQuantity, product.currency)}`,
  ].join('\n');

  return makeWhatsAppUrl(message);
};

export interface WhatsAppCartItem {
  product: Product;
  quantity: number;
}

export const getCartWhatsAppUrl = (items: WhatsAppCartItem[]): string => {
  if (items.length === 0) {
    throw new Error('Cannot create a WhatsApp order link for an empty cart.');
  }

  const subtotals: Record<'INR' | 'USD', number> = { INR: 0, USD: 0 };
  const itemLines = items.map(({ product, quantity }, index) => {
    const safeQuantity = normalizeQuantity(quantity);
    const currency = product.currency ?? 'USD';
    const lineSubtotal = product.price * safeQuantity;
    subtotals[currency] += lineSubtotal;

    return [
      `${index + 1}. ${product.name}`,
      `   Category: ${product.category}`,
      `   Quantity: ${safeQuantity}`,
      `   Unit price: ${formatCurrency(product.price, currency)}`,
      `   Subtotal: ${formatCurrency(lineSubtotal, currency)}`,
    ].join('\n');
  });

  const currencySubtotals = (['INR', 'USD'] as const)
    .filter((currency) => subtotals[currency] > 0)
    .map((currency) => `${currency}: ${formatCurrency(subtotals[currency], currency)}`);

  const message = [
    'Hi! I’d like to ask about the following products from my shopping bag.',
    '',
    ...itemLines,
    '',
    'Subtotal by currency:',
    ...currencySubtotals,
    '',
    'Please confirm availability, shipping, and payment details.',
  ].join('\n');

  return makeWhatsAppUrl(message);
};
