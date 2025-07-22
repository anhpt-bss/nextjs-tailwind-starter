// lib/classNames.ts
import clsx from 'clsx'

// BUTTON
export const buttonBase =
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'

export const buttonVariants = {
  default: 'bg-primary text-white hover:bg-primary/90',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  outline: 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
  ghost: 'bg-transparent hover:bg-accent text-foreground',
  link: 'underline-offset-4 hover:underline text-primary',
  danger: 'bg-red-600 text-white hover:bg-red-700',
}

export const buttonSizes = {
  sm: 'px-3 py-1 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
  icon: 'p-2',
}

// INPUT
export const inputBase =
  'block w-full rounded-md border bg-background text-foreground shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition disabled:opacity-50 disabled:pointer-events-none'

export const inputVariants = {
  default: 'border-input',
  error: 'border-red-500 focus:ring-red-500',
  success: 'border-green-500 focus:ring-green-500',
}

export const inputSizes = {
  sm: 'px-2 py-1 text-sm',
  md: 'px-3 py-2 text-base',
  lg: 'px-4 py-3 text-lg',
}

// CARD
export const cardBase = 'rounded-lg border bg-card text-card-foreground shadow-sm'

export const cardPadding = {
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-8',
}

// BADGE
export const badgeBase =
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition'

export const badgeVariants = {
  default: 'bg-primary text-white',
  secondary: 'bg-secondary text-secondary-foreground',
  outline: 'border border-border text-foreground',
  warning: 'bg-yellow-500 text-white',
  danger: 'bg-red-600 text-white',
  success: 'bg-green-600 text-white',
}

// TEXT / TYPOGRAPHY
export const heading = 'text-2xl font-bold tracking-tight'
export const subheading = 'text-lg font-semibold text-muted-foreground'
export const paragraph = 'leading-relaxed text-foreground'
