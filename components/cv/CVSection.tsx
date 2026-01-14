import { ReactNode } from 'react'

interface CVSectionProps {
  title: string
  icon?: ReactNode
  children: ReactNode
  className?: string
}

export default function CVSection({ title, icon, children, className = '' }: CVSectionProps) {
  return (
    <section className={`mb-10 ${className}`}>
      <div className="mb-6 flex items-center gap-3 border-b border-slate-200 pb-3 dark:border-slate-700">
        {icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            {icon}
          </div>
        )}
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{title}</h2>
      </div>
      <div className="space-y-6">{children}</div>
    </section>
  )
}
