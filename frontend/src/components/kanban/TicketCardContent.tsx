import { Avatar, CardContent, Stack, Typography, useTheme } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { FONT_MONO } from '../../theme'
import { getAvatarColorKey, getInitials } from '../../utils/avatar'
import { formatTicketId } from '../../utils/formatTicketId'
import { PriorityChip } from '../PriorityChip'
import type { Ticket } from '../../types/ticket'

export function TicketCardContent({ ticket }: { ticket: Ticket }) {
  const theme = useTheme()
  const colorKey = getAvatarColorKey(ticket.customerName)

  return (
    <CardContent sx={{ p: 1.75, '&:last-child': { pb: 1.75 } }}>
      <Stack spacing={1.25} sx={{ alignItems: 'flex-start' }}>
        <Typography
          component={RouterLink}
          to={`/tickets/${ticket.id}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          variant="caption"
          sx={{
            fontFamily: FONT_MONO,
            color: theme.palette.link.main,
            textDecoration: 'none',
            '&:visited': { color: theme.palette.link.main },
            '&:hover': { color: theme.palette.link.main, textDecoration: 'underline' },
            '&:active': { color: theme.palette.link.main },
          }}
        >
          {formatTicketId(ticket.id)}
        </Typography>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
          {ticket.title}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Avatar
            sx={{
              width: 24,
              height: 24,
              fontSize: 11,
              bgcolor: theme.palette[colorKey].main,
              color: theme.palette.avatarContrastText,
            }}
          >
            {getInitials(ticket.customerName)}
          </Avatar>
          <Typography variant="body2" color="text.secondary" noWrap>
            {ticket.customerName}
          </Typography>
        </Stack>
        <PriorityChip priority={ticket.priority} />
      </Stack>
    </CardContent>
  )
}
