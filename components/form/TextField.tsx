'use client'

import { Control, FieldValues, Path } from 'react-hook-form'

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

interface TextFieldProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label: string
  type?: string
  placeholder?: string
  required?: boolean
  autoComplete?: string
  minLength?: number
}

export function TextField<T extends FieldValues>({
  control,
  name,
  label,
  type = 'text',
  placeholder,
  required,
  autoComplete,
  minLength,
}: TextFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              required={required}
              autoComplete={autoComplete}
              minLength={minLength}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
