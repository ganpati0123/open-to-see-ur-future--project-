import assert from 'node:assert/strict';
import test from 'node:test';
import { PRODUCTS_DATA } from '../data/productsData';
import { formatCurrency } from './money';
import {
  getCartWhatsAppUrl,
  getCheckoutWhatsAppUrl,
  getProductWhatsAppUrl,
} from './whatsapp';

const whatsappNumber = '918219179738';

test('every catalog product link includes the correct contact and item details', () => {
  assert.ok(PRODUCTS_DATA.length > 0, 'the product catalog should not be empty');

  for (const product of PRODUCTS_DATA) {
    const url = new URL(getProductWhatsAppUrl(product));
    const message = url.searchParams.get('text') ?? '';

    assert.equal(url.protocol, 'https:');
    assert.equal(url.hostname, 'wa.me');
    assert.equal(url.pathname, `/${whatsappNumber}`);
    assert.ok(message.includes(product.name), `${product.id} name should be included`);
    assert.ok(message.includes(product.category), `${product.id} category should be included`);
    assert.ok(
      message.includes(`Price: ${formatCurrency(product.price, product.currency)}`),
      `${product.id} price and currency should be included`,
    );
    assert.ok(message.includes('Quantity: 1'));
    assert.ok(message.includes(`Total: ${formatCurrency(product.price, product.currency)}`));
  }
});

test('single-product links normalize quantity and calculate the correct total', () => {
  const product = PRODUCTS_DATA.find((item) => item.currency === 'INR');
  assert.ok(product, 'expected an INR-priced catalog product');

  const url = new URL(getProductWhatsAppUrl(product, 2.8));
  const message = url.searchParams.get('text') ?? '';
  assert.ok(message.includes('Quantity: 2'));
  assert.ok(message.includes(`Total: ${formatCurrency(product.price * 2, 'INR')}`));

  const minimumQuantityMessage = new URL(getProductWhatsAppUrl(product, 0))
    .searchParams.get('text');
  assert.ok(minimumQuantityMessage?.includes('Quantity: 1'));
});

test('cart links itemize all products and keep INR and USD subtotals separate', () => {
  const inrProduct = PRODUCTS_DATA.find((item) => item.currency === 'INR');
  const usdProduct = PRODUCTS_DATA.find((item) => (item.currency ?? 'USD') === 'USD');
  assert.ok(inrProduct, 'expected an INR-priced catalog product');
  assert.ok(usdProduct, 'expected a USD-priced catalog product');

  const items = [
    { product: inrProduct, quantity: 2 },
    { product: usdProduct, quantity: 3 },
  ];
  const url = new URL(getCartWhatsAppUrl(items));
  const message = url.searchParams.get('text') ?? '';

  assert.equal(url.hostname, 'wa.me');
  assert.equal(url.pathname, `/${whatsappNumber}`);
  for (const { product, quantity } of items) {
    assert.ok(message.includes(product.name));
    assert.ok(message.includes(`Quantity: ${quantity}`));
    assert.ok(message.includes(`Unit price: ${formatCurrency(product.price, product.currency)}`));
    assert.ok(
      message.includes(`Subtotal: ${formatCurrency(product.price * quantity, product.currency)}`),
    );
  }
  assert.ok(message.includes(`INR: ${formatCurrency(inrProduct.price * 2, 'INR')}`));
  assert.ok(message.includes(`USD: ${formatCurrency(usdProduct.price * 3, 'USD')}`));
  assert.doesNotMatch(message, /grand total|combined total/i);
});

test('cart links reject an empty cart', () => {
  assert.throws(() => getCartWhatsAppUrl([]), /empty cart/);
});

test('checkout WhatsApp link includes customer details and itemized order', () => {
  const product = PRODUCTS_DATA.find((item) => item.currency === 'INR');
  assert.ok(product, 'expected an INR-priced catalog product');

  const url = new URL(getCheckoutWhatsAppUrl(
    [{ product, quantity: 2 }],
    {
      name: 'Asha Sharma',
      phone: '+91 98765 43210',
      address: '12 Lake Road, Jaipur, Rajasthan 302001',
    },
  ));
  const message = url.searchParams.get('text') ?? '';

  assert.equal(url.hostname, 'wa.me');
  assert.equal(url.pathname, `/${whatsappNumber}`);
  assert.ok(message.includes('Name: Asha Sharma'));
  assert.ok(message.includes('Phone: +91 98765 43210'));
  assert.ok(message.includes('Delivery address: 12 Lake Road, Jaipur, Rajasthan 302001'));
  assert.ok(message.includes(product.name));
  assert.ok(message.includes(`Subtotal: ${formatCurrency(product.price * 2, product.currency)}`));
  assert.ok(message.includes('Please confirm availability, shipping charges, and payment details.'));
});

test('checkout WhatsApp link rejects an empty cart', () => {
  assert.throws(
    () => getCheckoutWhatsAppUrl([], { name: 'Asha', phone: '123', address: 'Jaipur' }),
    /empty cart/,
  );
});

test('product names are safely URL-encoded and recover from the WhatsApp message', () => {
  const product = {
    ...PRODUCTS_DATA[0],
    name: 'Crystal & Rose — 100%',
  };
  const url = new URL(getProductWhatsAppUrl(product));

  assert.ok(url.search.includes('%26'));
  assert.ok(url.searchParams.get('text')?.includes(product.name));
});
