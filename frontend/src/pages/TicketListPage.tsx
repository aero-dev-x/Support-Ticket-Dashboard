import { Alert, Box, Button, CircularProgress, Stack, TablePagination, Typography } from '@mui/material'
import { useState } from 'react'
import { CreateTicketDialog } from '../components/CreateTicketDialog'
import { FilterBar } from '../components/FilterBar'
import { SearchBar } from '../components/SearchBar'
import { TicketDetailDrawer } from '../components/TicketDetailDrawer'
import { TicketTable } from '../components/TicketTable'
import { useTickets } from '../hooks/useTickets'
import type { TicketPriority, TicketStatus } from '../types/ticket'

const PAGE_SIZE = 10

export function TicketListPage() {
  const [status, setStatus] = useState<TicketStatus | ''>('')
  const [priority, setPriority] = useState<TicketPriority | ''>('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [drawerTicketId, setDrawerTicketId] = useState<number | null>(null)

  const { data, isLoading, isError, refetch } = useTickets({
    status: status || undefined,
    priority: priority || undefined,
    search: search || undefined,
    page,
    pageSize: PAGE_SIZE,
    sort: '-created_at',
  })

  const updateFilterAndResetPage = <T,>(setter: (value: T) => void) => (value: T) => {
    setter(value)
    setPage(1)
  }

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h5">Tickets</Typography>
        <Button variant="contained" onClick={() => setDialogOpen(true)}>
          New Ticket
        </Button>
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <FilterBar
          status={status}
          priority={priority}
          onStatusChange={updateFilterAndResetPage(setStatus)}
          onPriorityChange={updateFilterAndResetPage(setPriority)}
        />
        <SearchBar onSearchChange={updateFilterAndResetPage(setSearch)} />
      </Stack>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {isError && (
        <Alert severity="error" action={<Button onClick={() => refetch()}>Retry</Button>}>
          Failed to load tickets.
        </Alert>
      )}

      {!isLoading && !isError && data && data.items.length === 0 && (
        <Alert severity="info">
          {status || priority || search ? 'No tickets match your filters.' : 'No tickets yet — create one to get started.'}
        </Alert>
      )}

      {!isLoading && !isError && data && data.items.length > 0 && (
        <>
          <TicketTable tickets={data.items} onRowClick={setDrawerTicketId} />
          <TablePagination
            component="div"
            count={data.total}
            page={page - 1}
            onPageChange={(_, newPage) => setPage(newPage + 1)}
            rowsPerPage={PAGE_SIZE}
            rowsPerPageOptions={[PAGE_SIZE]}
          />
        </>
      )}

      <CreateTicketDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
      <TicketDetailDrawer ticketId={drawerTicketId} onClose={() => setDrawerTicketId(null)} />
    </Stack>
  )
}
