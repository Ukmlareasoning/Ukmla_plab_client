import { useEffect } from 'react'
import { Box, Typography } from '@mui/material'
import UserDashboardLayout from './UserDashboardLayout'
import { HistoryTab } from './UserDashboard'
import { dashboardCoursesData } from './UserDashboardData.jsx'

export default function UserMocksHistoryPage() {
  const completedCourses = dashboardCoursesData.filter((c) => c.enrolled && c.progress >= 100)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <UserDashboardLayout>
      <Box sx={{ px: { xs: 2, sm: 3 }, py: { xs: 3, sm: 4 } }}>
        <Box sx={{ mb: { xs: 2.5, sm: 3 } }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '1.35rem', sm: '1.5rem' }, letterSpacing: '-0.02em' }}>
            Mocks History
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            View your completed mock exams
          </Typography>
        </Box>
        <HistoryTab
          completedCourses={completedCourses}
          detailsPath="/user-dashboard/course-details"
          sectionTitle="Completed Mocks Exams"
          singularLabel="mock exam"
          pluralLabel="mocks exams"
          emptyTitle="No completed mocks exams yet"
          emptySubtitle="Complete mock exams to see them here."
        />
      </Box>
    </UserDashboardLayout>
  )
}
