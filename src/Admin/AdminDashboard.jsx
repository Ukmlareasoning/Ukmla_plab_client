import { alpha } from '@mui/material/styles'
import {
  Box,
  Typography,
  Card,
  CardContent,
  useTheme,
  Button,
  Chip,
  Paper,
  Avatar,
  Divider,
} from '@mui/material'
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded'
import ContactMailRoundedIcon from '@mui/icons-material/ContactMailRounded'
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded'
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded'
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded'
import EmailRoundedIcon from '@mui/icons-material/EmailRounded'
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded'
import AssessmentRoundedIcon from '@mui/icons-material/AssessmentRounded'
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded'
import FiberManualRecordRoundedIcon from '@mui/icons-material/FiberManualRecordRounded'
import { useNavigate } from 'react-router-dom'

// Placeholder stats (replace with API data when backend is ready)
const stats = [
  {
    label: 'Total Users',
    value: '1,247',
    sub: '+12% this month',
    icon: <PeopleRoundedIcon sx={{ fontSize: 32 }} />,
    color: 'primary',
    gradient: 'linear-gradient(135deg, #0D9488 0%, #14B8A6 100%)',
    path: '/admin/users',
    trend: '+12%',
    trendUp: true,
  },
  {
    label: 'Contacts / Enquiries',
    value: '89',
    sub: '5 new today',
    icon: <ContactMailRoundedIcon sx={{ fontSize: 32 }} />,
    color: 'secondary',
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
    path: '/admin/contacts',
    trend: '+5',
    trendUp: true,
  },
  {
    label: 'Active Subscriptions',
    value: '432',
    sub: 'Standard & Premium',
    icon: <SchoolRoundedIcon sx={{ fontSize: 32 }} />,
    color: 'success',
    gradient: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
    path: '/admin/users',
    trend: '+8%',
    trendUp: true,
  },
  {
    label: 'Engagement Rate',
    value: '94%',
    sub: 'Session completion',
    icon: <TrendingUpRoundedIcon sx={{ fontSize: 32 }} />,
    color: 'primary',
    gradient: 'linear-gradient(135deg, #14B8A6 0%, #5EEAD4 100%)',
    path: '/admin/dashboard',
    trend: '+2%',
    trendUp: true,
  },
  {
    label: 'New Signups',
    value: '48',
    sub: 'This week',
    icon: <PersonAddRoundedIcon sx={{ fontSize: 32 }} />,
    color: 'success',
    gradient: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
    path: '/admin/users',
    trend: '+18%',
    trendUp: true,
  },
  {
    label: 'Revenue (MTD)',
    value: '£12.4k',
    sub: 'Month to date',
    icon: <AssessmentRoundedIcon sx={{ fontSize: 32 }} />,
    color: 'secondary',
    gradient: 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)',
    path: '/admin/dashboard',
    trend: '+22%',
    trendUp: true,
  },
  {
    label: 'Course Completions',
    value: '1,089',
    sub: 'This month',
    icon: <SchoolRoundedIcon sx={{ fontSize: 32 }} />,
    color: 'primary',
    gradient: 'linear-gradient(135deg, #0F766E 0%, #0D9488 100%)',
    path: '/admin/dashboard',
    trend: '+15%',
    trendUp: true,
  },
  {
    label: 'Support Tickets',
    value: '24',
    sub: '3 open',
    icon: <NotificationsActiveRoundedIcon sx={{ fontSize: 32 }} />,
    color: 'secondary',
    gradient: 'linear-gradient(135deg, #B45309 0%, #D97706 100%)',
    path: '/admin/contacts',
    trend: '-5',
    trendUp: false,
  },
]

// Placeholder recent activity
const recentActivity = [
  { 
    type: 'user', 
    text: 'New user registered', 
    detail: 'sarah.johnson@email.com',
    time: '2 min ago', 
    icon: <PersonAddRoundedIcon fontSize="small" />,
    color: '#0D9488',
  },
  { 
    type: 'contact', 
    text: 'Contact form submitted', 
    detail: 'Enquiry about premium plan',
    time: '15 min ago', 
    icon: <EmailRoundedIcon fontSize="small" />,
    color: '#F59E0B',
  },
  { 
    type: 'subscription', 
    text: 'New subscription purchased', 
    detail: 'Premium plan - £49.99',
    time: '32 min ago', 
    icon: <SchoolRoundedIcon fontSize="small" />,
    color: '#10B981',
  },
  { 
    type: 'contact', 
    text: 'Support ticket created', 
    detail: 'Payment issue reported',
    time: '1 hr ago', 
    icon: <NotificationsActiveRoundedIcon fontSize="small" />,
    color: '#D97706',
  },
  { 
    type: 'user', 
    text: 'Bulk user activity', 
    detail: '23 users completed practice tests',
    time: '2 hrs ago', 
    icon: <TrendingUpRoundedIcon fontSize="small" />,
    color: '#14B8A6',
  },
]

// Quick stats for additional context
const quickStats = [
  { label: 'Active Now', value: '127', color: '#10B981' },
  { label: 'Pending Responses', value: '8', color: '#F59E0B' },
  { label: 'Revenue Today', value: '£1,249', color: '#14B8A6' },
]

function AdminDashboard() {
  const theme = useTheme()
  const navigate = useNavigate()

  const getStatStyles = (colorKey) => {
    const main = theme.palette[colorKey]?.main || theme.palette.primary.main
    return {
      bg: alpha(main, 0.08),
      iconBg: alpha(main, 0.12),
      iconColor: main,
      subColor: theme.palette.text.secondary,
    }
  }

  return (
    <Box
      sx={{
        width: '100%',
        minWidth: 0,
        maxWidth: 1400,
        mx: 'auto',
        overflowX: 'hidden',
      }}
    >
      {/* Welcome Banner */}
      <Paper
        elevation={0}
        sx={{
          mb: { xs: 2, sm: 3 },
          p: { xs: 2, sm: 3 },
          borderRadius: 3,
          background: 'linear-gradient(135deg, #0D9488 0%, #14B8A6 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            transform: 'translate(30%, -30%)',
          },
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 0.5,
              fontSize: { xs: '1.5rem', sm: '2rem' },
            }}
          >
            Welcome back, Admin! 👋
          </Typography>
          <Typography
            variant="body1"
            sx={{
              opacity: 0.95,
              fontSize: { xs: '0.875rem', sm: '1rem' },
              mb: 2,
            }}
          >
            Here's what's happening with your platform today
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {quickStats.map((stat, idx) => (
              <Box
                key={idx}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <FiberManualRecordRoundedIcon 
                  sx={{ 
                    fontSize: 12, 
                    color: stat.color,
                    filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.5))',
                  }} 
                />
                <Box>
                  <Typography variant="caption" sx={{ opacity: 0.9, display: 'block', lineHeight: 1.2 }}>
                    {stat.label}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                    {stat.value}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Paper>

      {/* Stats cards — max 4 per row, 2 rows total */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: { xs: 1.5, sm: 2, md: 2.5 },
          mb: { xs: 2, sm: 3, md: 4 },
        }}
      >
        {stats.map((stat) => {
          const styles = getStatStyles(stat.color)
          return (
            <Box
              key={stat.label}
              sx={{
                width: '100%',
                minWidth: 0,
                maxWidth: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(25% - 15px)' },
                flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)', md: '0 1 calc(25% - 15px)' },
              }}
            >
              <Card
                component={Button}
                onClick={() => stat.path && navigate(stat.path)}
                sx={{
                  width: '100%',
                  height: '100%',
                  minHeight: { xs: 140, sm: 160 },
                  textAlign: 'left',
                  borderRadius: 3,
                  bgcolor: theme.palette.background.paper,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  border: '1px solid',
                  borderColor: alpha(theme.palette.grey[300], 0.5),
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  p: 0,
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: stat.gradient,
                  },
                  '&:hover': {
                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                    transform: 'translateY(-4px)',
                    borderColor: 'transparent',
                    '& .stat-icon': {
                      transform: 'scale(1.1) rotate(5deg)',
                    },
                    '& .stat-arrow': {
                      transform: 'translateX(4px)',
                      opacity: 1,
                    },
                  },
                  '&:active': {
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <CardContent
                  sx={{
                    p: { xs: 2, sm: 2.5 },
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:last-child': { pb: { xs: 2, sm: 2.5 } },
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      mb: 'auto',
                    }}
                  >
                    <Box
                      className="stat-icon"
                      sx={{
                        width: { xs: 56, sm: 64 },
                        height: { xs: 56, sm: 64 },
                        borderRadius: 2.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: stat.gradient,
                        color: 'white',
                        flexShrink: 0,
                        transition: 'transform 0.3s ease',
                        boxShadow: `0 8px 16px ${alpha(styles.iconColor, 0.3)}`,
                      }}
                    >
                      {stat.icon}
                    </Box>
                    <ArrowForwardRoundedIcon
                      className="stat-arrow"
                      sx={{ 
                        fontSize: 20, 
                        color: 'text.secondary', 
                        opacity: 0.5,
                        transition: 'all 0.3s ease',
                      }}
                    />
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 0.5 }}>
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 700,
                          color: 'text.primary',
                          fontSize: { xs: '1.75rem', sm: '2rem' },
                          lineHeight: 1,
                        }}
                      >
                        {stat.value}
                      </Typography>
                      {stat.trendUp && (
                        <Chip
                          label={stat.trend}
                          size="small"
                          sx={{
                            height: 22,
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            bgcolor: alpha('#10B981', 0.15),
                            color: '#059669',
                            border: 'none',
                          }}
                        />
                      )}
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.primary',
                        fontWeight: 600,
                        mb: 0.25,
                        fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                      }}
                    >
                      {stat.label}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.secondary',
                        fontSize: { xs: '0.75rem', sm: '0.8125rem' },
                      }}
                    >
                      {stat.sub}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          )
        })}
      </Box>

      {/* Recent Activity — horizontal */}
      <Card
        sx={{
          mb: { xs: 2, sm: 3 },
          borderRadius: 3,
          bgcolor: theme.palette.background.paper,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid',
          borderColor: alpha(theme.palette.grey[300], 0.5),
          transition: 'box-shadow 0.3s ease',
          '&:hover': {
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
          },
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2,
              flexWrap: 'wrap',
              gap: 1,
            }}
          >
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: 'text.primary',
                  fontSize: { xs: '1.125rem', sm: '1.25rem' },
                  mb: 0.25,
                }}
              >
                Recent Activity
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.875rem',
                }}
              >
                Real-time platform updates
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                icon={<FiberManualRecordRoundedIcon sx={{ fontSize: '10px !important', animation: 'pulse 2s infinite' }} />}
                size="small"
                label="Live"
                sx={{
                  bgcolor: alpha('#10B981', 0.15),
                  color: '#059669',
                  fontWeight: 600,
                  fontSize: '0.8125rem',
                  height: 28,
                  '@keyframes pulse': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.5 },
                  },
                }}
              />
              <Button
                size="small"
                variant="text"
                endIcon={<ArrowForwardRoundedIcon />}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  color: 'primary.main',
                  '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) },
                }}
              >
                View all
              </Button>
            </Box>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              overflowX: 'auto',
              pb: 1,
              flexWrap: { xs: 'wrap', md: 'nowrap' },
              '&::-webkit-scrollbar': { height: 8 },
              '&::-webkit-scrollbar-thumb': {
                borderRadius: 4,
                bgcolor: theme.palette.grey[300],
              },
            }}
          >
            {recentActivity.map((item, idx) => (
              <Paper
                key={idx}
                elevation={0}
                sx={{
                  minWidth: { xs: '100%', sm: 280, md: 260 },
                  maxWidth: { md: 260 },
                  flex: { xs: '1 1 100%', md: '0 0 auto' },
                  p: 2,
                  borderRadius: 2,
                  bgcolor: alpha(item.color, 0.04),
                  border: `1px solid ${alpha(item.color, 0.12)}`,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: alpha(item.color, 0.08),
                    boxShadow: `0 4px 12px ${alpha(item.color, 0.15)}`,
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      flexShrink: 0,
                      bgcolor: alpha(item.color, 0.15),
                      color: item.color,
                    }}
                  >
                    {item.icon}
                  </Avatar>
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 600,
                        color: 'text.primary',
                        fontSize: '0.9375rem',
                        mb: 0.25,
                      }}
                    >
                      {item.text}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        fontSize: '0.8125rem',
                        mb: 0.5,
                      }}
                    >
                      {item.detail}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.secondary',
                        fontSize: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                      }}
                    >
                      <AccessTimeRoundedIcon sx={{ fontSize: 12 }} />
                      {item.time}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Quick Actions — full width below Recent Activity */}
      <Card
        sx={{
          borderRadius: 3,
          bgcolor: theme.palette.background.paper,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid',
          borderColor: alpha(theme.palette.grey[300], 0.5),
          transition: 'box-shadow 0.3s ease',
          '&:hover': {
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
          },
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                mb: 0.5,
                fontSize: { xs: '1.125rem', sm: '1.25rem' },
              }}
            >
              Quick Actions
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontSize: '0.875rem',
              }}
            >
              Manage your platform efficiently
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: { xs: 1.5, sm: 2 },
            }}
          >
            <Button
              variant="contained"
              startIcon={<PeopleRoundedIcon />}
              endIcon={<ArrowForwardRoundedIcon />}
              onClick={() => navigate('/admin/users')}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                minHeight: 48,
                py: 1.25,
                px: 2.5,
                background: 'linear-gradient(135deg, #0D9488 0%, #14B8A6 100%)',
                fontSize: '0.9375rem',
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(13, 148, 136, 0.3)',
                '&:hover': {
                  boxShadow: '0 6px 20px rgba(13, 148, 136, 0.4)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Manage Users
            </Button>
            <Button
              variant="outlined"
              startIcon={<ContactMailRoundedIcon />}
              endIcon={<ArrowForwardRoundedIcon />}
              onClick={() => navigate('/admin/contacts')}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                minHeight: 48,
                py: 1.25,
                px: 2.5,
                borderColor: theme.palette.grey[300],
                color: 'text.primary',
                fontSize: '0.9375rem',
                borderRadius: 2,
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                  borderColor: theme.palette.primary.main,
                  bgcolor: alpha(theme.palette.primary.main, 0.04),
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              View Contacts
            </Button>
            <Button
              variant="outlined"
              startIcon={<AssessmentRoundedIcon />}
              endIcon={<ArrowForwardRoundedIcon />}
              onClick={() => navigate('/admin/dashboard')}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                minHeight: 48,
                py: 1.25,
                px: 2.5,
                borderColor: theme.palette.grey[300],
                color: 'text.primary',
                fontSize: '0.9375rem',
                borderRadius: 2,
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                  borderColor: theme.palette.primary.main,
                  bgcolor: alpha(theme.palette.primary.main, 0.04),
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              View Reports
            </Button>
            <Button
              variant="outlined"
              startIcon={<SettingsRoundedIcon />}
              endIcon={<ArrowForwardRoundedIcon />}
              onClick={() => navigate('/admin/dashboard')}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                minHeight: 48,
                py: 1.25,
                px: 2.5,
                borderColor: theme.palette.grey[300],
                color: 'text.primary',
                fontSize: '0.9375rem',
                borderRadius: 2,
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                  borderColor: theme.palette.primary.main,
                  bgcolor: alpha(theme.palette.primary.main, 0.04),
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Settings
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default AdminDashboard
