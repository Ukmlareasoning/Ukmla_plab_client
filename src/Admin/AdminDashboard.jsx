import { alpha } from '@mui/material/styles'
import { Box, Typography, useTheme } from '@mui/material'

function AdminDashboard() {
  const theme = useTheme()

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        borderRadius: 3,
        bgcolor: theme.palette.background.paper,
        boxShadow: `0 2px 12px ${alpha(theme.palette.primary.main, 0.06)}`,
      }}
    >
      <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 500 }}>
        This is Dashboard page
      </Typography>
    </Box>
  )
}

export default AdminDashboard
