'use client'

import clsx from 'clsx'
import React, { createContext, useContext, useState, ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

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
      <Dialog open={dialog.open} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent
          style={dialog.width ? { maxWidth: dialog.width } : undefined}
          className={clsx(
            'gap-0 p-0',
            dialog.width
              ? `max-w-[${dialog.width}]`
              : 'sm:max-w-[90%] md:max-w-[70%] lg:max-w-[30%]'
          )}
        >
          {/* Header */}
          <DialogHeader className="flex flex-row items-center justify-between border-b border-gray-200 px-4 py-2 dark:border-gray-800">
            {dialog.title && (
              <DialogTitle className="truncate overflow-hidden text-lg font-semibold whitespace-nowrap">
                {dialog.title}
              </DialogTitle>
            )}
          </DialogHeader>

          {/* Body */}
          <div className="mb-2 max-h-[90vh] flex-1 overflow-y-auto px-4 py-2">
            {dialog.description && (
              <DialogDescription className="mb-4">{dialog.description}</DialogDescription>
            )}
            {dialog.content}
          </div>

          {/* Footer */}
          <DialogFooter className="flex flex-wrap justify-end gap-2 border-t border-gray-200 px-4 py-2 dark:border-gray-800">
            {dialog.showCancel !== false && (
              <Button variant="secondary" onClick={closeDialog}>
                {dialog.cancelText || 'Cancel'}
              </Button>
            )}
            {dialog.showConfirm !== false && (
              <Button onClick={handleConfirm}>{dialog.confirmText || 'OK'}</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DialogContext.Provider>
  )
}
