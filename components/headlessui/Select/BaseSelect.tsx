'use client'

import React from 'react'
import { Field, Label, Select, Description } from '@headlessui/react'
import clsx from 'clsx'

export interface BaseSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  description?: string
  error?: string
  required?: boolean
  containerClassName?: string
  options?: {
    label: string
    value: string
    disabled?: boolean
  }[]
}

const BaseSelect = React.forwardRef<HTMLSelectElement, BaseSelectProps>(
  (
    {
      label,
      description,
      error,
      required,
      containerClassName,
      className,
      options,
      children,
      ...selectProps
    },
    ref
  ) => {
    return (
      <Field className={clsx('mb-4', containerClassName)} disabled={selectProps.disabled}>
        {label && (
          <Label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </Label>
        )}

        <Select
          ref={ref}
          {...selectProps}
          aria-invalid={!!error}
          className={clsx(
            'w-full rounded-lg border px-3 py-2 transition',
            'focus:border-blue-500 focus:ring focus:outline-none',
            'aria-[invalid=true]:border-red-500 aria-[invalid=true]:ring-red-500',
            'dark:bg-gray-800 dark:text-white',
            className
          )}
        >
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                  {opt.label}
                </option>
              ))
            : children}
        </Select>

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

BaseSelect.displayName = 'BaseSelect'
export default React.memo(BaseSelect)
