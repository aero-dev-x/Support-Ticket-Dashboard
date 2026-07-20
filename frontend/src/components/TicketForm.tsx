import { zodResolver } from '@hookform/resolvers/zod'
import { Button, MenuItem, Stack, TextField } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import type { CreateTicketInput } from '../types/ticket'

export const ticketFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  customerName: z.string().min(1, 'Customer name is required'),
  customerEmail: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  priority: z.enum(['low', 'medium', 'high']),
})

export type TicketFormValues = z.infer<typeof ticketFormSchema>

const DEFAULT_VALUES: TicketFormValues = {
  title: '',
  description: '',
  customerName: '',
  customerEmail: '',
  priority: 'medium',
}

interface TicketFormProps {
  onSubmit: (values: CreateTicketInput) => void
  isSubmitting?: boolean
}

export function TicketForm({ onSubmit, isSubmitting }: TicketFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TicketFormValues>({
    resolver: zodResolver(ticketFormSchema),
    defaultValues: DEFAULT_VALUES,
  })

  return (
    <Stack component="form" spacing={2} onSubmit={handleSubmit(onSubmit)} noValidate>
      <Controller
        name="title"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Title"
            error={!!errors.title}
            helperText={errors.title?.message}
            fullWidth
          />
        )}
      />
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Description"
            multiline
            minRows={3}
            error={!!errors.description}
            helperText={errors.description?.message}
            fullWidth
          />
        )}
      />
      <Controller
        name="customerName"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Customer Name"
            error={!!errors.customerName}
            helperText={errors.customerName?.message}
            fullWidth
          />
        )}
      />
      <Controller
        name="customerEmail"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Customer Email"
            error={!!errors.customerEmail}
            helperText={errors.customerEmail?.message}
            fullWidth
          />
        )}
      />
      <Controller
        name="priority"
        control={control}
        render={({ field }) => (
          <TextField {...field} select label="Priority" fullWidth>
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
          </TextField>
        )}
      />
      <Button type="submit" variant="contained" disabled={isSubmitting}>
        Create Ticket
      </Button>
    </Stack>
  )
}
