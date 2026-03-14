import { useState, useEffect } from 'react'
import { alpha } from '@mui/material/styles'
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Paper,
  TextField,
  InputAdornment,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  IconButton,
  Tooltip,
  Chip,
  Pagination,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Skeleton,
} from '@mui/material'
import Slide from '@mui/material/Slide'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded'
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'
import PrintRoundedIcon from '@mui/icons-material/PrintRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded'
import SubscriptionsRoundedIcon from '@mui/icons-material/SubscriptionsRounded'
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded'
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import ImagePreviewDialog from '../components/ImagePreviewDialog'
import apiClient from '../server'
import { useToast } from '../components/ToastProvider'

// Admin screen primary (#384D84 — no green/teal)
const ADMIN_PRIMARY = '#384D84'
const ADMIN_PRIMARY_DARK = '#2a3a64'
const ADMIN_PRIMARY_LIGHT = '#4a5f9a'

const ROWS_PER_PAGE_OPTIONS = [5, 10, 20, 30, 40, 50, 100]

const PACKAGE_OPTIONS = ['', 'Premium', 'Standard', 'Premium Monthly']
const STATUS_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'Active', label: 'Active' },
  { value: 'Ended', label: 'Ended' },
  { value: 'Cancelled', label: 'Cancelled' },
]

const adminGradient = `linear-gradient(135deg, ${ADMIN_PRIMARY} 0%, ${ADMIN_PRIMARY_LIGHT} 100%)`

const SKELETON_ROW_COUNT = 5

function formatDateTime(isoString) {
  if (!isoString) return '—'
  try {
    const d = new Date(isoString)
    if (Number.isNaN(d.getTime())) return isoString
    const day = d.getDate()
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const month = months[d.getMonth()]
    const year = d.getFullYear()
    let hours = d.getHours()
    const minutes = d.getMinutes()
    const ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12 || 12
    const mins = minutes < 10 ? '0' + minutes : String(minutes)
    return `${day} ${month} ${year} ${hours}:${mins} ${ampm}`
  } catch {
    return isoString
  }
}

function formatAmount(amount) {
  if (amount == null || amount === '') return '£0.00'
  const num = Number(amount)
  if (Number.isNaN(num)) return String(amount)
  return `£${num.toFixed(2)}`
}

function getSubscriptionColor(planName, theme, ADMIN_PRIMARY, ADMIN_PRIMARY_DARK) {
  if (!planName) return theme.palette.grey[500]
  const s = String(planName).toLowerCase()
  if (s.includes('premium')) return ADMIN_PRIMARY
  if (s.includes('standard')) return theme.palette.grey[700]
  return theme.palette.grey[600]
}

function getStatusChipStyle(status, theme, ADMIN_PRIMARY) {
  const s = String(status || '').toLowerCase()
  if (s === 'active') {
    return { bgcolor: alpha(theme.palette.success.main, 0.12), color: theme.palette.success.dark }
  }
  if (s === 'cancelled') {
    return { bgcolor: alpha(theme.palette.error.main, 0.12), color: theme.palette.error.dark }
  }
  if (s === 'ended') {
    return { bgcolor: alpha(theme.palette.grey[600], 0.12), color: theme.palette.grey[700] }
  }
  return { bgcolor: theme.palette.grey[100], color: theme.palette.grey[700] }
}

const hexToRgb = (hex) => {
  if (!hex) return [0, 0, 0]
  const normalized = String(hex).replace('#', '')
  const value = normalized.length === 3
    ? normalized.split('').map((c) => parseInt(c + c, 16))
    : [normalized.substring(0, 2), normalized.substring(2, 4), normalized.substring(4, 6)].map((x) => parseInt(x, 16))
  return value.some(Number.isNaN) ? [0, 0, 0] : value
}

function AdminAccounting() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const showAsCards = useMediaQuery(theme.breakpoints.down('md'))
  const { showToast } = useToast()

  const [search, setSearch] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [packageFilter, setPackageFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [stats, setStats] = useState({
    active_subscriptions: 0,
    cancelled_subscriptions: 0,
    ended_subscriptions: 0,
    total_earnings: 0,
    orders_count: 0,
    percent_active: 0,
    percent_cancelled: 0,
    percent_ended: 0,
  })
  const [records, setRecords] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalRows, setTotalRows] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [listLoading, setListLoading] = useState(false)
  const [listError, setListError] = useState('')
  const [viewDialog, setViewDialog] = useState({ open: false, row: null })
  const [imagePreview, setImagePreview] = useState({ open: false, src: '', alt: '', title: '' })

  const serverPage = page + 1
  const from = totalRows === 0 ? 0 : (serverPage - 1) * rowsPerPage + 1
  const to = Math.min((serverPage - 1) * rowsPerPage + rowsPerPage, totalRows)

  const fetchAccounting = async (opts = {}) => {
    const { targetPage = serverPage, targetPerPage = rowsPerPage, filters: filterOverrides } = opts
    setListLoading(true)
    setListError('')
    const text = filterOverrides?.text !== undefined ? filterOverrides.text : search
    const df = filterOverrides?.date_from !== undefined ? filterOverrides.date_from : dateFrom
    const dt = filterOverrides?.date_to !== undefined ? filterOverrides.date_to : dateTo
    const pkg = filterOverrides?.package !== undefined ? filterOverrides.package : packageFilter
    const st = filterOverrides?.status !== undefined ? filterOverrides.status : statusFilter
    const params = new URLSearchParams()
    params.set('page', String(targetPage))
    params.set('per_page', String(targetPerPage))
    if (String(text).trim()) params.set('text', String(text).trim())
    if (df) params.set('date_from', df)
    if (dt) params.set('date_to', dt)
    if (pkg) params.set('package', pkg)
    if (st) params.set('status', st)
    try {
      const { ok, data } = await apiClient(`/accounting?${params.toString()}`, 'GET')
      if (!ok || !data?.success) {
        const message = data?.message || (data?.errors && typeof data.errors === 'object' ? Object.values(data.errors).flat().join(' ') : '') || 'Unable to load accounting data.'
        setListError(message)
        showToast(message, 'error')
        return
      }
      const st = data.data?.stats || {}
      setStats({
        active_subscriptions: st.active_subscriptions ?? 0,
        cancelled_subscriptions: st.cancelled_subscriptions ?? 0,
        ended_subscriptions: st.ended_subscriptions ?? 0,
        total_earnings: st.total_earnings ?? 0,
        orders_count: st.orders_count ?? 0,
        percent_active: st.percent_active ?? 0,
        percent_cancelled: st.percent_cancelled ?? 0,
        percent_ended: st.percent_ended ?? 0,
      })
      const orders = data.data?.orders || []
      const pagination = data.data?.pagination || {}
      const mapped = orders.map((o) => {
        const u = o.user || {}
        return {
          id: o.id,
          userId: o.user_id,
          fullName: u.full_name || `${u.first_name ?? ''} ${u.last_name ?? ''}`.trim() || u.email || '—',
          email: u.email || '—',
          avatar: u.profile_image_url || '',
          package: o.plan_name || '—',
          date: formatDateTime(o.starts_at),
          subscriptionEndDate: formatDateTime(o.ends_at),
          amount: formatAmount(o.amount),
          status: o.status,
          reference: o.reference || '',
          createdAt: o.created_at ? formatDateTime(o.created_at) : '—',
        }
      })
      setRecords(mapped)
      const total = Number(pagination.total ?? 0)
      const perPageValue = Number(pagination.per_page ?? targetPerPage ?? 10)
      const currentPageValue = Number(pagination.current_page ?? targetPage ?? 1)
      const lastPageValue = Number(pagination.last_page ?? Math.max(1, Math.ceil(total / perPageValue)))
      setTotalRows(total)
      setRowsPerPage(perPageValue)
      setPage(Math.max(0, currentPageValue - 1))
      setTotalPages(lastPageValue || 1)
    } catch {
      setListError('Unable to reach server. Please try again.')
      showToast('Unable to reach server. Please try again.', 'error')
    } finally {
      setListLoading(false)
    }
  }

  useEffect(() => {
    fetchAccounting({ targetPage: 1, targetPerPage: rowsPerPage })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChangePage = (_, newPage) => {
    const value = newPage
    setPage(value - 1)
    fetchAccounting({ targetPage: value, targetPerPage: rowsPerPage })
  }
  const handleChangeRowsPerPage = (e) => {
    const newPerPage = Number(e.target.value)
    setRowsPerPage(newPerPage)
    setPage(0)
    fetchAccounting({ targetPage: 1, targetPerPage: newPerPage })
  }
  const handleSearch = () => {
    setPage(0)
    fetchAccounting({ targetPage: 1, targetPerPage: rowsPerPage })
  }
  const handleReset = () => {
    setSearch('')
    setDateFrom('')
    setDateTo('')
    setPackageFilter('')
    setStatusFilter('')
    setPage(0)
    fetchAccounting({ targetPage: 1, targetPerPage: rowsPerPage, filters: { text: '', date_from: '', date_to: '', package: '', status: '' } })
  }
  const handleViewOpen = (row) => setViewDialog({ open: true, row })
  const handleViewClose = () => setViewDialog({ open: false, row: null })

  const formatEarnings = (val) => {
    const num = Number(val)
    if (Number.isNaN(num)) return '£0'
    if (num >= 1000) return `£${(num / 1000).toFixed(1)}k`
    return `£${num.toFixed(2)}`
  }

  const accountingStats = [
    {
      label: 'Subscription',
      value: String(stats.active_subscriptions),
      sub: 'By status',
      icon: <SubscriptionsRoundedIcon sx={{ fontSize: 32 }} />,
      badges: [
        { label: `Enabled ${stats.active_subscriptions}`, color: theme.palette.success.dark, bgcolor: alpha(theme.palette.success.main, 0.12) },
        { label: `Cancelled ${stats.cancelled_subscriptions}`, color: theme.palette.error.dark, bgcolor: alpha(theme.palette.error.main, 0.12) },
        { label: `Ended ${stats.ended_subscriptions}`, color: theme.palette.grey[700], bgcolor: alpha(theme.palette.grey[600], 0.12) },
      ],
    },
    { label: 'Earnings', value: formatEarnings(stats.total_earnings), sub: 'Total earnings', icon: <TrendingUpRoundedIcon sx={{ fontSize: 32 }} />, badges: null },
    {
      label: 'History',
      value: String(stats.orders_count),
      sub: 'By status',
      icon: <HistoryRoundedIcon sx={{ fontSize: 32 }} />,
      badges: [
        { label: `Active ${stats.percent_active}%`, color: theme.palette.success.dark, bgcolor: alpha(theme.palette.success.main, 0.12) },
        { label: `Ended ${stats.percent_ended}%`, color: theme.palette.grey[700], bgcolor: alpha(theme.palette.grey[600], 0.12) },
        { label: `Cancelled ${stats.percent_cancelled}%`, color: theme.palette.error.dark, bgcolor: alpha(theme.palette.error.main, 0.12) },
      ],
    },
  ]

  const handlePrintSlip = (row) => {
    const doc = new jsPDF()
    const primary = hexToRgb(ADMIN_PRIMARY)
    const border = hexToRgb(theme.palette.grey[300])
    doc.setFontSize(14)
    doc.text('Payment / Subscription Slip', 14, 16)
    doc.setFontSize(10)
    doc.text(`Date: ${row.date}`, 14, 24)
    doc.text(`Subscription end: ${row.subscriptionEndDate}`, 14, 30)
    autoTable(doc, {
      startY: 36,
      head: [['User', 'Email', 'Package', 'Amount']],
      body: [[row.fullName, row.email, row.package, row.amount]],
      styles: { fontSize: 9, cellPadding: 4, lineColor: border, lineWidth: 0.15 },
      headStyles: { fillColor: primary, textColor: [255, 255, 255], fontStyle: 'bold' },
      margin: { left: 12, right: 12 },
    })
    doc.save(`slip-${row.id}-${row.fullName.replace(/\s+/g, '-')}.pdf`)
  }

  const listLabel = 'Earnings & order history'

  return (
    <Box sx={{ width: '100%', minWidth: 0, maxWidth: 1400, mx: 'auto', overflowX: 'hidden' }}>
      <Box sx={{ mb: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 0.25 }}>
          <AccountBalanceRoundedIcon sx={{ fontSize: { xs: 28, sm: 32 }, color: ADMIN_PRIMARY }} />
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
            Accounting
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
          Subscriptions, earnings and order history
        </Typography>
      </Box>

      {/* Quick view one-liner cards — same style as Dashboard; single row on mobile */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: { xs: 'nowrap', sm: 'wrap' },
          gap: { xs: 1, sm: 2 },
          mb: { xs: 2, sm: 3 },
          overflowX: { xs: 'auto', sm: 'visible' },
          pb: { xs: 0.5, sm: 0 },
          mx: { xs: -0.5, sm: 0 },
        }}
      >
        {accountingStats.map((stat) => (
          <Box
            key={stat.label}
            sx={{
              minWidth: 0,
              flex: { xs: '1 1 0', sm: '1 1 calc(50% - 8px)', md: '0 1 calc(33.333% - 14px)' },
              maxWidth: { xs: 'none', sm: 'calc(50% - 8px)', md: 'calc(33.333% - 14px)' },
            }}
          >
            <Card
              elevation={0}
              sx={{
                width: '100%',
                height: '100%',
                minHeight: { xs: 120, sm: 160 },
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
                  background: adminGradient,
                },
                '&:hover': {
                  boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                  transform: 'translateY(-4px)',
                  borderColor: 'transparent',
                  '& .stat-icon': { transform: 'scale(1.1) rotate(5deg)' },
                  '& .stat-arrow': { transform: 'translateX(4px)', opacity: 1 },
                },
              }}
            >
              <CardContent sx={{ p: { xs: 1.25, sm: 2.5 }, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', '&:last-child': { pb: { xs: 1.25, sm: 2.5 } } }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 'auto' }}>
                  <Box
                    className="stat-icon"
                    sx={{
                      width: { xs: 40, sm: 64 },
                      height: { xs: 40, sm: 64 },
                      borderRadius: '7px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: adminGradient,
                      color: 'white',
                      flexShrink: 0,
                      transition: 'transform 0.3s ease',
                      boxShadow: `0 8px 16px ${alpha(ADMIN_PRIMARY, 0.3)}`,
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <ArrowForwardRoundedIcon sx={{ fontSize: { xs: 16, sm: 20 }, color: 'text.secondary', opacity: 0.5, transition: 'all 0.3s ease', flexShrink: 0 }} className="stat-arrow" />
                </Box>
                <Box sx={{ mt: { xs: 1, sm: 2 }, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mb: 0.25, flexWrap: 'wrap' }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '1.125rem', sm: '2rem' }, lineHeight: 1 }}>
                      {stat.value}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600, mb: 0.5, fontSize: { xs: '0.75rem', sm: '0.9375rem' }, lineHeight: 1.2 }} noWrap>
                    {stat.label}
                  </Typography>
                  {stat.badges && stat.badges.length > 0 ? (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mt: 0.5 }}>
                      {stat.badges.map((badge, idx) => (
                        <Chip
                          key={idx}
                          label={badge.label}
                          size="small"
                          sx={{
                            height: 22,
                            fontSize: '0.6875rem',
                            fontWeight: 700,
                            borderRadius: '7px',
                            border: 'none',
                            bgcolor: badge.bgcolor,
                            color: badge.color,
                          }}
                        />
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: { xs: '0.65rem', sm: '0.8125rem' }, lineHeight: 1.2 }} display="block">
                      {stat.sub}
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      {/* Filters — single row */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 1.5, sm: 2 },
          mb: 2,
          borderRadius: '7px',
          border: '1px solid',
          borderColor: alpha(ADMIN_PRIMARY, 0.12),
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
          <TextField
            size="small"
            placeholder="Search text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
            sx={{
              flex: { xs: '1 1 100%', sm: '1 1 140px', md: '1 1 180px' },
              minWidth: { xs: 0, sm: 120 },
              maxWidth: { sm: 200, md: 240 },
              '& .MuiOutlinedInput-root': {
                bgcolor: theme.palette.grey[50],
                borderRadius: '7px',
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: alpha(ADMIN_PRIMARY, 0.3) },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: ADMIN_PRIMARY, borderWidth: 2 },
              },
              '& .MuiInputLabel-root.Mui-focused': { color: ADMIN_PRIMARY },
            }}
          />
          <TextField
            size="small"
            label="Date from"
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{
              flex: { xs: '1 1 100%', sm: '0 0 140px' },
              minWidth: { xs: 0, sm: 140 },
              '& .MuiOutlinedInput-root': { bgcolor: theme.palette.grey[50], borderRadius: '7px' },
              '& .MuiInputLabel-root.Mui-focused': { color: ADMIN_PRIMARY },
            }}
          />
          <TextField
            size="small"
            label="Date to"
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{
              flex: { xs: '1 1 100%', sm: '0 0 140px' },
              minWidth: { xs: 0, sm: 140 },
              '& .MuiOutlinedInput-root': { bgcolor: theme.palette.grey[50], borderRadius: '7px' },
              '& .MuiInputLabel-root.Mui-focused': { color: ADMIN_PRIMARY },
            }}
          />
          <FormControl
            size="small"
            sx={{
              minWidth: { xs: '100%', sm: 100 },
              flex: { xs: '1 1 100%', sm: '0 0 auto' },
              flexShrink: 0,
              '& .MuiOutlinedInput-root': { bgcolor: theme.palette.grey[50], borderRadius: '7px' },
              '& .MuiInputLabel-root.Mui-focused': { color: ADMIN_PRIMARY },
            }}
          >
            <InputLabel id="package-filter-label">Package</InputLabel>
            <Select labelId="package-filter-label" value={packageFilter} label="Package" onChange={(e) => setPackageFilter(e.target.value)}>
              {PACKAGE_OPTIONS.map((p) => (
                <MenuItem key={p || 'all'} value={p}>{p || 'All'}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl
            size="small"
            sx={{
              minWidth: { xs: '100%', sm: 110 },
              flex: { xs: '1 1 100%', sm: '0 0 auto' },
              flexShrink: 0,
              '& .MuiOutlinedInput-root': { bgcolor: theme.palette.grey[50], borderRadius: '7px' },
              '& .MuiInputLabel-root.Mui-focused': { color: ADMIN_PRIMARY },
            }}
          >
            <InputLabel id="status-filter-label">Status</InputLabel>
            <Select labelId="status-filter-label" value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
              {STATUS_OPTIONS.map((opt) => (
                <MenuItem key={opt.value || 'all'} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', sm: 'auto' }, flex: { xs: '1 1 100%', sm: '0 0 auto' }, flexShrink: 0, flexWrap: 'nowrap' }}>
            <Button
              variant="contained"
              size="small"
              startIcon={<SearchRoundedIcon sx={{ fontSize: 18 }} />}
              onClick={handleSearch}
              sx={{
                flex: { xs: 1, sm: '0 0 auto' },
                bgcolor: ADMIN_PRIMARY,
                borderRadius: '7px',
                px: 1.5,
                py: 1,
                fontWeight: 600,
                fontSize: '0.8125rem',
                whiteSpace: 'nowrap',
                minWidth: 'unset',
                '&:hover': { bgcolor: ADMIN_PRIMARY_DARK },
              }}
            >
              Search
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<RefreshRoundedIcon sx={{ fontSize: 18 }} />}
              onClick={handleReset}
              sx={{
                flex: { xs: 1, sm: '0 0 auto' },
                borderColor: theme.palette.grey[300],
                color: 'text.primary',
                borderRadius: '7px',
                fontWeight: 600,
                fontSize: '0.8125rem',
                px: 1.5,
                py: 1,
                whiteSpace: 'nowrap',
                minWidth: 'unset',
                '&:hover': { borderColor: ADMIN_PRIMARY, bgcolor: alpha(ADMIN_PRIMARY, 0.04) },
              }}
            >
              Reset
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Table section */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: '7px',
          border: '1px solid',
          borderColor: alpha(ADMIN_PRIMARY, 0.12),
          overflow: 'hidden',
          overflowX: { xs: 'hidden', md: 'visible' },
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Box
          sx={{
            px: { xs: 1.5, sm: 2 },
            py: 1.5,
            borderBottom: '1px solid',
            borderColor: theme.palette.grey[200],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
            {listLabel}
          </Typography>
        </Box>

        {!showAsCards && (
          <TableContainer>
            <Table size="medium" stickyHeader>
              <TableHead>
                <TableRow
                  sx={{
                    bgcolor: alpha(ADMIN_PRIMARY, 0.06),
                    '& .MuiTableCell-head': {
                      fontWeight: 700,
                      color: 'text.primary',
                      borderColor: theme.palette.grey[200],
                      py: 1.5,
                      fontSize: '0.8125rem',
                    },
                  }}
                >
                  <TableCell>User</TableCell>
                  <TableCell>Package</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {listLoading
                  ? Array.from({ length: SKELETON_ROW_COUNT }).map((_, idx) => (
                      <TableRow key={`skeleton-${idx}`} sx={{ '& .MuiTableCell-body': { borderColor: theme.palette.grey[200], py: 1.5 } }}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Skeleton variant="circular" width={40} height={40} />
                            <Box>
                              <Skeleton variant="text" width={120} sx={{ borderRadius: 1 }} />
                              <Skeleton variant="text" width={160} sx={{ borderRadius: 1 }} />
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell><Skeleton variant="rounded" width={80} height={24} sx={{ borderRadius: '7px' }} /></TableCell>
                        <TableCell><Skeleton variant="rounded" width={72} height={24} sx={{ borderRadius: '7px' }} /></TableCell>
                        <TableCell><Skeleton variant="text" width={120} sx={{ borderRadius: 1 }} /></TableCell>
                        <TableCell><Skeleton variant="text" width={60} sx={{ borderRadius: 1 }} /></TableCell>
                        <TableCell align="right"><Skeleton variant="circular" width={32} height={32} /></TableCell>
                      </TableRow>
                    ))
                  : records.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                            <ViewListRoundedIcon sx={{ fontSize: 40, color: alpha(ADMIN_PRIMARY, 0.4) }} />
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary' }}>No orders found.</Typography>
                            <Typography variant="body2" sx={{ color: 'text.disabled', maxWidth: 320 }}>Use the filters above or try a different date range.</Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )
                  : records.map((row) => (
                  <TableRow
                    key={row.id}
                    hover
                    sx={{
                      '&:hover': { bgcolor: alpha(ADMIN_PRIMARY, 0.04) },
                      '& .MuiTableCell-body': { borderColor: theme.palette.grey[200], py: 1.5, fontSize: '0.875rem' },
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar
                          src={row.avatar}
                          alt={row.fullName}
                          onClick={() => row.avatar && setImagePreview({ open: true, src: row.avatar, alt: row.fullName, title: row.fullName })}
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '7px',
                            cursor: row.avatar ? 'pointer' : 'default',
                            bgcolor: alpha(ADMIN_PRIMARY, 0.12),
                            color: ADMIN_PRIMARY,
                            '&:hover': row.avatar ? { opacity: 0.9, boxShadow: `0 2px 8px ${alpha(ADMIN_PRIMARY, 0.3)}` } : undefined,
                          }}
                        >
                          {(row.fullName || row.email || 'U').charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }} noWrap>
                            {row.fullName}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap display="block">
                            {row.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.package}
                        size="small"
                        sx={{
                          height: 24,
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          bgcolor: alpha(getSubscriptionColor(row.package, theme, ADMIN_PRIMARY, ADMIN_PRIMARY_DARK), 0.12),
                          color: getSubscriptionColor(row.package, theme, ADMIN_PRIMARY, ADMIN_PRIMARY_DARK),
                          borderRadius: '7px',
                          border: 'none',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.status || '—'}
                        size="small"
                        sx={{
                          height: 24,
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          borderRadius: '7px',
                          border: 'none',
                          ...getStatusChipStyle(row.status, theme, ADMIN_PRIMARY),
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem', lineHeight: 1.2 }} noWrap title={row.date}>
                          <strong>Start:</strong> {row.date}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem', lineHeight: 1.2 }} noWrap title={row.subscriptionEndDate}>
                          <strong>End:</strong> {row.subscriptionEndDate}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        {row.amount}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Print slip" placement="top" arrow>
                        <IconButton
                          size="small"
                          onClick={() => handlePrintSlip(row)}
                          sx={{
                            color: theme.palette.grey[600],
                            '&:hover': { color: ADMIN_PRIMARY, bgcolor: alpha(ADMIN_PRIMARY, 0.08) },
                          }}
                        >
                          <PrintRoundedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="View details" placement="top" arrow>
                        <IconButton
                          size="small"
                          onClick={() => handleViewOpen(row)}
                          sx={{
                            color: theme.palette.info.main,
                            ml: 0.5,
                            '&:hover': { color: theme.palette.info.dark, bgcolor: alpha(theme.palette.info.main, 0.12) },
                          }}
                        >
                          <VisibilityRoundedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {showAsCards && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 1.5 }, p: { xs: 2, sm: 2 }, pb: 2, overflowX: 'hidden' }}>
            {listLoading
              ? Array.from({ length: SKELETON_ROW_COUNT }).map((_, idx) => (
                  <Paper key={`skeleton-${idx}`} elevation={0} sx={{ p: 2, borderRadius: '7px', border: '1px solid', borderColor: theme.palette.grey[200] }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Skeleton variant="rectangular" width={48} height={48} sx={{ borderRadius: '7px' }} />
                      <Box sx={{ flex: 1 }}>
                        <Skeleton variant="text" width="60%" />
                        <Skeleton variant="text" width="80%" />
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Skeleton variant="rounded" width={80} height={26} sx={{ borderRadius: '7px' }} />
                      <Skeleton variant="text" width={100} />
                      <Skeleton variant="text" width={60} />
                    </Box>
                  </Paper>
                ))
              : records.length === 0 ? (
                  <Box sx={{ py: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                    <ViewListRoundedIcon sx={{ fontSize: 40, color: alpha(ADMIN_PRIMARY, 0.4) }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary' }}>No orders found.</Typography>
                    <Typography variant="body2" sx={{ color: 'text.disabled' }}>Use the filters above or try a different date range.</Typography>
                  </Box>
                )
              : records.map((row) => (
              <Paper
                key={row.id}
                elevation={0}
                sx={{
                  p: { xs: 2.5, sm: 2 },
                  borderRadius: '7px',
                  border: '1px solid',
                  borderColor: { xs: alpha(ADMIN_PRIMARY, 0.2), sm: theme.palette.grey[200] },
                  bgcolor: theme.palette.background.paper,
                  transition: 'all 0.2s ease',
                  overflow: 'hidden',
                  ...(isMobile && {
                    boxShadow: `0 2px 12px ${alpha(ADMIN_PRIMARY, 0.06)}`,
                    '&:active': { borderColor: ADMIN_PRIMARY, boxShadow: `0 4px 20px ${alpha(ADMIN_PRIMARY, 0.12)}` },
                  }),
                  '&:hover': { borderColor: alpha(ADMIN_PRIMARY, 0.35), boxShadow: `0 4px 20px ${alpha(ADMIN_PRIMARY, 0.1)}` },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1.5, mb: 2, pb: 2, borderBottom: '1px solid', borderColor: theme.palette.divider }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, sm: 1.5 }, minWidth: 0, flex: 1 }}>
                    <Avatar
                      src={row.avatar}
                      alt={row.fullName}
                      onClick={() => row.avatar && setImagePreview({ open: true, src: row.avatar, alt: row.fullName, title: row.fullName })}
                      sx={{
                        width: { xs: 56, sm: 48 },
                        height: { xs: 56, sm: 48 },
                        borderRadius: '7px',
                        flexShrink: 0,
                        cursor: row.avatar ? 'pointer' : 'default',
                        bgcolor: alpha(ADMIN_PRIMARY, 0.12),
                        color: ADMIN_PRIMARY,
                        border: `2px solid ${alpha(ADMIN_PRIMARY, 0.2)}`,
                        '&:hover': row.avatar ? { opacity: 0.9, boxShadow: `0 4px 12px ${alpha(ADMIN_PRIMARY, 0.25)}` } : undefined,
                      }}
                    >
                      {(row.fullName || row.email || 'U').charAt(0)}
                    </Avatar>
                    <Box sx={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
                      <Typography variant="subtitle1" noWrap sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '1rem', sm: '0.875rem' } }}>
                        {row.fullName}
                      </Typography>
                      <Typography variant="body2" noWrap sx={{ color: 'text.secondary', fontSize: { xs: '0.9375rem', sm: '0.875rem' }, mt: 0.5 }}>
                        {row.email}
                      </Typography>
                    </Box>
                  </Box>
                  {/* Buttons next to name: only on sm+ (tablet card view), hidden on mobile */}
                  <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', flexShrink: 0, gap: 0.25 }}>
                    <Tooltip title="Print slip" placement="top" arrow>
                      <IconButton size="medium" onClick={() => handlePrintSlip(row)} sx={{ color: theme.palette.grey[600], '&:hover': { color: ADMIN_PRIMARY, bgcolor: alpha(ADMIN_PRIMARY, 0.1) } }}>
                        <PrintRoundedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="View details" placement="top" arrow>
                      <IconButton size="medium" onClick={() => handleViewOpen(row)} sx={{ color: theme.palette.info.main, '&:hover': { color: theme.palette.info.dark, bgcolor: alpha(theme.palette.info.main, 0.15) } }}>
                        <VisibilityRoundedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.5 }}>
                  <Chip
                    label={row.package}
                    size="small"
                    sx={{
                      height: { xs: 28, sm: 26 },
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      bgcolor: alpha(getSubscriptionColor(row.package, theme, ADMIN_PRIMARY, ADMIN_PRIMARY_DARK), 0.12),
                      color: getSubscriptionColor(row.package, theme, ADMIN_PRIMARY, ADMIN_PRIMARY_DARK),
                      borderRadius: '7px',
                      border: 'none',
                    }}
                  />
                  <Chip
                    label={row.status || '—'}
                    size="small"
                    sx={{
                      height: { xs: 28, sm: 26 },
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      borderRadius: '7px',
                      border: 'none',
                      ...getStatusChipStyle(row.status, theme, ADMIN_PRIMARY),
                    }}
                  />
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem' }}>Start: {row.date}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem' }}>End: {row.subscriptionEndDate}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>{row.amount}</Typography>
                </Box>
                {/* Mobile only: Print & View details at end of card, right-aligned */}
                <Box sx={{ display: { xs: 'flex', sm: 'none' }, justifyContent: 'flex-end', alignItems: 'center', gap: 0.25, mt: 2, pt: 2, borderTop: '1px solid', borderColor: theme.palette.divider }}>
                  <Tooltip title="Print slip" placement="top" arrow>
                    <IconButton size="large" onClick={() => handlePrintSlip(row)} sx={{ color: theme.palette.grey[600], bgcolor: theme.palette.grey[100], '&:hover': { color: ADMIN_PRIMARY, bgcolor: alpha(ADMIN_PRIMARY, 0.1) } }}>
                      <PrintRoundedIcon fontSize="medium" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="View details" placement="top" arrow>
                    <IconButton size="large" onClick={() => handleViewOpen(row)} sx={{ color: theme.palette.info.main, bgcolor: alpha(theme.palette.info.main, 0.08), '&:hover': { color: theme.palette.info.dark, bgcolor: alpha(theme.palette.info.main, 0.15) } }}>
                      <VisibilityRoundedIcon fontSize="medium" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Paper>
            ))}
          </Box>
        )}

        {/* Pagination: compact on mobile, full on desktop */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            flexWrap: 'wrap',
            alignItems: { xs: 'center', sm: 'center' },
            justifyContent: 'space-between',
            gap: { xs: 1.5, sm: 2 },
            px: { xs: 1.5, sm: 2 },
            py: { xs: 1.75, sm: 2 },
            borderTop: '1px solid',
            borderColor: theme.palette.grey[200],
            bgcolor: alpha(ADMIN_PRIMARY, 0.02),
            borderRadius: { xs: '0 0 7px 7px', sm: 0 },
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: { xs: 'center', sm: 'flex-start' }, gap: { xs: 1, sm: 1.5 }, width: { xs: '100%', sm: 'auto' }, minWidth: 0 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: { xs: '0.8125rem', sm: '0.875rem' }, flexShrink: 0 }}>Rows per page</Typography>
            <FormControl size="small" variant="outlined" sx={{ minWidth: 72, flexShrink: 0 }}>
              <Select
                value={rowsPerPage}
                onChange={handleChangeRowsPerPage}
                sx={{
                  height: { xs: 36, sm: 36 },
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  borderRadius: '7px',
                  bgcolor: theme.palette.background.paper,
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.grey[300] },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: ADMIN_PRIMARY },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: ADMIN_PRIMARY, borderWidth: 2 },
                }}
              >
                {ROWS_PER_PAGE_OPTIONS.map((opt) => (
                  <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: { xs: '0.8125rem', sm: '0.875rem' }, flexShrink: 0 }}>
              {totalRows === 0 ? '0–0 of 0' : `${from}–${to} of ${totalRows}`}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', alignItems: 'center', justifyContent: { xs: 'center', sm: 'flex-end' }, gap: { xs: 1, sm: 1.5 }, width: { xs: '100%', sm: 'auto' }, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
              <ViewListRoundedIcon sx={{ color: ADMIN_PRIMARY, fontSize: { xs: 18, sm: 22 } }} />
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.75rem' } }}>Page {page + 1} of {totalPages}</Typography>
            </Box>
            <Pagination
              count={totalPages}
              page={page + 1}
              onChange={(_, value) => handleChangePage(null, value)}
              size="small"
              showFirstButton
              showLastButton
              sx={{
                '& .MuiPaginationItem-root': {
                  fontWeight: 600,
                  fontSize: '0.8125rem',
                  borderRadius: '7px',
                  minWidth: 32,
                  height: 32,
                  color: ADMIN_PRIMARY,
                },
                '& .MuiPaginationItem-page.Mui-selected': {
                  background: `linear-gradient(135deg, ${ADMIN_PRIMARY}, ${ADMIN_PRIMARY_DARK})`,
                  color: '#fff',
                  boxShadow: `0 2px 6px ${alpha(ADMIN_PRIMARY, 0.35)}`,
                  fontSize: '0.8125rem',
                  minWidth: 32,
                  height: 32,
                  '&:hover': { background: `linear-gradient(135deg, ${ADMIN_PRIMARY_LIGHT}, ${ADMIN_PRIMARY})` },
                },
                '& .MuiPaginationItem-page:not(.Mui-selected):hover': { backgroundColor: alpha(ADMIN_PRIMARY, 0.1), color: ADMIN_PRIMARY },
                '& .MuiPaginationItem-icon': { color: ADMIN_PRIMARY, fontSize: 20 },
              }}
            />
          </Box>
        </Box>
      </Paper>

      {/* View details dialog — style from AdminCoursesExamType */}
      <Dialog
        open={viewDialog.open}
        onClose={handleViewClose}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Slide}
        TransitionProps={{ direction: 'up' }}
        sx={{ ...(isMobile && { '& .MuiDialog-container': { alignItems: 'flex-end', justifyContent: 'center' } }) }}
        PaperProps={{
          sx: {
            margin: isMobile ? 0 : 24,
            maxHeight: isMobile ? '90vh' : 'calc(100vh - 48px)',
            width: isMobile ? '100%' : undefined,
            maxWidth: isMobile ? '100%' : undefined,
            borderRadius: isMobile ? '24px 24px 0 0' : '7px',
            border: '1px solid',
            borderColor: alpha(ADMIN_PRIMARY, 0.25),
            borderBottom: isMobile ? 'none' : undefined,
            boxShadow: isMobile ? `0 -8px 32px rgba(15, 23, 42, 0.2), 0 -4px 16px ${alpha(ADMIN_PRIMARY, 0.08)}` : `0 12px 40px ${alpha(ADMIN_PRIMARY, 0.15)}`,
            bgcolor: theme.palette.background.paper,
            overflow: 'hidden',
            position: 'relative',
            '&::before': isMobile ? { content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: 5, background: `linear-gradient(90deg, ${ADMIN_PRIMARY} 0%, ${ADMIN_PRIMARY_LIGHT} 100%)` } : undefined,
          },
        }}
        slotProps={{ backdrop: { sx: { bgcolor: alpha(theme.palette.common.black, 0.65), backdropFilter: 'blur(6px)' } } }}
      >
        {isMobile && (
          <Box sx={{ pt: 1.5, pb: 0.5, display: 'flex', justifyContent: 'center', flexShrink: 0, bgcolor: alpha(ADMIN_PRIMARY, 0.02), borderBottom: '1px solid', borderColor: alpha(ADMIN_PRIMARY, 0.1) }}>
            <Box sx={{ width: 40, height: 4, borderRadius: 2, bgcolor: theme.palette.grey[400] }} />
          </Box>
        )}
        <DialogTitle sx={{ fontWeight: 700, color: 'text.primary', borderBottom: '1px solid', borderColor: theme.palette.divider, py: 2, px: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
            <Box sx={{ width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, bgcolor: alpha(ADMIN_PRIMARY, 0.12), color: ADMIN_PRIMARY }}>
              <AccountBalanceRoundedIcon sx={{ fontSize: 24 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>View details</Typography>
          </Box>
          <IconButton size="small" onClick={handleViewClose} sx={{ color: theme.palette.grey[600], flexShrink: 0, '&:hover': { color: ADMIN_PRIMARY, bgcolor: alpha(ADMIN_PRIMARY, 0.08) } }}>
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ px: { xs: 2, sm: 3 }, pt: 0, pb: 3, overflow: 'auto', maxHeight: 'calc(100vh - 180px)' }}>
          {viewDialog.row && (
            <Box sx={{ pt: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {/* User */}
              <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: 1 }}>User</Typography>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: '7px',
                  border: '1px solid',
                  borderColor: alpha(ADMIN_PRIMARY, 0.15),
                  bgcolor: alpha(ADMIN_PRIMARY, 0.04),
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Avatar
                  src={viewDialog.row.avatar}
                  alt={viewDialog.row.fullName}
                  onClick={() => { setImagePreview({ open: true, src: viewDialog.row.avatar, alt: viewDialog.row.fullName, title: viewDialog.row.fullName }); handleViewClose(); }}
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '7px',
                    cursor: viewDialog.row.avatar ? 'pointer' : 'default',
                    bgcolor: alpha(ADMIN_PRIMARY, 0.12),
                    color: ADMIN_PRIMARY,
                    '&:hover': viewDialog.row.avatar ? { opacity: 0.9, boxShadow: 2 } : undefined,
                  }}
                >
                  {(viewDialog.row.fullName || viewDialog.row.email || 'U').charAt(0)}
                </Avatar>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '1rem' }}>{viewDialog.row.fullName}</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem', mt: 0.25 }}>{viewDialog.row.email}</Typography>
                  {viewDialog.row.userId && (
                    <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.75rem', mt: 0.25, display: 'block' }}>User ID: {viewDialog.row.userId}</Typography>
                  )}
                </Box>
              </Paper>

              {/* Order details */}
              <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: 1 }}>Order details</Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap: 1.5,
                }}
              >
                <Paper elevation={0} sx={{ p: 1.5, borderRadius: '7px', border: '1px solid', borderColor: theme.palette.grey[200], bgcolor: theme.palette.grey[50] }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>Order ID</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', mt: 0.5 }}>#{viewDialog.row.id}</Typography>
                </Paper>
                <Paper elevation={0} sx={{ p: 1.5, borderRadius: '7px', border: '1px solid', borderColor: theme.palette.grey[200], bgcolor: theme.palette.grey[50] }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>Package</Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip label={viewDialog.row.package} size="small" sx={{ height: 26, fontSize: '0.8125rem', fontWeight: 600, bgcolor: alpha(getSubscriptionColor(viewDialog.row.package, theme, ADMIN_PRIMARY, ADMIN_PRIMARY_DARK), 0.12), color: getSubscriptionColor(viewDialog.row.package, theme, ADMIN_PRIMARY, ADMIN_PRIMARY_DARK), borderRadius: '7px', border: 'none' }} />
                  </Box>
                </Paper>
                <Paper elevation={0} sx={{ p: 1.5, borderRadius: '7px', border: '1px solid', borderColor: theme.palette.grey[200], bgcolor: theme.palette.grey[50] }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>Status</Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip label={viewDialog.row.status || '—'} size="small" sx={{ height: 26, fontSize: '0.8125rem', fontWeight: 600, borderRadius: '7px', border: 'none', ...getStatusChipStyle(viewDialog.row.status, theme, ADMIN_PRIMARY) }} />
                  </Box>
                </Paper>
                <Paper elevation={0} sx={{ p: 1.5, borderRadius: '7px', border: '1px solid', borderColor: theme.palette.grey[200], bgcolor: theme.palette.grey[50] }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>Start date</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary', mt: 0.5, fontSize: '0.8125rem' }}>{viewDialog.row.date}</Typography>
                </Paper>
                <Paper elevation={0} sx={{ p: 1.5, borderRadius: '7px', border: '1px solid', borderColor: theme.palette.grey[200], bgcolor: theme.palette.grey[50] }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>End date</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary', mt: 0.5, fontSize: '0.8125rem' }}>{viewDialog.row.subscriptionEndDate}</Typography>
                </Paper>
                <Paper elevation={0} sx={{ p: 1.5, borderRadius: '7px', border: '1px solid', borderColor: theme.palette.grey[200], bgcolor: theme.palette.grey[50] }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>Order date</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary', mt: 0.5, fontSize: '0.8125rem' }}>{viewDialog.row.createdAt || '—'}</Typography>
                </Paper>
                {viewDialog.row.reference ? (
                  <Paper elevation={0} sx={{ p: 1.5, borderRadius: '7px', border: '1px solid', borderColor: theme.palette.grey[200], bgcolor: theme.palette.grey[50], gridColumn: { xs: '1', sm: '1 / -1' } }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>Reference</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary', mt: 0.5, fontSize: '0.8125rem', fontFamily: 'monospace' }}>{viewDialog.row.reference}</Typography>
                  </Paper>
                ) : null}
                <Paper elevation={0} sx={{ p: 1.5, borderRadius: '7px', border: '1px solid', borderColor: alpha(ADMIN_PRIMARY, 0.35), bgcolor: alpha(ADMIN_PRIMARY, 0.06), gridColumn: { xs: '1', sm: '1 / -1' } }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>Amount</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: ADMIN_PRIMARY, mt: 0.5 }}>{viewDialog.row.amount}</Typography>
                </Paper>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2.5, pt: 2, pb: { xs: 'max(20px, env(safe-area-inset-bottom))', sm: 2.5 }, borderTop: '1px solid', borderColor: theme.palette.divider, gap: 1 }}>
          <Button variant="contained" onClick={handleViewClose} sx={{ bgcolor: ADMIN_PRIMARY, borderRadius: '7px', fontWeight: 600, px: 2.5, '&:hover': { bgcolor: ADMIN_PRIMARY_DARK } }}>Close</Button>
        </DialogActions>
      </Dialog>

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

export default AdminAccounting
