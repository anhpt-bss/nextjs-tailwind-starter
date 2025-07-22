import { StoredFileResponse } from '@/types/storage'
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline'
import React from 'react'
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
import { toast } from 'sonner'
import { handleDownload } from '@/utils/helper'

interface MoreActionProps {
  file: StoredFileResponse
  handleDelete: () => void
}

const MoreAction: React.FC<MoreActionProps> = ({ file, handleDelete }) => {
  const handleCopyUrl = () => {
    navigator.clipboard.writeText(file.preview_url || '')
    toast.success('File URL copied to clipboard!', {
      position: 'top-center',
      icon: '📋',
    })
  }

  return (
    <Menu as="div" className="relative inline-block text-left">
      <MenuButton className="flex cursor-pointer items-center rounded p-1 hover:bg-gray-100 focus:outline-none dark:hover:bg-gray-800">
        <EllipsisVerticalIcon className="h-5 w-5 text-gray-400" />
      </MenuButton>
      <Transition
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-in"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <MenuItems className="ring-opacity-5 absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black focus:outline-none dark:bg-gray-800">
          <MenuItem>
            {({ focus }) => (
              <button
                onClick={handleCopyUrl}
                className={`w-full cursor-pointer px-4 py-2 text-left text-sm ${focus ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
              >
                Copy URL
              </button>
            )}
          </MenuItem>
          <MenuItem>
            {({ focus }) => (
              <button
                onClick={() => handleDownload(file.file_name, file.download_url)}
                className={`w-full cursor-pointer px-4 py-2 text-left text-sm ${focus ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
              >
                Download
              </button>
            )}
          </MenuItem>
          <MenuItem>
            {({ focus }) => (
              <button
                onClick={handleDelete}
                className={`w-full cursor-pointer px-4 py-2 text-left text-sm text-red-500 ${focus ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
              >
                Delete
              </button>
            )}
          </MenuItem>
        </MenuItems>
      </Transition>
    </Menu>
  )
}

export default MoreAction
