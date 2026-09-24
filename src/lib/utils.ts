import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | null | undefined, currency: string = 'INR'): string {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return '₹0';
  }
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(Number(amount));
  } catch (err) {
    return `₹${Number(amount || 0).toLocaleString('en-IN')}`;
  }
}

export function formatDate(date: string | Date | number | null | undefined, formatStr: string = 'dd MMM yyyy'): string {
  if (!date) return '-';
  try {
    const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    if (!d || isNaN(d.getTime())) return '-';
    return format(d, formatStr);
  } catch (err) {
    return '-';
  }
}

export function formatDateTime(date: string | Date | number | null | undefined): string {
  if (!date) return '-';
  return formatDate(date, 'dd MMM yyyy, hh:mm a');
}

export function formatTime(date: string | Date | number | null | undefined): string {
  if (!date) return '-';
  return formatDate(date, 'hh:mm a');
}

export function generateRandomCode(length: number = 8): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
