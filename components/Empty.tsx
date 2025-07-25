import React from 'react'
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'

interface EmptyProps {
  title?: string
  description?: string
  buttonText?: string
  onButtonClick?: () => void
}

const Empty: React.FC<EmptyProps> = ({
  title = 'No Data',
  description = 'There is nothing to display.',
  buttonText,
  onButtonClick,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <ExclamationCircleIcon className="mb-4 h-12 w-12 text-gray-400" />
      <h2 className="mb-2 text-lg font-semibold text-gray-700 dark:text-white">{title}</h2>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-300">{description}</p>
      {buttonText && (
        <button
          className="cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          onClick={onButtonClick}
        >
          {buttonText}
        </button>
      )}
    </div>
  )
}

export default Empty
