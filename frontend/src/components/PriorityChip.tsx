import { Chip } from '@mui/material'
import type { TicketPriority } from '../types/ticket'

const CONFIG: Record<TicketPriority, { label: string; color: 'default' | 'warning' | 'error' }> = {
  low: { label: 'Low', color: 'default' },
  medium: { label: 'Medium', color: 'warning' },
  high: { label: 'High', color: 'error' },
}

export function PriorityChip({ priority }: { priority: TicketPriority }) {
  const { label, color } = CONFIG[priority]
  return <Chip label={label} color={color} size="small" />
}
