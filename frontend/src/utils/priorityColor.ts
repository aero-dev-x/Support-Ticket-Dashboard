import type { Theme } from '@mui/material/styles'
import type { TicketPriority } from '../types/ticket'

export function getPriorityColor(priority: TicketPriority, theme: Theme): string {
  if (priority === 'high') return theme.palette.error.main
  if (priority === 'medium') return theme.palette.warning.main
  return theme.palette.text.disabled
}
