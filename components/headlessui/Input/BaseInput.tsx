'use client'

import React from 'react'
import { Field, Label, Input, Description } from '@headlessui/react'
import clsx from 'clsx'

export interface BaseInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  description?: string
  error?: string
  required?: boolean
  containerClassName?: string
}

const BaseInput = React.forwardRef<HTMLInputElement, BaseInputProps>(
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
          ref={ref}
          {...inputProps}
          value={inputProps?.value ?? ''}
          invalid={!!error}
          className={clsx(
            'w-full rounded-lg border px-3 py-2 transition',
            'data-focus:border-blue-500 data-focus:ring',
            'data-invalid:border-red-500 data-invalid:ring-red-500',
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

BaseInput.displayName = 'BaseInput'
export default React.memo(BaseInput)
