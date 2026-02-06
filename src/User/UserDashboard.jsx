import { useState } from 'react'
import { alpha } from '@mui/material/styles'
import {
  Box,
  Typography,
  Paper,
  useTheme,
  useMediaQuery,
  ButtonGroup,
  Button,
} from '@mui/material'
import Header from '../components/Header'
import Footer from '../components/Footer'
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded'
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded'
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded'

const TABS = [
  { id: 'statistics', label: 'Statistics', Icon: BarChartRoundedIcon },
  { id: 'courses', label: 'Courses', Icon: MenuBookRoundedIcon },
  { id: 'history', label: 'History', Icon: HistoryRoundedIcon },
]

function UserDashboard() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [activeTab, setActiveTab] = useState('statistics')

  return (
    <>
      <Header />
      <Box
        sx={{
          width: '100%',
          minWidth: 0,
          maxWidth: 1000,
          mx: 'auto',
          px: { xs: 2, sm: 3 },
          py: { xs: 3, sm: 4 },
          overflowX: 'hidden',
        }}
      >
        {/* Page title */}
        <Box sx={{ mb: { xs: 2.5, sm: 3 } }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              fontSize: { xs: '1.35rem', sm: '1.5rem' },
              letterSpacing: '-0.02em',
            }}
          >
            Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            View your statistics, courses, and activity history
          </Typography>
        </Box>

        {/* Toggle filter */}
        <Box
          sx={{
            mb: { xs: 2.5, sm: 3 },
            display: 'flex',
            justifyContent: { xs: 'center', sm: 'flex-start' },
            flexWrap: 'wrap',
          }}
        >
          <ButtonGroup
            variant="outlined"
            disableElevation
            sx={{
              borderRadius: 2.5,
              overflow: 'hidden',
              border: '1px solid',
              borderColor: alpha(theme.palette.primary.main, 0.25),
              bgcolor: alpha(theme.palette.primary.main, 0.04),
              boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.08)}`,
              '& .MuiButton-root': {
                px: { xs: 2, sm: 3 },
                py: { xs: 1.25, sm: 1.5 },
                textTransform: 'none',
                fontWeight: 600,
                fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                borderColor: 'transparent',
                borderRadius: 0,
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:not(:last-of-type)': {
                  borderRight: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                },
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  borderColor: 'transparent',
                },
              },
            }}
          >
            {TABS.map((tab) => {
              const Icon = tab.Icon
              const isActive = activeTab === tab.id
              return (
                <Button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  startIcon={<Icon sx={{ fontSize: 20, opacity: isActive ? 1 : 0.8 }} />}
                  sx={{
                    ...(isActive && {
                      bgcolor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      boxShadow: `0 2px 12px ${alpha(theme.palette.primary.main, 0.4)}`,
                      '&:hover': {
                        bgcolor: theme.palette.primary.dark,
                        color: theme.palette.primary.contrastText,
                        boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.45)}`,
                      },
                      '& .MuiSvgIcon-root': {
                        color: 'inherit',
                      },
                    }),
                    ...(!isActive && {
                      color: theme.palette.text.secondary,
                      '& .MuiSvgIcon-root': {
                        color: theme.palette.primary.main,
                      },
                    }),
                  }}
                >
                  {tab.label}
                </Button>
              )
            })}
          </ButtonGroup>
        </Box>

        {/* Content card - placeholder per tab */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 4 },
            borderRadius: { xs: 2.5, sm: 3 },
            border: '1px solid',
            borderColor: alpha(theme.palette.primary.main, 0.12),
            bgcolor: theme.palette.background.paper,
            boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.06)}`,
            minHeight: 320,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {activeTab === 'statistics' && (
            <Box sx={{ textAlign: 'center', maxWidth: 360 }}>
              <Box
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                }}
              >
                <BarChartRoundedIcon sx={{ color: 'primary.main', fontSize: 40 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
                Statistics
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Your progress, scores, and learning stats will appear here.
              </Typography>
            </Box>
          )}

          {activeTab === 'courses' && (
            <Box sx={{ textAlign: 'center', maxWidth: 360 }}>
              <Box
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                }}
              >
                <MenuBookRoundedIcon sx={{ color: 'primary.main', fontSize: 40 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
                Courses
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Your enrolled courses and learning path will appear here.
              </Typography>
            </Box>
          )}

          {activeTab === 'history' && (
            <Box sx={{ textAlign: 'center', maxWidth: 360 }}>
              <Box
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                }}
              >
                <HistoryRoundedIcon sx={{ color: 'primary.main', fontSize: 40 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
                History
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Your activity and attempt history will appear here.
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
      <Footer />
    </>
  )
}

export default UserDashboard
