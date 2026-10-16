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

export interface WhatsAppCustomerDetails {
  name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
}

export const getSessionBookingWhatsAppUrl = (details: {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  topic: string;
}): string => {
  const message = [
    'Hi! I would like to book a private 1:1 tarot session with Open to See Your Future.',
    '',
    `Name: ${details.name}`,
    `Email: ${details.email}`,
    `Phone: ${details.phone}`,
    `Preferred date: ${details.date}`,
    `Preferred time: ${details.time}`,
    `Focus: ${details.topic}`,
    '',
    'Please confirm availability, payment details, and the next steps.',
  ].join('\n');

  return makeWhatsAppUrl(message);
};

export const getCartWhatsAppUrl = (
  items: WhatsAppCartItem[],
  customer?: Partial<WhatsAppCustomerDetails>,
): string => {
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
    openingLine,
    '',
    ...itemLines,
    '',
    'Subtotal by currency:',
    ...currencySubtotals,
    '',
    closingLine,
  ].join('\n');

  return message;
};

export const getCartWhatsAppUrl = (items: WhatsAppCartItem[]): string =>
  makeWhatsAppUrl(buildCartMessage(
    items,
    'Hi! I’d like to ask about the following products from my shopping bag.',
    'Please confirm availability, shipping, and payment details.',
    ...(customer
      ? [
          '',
          'Customer details:',
          `Name: ${customer.name ?? ''}`,
          `Phone: ${customer.phone ?? ''}`,
          `Address: ${customer.address ?? ''}`,
          `City: ${customer.city ?? ''}`,
          `Pincode: ${customer.pincode ?? ''}`,
        ]
      : []),
  ].join('\n');

  return makeWhatsAppUrl([
    customerDetails,
    '',
    buildCartMessage(
      items,
      'Order items:',
      'Please confirm availability, shipping charges, and payment details.',
    ),
  ].join('\n'));
};
