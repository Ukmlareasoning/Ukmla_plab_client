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

// Theme: primary (teal) only — no yellow/amber
const primaryGradient = 'linear-gradient(135deg, #0D9488 0%, #14B8A6 100%)'

// Placeholder stats (replace with API data when backend is ready)
const stats = [
  {
    label: 'Total Users',
    value: '1,247',
    sub: '+12% this month',
    icon: <PeopleRoundedIcon sx={{ fontSize: 32 }} />,
    color: 'primary',
    gradient: primaryGradient,
    path: '/admin/users',
    trend: '+12%',
    trendUp: true,
  },
  {
    label: 'Contacts / Enquiries',
    value: '89',
    sub: '5 new today',
    icon: <ContactMailRoundedIcon sx={{ fontSize: 32 }} />,
    color: 'primary',
    gradient: primaryGradient,
    path: '/admin/contacts',
    trend: '+5',
    trendUp: true,
  },
  {
    label: 'Active Subscriptions',
    value: '432',
    sub: 'Standard & Premium',
    icon: <SchoolRoundedIcon sx={{ fontSize: 32 }} />,
    color: 'primary',
    gradient: primaryGradient,
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
    gradient: primaryGradient,
    path: '/admin/dashboard',
    trend: '+2%',
    trendUp: true,
  },
  {
    label: 'New Signups',
    value: '48',
    sub: 'This week',
    icon: <PersonAddRoundedIcon sx={{ fontSize: 32 }} />,
    color: 'primary',
    gradient: primaryGradient,
    path: '/admin/users',
    trend: '+18%',
    trendUp: true,
  },
  {
    label: 'Revenue (MTD)',
    value: '£12.4k',
    sub: 'Month to date',
    icon: <AssessmentRoundedIcon sx={{ fontSize: 32 }} />,
    color: 'primary',
    gradient: primaryGradient,
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
    gradient: primaryGradient,
    path: '/admin/dashboard',
    trend: '+15%',
    trendUp: true,
  },
  {
    label: 'Support Tickets',
    value: '24',
    sub: '3 open',
    icon: <NotificationsActiveRoundedIcon sx={{ fontSize: 32 }} />,
    color: 'primary',
    gradient: primaryGradient,
    path: '/admin/contacts',
    trend: '-5',
    trendUp: false,
  },
]

// Placeholder recent activity — primary (teal) only
const recentActivity = [
  { type: 'user', text: 'New user registered', detail: 'sarah.johnson@email.com', time: '2 min ago', icon: <PersonAddRoundedIcon fontSize="small" />, colorKey: 'primary' },
  { type: 'contact', text: 'Contact form submitted', detail: 'Enquiry about premium plan', time: '15 min ago', icon: <EmailRoundedIcon fontSize="small" />, colorKey: 'primary' },
  { type: 'subscription', text: 'New subscription purchased', detail: 'Premium plan - £49.99', time: '32 min ago', icon: <SchoolRoundedIcon fontSize="small" />, colorKey: 'primary' },
  { type: 'contact', text: 'Support ticket created', detail: 'Payment issue reported', time: '1 hr ago', icon: <NotificationsActiveRoundedIcon fontSize="small" />, colorKey: 'primary' },
  { type: 'user', text: 'Bulk user activity', detail: '23 users completed practice tests', time: '2 hrs ago', icon: <TrendingUpRoundedIcon fontSize="small" />, colorKey: 'primary' },
  { type: 'contact', text: 'Pricing page enquiry', detail: 'Question about team plans', time: '3 hrs ago', icon: <EmailRoundedIcon fontSize="small" />, colorKey: 'primary' },
  { type: 'user', text: 'Account upgraded', detail: 'Free to Premium - james.w@email.com', time: '4 hrs ago', icon: <SchoolRoundedIcon fontSize="small" />, colorKey: 'primary' },
  { type: 'user', text: 'Password reset request', detail: 'Completed successfully', time: '5 hrs ago', icon: <PersonAddRoundedIcon fontSize="small" />, colorKey: 'primary' },
]

// Quick stats — primary (teal) only
const quickStats = [
  { label: 'Active Now', value: '127', colorKey: 'primary' },
  { label: 'Pending Responses', value: '8', colorKey: 'primary' },
  { label: 'Revenue Today', value: '£1,249', colorKey: 'primary' },
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
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
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
                    color: theme.palette[stat.colorKey].main,
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
                maxWidth: { xs: 'calc(50% - 6px)', sm: 'calc(50% - 8px)', md: 'calc(25% - 15px)' },
                flex: { xs: '1 1 calc(50% - 6px)', sm: '1 1 calc(50% - 8px)', md: '0 1 calc(25% - 15px)' },
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
                            bgcolor: alpha(theme.palette.primary.main, 0.15),
                            color: theme.palette.primary.dark,
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

      {/* Recent Activity — 2 per row on mobile, 4 on desktop */}
      <Card
        sx={{
          mb: { xs: 2, sm: 3 },
          borderRadius: { xs: 2, sm: 3 },
          bgcolor: theme.palette.background.paper,
          boxShadow: { xs: '0 2px 12px rgba(0,0,0,0.06)', sm: '0 4px 20px rgba(0,0,0,0.08)' },
          border: '1px solid',
          borderColor: alpha(theme.palette.grey[300], 0.5),
          overflow: 'hidden',
          transition: 'box-shadow 0.3s ease',
          '&:hover': {
            boxShadow: { xs: '0 2px 12px rgba(0,0,0,0.06)', sm: '0 8px 30px rgba(0,0,0,0.12)' },
          },
        }}
      >
        <CardContent sx={{ p: { xs: 1.5, sm: 2.5 }, '&:last-child': { pb: { xs: 1.5, sm: 2.5 } } }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: { xs: 1.5, sm: 2 },
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
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                  mb: 0.25,
                }}
              >
                Recent Activity
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                }}
              >
                Real-time platform updates
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Chip
                icon={<FiberManualRecordRoundedIcon sx={{ fontSize: '8px !important', animation: 'pulse 2s infinite' }} />}
                size="small"
                label="Live"
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.2),
                  color: theme.palette.primary.dark,
                  fontWeight: 600,
                  fontSize: { xs: '0.75rem', sm: '0.8125rem' },
                  height: { xs: 24, sm: 28 },
                  '@keyframes pulse': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.5 },
                  },
                }}
              />
              <Button
                size="small"
                variant="text"
                endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                  color: 'primary.main',
                  minWidth: 0,
                  px: { xs: 0.75, sm: 1 },
                  '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) },
                }}
              >
                View all
              </Button>
            </Box>
          </Box>
          <Divider sx={{ mb: { xs: 1.5, sm: 2 } }} />
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: { xs: 1.25, sm: 2 },
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            {recentActivity.map((item, idx) => (
              <Paper
                key={idx}
                elevation={0}
                sx={{
                  minWidth: 0,
                  p: { xs: 1.25, sm: 2 },
                  borderRadius: { xs: 1.5, sm: 2 },
                  bgcolor: alpha(theme.palette[item.colorKey].main, 0.06),
                  border: `1px solid ${alpha(theme.palette[item.colorKey].main, 0.12)}`,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: alpha(theme.palette[item.colorKey].main, 0.1),
                    boxShadow: `0 2px 8px ${alpha(theme.palette[item.colorKey].main, 0.12)}`,
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: { xs: 1, sm: 1.5 },
                    minWidth: 0,
                  }}
                >
                  <Avatar
                    sx={{
                      width: { xs: 32, sm: 40 },
                      height: { xs: 32, sm: 40 },
                      flexShrink: 0,
                      bgcolor: alpha(theme.palette[item.colorKey].main, 0.18),
                      color: theme.palette[item.colorKey].main,
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                    }}
                  >
                    {item.icon}
                  </Avatar>
                  <Box sx={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 600,
                        color: 'text.primary',
                        fontSize: { xs: '0.75rem', sm: '0.9375rem' },
                        lineHeight: 1.3,
                        mb: 0.25,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {item.text}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        fontSize: { xs: '0.6875rem', sm: '0.8125rem' },
                        mb: 0.25,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item.detail}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.secondary',
                        fontSize: { xs: '0.6875rem', sm: '0.75rem' },
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.25,
                      }}
                    >
                      <AccessTimeRoundedIcon sx={{ fontSize: 10 }} />
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
              '& > .MuiButton-root': {
                flex: { xs: '1 1 calc(50% - 6px)', sm: '1 1 auto' },
                minWidth: { xs: 'calc(50% - 6px)', sm: 'auto' },
                whiteSpace: 'nowrap',
                fontSize: { xs: '0.8125rem', sm: '0.9375rem' },
                minHeight: { xs: 44, sm: 48 },
                py: { xs: 1, sm: 1.25 },
                px: { xs: 1.5, sm: 2.5 },
                '& .MuiButton-startIcon': { mr: { xs: 0.75, sm: 1 } },
                '& .MuiButton-endIcon': { ml: { xs: 0.5, sm: 1 } },
              },
            }}
          >
            <Button
              variant="outlined"
              startIcon={<PeopleRoundedIcon sx={{ fontSize: { xs: 18, sm: 24 } }} />}
              endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />}
              onClick={() => navigate('/admin/users')}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderColor: theme.palette.grey[300],
                color: 'text.primary',
                borderRadius: 2,
                borderWidth: 2,
                bgcolor: 'transparent',
                '&:hover': {
                  borderWidth: 2,
                  borderColor: theme.palette.primary.main,
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>Users</Box>
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Manage Users</Box>
            </Button>
            <Button
              variant="outlined"
              startIcon={<ContactMailRoundedIcon sx={{ fontSize: { xs: 18, sm: 24 } }} />}
              endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />}
              onClick={() => navigate('/admin/contacts')}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderColor: theme.palette.grey[300],
                color: 'text.primary',
                borderRadius: 2,
                borderWidth: 2,
                bgcolor: 'transparent',
                '&:hover': {
                  borderWidth: 2,
                  borderColor: theme.palette.primary.main,
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>Contacts</Box>
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>View Contacts</Box>
            </Button>
            <Button
              variant="outlined"
              startIcon={<AssessmentRoundedIcon sx={{ fontSize: { xs: 18, sm: 24 } }} />}
              endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />}
              onClick={() => navigate('/admin/dashboard')}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderColor: theme.palette.grey[300],
                color: 'text.primary',
                borderRadius: 2,
                borderWidth: 2,
                bgcolor: 'transparent',
                '&:hover': {
                  borderWidth: 2,
                  borderColor: theme.palette.primary.main,
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>Reports</Box>
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>View Reports</Box>
            </Button>
            <Button
              variant="outlined"
              startIcon={<SettingsRoundedIcon sx={{ fontSize: { xs: 18, sm: 24 } }} />}
              endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />}
              onClick={() => navigate('/admin/dashboard')}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderColor: theme.palette.grey[300],
                color: 'text.primary',
                borderRadius: 2,
                borderWidth: 2,
                bgcolor: 'transparent',
                '&:hover': {
                  borderWidth: 2,
                  borderColor: theme.palette.primary.main,
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
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
