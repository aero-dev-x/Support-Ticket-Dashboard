import { apiRequest } from './client'
import type { CreateTicketInput, PaginatedTickets, Ticket, TicketFilters, TicketStatus } from '../types/ticket'

function buildQueryString(filters: TicketFilters): string {
  const params = new URLSearchParams()
  if (filters.status) params.set('status', filters.status)
  if (filters.priority) params.set('priority', filters.priority)
  if (filters.search) params.set('search', filters.search)
  if (filters.page) params.set('page', String(filters.page))
  if (filters.pageSize) params.set('page_size', String(filters.pageSize))
  if (filters.sort) params.set('sort', filters.sort)
  const query = params.toString()
  return query ? `?${query}` : ''
}

export function fetchTickets(filters: TicketFilters = {}): Promise<PaginatedTickets> {
  return apiRequest<PaginatedTickets>(`/api/tickets${buildQueryString(filters)}`)
}

export function fetchTicket(id: number): Promise<Ticket> {
  return apiRequest<Ticket>(`/api/tickets/${id}`)
}

export function createTicket(input: CreateTicketInput): Promise<Ticket> {
  return apiRequest<Ticket>('/api/tickets', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function updateTicketStatus(id: number, status: TicketStatus): Promise<Ticket> {
  return apiRequest<Ticket>(`/api/tickets/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}
