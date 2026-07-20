import { AppBar, Box, Button, Container, ToggleButton, ToggleButtonGroup, Toolbar, Typography } from '@mui/material'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const TABS = [
  { path: '/', label: 'List' },
  { path: '/board', label: 'Board' },
]

export function AppShell() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()

  const currentTab = TABS.some((tab) => tab.path === location.pathname) ? location.pathname : '/'

  return (
    <>
      <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
        <Toolbar sx={{ flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Support Tickets
          </Typography>
          <ToggleButtonGroup
            size="small"
            exclusive
            value={currentTab}
            onChange={(_, value) => value && navigate(value)}
            sx={{
              bgcolor: 'background.paper',
              p: 0.4,
              '& .MuiToggleButton-root': {
                border: 'none',
                textTransform: 'none',
                px: 1.5,
                color: 'text.secondary',
                '&.Mui-selected': { bgcolor: 'background.default', color: 'text.primary' },
              },
            }}
          >
            {TABS.map((tab) => (
              <ToggleButton key={tab.path} value={tab.path}>
                {tab.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
              <Button size="small" onClick={logout}>
                Log out
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Outlet />
      </Container>
    </>
  )
}
