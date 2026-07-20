import { Alert, Box, Button, CircularProgress, Stack } from '@mui/material'
import { Link as RouterLink, useParams } from 'react-router-dom'
import { TicketDetailCard } from '../components/TicketDetailCard'
import { useTicket } from '../hooks/useTicket'

export function TicketDetailPage() {
  const { id } = useParams<{ id: string }>()
  const ticketId = Number(id)
  const { data: ticket, isLoading, isError, refetch } = useTicket(ticketId)

  return (
    <Stack spacing={2}>
      <Button component={RouterLink} to="/" sx={{ alignSelf: 'flex-start' }}>
        &larr; Back to list
      </Button>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {isError && (
        <Alert severity="error" action={<Button onClick={() => refetch()}>Retry</Button>}>
          Ticket not found or failed to load.
        </Alert>
      )}

      {!isLoading && !isError && ticket && <TicketDetailCard ticket={ticket} />}
    </Stack>
  )
}
