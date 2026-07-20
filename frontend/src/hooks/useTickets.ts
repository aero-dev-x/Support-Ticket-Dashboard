import { useQuery } from '@tanstack/react-query'
import { fetchTickets } from '../api/tickets'
import type { TicketFilters } from '../types/ticket'

export function useTickets(filters: TicketFilters) {
  return useQuery({
    queryKey: ['tickets', filters],
    queryFn: () => fetchTickets(filters),
  })
}
