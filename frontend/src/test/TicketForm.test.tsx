import { ThemeProvider } from '@mui/material/styles'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { TicketForm } from '../components/TicketForm'
import { theme } from '../theme'

function renderWithTheme(children: ReactNode) {
  return render(<ThemeProvider theme={theme}>{children}</ThemeProvider>)
}

describe('TicketForm', () => {
  it('shows validation errors for empty required fields and does not submit', async () => {
    const onSubmit = vi.fn()
    renderWithTheme(<TicketForm onSubmit={onSubmit} />)

    await userEvent.click(screen.getByRole('button', { name: /create ticket/i }))

    expect(await screen.findByText('Title is required')).toBeInTheDocument()
    expect(screen.getByText('Description is required')).toBeInTheDocument()
    expect(screen.getByText('Customer name is required')).toBeInTheDocument()
    expect(screen.getByText('Email is required')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('shows a validation error for an invalid email format', async () => {
    const onSubmit = vi.fn()
    renderWithTheme(<TicketForm onSubmit={onSubmit} />)

    await userEvent.type(screen.getByLabelText(/title/i), 'Some issue')
    await userEvent.type(screen.getByLabelText(/description/i), 'Some description')
    await userEvent.type(screen.getByLabelText(/customer name/i), 'Jane Doe')
    await userEvent.type(screen.getByLabelText(/customer email/i), 'not-an-email')
    await userEvent.click(screen.getByRole('button', { name: /create ticket/i }))

    expect(await screen.findByText('Enter a valid email address')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })
})
