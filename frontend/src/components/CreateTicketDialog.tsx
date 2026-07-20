import CloseIcon from '@mui/icons-material/Close'
import { Dialog, DialogContent, DialogTitle, IconButton, useMediaQuery, useTheme } from '@mui/material'
import { useCreateTicket } from '../hooks/useCreateTicket'
import { useFeedback } from './layout/FeedbackSnackbar'
import { TicketForm } from './TicketForm'

interface CreateTicketDialogProps {
  open: boolean
  onClose: () => void
}

export function CreateTicketDialog({ open, onClose }: CreateTicketDialogProps) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const { mutate, isPending } = useCreateTicket()
  const { showSuccess, showError } = useFeedback()

  return (
    <Dialog open={open} onClose={onClose} fullScreen={fullScreen} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        New Ticket
        <IconButton onClick={onClose} size="small" aria-label="Close">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TicketForm
          isSubmitting={isPending}
          onSubmit={(values) =>
            mutate(values, {
              onSuccess: () => {
                showSuccess('Ticket created successfully')
                onClose()
              },
              onError: () => showError('Failed to create ticket. Please check the form and try again.'),
            })
          }
        />
      </DialogContent>
    </Dialog>
  )
}
