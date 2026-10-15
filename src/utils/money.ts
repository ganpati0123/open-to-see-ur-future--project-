import type { Product } from '../data/productsData';

export function formatCurrency(amount: number, currency: Product['currency'] = 'USD'): string {
  const code = currency ?? 'USD';
  return new Intl.NumberFormat(code === 'INR' ? 'en-IN' : 'en-US', {
    style: 'currency',
    currency: code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}
