import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(num?: number | string) {
  if (!num && num !== 0) {
    return ''
  }

  return Intl.NumberFormat().format(Number(num))
}
