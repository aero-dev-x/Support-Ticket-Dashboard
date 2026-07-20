import SearchIcon from '@mui/icons-material/Search'
import { InputAdornment, TextField } from '@mui/material'
import { useEffect, useState } from 'react'

interface SearchBarProps {
  onSearchChange: (value: string) => void
}

export function SearchBar({ onSearchChange }: SearchBarProps) {
  const [value, setValue] = useState('')

  useEffect(() => {
    const timeout = setTimeout(() => onSearchChange(value), 300)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <TextField
      placeholder="Filter tickets…"
      size="small"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      sx={{ minWidth: 240 }}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" color="disabled" />
            </InputAdornment>
          ),
        },
      }}
    />
  )
}
