import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from '@/components/ui/pagination'

interface Props {
  total: number
  skip: number
  limit: number
  onChange: (skip: number) => void
}

export default function PaginationBar({ total, skip, limit, onChange }: Props) {
  const totalPages = Math.ceil(total / limit)
  const currentPage = Math.floor(skip / limit)

  if (totalPages <= 1) return null

  return (
    <div className="mt-6 flex justify-center">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={() => onChange(Math.max((currentPage - 1) * limit, 0))}
              aria-disabled={currentPage === 0}
            />
          </PaginationItem>
          {Array.from({ length: totalPages }).map((_, idx) => (
            <PaginationItem key={idx}>
              <PaginationLink
                href="#"
                isActive={currentPage === idx}
                onClick={() => onChange(idx * limit)}
              >
                {idx + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={() =>
                onChange(Math.min((currentPage + 1) * limit, (totalPages - 1) * limit))
              }
              aria-disabled={currentPage >= totalPages - 1}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
