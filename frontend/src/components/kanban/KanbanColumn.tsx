import { useDroppable } from '@dnd-kit/core'
import { Box, Chip, Paper, Stack, Typography } from '@mui/material'
import { TicketCard } from './TicketCard'
import type { Ticket, TicketStatus } from '../../types/ticket'

interface KanbanColumnProps {
  status: TicketStatus
  title: string
  accent: string
  tickets: Ticket[]
  onOpenDrawer: (ticketId: number) => void
}

export function KanbanColumn({ status, title, accent, tickets, onOpenDrawer }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <Paper
      variant="outlined"
      sx={{
        flex: 1,
        width: { xs: '100%', md: 0 },
        minWidth: { md: 280 },
        bgcolor: isOver ? `color-mix(in srgb, ${accent} 10%, transparent)` : 'background.paper',
        transition: 'background-color 150ms ease',
      }}
    >
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', px: 2, py: 1.5 }}>
        <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: accent, flexShrink: 0 }} />
        <Typography variant="overline" color="text.secondary" sx={{ lineHeight: 1 }}>
          {title}
        </Typography>
        <Chip
          label={tickets.length}
          size="small"
          sx={{
            ml: 'auto',
            bgcolor: 'background.default',
            border: '1px solid',
            borderColor: 'divider',
            color: 'text.disabled',
            fontWeight: 500,
            height: 20,
            minWidth: 20,
          }}
        />
      </Stack>
      <Box
        ref={setNodeRef}
        sx={{
          px: 1.5,
          pb: 1.5,
          minHeight: 140,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.25,
        }}
      >
        {tickets.length === 0 && (
          <Box
            sx={{
              border: '2px dashed',
              borderColor: isOver ? accent : 'divider',
              borderRadius: 2,
              py: 4,
              textAlign: 'center',
              transition: 'border-color 150ms ease',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Drop tickets here
            </Typography>
          </Box>
        )}
        {tickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} onOpenDrawer={onOpenDrawer} />
        ))}
      </Box>
    </Paper>
  )
}
