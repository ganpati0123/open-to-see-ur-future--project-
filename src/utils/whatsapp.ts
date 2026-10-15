import type { Product } from '../data/productsData';
import { formatCurrency } from './money';

const WHATSAPP_NUMBER = '918219179738';

export const getProductWhatsAppUrl = (product: Product, quantity = 1): string => {
  const safeQuantity = Math.max(1, Math.floor(quantity));
  const message = [
    'Hi! I’m interested in this product. Please share its availability and delivery details.',
    '',
    `Product: ${product.name}`,
    `Category: ${product.category}`,
    `Price: ${formatCurrency(product.price, product.currency)}`,
    `Quantity: ${safeQuantity}`,
    `Total: ${formatCurrency(product.price * safeQuantity, product.currency)}`,
  ].join('\n');

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};
