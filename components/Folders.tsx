import { FolderIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import React from 'react'

type FoldersProps = {
  folders: string[]
  selected?: string
  onSelect: (folder?: string) => void
}

const Folders: React.FC<FoldersProps> = ({ folders, selected, onSelect }) => (
  <>
    <div
      key="all"
      className={clsx(
        'flex cursor-pointer items-center gap-1 rounded bg-yellow-100 px-2 py-1 text-sm font-semibold hover:bg-yellow-200 dark:bg-yellow-700 dark:hover:bg-yellow-600',
        !selected
          ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-500 dark:bg-blue-900 dark:text-blue-200'
          : ''
      )}
      onClick={() => onSelect(undefined)}
      aria-hidden="true"
    >
      <FolderIcon
        className={clsx(
          'h-4 w-4',
          !selected ? 'text-blue-500 dark:text-blue-200' : 'text-yellow-700 dark:text-yellow-200'
        )}
      />
      All
    </div>
    {folders?.map((folder) => (
      <div
        key={folder}
        className={clsx(
          'flex cursor-pointer items-center gap-1 rounded bg-yellow-50 px-2 py-1 text-sm hover:bg-yellow-100 dark:bg-yellow-800 dark:hover:bg-yellow-700',
          selected === folder
            ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-500 dark:bg-blue-900 dark:text-blue-200'
            : ''
        )}
        onClick={() => onSelect(folder)}
        aria-hidden="true"
      >
        <FolderIcon
          className={clsx(
            'h-4 w-4',
            selected === folder
              ? 'text-blue-500 dark:text-blue-200'
              : 'text-yellow-700 dark:text-yellow-200'
          )}
        />
        {folder}
      </div>
    ))}
  </>
)

export default Folders
