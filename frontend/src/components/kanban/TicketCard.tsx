import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { Card, useTheme } from '@mui/material'
import { getPriorityColor } from '../../utils/priorityColor'
import { TicketCardContent } from './TicketCardContent'
import type { Ticket } from '../../types/ticket'

interface TicketCardProps {
  ticket: Ticket
  onOpenDrawer: (ticketId: number) => void
}

export function TicketCard({ ticket, onOpenDrawer }: TicketCardProps) {
  const theme = useTheme()
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: ticket.id,
  })

  return (
    <Card
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={() => onOpenDrawer(ticket.id)}
      variant="outlined"
      style={transform ? { transform: CSS.Translate.toString(transform) } : undefined}
      sx={{
        cursor: 'grab',
        opacity: isDragging ? 0.35 : 1,
        bgcolor: 'background.paper',
        borderLeft: `3px solid ${getPriorityColor(ticket.priority, theme)}`,
        transition: 'background-color 150ms ease, box-shadow 150ms ease',
        '&:hover': { boxShadow: 3, bgcolor: theme.palette.action.hover },
        '&:active': { cursor: 'grabbing' },
      }}
    >
      <TicketCardContent ticket={ticket} />
    </Card>
  )
}
