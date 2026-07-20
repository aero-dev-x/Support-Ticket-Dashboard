import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { Alert, Box, Button, Card, CircularProgress, Stack, useTheme } from '@mui/material'
import { useState } from 'react'
import { useTickets } from '../../hooks/useTickets'
import { useUpdateTicketStatus } from '../../hooks/useUpdateTicketStatus'
import { getPriorityColor } from '../../utils/priorityColor'
import { useFeedback } from '../layout/FeedbackSnackbar'
import { TicketDetailDrawer } from '../TicketDetailDrawer'
import { KanbanColumn } from './KanbanColumn'
import { TicketCardContent } from './TicketCardContent'
import type { Ticket, TicketPriority, TicketStatus } from '../../types/ticket'

interface KanbanBoardProps {
  priority?: TicketPriority
  search?: string
}

export function KanbanBoard({ priority, search }: KanbanBoardProps) {
  const theme = useTheme()

  const COLUMNS: { status: TicketStatus; title: string; accent: string }[] = [
    { status: 'open', title: 'Open', accent: theme.palette.kanbanStatus.open },
    { status: 'in_progress', title: 'In Progress', accent: theme.palette.kanbanStatus.inProgress },
    { status: 'resolved', title: 'Resolved', accent: theme.palette.kanbanStatus.resolved },
  ]
  const { data, isLoading, isError, refetch } = useTickets({
    priority,
    search,
    page: 1,
    pageSize: 100,
    sort: '-created_at',
  })
  const { mutate } = useUpdateTicketStatus()
  const { showSuccess, showError } = useFeedback()
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null)
  const [drawerTicketId, setDrawerTicketId] = useState<number | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  )

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (isError) {
    return (
      <Alert severity="error" action={<Button onClick={() => refetch()}>Retry</Button>}>
        Failed to load tickets.
      </Alert>
    )
  }

  const tickets = data?.items ?? []
  const byStatus = (status: TicketStatus): Ticket[] => tickets.filter((t) => t.status === status)

  const handleDragStart = (event: DragStartEvent) => {
    const ticket = tickets.find((t) => t.id === Number(event.active.id))
    setActiveTicket(ticket ?? null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTicket(null)
    const { active, over } = event
    if (!over) return

    const newStatus = over.id as TicketStatus
    const ticket = tickets.find((t) => t.id === Number(active.id))
    if (!ticket || ticket.status === newStatus) return

    mutate(
      { id: ticket.id, status: newStatus },
      {
        onSuccess: () => showSuccess('Ticket status updated'),
        onError: () => showError('Failed to update ticket status. Please try again.'),
      },
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ alignItems: 'flex-start' }}>
        {COLUMNS.map(({ status, title, accent }) => (
          <KanbanColumn
            key={status}
            status={status}
            title={title}
            accent={accent}
            tickets={byStatus(status)}
            onOpenDrawer={setDrawerTicketId}
          />
        ))}
      </Stack>
      <DragOverlay>
        {activeTicket && (
          <Card
            variant="outlined"
            sx={{
              bgcolor: 'background.paper',
              borderLeft: `3px solid ${getPriorityColor(activeTicket.priority, theme)}`,
              boxShadow: 8,
              transform: 'rotate(2deg)',
              cursor: 'grabbing',
            }}
          >
            <TicketCardContent ticket={activeTicket} />
          </Card>
        )}
      </DragOverlay>

      <TicketDetailDrawer ticketId={drawerTicketId} onClose={() => setDrawerTicketId(null)} />
    </DndContext>
  )
}
