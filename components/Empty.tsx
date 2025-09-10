import { FileQuestion } from 'lucide-react'

import { cn } from '@/lib/utils'

import { Button } from './ui/button'

interface EmptyProps {
  title?: string
  description?: string
  className?: string
  buttonText?: string
  onButtonClick?: () => void
}

export default function Empty({
  title = 'No data available',
  description = '',
  className = '',
  buttonText = 'Add new',
  onButtonClick,
}: EmptyProps) {
  return (
    <div
      className={cn(
        'text-muted-foreground flex flex-col items-center justify-center py-12 text-center',
        className
      )}
    >
      <div className="bg-muted mb-4 flex h-16 w-16 items-center justify-center rounded-full">
        <FileQuestion className="text-muted-foreground h-8 w-8" />
      </div>
      <div className="text-lg font-semibold">{title}</div>
      {description && <div className="text-muted-foreground mt-1 text-sm">{description}</div>}

      {onButtonClick && (
        <Button className="mt-2" onClick={onButtonClick}>
          {buttonText}
        </Button>
      )}
    </div>
  )
}
