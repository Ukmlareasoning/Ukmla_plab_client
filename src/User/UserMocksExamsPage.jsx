import { useEffect } from 'react'
import { Box, Typography } from '@mui/material'
import UserDashboardLayout from './UserDashboardLayout'
import { DashboardCoursesTab } from './UserDashboard'

export default function UserMocksExamsPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <UserDashboardLayout>
      <Box sx={{ px: { xs: 2, sm: 3 }, py: { xs: 3, sm: 4 } }}>
        <Box sx={{ mb: { xs: 2.5, sm: 3 } }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '1.35rem', sm: '1.5rem' }, letterSpacing: '-0.02em' }}>
            Mocks Exams
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Browse and manage your mock exams
          </Typography>
        </Box>
        <DashboardCoursesTab />
      </Box>
    </UserDashboardLayout>
  )
}
