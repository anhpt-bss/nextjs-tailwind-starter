'use client'

import {
  Combobox,
  Transition,
  Field,
  Label,
  Description,
  ComboboxOptions,
  ComboboxInput,
  ComboboxButton,
  ComboboxOption,
} from '@headlessui/react'
import React, { Fragment, useState } from 'react'
import { ChevronDownIcon, CheckIcon, XMarkIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'

export type ComboboxOption<T> = {
  label: string
  value: T
  disabled?: boolean
}

export interface ComboboxFieldProps<T> {
  options: ComboboxOption<T>[]
  selected: string | null | undefined
  onChange: (value: string | null | undefined) => void
  label?: string
  description?: string
  error?: string
  required?: boolean
  disabled?: boolean
  placeholder?: string
  className?: string
  inputClassName?: string
}

export function ComboboxField<T>({
  options,
  selected,
  onChange,
  label,
  description,
  error,
  required,
  disabled = false,
  placeholder = 'Select...',
  className,
  inputClassName,
}: ComboboxFieldProps<T>) {
  const [query, setQuery] = useState('')

  const filteredOptions =
    query === ''
      ? options
      : options.filter((option) => option.label.toLowerCase().includes(query.toLowerCase()))

  const optionSelected = React.useMemo(() => {
    return options.find((option) => option.value === selected) || null
  }, [options, selected])

  return (
    <Field className={clsx(className)} disabled={disabled}>
      {label && (
        <Label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </Label>
      )}

      <Combobox
        value={optionSelected}
        onChange={(option) => {
          const optionSelected = option as ComboboxOption<T> | null
          onChange(optionSelected?.value as string | null | undefined)
        }}
        disabled={disabled}
      >
        <div className="relative">
          <div
            className={clsx(
              'relative w-full transition',
              'rounded-md border border-gray-300 px-2 py-1 shadow-sm dark:border-gray-700',
              'bg-white dark:bg-gray-800',
              'text-gray-900 dark:text-white',
              'focus:ring-2 focus:ring-blue-500 focus:outline-none',
              error ? 'border-red-500 ring-red-500' : 'border-gray-300 dark:border-gray-700',
              inputClassName
            )}
          >
            <ComboboxInput
              className="w-[calc(100%-25px)] border-none bg-transparent px-0 py-0 focus:ring-0"
              displayValue={(option: ComboboxOption<T>) => option?.label || ''}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={placeholder}
            />
            <ComboboxButton className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-2">
              {optionSelected ? (
                <span
                  className="ml-2 cursor-pointer text-red-600 dark:text-red-400"
                  role="button"
                  tabIndex={0}
                  onClick={() => onChange(undefined)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      onChange(undefined)
                    }
                  }}
                >
                  <XMarkIcon className="h-5 w-5" />
                </span>
              ) : (
                <ChevronDownIcon
                  className="h-5 w-5 text-gray-400 dark:text-gray-300"
                  aria-hidden="true"
                />
              )}
            </ComboboxButton>
          </div>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery('')}
          >
            <ComboboxOptions className="ring-opacity-5 absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black focus:outline-none sm:text-sm dark:bg-gray-800">
              {filteredOptions.length === 0 && query !== '' ? (
                <div className="relative cursor-default px-4 py-2 text-gray-500 select-none dark:text-gray-400">
                  Nothing found.
                </div>
              ) : (
                filteredOptions.map((option, idx) => (
                  <ComboboxOption
                    key={idx}
                    value={option}
                    disabled={option.disabled}
                    className={({ focus, disabled }) =>
                      clsx(
                        'relative cursor-default p-2 select-none',
                        focus ? 'bg-blue-600 text-white' : 'text-gray-900 dark:text-white',
                        disabled && 'cursor-not-allowed opacity-50'
                      )
                    }
                  >
                    {({ selected, focus }) => (
                      <>
                        <span
                          className={clsx(
                            'block truncate',
                            selected ? 'font-medium' : 'font-normal'
                          )}
                          title={option.label}
                        >
                          {option.label}
                        </span>
                        {selected ? (
                          <span
                            className={clsx(
                              'absolute inset-y-0 left-0 flex items-center pl-3',
                              focus ? 'text-white' : 'text-blue-600'
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </ComboboxOption>
                ))
              )}
            </ComboboxOptions>
          </Transition>
        </div>
      </Combobox>

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
