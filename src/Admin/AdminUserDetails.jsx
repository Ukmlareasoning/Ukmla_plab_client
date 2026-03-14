import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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
  Skeleton,
} from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded'
import SubscriptionsRoundedIcon from '@mui/icons-material/SubscriptionsRounded'
import EmailRoundedIcon from '@mui/icons-material/EmailRounded'
import WcRoundedIcon from '@mui/icons-material/WcRounded'
import CardMembershipRoundedIcon from '@mui/icons-material/CardMembershipRounded'
import ImagePreviewDialog from '../components/ImagePreviewDialog'
import apiClient from '../server'
import { useToast } from '../components/ToastProvider'

const ADMIN_PRIMARY = '#384D84'
const ADMIN_PRIMARY_DARK = '#2a3a64'
const ADMIN_PRIMARY_LIGHT = '#4a5f9a'

function formatDate(isoString) {
  if (!isoString) return '—'
  try {
    const d = new Date(isoString)
    if (Number.isNaN(d.getTime())) return isoString
    const day = d.getDate()
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ]
    const month = months[d.getMonth()]
    const year = d.getFullYear()
    return `${day} ${month} ${year}`
  } catch {
    return isoString
  }
}

function formatDateTime(isoString) {
  if (!isoString) return '—'
  try {
    const d = new Date(isoString)
    if (Number.isNaN(d.getTime())) return isoString
    const dateStr = formatDate(isoString)
    let hours = d.getHours()
    const minutes = d.getMinutes()
    const ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12 || 12
    const mins = minutes < 10 ? '0' + minutes : String(minutes)
    return `${dateStr} ${hours}:${mins} ${ampm}`
  } catch {
    return isoString
  }
}

function formatAmount(amount) {
  if (amount == null || amount === '') return '—'
  const num = Number(amount)
  if (Number.isNaN(num)) return String(amount)
  return `£${num.toFixed(2)}`
}

function AdminUserDetails() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [user, setUser] = useState(null)
  const [activeSubscriptions, setActiveSubscriptions] = useState([])
  const [subscriptionHistory, setSubscriptionHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [imagePreview, setImagePreview] = useState({ open: false, src: '', alt: '', title: '' })

  useEffect(() => {
    if (!id) return
    let cancelled = false
    setLoading(true)
    setError('')
    apiClient(`/users/${id}`, 'GET')
      .then(({ ok, data }) => {
        if (cancelled) return
        if (!ok || !data?.success) {
          const message =
            data?.errors && typeof data.errors === 'object'
              ? Object.values(data.errors).flat().join(' ')
              : data?.message
          setError(message || 'User not found.')
          setUser(null)
          setActiveSubscriptions([])
          setSubscriptionHistory([])
          return
        }
        const u = data.data?.user || {}
        setUser({
          id: u.id,
          fullName: u.full_name || `${u.first_name ?? ''} ${u.last_name ?? ''}`.trim() || u.email,
          email: u.email,
          gender: u.gender ? (String(u.gender).toLowerCase() === 'male' ? 'Male' : String(u.gender).charAt(0).toUpperCase() + String(u.gender).slice(1)) : 'N/A',
          subscription: u.subscription_type || (u.is_subscribed ? 'Subscribed' : 'None'),
          avatar: u.profile_image_url || '',
          status: u.status || 'Active',
          availability: u.availability || null,
          availabilityLabel: u.availability_label || null,
          isOnline: typeof u.is_online === 'boolean' ? u.is_online : !!u.is_online,
        })
        setActiveSubscriptions(data.data?.active_subscriptions || [])
        setSubscriptionHistory(data.data?.subscription_history || [])
      })
      .catch(() => {
        if (!cancelled) {
          setError('Unable to load user details.')
          showToast('Unable to load user details.', 'error')
          setUser(null)
          setActiveSubscriptions([])
          setSubscriptionHistory([])
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [id, showToast])

  const getSubscriptionColor = (sub) => {
    if (sub === 'Premium') return ADMIN_PRIMARY
    if (sub === 'Standard') return theme.palette.grey[700]
    return theme.palette.grey[500]
  }

  if (loading) {
    return (
      <Box sx={{ width: '100%', minWidth: 0, maxWidth: 900, mx: 'auto', overflowX: 'hidden' }}>
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Skeleton variant="rectangular" width={40} height={40} sx={{ borderRadius: '7px' }} />
          <Box>
            <Skeleton variant="text" width={180} height={32} />
            <Skeleton variant="text" width={120} height={20} />
          </Box>
        </Box>
        <Paper elevation={0} sx={{ p: 2.5, mb: 2, borderRadius: '7px', border: '1px solid', borderColor: alpha(ADMIN_PRIMARY, 0.15) }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Skeleton variant="rectangular" width={80} height={80} sx={{ borderRadius: '7px' }} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="60%" height={28} />
              <Skeleton variant="text" width="80%" height={22} sx={{ mt: 1 }} />
              <Box sx={{ display: 'flex', gap: 1, mt: 1.5 }}>
                <Skeleton variant="rounded" width={80} height={28} sx={{ borderRadius: '7px' }} />
                <Skeleton variant="rounded" width={90} height={28} sx={{ borderRadius: '7px' }} />
              </Box>
            </Box>
          </Box>
        </Paper>
        <Paper elevation={0} sx={{ mb: 2, borderRadius: '7px', border: '1px solid', borderColor: theme.palette.grey[200], overflow: 'hidden' }}>
          <Box sx={{ px: 2.5, py: 1.5, borderBottom: '1px solid', borderColor: theme.palette.divider }}>
            <Skeleton variant="text" width={160} height={24} />
          </Box>
          <Box sx={{ p: 2 }}>
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="80%" sx={{ mt: 1 }} />
          </Box>
        </Paper>
        <Paper elevation={0} sx={{ borderRadius: '7px', border: '1px solid', borderColor: theme.palette.grey[200], overflow: 'hidden' }}>
          <Box sx={{ px: 2.5, py: 1.5, borderBottom: '1px solid', borderColor: theme.palette.divider }}>
            <Skeleton variant="text" width={180} height={24} />
          </Box>
          <Box sx={{ p: 2 }}>
            <Skeleton variant="rectangular" height={120} sx={{ borderRadius: '7px' }} />
          </Box>
        </Paper>
      </Box>
    )
  }

  if (error || !user) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">{error || 'User not found.'}</Typography>
        <IconButton
          onClick={() => navigate('/admin/users')}
          sx={{ mt: 2, borderRadius: '7px', color: ADMIN_PRIMARY }}
          aria-label="Back to users"
        >
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
            color: ADMIN_PRIMARY,
            bgcolor: alpha(ADMIN_PRIMARY, 0.08),
            borderRadius: '7px',
            '&:hover': { bgcolor: alpha(ADMIN_PRIMARY, 0.15) },
          }}
          aria-label="Back to users"
        >
          <ArrowBackRoundedIcon />
        </IconButton>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
            User Details
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
          borderRadius: '7px',
          border: '1px solid',
          borderColor: alpha(ADMIN_PRIMARY, 0.15),
          bgcolor: alpha(ADMIN_PRIMARY, 0.04),
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <Avatar
              src={user.avatar}
              alt={user.fullName}
              onClick={() => user.avatar && setImagePreview({ open: true, src: user.avatar, alt: user.fullName, title: user.fullName })}
              sx={{
                width: { xs: 72, sm: 80 },
                height: { xs: 72, sm: 80 },
                cursor: user.avatar ? 'pointer' : 'default',
                borderRadius: '7px',
                bgcolor: alpha(ADMIN_PRIMARY, 0.12),
                color: ADMIN_PRIMARY,
                border: `3px solid ${alpha(ADMIN_PRIMARY, 0.3)}`,
                '&:hover': user.avatar ? { opacity: 0.9, boxShadow: 2 } : undefined,
              }}
            >
              {(user.fullName || user.email || 'U').charAt(0)}
            </Avatar>
            <Box
              sx={{
                position: 'absolute',
                bottom: -2,
                right: -2,
                width: 14,
                height: 14,
                borderRadius: '50%',
                bgcolor: user.isOnline ? '#22c55e' : theme.palette.grey[600],
                border: '2px solid',
                borderColor: theme.palette.background.paper,
                boxShadow: user.isOnline ? '0 0 0 1px rgba(34, 197, 94, 0.4), 0 0 8px rgba(34, 197, 94, 0.5)' : 'none',
              }}
            />
          </Box>
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
                  borderRadius: '7px',
                  bgcolor: user.gender === 'Male' ? alpha(ADMIN_PRIMARY, 0.12) : alpha(ADMIN_PRIMARY_LIGHT, 0.15),
                  color: user.gender === 'Male' ? ADMIN_PRIMARY_DARK : ADMIN_PRIMARY,
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
                  borderRadius: '7px',
                  bgcolor: alpha(getSubscriptionColor(user.subscription), 0.12),
                  color: getSubscriptionColor(user.subscription),
                  border: 'none',
                }}
              />
              <Chip
                label={user.availability === 'online' ? (user.availabilityLabel || 'Online') : (user.availabilityLabel || 'Offline')}
                size="small"
                sx={{
                  height: 28,
                  fontWeight: 600,
                  borderRadius: '7px',
                  bgcolor: user.availability === 'online' ? alpha(theme.palette.success.main, 0.12) : alpha(theme.palette.grey[500], 0.12),
                  color: user.availability === 'online' ? theme.palette.success.dark : theme.palette.grey[700],
                  border: 'none',
                }}
              />
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Active Subscription */}
      <Paper
        elevation={0}
        sx={{
          mb: 2,
          borderRadius: '7px',
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
            bgcolor: alpha(ADMIN_PRIMARY, 0.04),
          }}
        >
          <AccountBalanceRoundedIcon sx={{ color: ADMIN_PRIMARY, fontSize: 24 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
            Active Subscription
          </Typography>
        </Box>
        {isMobile ? (
          <Box sx={{ p: { xs: 1.5, sm: 2 }, display: 'flex', flexDirection: 'column', gap: 1.5, overflowX: 'hidden' }}>
            {activeSubscriptions.length === 0 ? (
              <Box
                sx={{
                  py: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                }}
              >
                <AccountBalanceRoundedIcon sx={{ fontSize: 32, color: alpha(ADMIN_PRIMARY, 0.35) }} />
                <Typography variant="body2" align="center" sx={{ color: 'text.secondary' }}>
                  No active subscription
                </Typography>
              </Box>
            ) : (
              activeSubscriptions.map((row) => (
                <Paper
                  key={row.id}
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: '7px',
                    border: '1px solid',
                    borderColor: theme.palette.grey[200],
                    bgcolor: theme.palette.grey[50],
                    '&:hover': { borderColor: alpha(ADMIN_PRIMARY, 0.3), bgcolor: alpha(ADMIN_PRIMARY, 0.02) },
                  }}
                >
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 1, mb: 1.5 }}>
                    <Chip
                      label={row.plan_name}
                      size="small"
                      sx={{ height: 26, fontSize: '0.75rem', fontWeight: 600, borderRadius: '7px', bgcolor: alpha(ADMIN_PRIMARY, 0.12), color: ADMIN_PRIMARY_DARK, border: 'none' }}
                    />
                    <Typography variant="body2" sx={{ fontWeight: 700, color: ADMIN_PRIMARY }}>
                      {formatAmount(row.amount)}
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', mb: 0.25 }}>Start date</Typography>
                  <Typography variant="body2" sx={{ color: 'text.primary', fontSize: '0.875rem', mb: 1 }}>{formatDateTime(row.starts_at)}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', mb: 0.25 }}>End date</Typography>
                  <Typography variant="body2" sx={{ color: 'text.primary', fontSize: '0.875rem' }}>{formatDateTime(row.ends_at)}</Typography>
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
                  <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase' }}>Start date</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase' }}>End date</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase' }}>Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {activeSubscriptions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 1,
                        }}
                      >
                        <AccountBalanceRoundedIcon sx={{ fontSize: 32, color: alpha(ADMIN_PRIMARY, 0.35) }} />
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          No active subscription
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  activeSubscriptions.map((row) => (
                    <TableRow key={row.id} hover sx={{ '& .MuiTableCell-body': { borderColor: theme.palette.grey[200], py: 1.5 } }}>
                      <TableCell>
                        <Chip label={row.plan_name} size="small" sx={{ height: 24, fontSize: '0.75rem', fontWeight: 600, borderRadius: '7px', bgcolor: alpha(ADMIN_PRIMARY, 0.12), color: ADMIN_PRIMARY_DARK, border: 'none' }} />
                      </TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>{formatDateTime(row.starts_at)}</TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>{formatDateTime(row.ends_at)}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, color: ADMIN_PRIMARY }}>{formatAmount(row.amount)}</TableCell>
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
          borderRadius: '7px',
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
            bgcolor: alpha(ADMIN_PRIMARY, 0.04),
          }}
        >
          <SubscriptionsRoundedIcon sx={{ color: ADMIN_PRIMARY, fontSize: 24 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
            Subscription History
          </Typography>
        </Box>
        {isMobile ? (
          <Box sx={{ p: { xs: 1.5, sm: 2 }, display: 'flex', flexDirection: 'column', gap: 1.5, overflowX: 'hidden' }}>
            {subscriptionHistory.length === 0 ? (
              <Box
                sx={{
                  py: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                }}
              >
                <SubscriptionsRoundedIcon sx={{ fontSize: 32, color: alpha(ADMIN_PRIMARY, 0.35) }} />
                <Typography variant="body2" align="center" sx={{ color: 'text.secondary' }}>
                  No subscription history
                </Typography>
              </Box>
            ) : (
              subscriptionHistory.map((row) => (
                <Paper
                  key={row.id}
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: '7px',
                    border: '1px solid',
                    borderColor: theme.palette.grey[200],
                    bgcolor: theme.palette.grey[50],
                    '&:hover': { borderColor: alpha(ADMIN_PRIMARY, 0.3), bgcolor: alpha(ADMIN_PRIMARY, 0.02) },
                  }}
                >
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 1, mb: 1.5 }}>
                    <Chip
                      label={row.plan_name}
                      size="small"
                      sx={{ height: 26, fontSize: '0.75rem', fontWeight: 600, borderRadius: '7px', bgcolor: alpha(getSubscriptionColor(row.plan_name), 0.12), color: getSubscriptionColor(row.plan_name), border: 'none' }}
                    />
                    <Chip
                      label={row.status}
                      size="small"
                      sx={{
                        height: 24,
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                        borderRadius: '7px',
                        bgcolor: row.status === 'Active' ? alpha(ADMIN_PRIMARY, 0.12) : alpha(theme.palette.grey[500], 0.12),
                        color: row.status === 'Active' ? ADMIN_PRIMARY_DARK : theme.palette.grey[600],
                        border: 'none',
                      }}
                    />
                  </Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', mb: 0.25 }}>Start date</Typography>
                  <Typography variant="body2" sx={{ color: 'text.primary', fontSize: '0.875rem', mb: 1 }}>{formatDate(row.starts_at)}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', mb: 0.25 }}>End date</Typography>
                  <Typography variant="body2" sx={{ color: 'text.primary', fontSize: '0.875rem' }}>{formatDate(row.ends_at)}</Typography>
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
                    <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 1,
                        }}
                      >
                        <SubscriptionsRoundedIcon sx={{ fontSize: 32, color: alpha(ADMIN_PRIMARY, 0.35) }} />
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          No subscription history
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  subscriptionHistory.map((row) => (
                    <TableRow key={row.id} hover sx={{ '& .MuiTableCell-body': { borderColor: theme.palette.grey[200], py: 1.5 } }}>
                      <TableCell>
                        <Chip label={row.plan_name} size="small" sx={{ height: 24, fontSize: '0.75rem', fontWeight: 600, borderRadius: '7px', bgcolor: alpha(getSubscriptionColor(row.plan_name), 0.12), color: getSubscriptionColor(row.plan_name), border: 'none' }} />
                      </TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>{formatDate(row.starts_at)}</TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>{formatDate(row.ends_at)}</TableCell>
                      <TableCell>
                        <Chip label={row.status} size="small" sx={{ height: 22, fontSize: '0.6875rem', fontWeight: 600, borderRadius: '7px', bgcolor: row.status === 'Active' ? alpha(ADMIN_PRIMARY, 0.12) : alpha(theme.palette.grey[500], 0.12), color: row.status === 'Active' ? ADMIN_PRIMARY_DARK : theme.palette.grey[600], border: 'none' }} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <ImagePreviewDialog
        open={imagePreview.open}
        onClose={() => setImagePreview((p) => ({ ...p, open: false }))}
        src={imagePreview.src}
        alt={imagePreview.alt}
        title={imagePreview.title}
      />
    </Box>
  )
}

export default AdminUserDetails
