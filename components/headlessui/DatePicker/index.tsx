'use client'

import React from 'react'
import { Controller, Control } from 'react-hook-form'
import BaseDatePicker, { BaseDatePickerProps } from './BaseDatePicker'

interface DatePickerFieldProps extends Omit<BaseDatePickerProps, 'error'> {
  control: Control<any>
  name: string
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({ control, name, ...rest }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <BaseDatePicker {...rest} {...field} error={fieldState.error?.message} />
      )}
    />
  )
}

export default React.memo(DatePickerField)
