import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Box, Typography } from '@mui/material'
import UserDashboardLayout from './UserDashboardLayout'

const PATH_TO_PAGE_NAME = {
  '/user-dashboard/scenarios': 'Scenarios',
  '/user-dashboard/scenarios-history': 'Scenarios History',
  '/user-dashboard/progress': 'Progress',
  '/user-dashboard/mistakes': 'Mistakes',
  '/user-dashboard/notes': 'Notes',
  '/user-dashboard/webinar': 'Webinar',
  '/user-dashboard/community': 'Community',
}

export default function UserPlaceholderPage() {
  const location = useLocation()
  const pageName = PATH_TO_PAGE_NAME[location.pathname] || 'Page'

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <UserDashboardLayout>
      <Box sx={{ px: { xs: 2, sm: 3 }, py: { xs: 3, sm: 4 } }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
          This is {pageName} page.
        </Typography>
      </Box>
    </UserDashboardLayout>
  )
}
