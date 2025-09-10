import clsx from 'clsx'
import debounce from 'lodash/debounce'
import { Search as SearchIcon } from 'lucide-react'
import React, { useState, useCallback } from 'react'

import { Input } from '@/components/ui/input'
import { normalizeText } from '@/utils/helper'

interface SearchInputProps {
  onSearch: (value: string) => void
  placeholder?: string
  className?: string
  isCollapsed?: boolean
}

const SearchInput: React.FC<SearchInputProps> = ({
  onSearch,
  placeholder = 'Search...',
  className = '',
  isCollapsed = false,
}) => {
  const [value, setValue] = useState('')
  const [expanded, setExpanded] = useState(isCollapsed ? false : true)

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
      className={clsx(
        'relative flex items-center transition-all duration-300',
        expanded ? 'w-[320px] sm:w-[400px]' : 'w-12',
        className
      )}
      style={{ minWidth: 48, maxWidth: expanded ? 400 : 48 }}
    >
      <button
        type="button"
        className="absolute top-1/2 left-3 z-10 -translate-y-1/2 cursor-pointer border-none bg-transparent p-0 outline-none"
        tabIndex={0}
        onClick={() => isCollapsed && setExpanded((prev) => !prev)}
        aria-label="Search"
      >
        <SearchIcon className="h-5 w-5 text-neutral-400 dark:text-neutral-400" />
      </button>
      <Input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={clsx(
          'pl-10 text-base transition-all duration-300',
          !isCollapsed && 'rounded-full',
          expanded ? 'w-full opacity-100' : 'pointer-events-none w-0 opacity-0'
        )}
        style={{
          minWidth: expanded ? 180 : 0,
          width: expanded ? '100%' : 0,
          maxWidth: expanded ? 400 : 0,
        }}
      />
    </div>
  )
}

export default SearchInput
