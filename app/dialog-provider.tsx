'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Dialog, DialogPanel, DialogTitle, Description } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

export interface DialogOptions {
  open?: boolean
  title?: ReactNode
  description?: ReactNode
  content?: ReactNode
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
  showCancel?: boolean
  showConfirm?: boolean
  width?: string
}

interface DialogContextType {
  openDialog: (options: DialogOptions) => void
  closeDialog: () => void
}

export const DialogContext = createContext<DialogContextType | undefined>(undefined)

export const useDialog = () => {
  const ctx = useContext(DialogContext)
  if (!ctx) throw new Error('useDialog must be used within DialogProvider')
  return ctx
}

export const DialogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [dialog, setDialog] = useState<DialogOptions & { open: boolean }>({ open: false })

  const openDialog = (options: DialogOptions) => {
    setDialog({ ...options, open: true })
  }
  const closeDialog = () => {
    setDialog((d) => ({ ...d, open: false }))
    dialog.onCancel?.()
  }
  const handleConfirm = () => {
    setDialog((d) => ({ ...d, open: false }))
    dialog.onConfirm?.()
  }

  return (
    <DialogContext.Provider value={{ openDialog, closeDialog }}>
      {children}
      <Dialog
        open={dialog.open}
        onClose={closeDialog}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div
          className="fixed inset-0 bg-black/50 transition-colors duration-300 dark:bg-gray-950/80"
          aria-hidden="true"
        />
        <div
          className="relative z-10 mx-auto w-full px-2 sm:px-0"
          style={{ maxWidth: dialog.width || '30%' }}
        >
          <DialogPanel
            className="mx-auto flex w-full flex-col rounded-xl bg-white shadow-2xl transition-colors duration-300 dark:bg-gray-900"
            style={{ width: '100%' }}
          >
            {/* Header */}
            <div className="mb-2 flex items-center justify-between border-b border-gray-200 px-4 py-2 dark:border-gray-800">
              {dialog.title && (
                <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                  {dialog.title}
                </DialogTitle>
              )}
              <span className="ml-2 cursor-pointer text-red-600 dark:text-red-400">
                <XMarkIcon className="h-5 w-5" onClick={closeDialog} />
              </span>
            </div>

            {/* Body */}
            <div className="mb-2 max-h-[90vh] flex-1 overflow-y-auto px-4 py-2">
              {dialog.description && (
                <Description className="mb-4 text-gray-600 dark:text-gray-300">
                  {dialog.description}
                </Description>
              )}
              {dialog.content}
            </div>

            {/* Footer */}
            <div className="flex flex-wrap justify-end gap-2 px-4 py-2">
              {dialog.showCancel !== false && (
                <button
                  onClick={closeDialog}
                  className="rounded bg-gray-200 px-4 py-2 text-gray-700 transition-colors duration-200 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  {dialog.cancelText || 'Cancel'}
                </button>
              )}
              {dialog.showConfirm !== false && (
                <button
                  onClick={handleConfirm}
                  className="rounded bg-blue-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-blue-700"
                >
                  {dialog.confirmText || 'OK'}
                </button>
              )}
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </DialogContext.Provider>
  )
}
