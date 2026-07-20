import { Box, Card, CardContent, Divider, Stack, Typography } from '@mui/material'
import { FONT_MONO } from '../theme'
import { formatTicketId } from '../utils/formatTicketId'
import { PriorityChip } from './PriorityChip'
import { StatusSelect } from './StatusSelect'
import type { Ticket } from '../types/ticket'

export function TicketDetailCard({ ticket }: { ticket: Ticket }) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <Box>
            <Typography variant="caption" color="text.disabled" sx={{ fontFamily: FONT_MONO }}>
              {formatTicketId(ticket.id)}
            </Typography>
            <Typography variant="h5">{ticket.title}</Typography>
            <Typography variant="body2" color="text.secondary">
              Created {new Date(ticket.createdAt).toLocaleString()}
            </Typography>
          </Box>

          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <StatusSelect ticketId={ticket.id} status={ticket.status} />
            <PriorityChip priority={ticket.priority} />
          </Stack>

          <Divider />

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Description
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {ticket.description}
            </Typography>
          </Box>

          <Divider />

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Customer
            </Typography>
            <Typography variant="body1">{ticket.customerName}</Typography>
            <Typography variant="body2" color="text.secondary">
              {ticket.customerEmail}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}
