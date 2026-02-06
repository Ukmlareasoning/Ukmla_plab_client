import { useState } from 'react'
import { alpha } from '@mui/material/styles'
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
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
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded'
import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import NewReleasesRoundedIcon from '@mui/icons-material/NewReleasesRounded'
import AllInclusiveRoundedIcon from '@mui/icons-material/AllInclusiveRounded'
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded'

const TABS = [
  { id: 'statistics', label: 'Statistics', Icon: BarChartRoundedIcon },
  { id: 'courses', label: 'Courses', Icon: MenuBookRoundedIcon },
  { id: 'history', label: 'History', Icon: HistoryRoundedIcon },
]

const primaryGradient = 'linear-gradient(135deg, #0D9488 0%, #14B8A6 100%)'

// User stats cards: courses collection one-liners (replace with API)
const statsCards = [
  { id: 'all', label: 'All', value: '12', sub: 'Total courses', Icon: AllInclusiveRoundedIcon, gradient: primaryGradient },
  { id: 'active', label: 'Active', value: '3', sub: 'In progress', Icon: PlayCircleOutlineRoundedIcon, gradient: primaryGradient },
  { id: 'completed', label: 'Completed', value: '2', sub: 'Finished', Icon: CheckCircleRoundedIcon, gradient: primaryGradient },
  { id: 'new', label: 'New', value: '7', sub: 'Not started', Icon: NewReleasesRoundedIcon, gradient: primaryGradient },
]

// Course type filter tabs (one-liner filter)
const COURSE_FILTER_TABS = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' },
  { id: 'new', label: 'New' },
]

// Mock data for bar chart: course progress (label, percentage)
const progressBarData = [
  { label: 'UKMLA Reasoning Core', value: 78 },
  { label: 'Ethics & GMC', value: 45 },
  { label: 'Patient Safety', value: 22 },
]

// Mock data for pie: course distribution (label, percentage, color)
const pieData = [
  { label: 'Active', value: 25, color: '#0D9488' },
  { label: 'Completed', value: 17, color: '#10B981' },
  { label: 'New', value: 58, color: '#64748B' },
]

function UserDashboard() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [activeTab, setActiveTab] = useState('statistics')
  const [courseFilter, setCourseFilter] = useState('all')

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

        {/* Main toggle: Statistics | Courses | History */}
        <Box sx={{ mb: { xs: 2.5, sm: 3 }, display: 'flex', justifyContent: { xs: 'center', sm: 'flex-start' }, flexWrap: 'wrap' }}>
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
                '&:not(:last-of-type)': { borderRight: `1px solid ${alpha(theme.palette.primary.main, 0.2)}` },
                '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1), borderColor: 'transparent' },
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
                      '& .MuiSvgIcon-root': { color: 'inherit' },
                    }),
                    ...(!isActive && {
                      color: theme.palette.text.secondary,
                      '& .MuiSvgIcon-root': { color: theme.palette.primary.main },
                    }),
                  }}
                >
                  {tab.label}
                </Button>
              )
            })}
          </ButtonGroup>
        </Box>

        {/* Statistics tab: dashboard cards + course filter tabs + charts */}
        {activeTab === 'statistics' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2.5, sm: 3 } }}>
            {/* Stat cards: All, Active, Completed, New */}
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: { xs: 1.5, sm: 2 },
              }}
            >
              {statsCards.map((stat) => {
                const Icon = stat.Icon
                return (
                  <Card
                    key={stat.id}
                    elevation={0}
                    sx={{
                      flex: { xs: '1 1 calc(50% - 6px)', sm: '1 1 calc(25% - 12px)' },
                      minWidth: 0,
                      maxWidth: { xs: 'none', sm: 'calc(25% - 12px)' },
                      minHeight: { xs: 120, sm: 140 },
                      borderRadius: 2.5,
                      bgcolor: theme.palette.background.paper,
                      border: '1px solid',
                      borderColor: alpha(theme.palette.primary.main, 0.15),
                      boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.06)}`,
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.25s ease',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 3,
                        background: stat.gradient,
                      },
                      '&:hover': {
                        boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.12)}`,
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: { xs: 1.5, sm: 2 }, '&:last-child': { pb: { xs: 1.5, sm: 2 } } }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: stat.gradient,
                          color: 'white',
                          mb: 1.5,
                          boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                        }}
                      >
                        <Icon sx={{ fontSize: 26 }} />
                      </Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '1.5rem', sm: '1.75rem' }, lineHeight: 1 }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.875rem' }}>
                        {stat.label}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                        {stat.sub}
                      </Typography>
                    </CardContent>
                  </Card>
                )
              })}
            </Box>

            {/* Course type filter tabs: All | Active | Completed | New */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 1.5, sm: 2 },
                borderRadius: 2,
                border: '1px solid',
                borderColor: alpha(theme.palette.primary.main, 0.12),
                bgcolor: alpha(theme.palette.primary.main, 0.02),
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.secondary', mb: 1.5, fontSize: '0.8125rem' }}>
                Filter by course type
              </Typography>
              <ButtonGroup
                variant="outlined"
                size="small"
                disableElevation
                sx={{
                  flexWrap: 'wrap',
                  gap: 0.5,
                  '& .MuiButton-root': {
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.8125rem',
                    borderRadius: 1.5,
                    borderColor: alpha(theme.palette.primary.main, 0.3),
                    color: 'text.secondary',
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                      color: theme.palette.primary.dark,
                    },
                  },
                }}
              >
                {COURSE_FILTER_TABS.map((tab) => {
                  const isFilterActive = courseFilter === tab.id
                  return (
                    <Button
                      key={tab.id}
                      onClick={() => setCourseFilter(tab.id)}
                      sx={{
                        ...(isFilterActive && {
                          bgcolor: theme.palette.primary.main,
                          color: theme.palette.primary.contrastText,
                          borderColor: theme.palette.primary.main,
                          '&:hover': {
                            bgcolor: theme.palette.primary.dark,
                            color: theme.palette.primary.contrastText,
                            borderColor: theme.palette.primary.dark,
                          },
                        }),
                      }}
                    >
                      {tab.label}
                    </Button>
                  )
                })}
              </ButtonGroup>
            </Paper>

            {/* Charts row: Bar chart + Pie chart */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: { xs: 2, sm: 2.5 },
              }}
            >
              {/* Bar chart - progress by course */}
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 2.5 },
                  borderRadius: 2.5,
                  border: '1px solid',
                  borderColor: alpha(theme.palette.primary.main, 0.12),
                  bgcolor: theme.palette.background.paper,
                  boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.06)}`,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <TrendingUpRoundedIcon sx={{ color: 'primary.main', fontSize: 24 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '1rem' }}>
                    Progress by course
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {progressBarData.map((item, idx) => (
                    <Box key={idx}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem' }}>
                          {item.label}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 700, fontSize: '0.75rem' }}>
                          {item.value}%
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          height: 10,
                          borderRadius: 1,
                          bgcolor: alpha(theme.palette.primary.main, 0.12),
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          sx={{
                            height: '100%',
                            width: `${item.value}%`,
                            borderRadius: 1,
                            background: primaryGradient,
                            transition: 'width 0.5s ease',
                          }}
                        />
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Paper>

              {/* Pie chart - course distribution */}
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 2.5 },
                  borderRadius: 2.5,
                  border: '1px solid',
                  borderColor: alpha(theme.palette.primary.main, 0.12),
                  bgcolor: theme.palette.background.paper,
                  boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.06)}`,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <BarChartRoundedIcon sx={{ color: 'primary.main', fontSize: 24 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '1rem' }}>
                    Course distribution
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 140,
                      height: 140,
                      borderRadius: '50%',
                      flexShrink: 0,
                      background: `conic-gradient(${pieData.map((d, i) => {
                        const start = pieData.slice(0, i).reduce((a, x) => a + x.value, 0)
                        return `${d.color} ${start}% ${start + d.value}%`
                      }).join(', ')})`,
                      boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.15)}`,
                    }}
                  />
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                    {pieData.map((d, idx) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 12, height: 12, borderRadius: 1, bgcolor: d.color }} />
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                          {d.label}: {d.value}%
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Box>
        )}

        {/* Courses tab - placeholder */}
        {activeTab === 'courses' && (
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
          </Paper>
        )}

        {/* History tab - placeholder */}
        {activeTab === 'history' && (
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
          </Paper>
        )}
      </Box>
      <Footer />
    </>
  )
}

export default UserDashboard
