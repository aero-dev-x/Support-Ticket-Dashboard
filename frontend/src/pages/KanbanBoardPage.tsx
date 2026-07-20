import { Button, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { CreateTicketDialog } from '../components/CreateTicketDialog'
import { FilterBar } from '../components/FilterBar'
import { SearchBar } from '../components/SearchBar'
import { KanbanBoard } from '../components/kanban/KanbanBoard'
import type { TicketPriority } from '../types/ticket'

export function KanbanBoardPage() {
  const [priority, setPriority] = useState<TicketPriority | ''>('')
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h5">Board</Typography>
        <Button variant="contained" onClick={() => setDialogOpen(true)}>
          New Ticket
        </Button>
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <FilterBar priority={priority} onPriorityChange={setPriority} />
        <SearchBar onSearchChange={setSearch} />
      </Stack>

      <KanbanBoard priority={priority || undefined} search={search || undefined} />

      <CreateTicketDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </Stack>
  )
}
