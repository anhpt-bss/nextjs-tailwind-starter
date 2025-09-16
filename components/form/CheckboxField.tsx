'use client'

import { Control, FieldValues, Path } from 'react-hook-form'

import { Checkbox } from '@/components/ui/checkbox'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'

interface CheckboxFieldProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label: string
}

export function CheckboxField<T extends FieldValues>({
  control,
  name,
  label,
}: CheckboxFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center space-x-2">
          <FormControl>
            <Checkbox checked={!!field.value} onCheckedChange={field.onChange} {...field} />
          </FormControl>
          <FormLabel>{label}</FormLabel>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
