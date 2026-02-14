import { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
import UserDashboardLayout from './UserDashboardLayout'
import { DashboardStatsContent } from './UserDashboard'

export default function UserDashboardPage() {
  const [courseFilter, setCourseFilter] = useState('all')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <UserDashboardLayout>
      <Box sx={{ px: { xs: 2, sm: 3 }, py: { xs: 3, sm: 4 } }}>
        <Box sx={{ mb: { xs: 2.5, sm: 3 } }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '1.35rem', sm: '1.5rem' }, letterSpacing: '-0.02em' }}>
            Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            View your statistics, mocks exams, and activity history
          </Typography>
        </Box>
        <DashboardStatsContent courseFilter={courseFilter} setCourseFilter={setCourseFilter} />
      </Box>
    </UserDashboardLayout>
  )
}
