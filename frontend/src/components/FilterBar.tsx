import { Chip, Stack, Typography } from '@mui/material'
import type { TicketPriority, TicketStatus } from '../types/ticket'

interface FilterBarProps {
  status?: TicketStatus | ''
  priority: TicketPriority | ''
  onStatusChange?: (status: TicketStatus | '') => void
  onPriorityChange: (priority: TicketPriority | '') => void
}

const STATUS_OPTIONS: { value: TicketStatus | ''; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
]

const PRIORITY_OPTIONS: { value: TicketPriority | ''; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

export function FilterBar({ status, priority, onStatusChange, onPriorityChange }: FilterBarProps) {
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5} sx={{ flexWrap: 'wrap' }}>
      {onStatusChange && (
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap', rowGap: 1 }}>
          <Typography variant="caption" color="text.disabled" sx={{ mr: 0.5 }}>
            Status
          </Typography>
          {STATUS_OPTIONS.map((opt) => (
            <Chip
              key={opt.value || 'all-status'}
              label={opt.label}
              size="small"
              clickable
              variant={status === opt.value ? 'filled' : 'outlined'}
              color={status === opt.value ? 'primary' : 'default'}
              onClick={() => onStatusChange(opt.value)}
            />
          ))}
        </Stack>
      )}
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap', rowGap: 1 }}>
        <Typography variant="caption" color="text.disabled" sx={{ mr: 0.5 }}>
          Priority
        </Typography>
        {PRIORITY_OPTIONS.map((opt) => (
          <Chip
            key={opt.value || 'all-priority'}
            label={opt.label}
            size="small"
            clickable
            variant={priority === opt.value ? 'filled' : 'outlined'}
            color={priority === opt.value ? 'primary' : 'default'}
            onClick={() => onPriorityChange(opt.value)}
          />
        ))}
      </Stack>
    </Stack>
  )
}
