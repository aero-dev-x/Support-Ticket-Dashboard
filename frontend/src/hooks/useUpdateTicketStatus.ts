import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateTicketStatus } from '../api/tickets'
import type { TicketStatus } from '../types/ticket'

export function useUpdateTicketStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: TicketStatus }) => updateTicketStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
      queryClient.invalidateQueries({ queryKey: ['ticket'] })
    },
  })
}
