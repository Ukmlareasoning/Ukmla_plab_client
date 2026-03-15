import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import UserDashboardLayout from './UserDashboardLayout'
import Scenarios from './Scenarios'

export default function UserScenariosPage() {
  const theme = useTheme()

  return (
    <UserDashboardLayout>
      <Box sx={{ px: { xs: 2, sm: 3 }, pt: 0, pb: { xs: 3, sm: 4 } }}>
        {/* Main scenarios list (API-powered, no login dialog, hero/footer hidden because dashboard has its own chrome) */}
        <Scenarios disableLoginDialog hideHero hideFooter compactTop />
      </Box>
    </UserDashboardLayout>
  )
}
