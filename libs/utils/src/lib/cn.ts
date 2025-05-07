import { type ClassValue,clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/* eslint-disable import/prefer-default-export */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
