import { Alert, Snackbar } from '@mui/material'
import { createContext, useContext, useState, type ReactNode } from 'react'

type Severity = 'success' | 'error'

interface FeedbackContextValue {
  showSuccess: (message: string) => void
  showError: (message: string) => void
}

const FeedbackContext = createContext<FeedbackContextValue | undefined>(undefined)

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [severity, setSeverity] = useState<Severity>('success')

  const show = (msg: string, sev: Severity) => {
    setMessage(msg)
    setSeverity(sev)
    setOpen(true)
  }

  return (
    <FeedbackContext.Provider
      value={{
        showSuccess: (msg) => show(msg, 'success'),
        showError: (msg) => show(msg, 'error'),
      }}
    >
      {children}
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={severity} onClose={() => setOpen(false)} variant="filled">
          {message}
        </Alert>
      </Snackbar>
    </FeedbackContext.Provider>
  )
}

export function useFeedback(): FeedbackContextValue {
  const context = useContext(FeedbackContext)
  if (!context) {
    throw new Error('useFeedback must be used within a FeedbackProvider')
  }
  return context
}
