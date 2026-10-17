import type { Product } from '../data/productsData';

const USD_TO_INR = 84;

export function convertToInr(amount: number, currency: Product['currency'] = 'INR'): number {
  return (currency ?? 'INR') === 'USD' ? amount * USD_TO_INR : amount;
}

export function formatCurrency(amount: number, currency: Product['currency'] = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(convertToInr(amount, currency));
}
