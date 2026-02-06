import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { alpha } from '@mui/material/styles'
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Paper,
  Avatar,
  IconButton,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
} from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded'
import SubscriptionsRoundedIcon from '@mui/icons-material/SubscriptionsRounded'
import EmailRoundedIcon from '@mui/icons-material/EmailRounded'
import WcRoundedIcon from '@mui/icons-material/WcRounded'
import CardMembershipRoundedIcon from '@mui/icons-material/CardMembershipRounded'

// Match AdminUsers static data (fallback when opening via URL without state)
const STATIC_USERS = [
  { id: 1, fullName: 'Sarah Johnson', email: 'sarah.johnson@email.com', gender: 'Female', subscription: 'Premium', avatar: 'https://i.pravatar.cc/80?img=1' },
  { id: 2, fullName: 'James Wilson', email: 'james.wilson@email.com', gender: 'Male', subscription: 'Standard', avatar: 'https://i.pravatar.cc/80?img=2' },
  { id: 3, fullName: 'Emma Davis', email: 'emma.davis@email.com', gender: 'Female', subscription: 'Free Trial', avatar: 'https://i.pravatar.cc/80?img=3' },
  { id: 4, fullName: 'Michael Brown', email: 'michael.b@email.com', gender: 'Male', subscription: 'Premium', avatar: 'https://i.pravatar.cc/80?img=4' },
  { id: 5, fullName: 'Olivia Martinez', email: 'olivia.m@email.com', gender: 'Female', subscription: 'Standard', avatar: 'https://i.pravatar.cc/80?img=5' },
  { id: 6, fullName: 'William Taylor', email: 'william.t@email.com', gender: 'Male', subscription: 'Premium', avatar: 'https://i.pravatar.cc/80?img=6' },
  { id: 7, fullName: 'Sophie Anderson', email: 'sophie.a@email.com', gender: 'Female', subscription: 'Free Trial', avatar: 'https://i.pravatar.cc/80?img=7' },
  { id: 8, fullName: 'Daniel Thomas', email: 'daniel.t@email.com', gender: 'Male', subscription: 'Standard', avatar: 'https://i.pravatar.cc/80?img=8' },
  { id: 9, fullName: 'Isabella Jackson', email: 'isabella.j@email.com', gender: 'Female', subscription: 'Premium', avatar: 'https://i.pravatar.cc/80?img=9' },
  { id: 10, fullName: 'Benjamin White', email: 'benjamin.w@email.com', gender: 'Male', subscription: 'Standard', avatar: 'https://i.pravatar.cc/80?img=10' },
  { id: 11, fullName: 'Mia Harris', email: 'mia.harris@email.com', gender: 'Female', subscription: 'Free Trial', avatar: 'https://i.pravatar.cc/80?img=11' },
  { id: 12, fullName: 'Lucas Clark', email: 'lucas.clark@email.com', gender: 'Male', subscription: 'Premium', avatar: 'https://i.pravatar.cc/80?img=12' },
]

// Dummy accounting records (match AdminAccounting — by user id)
const ACCOUNTING_RECORDS = [
  { id: 1, userId: 1, package: 'Premium', date: '1 January 2026 12:15 PM', subscriptionEndDate: '1 April 2026 11:59 PM', amount: '£49.99' },
  { id: 2, userId: 2, package: 'Standard', date: '4 January 2026 09:30 AM', subscriptionEndDate: '4 April 2026 11:59 PM', amount: '£29.99' },
  { id: 3, userId: 3, package: 'Free Trial', date: '9 January 2026 05:45 PM', subscriptionEndDate: '23 January 2026 11:59 PM', amount: '£0' },
  { id: 4, userId: 4, package: 'Premium', date: '12 January 2026 08:10 AM', subscriptionEndDate: '12 April 2026 11:59 PM', amount: '£49.99' },
  { id: 5, userId: 5, package: 'Standard', date: '18 January 2026 11:20 AM', subscriptionEndDate: '18 April 2026 11:59 PM', amount: '£29.99' },
  { id: 6, userId: 6, package: 'Premium', date: '21 January 2026 02:05 PM', subscriptionEndDate: '21 April 2026 11:59 PM', amount: '£49.99' },
  { id: 7, userId: 7, package: 'Free Trial', date: '28 January 2026 06:40 PM', subscriptionEndDate: '11 February 2026 11:59 PM', amount: '£0' },
  { id: 8, userId: 8, package: 'Standard', date: '2 February 2026 10:00 AM', subscriptionEndDate: '2 May 2026 11:59 PM', amount: '£29.99' },
  { id: 9, userId: 9, package: 'Premium', date: '5 February 2026 03:30 PM', subscriptionEndDate: '5 May 2026 11:59 PM', amount: '£49.99' },
  { id: 10, userId: 10, package: 'Standard', date: '8 February 2026 09:15 AM', subscriptionEndDate: '8 May 2026 11:59 PM', amount: '£29.99' },
]

// Dummy subscription history (plan, start, end, status) — per user
const SUBSCRIPTION_HISTORY = [
  { userId: 1, plan: 'Premium', startDate: '1 January 2026', endDate: '1 April 2026', status: 'Active' },
  { userId: 1, plan: 'Standard', startDate: '1 October 2025', endDate: '31 December 2025', status: 'Ended' },
  { userId: 2, plan: 'Standard', startDate: '4 January 2026', endDate: '4 April 2026', status: 'Active' },
  { userId: 2, plan: 'Free Trial', startDate: '7 December 2025', endDate: '3 January 2026', status: 'Ended' },
  { userId: 3, plan: 'Free Trial', startDate: '9 January 2026', endDate: '23 January 2026', status: 'Active' },
  { userId: 4, plan: 'Premium', startDate: '12 January 2026', endDate: '12 April 2026', status: 'Active' },
  { userId: 5, plan: 'Standard', startDate: '18 January 2026', endDate: '18 April 2026', status: 'Active' },
  { userId: 6, plan: 'Premium', startDate: '21 January 2026', endDate: '21 April 2026', status: 'Active' },
  { userId: 7, plan: 'Free Trial', startDate: '28 January 2026', endDate: '11 February 2026', status: 'Active' },
  { userId: 8, plan: 'Standard', startDate: '2 February 2026', endDate: '2 May 2026', status: 'Active' },
  { userId: 9, plan: 'Premium', startDate: '5 February 2026', endDate: '5 May 2026', status: 'Active' },
  { userId: 10, plan: 'Standard', startDate: '8 February 2026', endDate: '8 May 2026', status: 'Active' },
  { userId: 11, plan: 'Free Trial', startDate: '1 February 2026', endDate: '15 February 2026', status: 'Active' },
  { userId: 12, plan: 'Premium', startDate: '10 February 2026', endDate: '10 May 2026', status: 'Active' },
]

function AdminUserDetails() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const user = location.state?.user ?? STATIC_USERS.find((u) => String(u.id) === String(id))
  const userId = user ? Number(user.id) : null
  const accountingRecords = userId != null ? ACCOUNTING_RECORDS.filter((r) => r.userId === userId) : []
  const subscriptionHistory = userId != null ? SUBSCRIPTION_HISTORY.filter((s) => s.userId === userId) : []

  const getSubscriptionColor = (sub) => {
    if (sub === 'Premium') return theme.palette.primary.main
    if (sub === 'Standard') return theme.palette.grey[700]
    return theme.palette.grey[500]
  }

  if (!user) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">User not found.</Typography>
        <IconButton onClick={() => navigate('/admin/users')} sx={{ mt: 2 }}>
          <ArrowBackRoundedIcon />
        </IconButton>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        width: '100%',
        minWidth: 0,
        maxWidth: 900,
        mx: 'auto',
        overflowX: 'hidden',
      }}
    >
      {/* Header: Back + title */}
      <Box sx={{ mb: { xs: 2, sm: 3 }, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <IconButton
          onClick={() => navigate('/admin/users')}
          size={isMobile ? 'medium' : 'large'}
          sx={{
            color: theme.palette.primary.main,
            bgcolor: alpha(theme.palette.primary.main, 0.08),
            '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.15) },
          }}
          aria-label="Back to users"
        >
          <ArrowBackRoundedIcon />
        </IconButton>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
            User details
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
            {user.fullName}
          </Typography>
        </Box>
      </Box>

      {/* User info card */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 2.5 },
          mb: 2,
          borderRadius: 2,
          border: '1px solid',
          borderColor: alpha(theme.palette.primary.main, 0.15),
          bgcolor: alpha(theme.palette.primary.main, 0.04),
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Avatar
            src={user.avatar}
            alt={user.fullName}
            sx={{
              width: { xs: 72, sm: 80 },
              height: { xs: 72, sm: 80 },
              bgcolor: alpha(theme.palette.primary.main, 0.12),
              color: theme.palette.primary.main,
              border: `3px solid ${alpha(theme.palette.primary.main, 0.3)}`,
            }}
          >
            {user.fullName.charAt(0)}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
              {user.fullName}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 0.5 }}>
              <EmailRoundedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {user.email}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
              <Chip
                icon={<WcRoundedIcon sx={{ fontSize: 16 }} />}
                label={user.gender}
                size="small"
                sx={{
                  height: 28,
                  fontWeight: 600,
                  bgcolor: user.gender === 'Male' ? alpha(theme.palette.primary.main, 0.12) : alpha(theme.palette.primary.light, 0.15),
                  color: user.gender === 'Male' ? theme.palette.primary.dark : theme.palette.primary.main,
                  border: 'none',
                }}
              />
              <Chip
                icon={<CardMembershipRoundedIcon sx={{ fontSize: 16 }} />}
                label={user.subscription}
                size="small"
                sx={{
                  height: 28,
                  fontWeight: 600,
                  bgcolor: alpha(getSubscriptionColor(user.subscription), 0.12),
                  color: getSubscriptionColor(user.subscription),
                  border: 'none',
                }}
              />
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Accounting history */}
      <Paper
        elevation={0}
        sx={{
          mb: 2,
          borderRadius: 2,
          border: '1px solid',
          borderColor: theme.palette.grey[200],
          bgcolor: theme.palette.background.paper,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            px: { xs: 2, sm: 2.5 },
            py: 1.5,
            borderBottom: '1px solid',
            borderColor: theme.palette.divider,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            bgcolor: alpha(theme.palette.primary.main, 0.04),
          }}
        >
          <AccountBalanceRoundedIcon sx={{ color: theme.palette.primary.main, fontSize: 24 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
            Accounting history
          </Typography>
        </Box>
        {isMobile ? (
          <Box sx={{ p: { xs: 1.5, sm: 2 }, display: 'flex', flexDirection: 'column', gap: 1.5, overflowX: 'hidden' }}>
            {accountingRecords.length === 0 ? (
              <Typography variant="body2" align="center" sx={{ py: 3, color: 'text.secondary' }}>No accounting records</Typography>
            ) : (
              accountingRecords.map((row) => (
                <Paper
                  key={row.id}
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: theme.palette.grey[200],
                    bgcolor: theme.palette.grey[50],
                    '&:hover': { borderColor: alpha(theme.palette.primary.main, 0.3), bgcolor: alpha(theme.palette.primary.main, 0.02) },
                  }}
                >
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 1, mb: 1.5 }}>
                    <Chip
                      label={row.package}
                      size="small"
                      sx={{ height: 26, fontSize: '0.75rem', fontWeight: 600, bgcolor: alpha(theme.palette.primary.main, 0.12), color: theme.palette.primary.dark, border: 'none' }}
                    />
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>{row.amount}</Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', mb: 0.25 }}>Date</Typography>
                  <Typography variant="body2" sx={{ color: 'text.primary', fontSize: '0.875rem', mb: 1 }}>{row.date}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', mb: 0.25 }}>Subscription end</Typography>
                  <Typography variant="body2" sx={{ color: 'text.primary', fontSize: '0.875rem' }}>{row.subscriptionEndDate}</Typography>
                </Paper>
              ))
            )}
          </Box>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: theme.palette.grey[50] }}>
                  <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase' }}>Package</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase' }}>Subscription end</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase' }}>Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {accountingRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 3, color: 'text.secondary' }}>No accounting records</TableCell>
                  </TableRow>
                ) : (
                  accountingRecords.map((row) => (
                    <TableRow key={row.id} hover sx={{ '& .MuiTableCell-body': { borderColor: theme.palette.grey[200], py: 1.5 } }}>
                      <TableCell>
                        <Chip label={row.package} size="small" sx={{ height: 24, fontSize: '0.75rem', fontWeight: 600, bgcolor: alpha(theme.palette.primary.main, 0.12), color: theme.palette.primary.dark, border: 'none' }} />
                      </TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>{row.date}</TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>{row.subscriptionEndDate}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, color: 'primary.main' }}>{row.amount}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Subscription history */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          border: '1px solid',
          borderColor: theme.palette.grey[200],
          bgcolor: theme.palette.background.paper,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            px: { xs: 2, sm: 2.5 },
            py: 1.5,
            borderBottom: '1px solid',
            borderColor: theme.palette.divider,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            bgcolor: alpha(theme.palette.primary.main, 0.04),
          }}
        >
          <SubscriptionsRoundedIcon sx={{ color: theme.palette.primary.main, fontSize: 24 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
            Subscription history
          </Typography>
        </Box>
        {isMobile ? (
          <Box sx={{ p: { xs: 1.5, sm: 2 }, display: 'flex', flexDirection: 'column', gap: 1.5, overflowX: 'hidden' }}>
            {subscriptionHistory.length === 0 ? (
              <Typography variant="body2" align="center" sx={{ py: 3, color: 'text.secondary' }}>No subscription history</Typography>
            ) : (
              subscriptionHistory.map((s, idx) => (
                <Paper
                  key={idx}
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: theme.palette.grey[200],
                    bgcolor: theme.palette.grey[50],
                    '&:hover': { borderColor: alpha(theme.palette.primary.main, 0.3), bgcolor: alpha(theme.palette.primary.main, 0.02) },
                  }}
                >
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 1, mb: 1.5 }}>
                    <Chip
                      label={s.plan}
                      size="small"
                      sx={{ height: 26, fontSize: '0.75rem', fontWeight: 600, bgcolor: alpha(getSubscriptionColor(s.plan), 0.12), color: getSubscriptionColor(s.plan), border: 'none' }}
                    />
                    <Chip
                      label={s.status}
                      size="small"
                      sx={{
                        height: 24,
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                        bgcolor: s.status === 'Active' ? alpha(theme.palette.success.main, 0.12) : alpha(theme.palette.grey[500], 0.12),
                        color: s.status === 'Active' ? theme.palette.success.dark : theme.palette.grey[600],
                        border: 'none',
                      }}
                    />
                  </Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', mb: 0.25 }}>Start date</Typography>
                  <Typography variant="body2" sx={{ color: 'text.primary', fontSize: '0.875rem', mb: 1 }}>{s.startDate}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', mb: 0.25 }}>End date</Typography>
                  <Typography variant="body2" sx={{ color: 'text.primary', fontSize: '0.875rem' }}>{s.endDate}</Typography>
                </Paper>
              ))
            )}
          </Box>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: theme.palette.grey[50] }}>
                  <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase' }}>Plan</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase' }}>Start date</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase' }}>End date</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subscriptionHistory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 3, color: 'text.secondary' }}>No subscription history</TableCell>
                  </TableRow>
                ) : (
                  subscriptionHistory.map((s, idx) => (
                    <TableRow key={idx} hover sx={{ '& .MuiTableCell-body': { borderColor: theme.palette.grey[200], py: 1.5 } }}>
                      <TableCell>
                        <Chip label={s.plan} size="small" sx={{ height: 24, fontSize: '0.75rem', fontWeight: 600, bgcolor: alpha(getSubscriptionColor(s.plan), 0.12), color: getSubscriptionColor(s.plan), border: 'none' }} />
                      </TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>{s.startDate}</TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>{s.endDate}</TableCell>
                      <TableCell>
                        <Chip label={s.status} size="small" sx={{ height: 22, fontSize: '0.6875rem', fontWeight: 600, bgcolor: s.status === 'Active' ? alpha(theme.palette.success.main, 0.12) : alpha(theme.palette.grey[500], 0.12), color: s.status === 'Active' ? theme.palette.success.dark : theme.palette.grey[600], border: 'none' }} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  )
}

export default AdminUserDetails
