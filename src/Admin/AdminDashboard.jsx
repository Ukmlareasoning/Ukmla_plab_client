import { useState, useEffect } from 'react'
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
  Skeleton,
} from '@mui/material'
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded'
import ContactMailRoundedIcon from '@mui/icons-material/ContactMailRounded'
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded'
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded'
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded'
import EmailRoundedIcon from '@mui/icons-material/EmailRounded'
import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded'
import SubscriptionsRoundedIcon from '@mui/icons-material/SubscriptionsRounded'
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded'
import QuizRoundedIcon from '@mui/icons-material/QuizRounded'
import FiberManualRecordRoundedIcon from '@mui/icons-material/FiberManualRecordRounded'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import { useNavigate } from 'react-router-dom'
import apiClient from '../server'

// Admin dashboard primary (#384D84 — no green/teal)
const ADMIN_PRIMARY = '#384D84'
const ADMIN_PRIMARY_DARK = '#2a3a64'
const ADMIN_PRIMARY_LIGHT = '#4a5f9a'
const primaryGradient = `linear-gradient(135deg, ${ADMIN_PRIMARY} 0%, ${ADMIN_PRIMARY_LIGHT} 100%)`

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function formatEarnings(value) {
  if (value == null || value === '') return '£0'
  const num = Number(value)
  if (Number.isNaN(num)) return String(value)
  if (num >= 1000) return `£${(num / 1000).toFixed(1)}k`
  return `£${num.toFixed(0)}`
}

function timeAgo(isoString) {
  if (!isoString) return '—'
  try {
    const d = new Date(isoString)
    if (Number.isNaN(d.getTime())) return isoString
    const now = new Date()
    const diffMs = now - d
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} min ago`
    if (diffHours < 24) return `${diffHours} hr ago`
    if (diffDays < 7) return `${diffDays} days ago`
    return d.toLocaleDateString()
  } catch {
    return isoString
  }
}

function formatActivityDate(isoString) {
  if (!isoString) return '—'
  try {
    const d = new Date(isoString)
    if (Number.isNaN(d.getTime())) return isoString
    const day = d.getDate()
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const month = months[d.getMonth()]
    const year = d.getFullYear()
    let hours = d.getHours()
    const minutes = d.getMinutes()
    const ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12 || 12
    const mins = minutes < 10 ? '0' + minutes : String(minutes)
    return `${day} ${month} ${year}, ${hours}:${mins} ${ampm}`
  } catch {
    return isoString
  }
}

function getActivityIcon(action = '') {
  const a = String(action).toLowerCase()
  if (a.includes('user') || a.includes('register') || a.includes('login')) return <PersonAddRoundedIcon fontSize="small" />
  if (a.includes('contact') || a.includes('enquir')) return <EmailRoundedIcon fontSize="small" />
  if (a.includes('subscription') || a.includes('plan') || a.includes('payment')) return <SubscriptionsRoundedIcon fontSize="small" />
  if (a.includes('course') || a.includes('mock')) return <SchoolRoundedIcon fontSize="small" />
  if (a.includes('question')) return <QuizRoundedIcon fontSize="small" />
  if (a.includes('account') || a.includes('earning')) return <AccountBalanceRoundedIcon fontSize="small" />
  return <AccessTimeRoundedIcon fontSize="small" />
}

const IMAGE_BASE_URL = import.meta.env.VITE_API_IMAGE_UPLOAD_BASE_URL || 'http://127.0.0.1:8000/'

function AdminDashboard() {
  const theme = useTheme()
  const navigate = useNavigate()

  const getProfileImageUrl = (user) => {
    if (!user?.profile_image_url) return ''
    const url = user.profile_image_url
    if (url.startsWith('http')) return url
    return `${IMAGE_BASE_URL.replace(/\/+$/, '')}/${url.replace(/^\/+/, '')}`
  }

  const [loading, setLoading] = useState(true)
  const [usersTotal, setUsersTotal] = useState(0)
  const [contactsTotal, setContactsTotal] = useState(0)
  const [subscriptionsTotal, setSubscriptionsTotal] = useState(0)
  const [examTypesTotal, setExamTypesTotal] = useState(0)
  const [difficultyLevelsTotal, setDifficultyLevelsTotal] = useState(0)
  const [mocksTotal, setMocksTotal] = useState(0)
  const [questionBankTotal, setQuestionBankTotal] = useState(0)
  const [accountingStats, setAccountingStats] = useState(null)
  const [accountingOrders, setAccountingOrders] = useState([])
  const [recentActivityList, setRecentActivityList] = useState([])

  const fetchDashboard = async () => {
    setLoading(true)
    try {
      const [
        usersRes,
        contactsRes,
        subsRes,
        examTypesRes,
        difficultyRes,
        mocksRes,
        mockQuestionsRes,
        accountingRes,
        activityRes,
      ] = await Promise.all([
        apiClient('/users?per_page=1', 'GET'),
        apiClient('/contacts?per_page=1', 'GET'),
        apiClient('/subscriptions?per_page=1', 'GET'),
        apiClient('/exam-types?per_page=1', 'GET'),
        apiClient('/difficulty-levels?per_page=1', 'GET'),
        apiClient('/mocks?per_page=1', 'GET'),
        apiClient('/mock-questions?per_page=1', 'GET'),
        apiClient('/accounting?per_page=200', 'GET'),
        apiClient('/activity-logs?per_page=8', 'GET'),
      ])

      if (usersRes.ok && usersRes.data?.success) {
        const p = usersRes.data.data?.pagination
        setUsersTotal(Number(p?.total ?? 0))
      }
      if (contactsRes.ok && contactsRes.data?.success) {
        const p = contactsRes.data.data?.pagination
        setContactsTotal(Number(p?.total ?? 0))
      }
      if (subsRes.ok && subsRes.data?.success) {
        const p = subsRes.data.data?.pagination
        setSubscriptionsTotal(Number(p?.total ?? 0))
      }
      if (examTypesRes.ok && examTypesRes.data?.success) {
        const pag = examTypesRes.data.data?.pagination
        setExamTypesTotal(Number(pag?.total ?? 0))
      }
      if (difficultyRes.ok && difficultyRes.data?.success) {
        const pag = difficultyRes.data.data?.pagination
        setDifficultyLevelsTotal(Number(pag?.total ?? 0))
      }
      if (mocksRes.ok && mocksRes.data?.success) {
        const p = mocksRes.data.data?.pagination
        setMocksTotal(Number(p?.total ?? 0))
      }
      if (mockQuestionsRes.ok && mockQuestionsRes.data?.success) {
        const p = mockQuestionsRes.data.data?.pagination
        setQuestionBankTotal(Number(p?.total ?? 0))
      }
      if (accountingRes.ok && accountingRes.data?.success) {
        setAccountingStats(accountingRes.data.data?.stats || null)
        setAccountingOrders(accountingRes.data.data?.orders || [])
      }
      if (activityRes.ok && activityRes.data?.success) {
        const list = activityRes.data.data?.activity_logs || []
        setRecentActivityList(list)
      }
    } catch {
      // Silent fail; counts stay 0
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  const subscriptionDistributionData = accountingStats
    ? [
        { name: 'Active', value: accountingStats.active_subscriptions ?? 0 },
        { name: 'Ended', value: accountingStats.ended_subscriptions ?? 0 },
        { name: 'Cancelled', value: accountingStats.cancelled_subscriptions ?? 0 },
      ].filter((d) => d.value > 0)
    : []

  const revenueTrendData = (() => {
    if (!accountingOrders.length) return []
    const now = new Date()
    const byMonth = {}
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      byMonth[key] = { month: MONTH_NAMES[d.getMonth()], value: 0 }
    }
    accountingOrders.forEach((o) => {
      const dateRaw = o.starts_at ?? o.created_at
      if (!dateRaw) return
      const d = new Date(dateRaw)
      if (Number.isNaN(d.getTime())) return
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      if (byMonth[key] != null) {
        byMonth[key].value += Number(o.amount) || 0
      }
    })
    const out = Object.values(byMonth).map((r) => ({
      month: r.month,
      value: Math.round((r.value / 1000) * 10) / 10,
    }))
    const hasAnyValue = out.some((r) => r.value > 0)
    if (!hasAnyValue) {
      const fromOrders = {}
      accountingOrders.forEach((o) => {
        const dateRaw = o.starts_at ?? o.created_at
        if (!dateRaw) return
        const d = new Date(dateRaw)
        if (Number.isNaN(d.getTime())) return
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        if (!fromOrders[key]) fromOrders[key] = { month: MONTH_NAMES[d.getMonth()], value: 0 }
        fromOrders[key].value += Number(o.amount) || 0
      })
      const sortedKeys = Object.keys(fromOrders).sort()
      return sortedKeys.slice(-6).map((k) => ({
        month: fromOrders[k].month,
        value: Math.round((fromOrders[k].value / 1000) * 10) / 10,
      }))
    }
    return out
  })()

  const stats = [
    { label: 'Users', value: usersTotal.toLocaleString(), sub: 'Registered users', icon: <PeopleRoundedIcon sx={{ fontSize: 32 }} />, color: 'primary', gradient: primaryGradient, path: '/admin/users', trend: null, trendUp: false },
    { label: 'Accounting', value: formatEarnings(accountingStats?.total_earnings), sub: 'Total earnings', icon: <AccountBalanceRoundedIcon sx={{ fontSize: 32 }} />, color: 'primary', gradient: primaryGradient, path: '/admin/accounting', trend: null, trendUp: false },
    { label: 'Contacts', value: String(contactsTotal), sub: 'Enquiries & support', icon: <ContactMailRoundedIcon sx={{ fontSize: 32 }} />, color: 'primary', gradient: primaryGradient, path: '/admin/contacts', trend: null, trendUp: false },
    { label: 'Subscriptions', value: String(subscriptionsTotal), sub: 'Subscriber emails', icon: <SubscriptionsRoundedIcon sx={{ fontSize: 32 }} />, color: 'primary', gradient: primaryGradient, path: '/admin/subscriptions', trend: null, trendUp: false },
    { label: 'Exam types', value: String(examTypesTotal), sub: 'PLAB exam types', icon: <AssignmentRoundedIcon sx={{ fontSize: 32 }} />, color: 'primary', gradient: primaryGradient, path: '/admin/courses/exam-type', trend: null, trendUp: false },
    { label: 'Difficulty levels', value: String(difficultyLevelsTotal), sub: 'Question levels', icon: <TrendingUpRoundedIcon sx={{ fontSize: 32 }} />, color: 'primary', gradient: primaryGradient, path: '/admin/courses/difficulty-level', trend: null, trendUp: false },
    { label: 'Mocks', value: String(mocksTotal), sub: 'PLAB mocks', icon: <SchoolRoundedIcon sx={{ fontSize: 32 }} />, color: 'primary', gradient: primaryGradient, path: '/admin/courses/courses', trend: null, trendUp: false },
    { label: 'Question Bank', value: questionBankTotal.toLocaleString(), sub: 'Mock questions', icon: <QuizRoundedIcon sx={{ fontSize: 32 }} />, color: 'primary', gradient: primaryGradient, path: '/admin/courses/question-bank', trend: null, trendUp: false },
  ]

  const quickStats = [
    { label: 'Total users', value: loading ? '—' : usersTotal.toLocaleString(), colorKey: 'primary' },
    { label: 'Contacts', value: loading ? '—' : String(contactsTotal), colorKey: 'primary' },
    { label: 'Revenue', value: loading ? '—' : formatEarnings(accountingStats?.total_earnings), colorKey: 'primary' },
  ]

  const recentActivity = recentActivityList.map((log) => ({
    id: log.id,
    type: 'log',
    text: log.action || 'Activity',
    detail: log.user?.email || log.user?.full_name || '—',
    profileImageUrl: getProfileImageUrl(log.user),
    dateFormatted: formatActivityDate(log.created_at),
    time: timeAgo(log.created_at),
    icon: getActivityIcon(log.action),
    colorKey: 'primary',
  }))

  const getStatStyles = (colorKey) => {
    const main = colorKey === 'primary' ? ADMIN_PRIMARY : (theme.palette[colorKey]?.main ?? ADMIN_PRIMARY)
    return {
      bg: alpha(main, 0.08),
      iconBg: alpha(main, 0.12),
      iconColor: main,
      subColor: theme.palette.text.secondary,
    }
  }

  const getColorKeyMain = (colorKey) => (colorKey === 'primary' ? ADMIN_PRIMARY : theme.palette[colorKey]?.main)

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
          borderRadius: '7px',
          background: `linear-gradient(135deg, ${ADMIN_PRIMARY} 0%, ${ADMIN_PRIMARY_LIGHT} 100%)`,
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
            {loading
              ? [1, 2, 3].map((idx) => (
                  <Box
                    key={idx}
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)',
                      px: 2,
                      py: 1,
                      borderRadius: '7px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      minWidth: 120,
                    }}
                  >
                    <Skeleton variant="circular" width={12} height={12} sx={{ bgcolor: 'rgba(255,255,255,0.3)' }} />
                    <Box>
                      <Skeleton variant="text" width={72} sx={{ bgcolor: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }} />
                      <Skeleton variant="text" width={48} sx={{ bgcolor: 'rgba(255,255,255,0.4)', fontSize: '1.25rem' }} />
                    </Box>
                  </Box>
                ))
              : quickStats.map((stat, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)',
                      px: 2,
                      py: 1,
                      borderRadius: '7px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <FiberManualRecordRoundedIcon
                      sx={{
                        fontSize: 12,
                        color: getColorKeyMain(stat.colorKey),
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
        {loading
          ? Array.from({ length: 8 }).map((_, idx) => (
              <Box
                key={idx}
                sx={{
                  width: '100%',
                  minWidth: 0,
                  maxWidth: { xs: 'calc(50% - 6px)', sm: 'calc(50% - 8px)', md: 'calc(25% - 15px)' },
                  flex: { xs: '1 1 calc(50% - 6px)', sm: '1 1 calc(50% - 8px)', md: '0 1 calc(25% - 15px)' },
                }}
              >
                <Card
                  sx={{
                    borderRadius: '7px',
                    overflow: 'hidden',
                    minHeight: { xs: 140, sm: 160 },
                  }}
                >
                  <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Skeleton variant="rounded" width={56} height={56} sx={{ borderRadius: '7px' }} />
                      <Skeleton variant="circular" width={20} height={20} />
                    </Box>
                    <Skeleton variant="text" width="40%" sx={{ fontSize: '2rem', mb: 0.5 }} />
                    <Skeleton variant="text" width="70%" sx={{ mb: 0.25 }} />
                    <Skeleton variant="text" width="90%" />
                  </CardContent>
                </Card>
              </Box>
            ))
          : stats.map((stat) => {
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
                  borderRadius: '7px',
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
                        borderRadius: '7px',
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
                      {stat.trend != null && stat.trendUp !== false && (
                        <Chip
                          label={stat.trend}
                          size="small"
                          sx={{
                            height: 22,
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            borderRadius: '7px',
                            bgcolor: alpha(ADMIN_PRIMARY, 0.15),
                            color: ADMIN_PRIMARY_DARK,
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

      {/* Charts section */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: { xs: 2, sm: 3 },
          mb: { xs: 2, sm: 3, md: 4 },
        }}
      >
        {/* Subscription distribution (Pie chart) */}
        <Card
          sx={{
            flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' },
            borderRadius: '7px',
            bgcolor: theme.palette.background.paper,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid',
            borderColor: alpha(theme.palette.grey[300], 0.5),
            overflow: 'hidden',
          }}
        >
          <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                mb: 0.5,
                fontSize: { xs: '1rem', sm: '1.125rem' },
              }}
            >
              Subscription distribution
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                mb: 2,
                display: 'block',
              }}
            >
              Active, ended and cancelled
            </Typography>
            <Box sx={{ width: '100%', height: { xs: 220, sm: 260 } }}>
              {loading ? (
                <Skeleton variant="rounded" width="100%" height="100%" sx={{ borderRadius: '7px' }} />
              ) : subscriptionDistributionData.length === 0 ? (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'text.secondary' }}>
                  <Typography variant="body2">No subscription data yet</Typography>
                </Box>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={subscriptionDistributionData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                    >
                      {subscriptionDistributionData.map((entry, index) => {
                        const colors = [theme.palette.success.main, theme.palette.grey[600], theme.palette.error.main]
                        return <Cell key={`cell-${entry.name}`} fill={colors[index % colors.length]} />
                      })}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [value, 'Count']}
                      contentStyle={{
                        borderRadius: 7,
                        border: `1px solid ${alpha(theme.palette.grey[300], 0.8)}`,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      }}
                    />
                    <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Revenue trend (Line chart) */}
        <Card
          sx={{
            flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' },
            borderRadius: '7px',
            bgcolor: theme.palette.background.paper,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid',
            borderColor: alpha(theme.palette.grey[300], 0.5),
            overflow: 'hidden',
          }}
        >
          <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                mb: 0.5,
                fontSize: { xs: '1rem', sm: '1.125rem' },
              }}
            >
              Monthly revenue trend
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                mb: 2,
                display: 'block',
              }}
            >
              Revenue in £k over the last 6 months
            </Typography>
            <Box sx={{ width: '100%', height: { xs: 220, sm: 260 } }}>
              {loading ? (
                <Skeleton variant="rounded" width="100%" height="100%" sx={{ borderRadius: '7px' }} />
              ) : revenueTrendData.length === 0 ? (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'text.secondary' }}>
                  <Typography variant="body2">No revenue data yet</Typography>
                </Box>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueTrendData} margin={{ top: 8, right: 16, left: -16, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.grey[400], 0.4)} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}k`}
                      domain={[0, (dataMax) => Math.max(0.5, dataMax)]}
                    />
                    <Tooltip
                      formatter={(value) => [`£${value}k`, 'Revenue']}
                      contentStyle={{
                        borderRadius: 7,
                        border: `1px solid ${alpha(theme.palette.grey[300], 0.8)}`,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={ADMIN_PRIMARY}
                      strokeWidth={3}
                      dot={{ r: 4, strokeWidth: 2, stroke: theme.palette.background.paper }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Recent Activity — 2 per row on mobile, 4 on desktop */}
      <Card
        sx={{
          mb: { xs: 2, sm: 3 },
          borderRadius: '7px',
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
                  bgcolor: alpha(ADMIN_PRIMARY, 0.2),
                  color: ADMIN_PRIMARY_DARK,
                  fontWeight: 600,
                  fontSize: { xs: '0.75rem', sm: '0.8125rem' },
                  height: { xs: 24, sm: 28 },
                  borderRadius: '7px',
                  '@keyframes pulse': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.5 },
                  },
                }}
              />
              <Button
                size="small"
                variant="text"
                onClick={() => navigate('/admin/activity-log')}
                endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                  color: ADMIN_PRIMARY,
                  borderRadius: '7px',
                  minWidth: 0,
                  px: { xs: 0.75, sm: 1 },
                  '&:hover': { bgcolor: alpha(ADMIN_PRIMARY, 0.04) },
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
            {loading
              ? Array.from({ length: 8 }).map((_, idx) => (
                  <Paper
                    key={idx}
                    elevation={0}
                    sx={{
                      minWidth: 0,
                      p: { xs: 1.25, sm: 2 },
                      borderRadius: '7px',
                      bgcolor: alpha(ADMIN_PRIMARY, 0.06),
                      border: `1px solid ${alpha(ADMIN_PRIMARY, 0.12)}`,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                      <Skeleton variant="circular" width={44} height={44} sx={{ flexShrink: 0 }} />
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Skeleton variant="text" width="90%" sx={{ mb: 0.5 }} />
                        <Skeleton variant="text" width="70%" sx={{ mb: 0.25 }} />
                        <Skeleton variant="text" width={120} />
                      </Box>
                    </Box>
                  </Paper>
                ))
              : recentActivity.length === 0
                ? (
                  <Box sx={{ gridColumn: '1 / -1', textAlign: 'center', py: 3, color: 'text.secondary' }}>
                    <Typography variant="body2">No recent activity</Typography>
                  </Box>
                )
                : recentActivity.map((item) => (
                  <Paper
                    key={item.id}
                    elevation={0}
                    sx={{
                      minWidth: 0,
                      p: { xs: 1.25, sm: 2 },
                      borderRadius: '7px',
                      bgcolor: alpha(getColorKeyMain(item.colorKey), 0.06),
                      border: `1px solid ${alpha(getColorKeyMain(item.colorKey), 0.12)}`,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: alpha(getColorKeyMain(item.colorKey), 0.1),
                        boxShadow: `0 2px 8px ${alpha(getColorKeyMain(item.colorKey), 0.12)}`,
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
                        src={item.profileImageUrl}
                        alt={item.detail}
                        sx={{
                          width: { xs: 36, sm: 44 },
                          height: { xs: 36, sm: 44 },
                          flexShrink: 0,
                          borderRadius: '50%',
                          bgcolor: alpha(ADMIN_PRIMARY, 0.12),
                          color: ADMIN_PRIMARY,
                          fontSize: { xs: '0.875rem', sm: '1rem' },
                        }}
                      >
                        {(item.detail || '?').charAt(0)}
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
                            color: ADMIN_PRIMARY,
                            fontSize: { xs: '0.6875rem', sm: '0.75rem' },
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.25,
                          }}
                        >
                          <AccessTimeRoundedIcon sx={{ fontSize: 10 }} />
                          {item.dateFormatted}
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
          borderRadius: '7px',
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
                borderRadius: '7px',
                borderWidth: 2,
                bgcolor: 'transparent',
                '&:hover': {
                  borderWidth: 2,
                  borderColor: ADMIN_PRIMARY,
                  bgcolor: ADMIN_PRIMARY,
                  color: '#fff',
                  boxShadow: `0 4px 12px ${alpha(ADMIN_PRIMARY, 0.3)}`,
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
                borderRadius: '7px',
                borderWidth: 2,
                bgcolor: 'transparent',
                '&:hover': {
                  borderWidth: 2,
                  borderColor: ADMIN_PRIMARY,
                  bgcolor: ADMIN_PRIMARY,
                  color: '#fff',
                  boxShadow: `0 4px 12px ${alpha(ADMIN_PRIMARY, 0.3)}`,
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
              startIcon={<AccountBalanceRoundedIcon sx={{ fontSize: { xs: 18, sm: 24 } }} />}
              endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />}
              onClick={() => navigate('/admin/accounting')}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderColor: theme.palette.grey[300],
                color: 'text.primary',
                borderRadius: '7px',
                borderWidth: 2,
                bgcolor: 'transparent',
                '&:hover': {
                  borderWidth: 2,
                  borderColor: ADMIN_PRIMARY,
                  bgcolor: ADMIN_PRIMARY,
                  color: '#fff',
                  boxShadow: `0 4px 12px ${alpha(ADMIN_PRIMARY, 0.3)}`,
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>Accounting</Box>
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Accounting</Box>
            </Button>
            <Button
              variant="outlined"
              startIcon={<SchoolRoundedIcon sx={{ fontSize: { xs: 18, sm: 24 } }} />}
              endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />}
              onClick={() => navigate('/admin/courses/courses')}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderColor: theme.palette.grey[300],
                color: 'text.primary',
                borderRadius: '7px',
                borderWidth: 2,
                bgcolor: 'transparent',
                '&:hover': {
                  borderWidth: 2,
                  borderColor: ADMIN_PRIMARY,
                  bgcolor: ADMIN_PRIMARY,
                  color: '#fff',
                  boxShadow: `0 4px 12px ${alpha(ADMIN_PRIMARY, 0.3)}`,
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>Courses</Box>
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Courses</Box>
            </Button>
            <Button
              variant="outlined"
              startIcon={<SubscriptionsRoundedIcon sx={{ fontSize: { xs: 18, sm: 24 } }} />}
              endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />}
              onClick={() => navigate('/admin/subscriptions')}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderColor: theme.palette.grey[300],
                color: 'text.primary',
                borderRadius: '7px',
                borderWidth: 2,
                bgcolor: 'transparent',
                '&:hover': {
                  borderWidth: 2,
                  borderColor: ADMIN_PRIMARY,
                  bgcolor: ADMIN_PRIMARY,
                  color: '#fff',
                  boxShadow: `0 4px 12px ${alpha(ADMIN_PRIMARY, 0.3)}`,
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>Subscriptions</Box>
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Subscriptions</Box>
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default AdminDashboard
