'use client'

import React from 'react'
import { Controller, Control } from 'react-hook-form'

import BaseSelect, { BaseSelectProps } from './BaseSelect'

interface SelectFieldProps extends Omit<BaseSelectProps, 'error'> {
  control: Control<any>
  name: string
}

const SelectField: React.FC<SelectFieldProps> = ({ control, name, ...rest }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <BaseSelect {...rest} {...field} error={fieldState.error?.message} />
      )}
    />
  )
}

export default React.memo(SelectField)
