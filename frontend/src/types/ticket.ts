export type TicketStatus = 'open' | 'in_progress' | 'resolved'
export type TicketPriority = 'low' | 'medium' | 'high'

export interface Ticket {
  id: number
  title: string
  description: string
  customerName: string
  customerEmail: string
  status: TicketStatus
  priority: TicketPriority
  createdAt: string
}

export interface CreateTicketInput {
  title: string
  description: string
  customerName: string
  customerEmail: string
  priority: TicketPriority
}

export interface PaginatedTickets {
  items: Ticket[]
  total: number
  page: number
  pageSize: number
}

export interface TicketFilters {
  status?: TicketStatus
  priority?: TicketPriority
  search?: string
  page?: number
  pageSize?: number
  sort?: 'created_at' | '-created_at' | 'priority' | '-priority'
}
