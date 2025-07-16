'use client'

import React from 'react'
import { Controller } from 'react-hook-form'
import BaseInput from './BaseInput'

interface InputFieldProps {
  control: any
  name: string
  label?: string
  placeholder?: string
  type?: string
  description?: string
  required?: boolean
  className?: string
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
}

const InputField: React.FC<InputFieldProps> = ({ control, name, ...props }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <BaseInput
          {...field}
          {...props.inputProps}
          label={props.label}
          description={props.description}
          required={props.required}
          className={props.className}
          type={props.type}
          error={fieldState.error?.message}
        />
      )}
    />
  )
}

export default React.memo(InputField)
