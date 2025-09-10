import debounce from 'lodash/debounce'
import { Search as SearchIcon } from 'lucide-react'
import React, { useState, useCallback } from 'react'

import { normalizeText } from '@/utils/helper'

interface SearchInputProps {
  onSearch: (value: string) => void
  placeholder?: string
  className?: string
}

const SearchInput: React.FC<SearchInputProps> = ({
  onSearch,
  placeholder = 'Search...',
  className = '',
}) => {
  const [value, setValue] = useState('')

  const debounced = useCallback(
    debounce((val: string) => {
      onSearch(normalizeText(val))
    }, 400),
    [onSearch]
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
    debounced(e.target.value)
  }

  return (
    <div
      className={`mx-auto flex w-full max-w-lg items-center gap-3 rounded-full border border-neutral-200 bg-white px-4 py-2 shadow dark:border-neutral-700 dark:bg-neutral-900 ${className}`}
    >
      <SearchIcon className="h-5 w-5 text-neutral-400 dark:text-neutral-400" />
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full border-none bg-transparent p-0 text-base text-neutral-800 outline-none placeholder:text-neutral-400 focus:ring-0 sm:px-1 dark:text-neutral-100 dark:placeholder:text-neutral-500"
        style={{ boxShadow: 'none' }}
      />
    </div>
  )
}

export default SearchInput
