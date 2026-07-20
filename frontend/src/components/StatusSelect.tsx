import { MenuItem, Select, type SelectChangeEvent } from '@mui/material'
import { useUpdateTicketStatus } from '../hooks/useUpdateTicketStatus'
import { useFeedback } from './layout/FeedbackSnackbar'
import type { TicketStatus } from '../types/ticket'

const LABELS: Record<TicketStatus, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
}

export function StatusSelect({ ticketId, status }: { ticketId: number; status: TicketStatus }) {
  const { mutate, isPending } = useUpdateTicketStatus()
  const { showSuccess, showError } = useFeedback()

  const handleChange = (event: SelectChangeEvent) => {
    const newStatus = event.target.value as TicketStatus
    mutate(
      { id: ticketId, status: newStatus },
      {
        onSuccess: () => showSuccess(`Ticket status updated to "${LABELS[newStatus]}"`),
        onError: () => showError('Failed to update ticket status. Please try again.'),
      },
    )
  }

  return (
    <Select
      size="small"
      value={status}
      onChange={handleChange}
      disabled={isPending}
      onClick={(event) => event.stopPropagation()}
      sx={{
        fontSize: '0.8125rem',
        '& .MuiSelect-select': {
          py: '3px',
          pl: 1,
          pr: '28px !important',
        },
      }}
    >
      {Object.entries(LABELS).map(([value, label]) => (
        <MenuItem key={value} value={value} onClick={(event) => event.stopPropagation()} sx={{ fontSize: '0.8125rem' }}>
          {label}
        </MenuItem>
      ))}
    </Select>
  )
}
