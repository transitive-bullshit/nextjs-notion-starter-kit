import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Narrow an unknown caught value to a human-readable message. */
export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}
