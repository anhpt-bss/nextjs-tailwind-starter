// hooks/useCustomMutation.ts
import { useMutation, UseMutationOptions } from '@tanstack/react-query'

import { handleApiError } from '@/hooks/useApiErrorHandler'

export function useCustomMutation<
  TData = unknown,
  TVariables = void,
  TError = unknown,
  TContext = unknown,
>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: UseMutationOptions<TData, TError, TVariables, TContext>
) {
  return useMutation<TData, TError, TVariables, TContext>({
    mutationFn: async (variables) => {
      try {
        return await mutationFn(variables)
      } catch (err) {
        handleApiError(err)
        throw err
      }
    },
    ...options,
  })
}
