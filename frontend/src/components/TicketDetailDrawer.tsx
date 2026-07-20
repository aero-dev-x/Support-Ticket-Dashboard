import CloseIcon from '@mui/icons-material/Close'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { Alert, Box, Button, CircularProgress, Drawer, IconButton, Stack, Typography } from '@mui/material'
import { useTicket } from '../hooks/useTicket'
import { FONT_MONO } from '../theme'
import { formatTicketId } from '../utils/formatTicketId'
import { TicketDetailCard } from './TicketDetailCard'

interface TicketDetailDrawerProps {
  ticketId: number | null
  onClose: () => void
}

export function TicketDetailDrawer({ ticketId, onClose }: TicketDetailDrawerProps) {
  return (
    <Drawer anchor="right" open={ticketId !== null} onClose={onClose}>
      <Box sx={{ width: { xs: '100vw', sm: 440 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Stack
          direction="row"
          sx={{ alignItems: 'center', justifyContent: 'space-between', p: 2, borderBottom: '1px solid', borderColor: 'divider' }}
        >
          <Typography variant="overline" color="text.secondary" sx={{ fontFamily: FONT_MONO }}>
            {ticketId !== null ? formatTicketId(ticketId) : ''}
          </Typography>
          <Stack direction="row" spacing={0.5}>
            {ticketId !== null && (
              <IconButton
                component="a"
                href={`/tickets/${ticketId}`}
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                aria-label="Open in new tab"
              >
                <OpenInNewIcon fontSize="small" />
              </IconButton>
            )}
            <IconButton onClick={onClose} size="small" aria-label="Close">
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>
        <Box sx={{ p: 2, overflowY: 'auto', flex: 1 }}>
          {ticketId !== null && <DrawerBody ticketId={ticketId} />}
        </Box>
      </Box>
    </Drawer>
  )
}

function DrawerBody({ ticketId }: { ticketId: number }) {
  const { data: ticket, isLoading, isError, refetch } = useTicket(ticketId)

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (isError || !ticket) {
    return (
      <Alert severity="error" action={<Button onClick={() => refetch()}>Retry</Button>}>
        Failed to load ticket.
      </Alert>
    )
  }

  return <TicketDetailCard ticket={ticket} />
}
