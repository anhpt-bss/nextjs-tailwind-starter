'use client'

import { Field, Label, Input, Description } from '@headlessui/react'
import clsx from 'clsx'
import React from 'react'

export interface BaseDatePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  description?: string
  error?: string
  required?: boolean
  containerClassName?: string
}

const BaseDatePicker = React.forwardRef<HTMLInputElement, BaseDatePickerProps>(
  ({ label, description, error, required, containerClassName, className, ...inputProps }, ref) => {
    return (
      <Field className={clsx('mb-4', containerClassName)} disabled={inputProps.disabled}>
        {label && (
          <Label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </Label>
        )}

        <Input
          {...inputProps}
          ref={ref}
          type="date"
          aria-invalid={!!error}
          className={clsx(
            'w-full rounded-lg border px-3 py-2 transition',
            'focus:border-blue-500 focus:ring focus:outline-none',
            'aria-[invalid=true]:border-red-500 aria-[invalid=true]:ring-red-500',
            'dark:bg-gray-800 dark:text-white',
            className
          )}
        />

        {error ? (
          <Description className="mt-1 text-xs text-red-500">{error}</Description>
        ) : (
          description && (
            <Description className="mt-1 text-xs text-gray-500">{description}</Description>
          )
        )}
      </Field>
    )
  }
)

BaseDatePicker.displayName = 'BaseDatePicker'
export default React.memo(BaseDatePicker)
