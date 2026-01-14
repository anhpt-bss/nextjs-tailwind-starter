'use client'

import { Printer } from 'lucide-react'

interface DownloadPDFButtonProps {
  className?: string
  label?: string
}

export default function DownloadPDFButton({
  className = '',
  label = 'Download PDF',
}: DownloadPDFButtonProps) {
  const handlePrint = () => {
    // Use browser's native print dialog (supports all modern CSS including oklch)
    // User can "Save as PDF" from the print dialog
    window.print()
  }

  return (
    <button
      onClick={handlePrint}
      className={`group inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl active:scale-95 print:hidden ${className}`}
      type="button"
    >
      <Printer className="h-5 w-5 transition-transform group-hover:scale-110" />
      <span>{label}</span>
    </button>
  )
}
