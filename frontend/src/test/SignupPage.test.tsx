import { ThemeProvider } from '@mui/material/styles'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AuthProvider } from '../contexts/AuthContext'
import { SignupPage } from '../pages/SignupPage'
import { theme } from '../theme'

function renderSignupPage() {
  return render(
    <ThemeProvider theme={theme}>
      <MemoryRouter>
        <AuthProvider>
          <SignupPage />
        </AuthProvider>
      </MemoryRouter>
    </ThemeProvider>,
  )
}

describe('SignupPage', () => {
  it('shows a validation error for an invalid email and a too-short password', async () => {
    renderSignupPage()

    await userEvent.type(screen.getByLabelText(/email/i), 'not-an-email')
    await userEvent.type(screen.getByLabelText('Password', { exact: true }), 'short')
    await userEvent.click(screen.getByRole('button', { name: /sign up/i }))

    expect(await screen.findByText('Enter a valid email address')).toBeInTheDocument()
    expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument()
  })

  it('shows a validation error when the confirm password does not match', async () => {
    renderSignupPage()

    await userEvent.type(screen.getByLabelText(/email/i), 'valid@example.com')
    await userEvent.type(screen.getByLabelText('Password', { exact: true }), 'password123')
    await userEvent.type(screen.getByLabelText(/confirm password/i), 'password456')
    await userEvent.click(screen.getByRole('button', { name: /sign up/i }))

    expect(await screen.findByText('Passwords do not match')).toBeInTheDocument()
  })
})
