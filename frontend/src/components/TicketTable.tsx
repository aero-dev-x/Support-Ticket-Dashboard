import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { FONT_MONO } from '../theme'
import { getAvatarColorKey, getInitials } from '../utils/avatar'
import { getPriorityColor } from '../utils/priorityColor'
import { formatTicketId } from '../utils/formatTicketId'
import { PriorityChip } from './PriorityChip'
import { StatusSelect } from './StatusSelect'
import type { Ticket } from '../types/ticket'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

function TicketIdLink({ ticket }: { ticket: Ticket }) {
  return (
    <Typography
      component={RouterLink}
      to={`/tickets/${ticket.id}`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      variant="caption"
      sx={(theme) => ({
        fontFamily: FONT_MONO,
        color: theme.palette.link.main,
        textDecoration: 'none',
        '&:visited': { color: theme.palette.link.main },
        '&:hover': { color: theme.palette.link.main, textDecoration: 'underline' },
        '&:active': { color: theme.palette.link.main },
      })}
    >
      {formatTicketId(ticket.id)}
    </Typography>
  )
}

function CustomerCell({ ticket }: { ticket: Ticket }) {
  const theme = useTheme()
  const colorKey = getAvatarColorKey(ticket.customerName)
  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
      <Avatar
        sx={{
          width: 22,
          height: 22,
          fontSize: 10,
          bgcolor: theme.palette[colorKey].main,
          color: theme.palette.avatarContrastText,
        }}
      >
        {getInitials(ticket.customerName)}
      </Avatar>
      <Typography variant="body2">{ticket.customerName}</Typography>
    </Stack>
  )
}

interface TicketTableProps {
  tickets: Ticket[]
  onRowClick: (ticketId: number) => void
}

export function TicketTable({ tickets, onRowClick }: TicketTableProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  if (isMobile) {
    return (
      <Stack spacing={1.5}>
        {tickets.map((ticket) => (
          <Card
            key={ticket.id}
            variant="outlined"
            sx={{ borderLeft: `3px solid ${getPriorityColor(ticket.priority, theme)}` }}
          >
            <CardActionArea onClick={() => onRowClick(ticket.id)}>
              <CardContent>
                <TicketIdLink ticket={ticket} />
                <Typography variant="subtitle1">{ticket.title}</Typography>
                <Box sx={{ mt: 0.5, mb: 1 }}>
                  <CustomerCell ticket={ticket} />
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {formatDate(ticket.createdAt)}
                </Typography>
                <Box
                  sx={{ mt: 1, display: 'flex', gap: 1, alignItems: 'center' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <PriorityChip priority={ticket.priority} />
                  <StatusSelect ticketId={ticket.id} status={ticket.status} />
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Stack>
    )
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell width={20} />
            <TableCell>ID</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell>Created</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id} hover onClick={() => onRowClick(ticket.id)} sx={{ cursor: 'pointer' }}>
              <TableCell sx={{ p: 0 }}>
                <Box sx={{ width: 3, height: 28, borderRadius: 1, bgcolor: getPriorityColor(ticket.priority, theme) }} />
              </TableCell>
              <TableCell>
                <TicketIdLink ticket={ticket} />
              </TableCell>
              <TableCell>{ticket.title}</TableCell>
              <TableCell>
                <CustomerCell ticket={ticket} />
              </TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <StatusSelect ticketId={ticket.id} status={ticket.status} />
              </TableCell>
              <TableCell>
                <PriorityChip priority={ticket.priority} />
              </TableCell>
              <TableCell>{formatDate(ticket.createdAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
