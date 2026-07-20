import { ThemeProvider } from '@mui/material/styles'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { FeedbackProvider } from '../components/layout/FeedbackSnackbar'
import { TicketTable } from '../components/TicketTable'
import { theme } from '../theme'
import type { Ticket } from '../types/ticket'

const MOCK_TICKETS: Ticket[] = [
  {
    id: 1,
    title: 'Unable to complete payment',
    description: 'Payment form errors out.',
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    status: 'open',
    priority: 'high',
    createdAt: '2026-06-18T10:30:00Z',
  },
  {
    id: 2,
    title: 'Password reset email missing',
    description: 'No email arrives after requesting a reset.',
    customerName: 'Miguel Torres',
    customerEmail: 'miguel@example.com',
    status: 'in_progress',
    priority: 'medium',
    createdAt: '2026-06-19T08:00:00Z',
  },
]

function renderWithProviders(children: ReactNode) {
  const queryClient = new QueryClient()
  return render(
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <FeedbackProvider>{children}</FeedbackProvider>
        </MemoryRouter>
      </QueryClientProvider>
    </ThemeProvider>,
  )
}

describe('TicketTable', () => {
  it('renders ticket rows from provided data', () => {
    renderWithProviders(<TicketTable tickets={MOCK_TICKETS} onRowClick={vi.fn()} />)

    expect(screen.getByText('Unable to complete payment')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('High')).toBeInTheDocument()

    expect(screen.getByText('Password reset email missing')).toBeInTheDocument()
    expect(screen.getByText('Miguel Torres')).toBeInTheDocument()
    expect(screen.getByText('Medium')).toBeInTheDocument()
  })
})
