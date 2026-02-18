import { useEffect } from 'react'
import { Box, Typography } from '@mui/material'
import UserDashboardLayout from './UserDashboardLayout'
import { HistoryTab, dashboardScenariosData } from './UserDashboard'

export default function UserScenariosHistoryPage() {
  const completedScenarios = dashboardScenariosData.filter((c) => c.enrolled && c.progress >= 100)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <UserDashboardLayout>
      <Box sx={{ px: { xs: 2, sm: 3 }, py: { xs: 3, sm: 4 } }}>
        <Box sx={{ mb: { xs: 2.5, sm: 3 } }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '1.35rem', sm: '1.5rem' }, letterSpacing: '-0.02em' }}>
            Scenarios History
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            View your completed scenario exams
          </Typography>
        </Box>
        <HistoryTab
          completedCourses={completedScenarios}
          detailsPath="/user-dashboard/scenario-details"
          sectionTitle="Completed Scenario Exams"
          singularLabel="scenario exam"
          pluralLabel="scenario exams"
          emptyTitle="No completed scenario exams yet"
          emptySubtitle="Complete scenario exams to see them here."
        />
      </Box>
    </UserDashboardLayout>
  )
}
