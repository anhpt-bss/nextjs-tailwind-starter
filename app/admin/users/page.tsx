// app/(user)/users/page.tsx
import { dehydrate } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import UserPage from './view'
import { getQueryClient } from '@/lib/react-query'
import { requestGetUsers } from '@/services/user.service'

export default async function Page() {
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['users'],
    queryFn: requestGetUsers,
  })

  // Dehydrate the query client to pass the state to the client-side
  // This allows the client to access the pre-fetched data without making another request
  const dehydratedState = dehydrate(queryClient)

  return (
    <HydrationBoundary state={dehydratedState}>
      <UserPage />
    </HydrationBoundary>
  )
}
