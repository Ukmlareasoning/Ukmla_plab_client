import { useState } from 'react'
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

const ROWS_PER_PAGE_OPTIONS = [5, 10, 20, 30, 40, 50, 100]

const PACKAGE_OPTIONS = ['', 'Premium', 'Standard', 'Free Trial']

const primaryGradient = 'linear-gradient(135deg, #0D9488 0%, #14B8A6 100%)'

// Quick view one-liner cards (dashboard style)
const accountingStats = [
  { label: 'Subscription', value: '432', sub: 'Active subscriptions', trend: '+8%', trendUp: true, icon: <SubscriptionsRoundedIcon sx={{ fontSize: 32 }} /> },
  { label: 'Earnings', value: '£12.4k', sub: 'Month to date', trend: '+22%', trendUp: true, icon: <TrendingUpRoundedIcon sx={{ fontSize: 32 }} /> },
  { label: 'History', value: '1,089', sub: 'Orders this month', trend: '+15%', trendUp: true, icon: <HistoryRoundedIcon sx={{ fontSize: 32 }} /> },
]

// Dummy records: user, package, date, subscription end date, amount
const STATIC_RECORDS = [
  { id: 1, fullName: 'Sarah Johnson', email: 'sarah.johnson@email.com', avatar: 'https://i.pravatar.cc/80?img=1', package: 'Premium', date: '1 January 2026 12:15 PM', subscriptionEndDate: '1 April 2026 11:59 PM', amount: '£49.99' },
  { id: 2, fullName: 'James Wilson', email: 'james.wilson@email.com', avatar: 'https://i.pravatar.cc/80?img=2', package: 'Standard', date: '4 January 2026 09:30 AM', subscriptionEndDate: '4 April 2026 11:59 PM', amount: '£29.99' },
  { id: 3, fullName: 'Emma Davis', email: 'emma.davis@email.com', avatar: 'https://i.pravatar.cc/80?img=3', package: 'Free Trial', date: '9 January 2026 05:45 PM', subscriptionEndDate: '23 January 2026 11:59 PM', amount: '£0' },
  { id: 4, fullName: 'Michael Brown', email: 'michael.b@email.com', avatar: 'https://i.pravatar.cc/80?img=4', package: 'Premium', date: '12 January 2026 08:10 AM', subscriptionEndDate: '12 April 2026 11:59 PM', amount: '£49.99' },
  { id: 5, fullName: 'Olivia Martinez', email: 'olivia.m@email.com', avatar: 'https://i.pravatar.cc/80?img=5', package: 'Standard', date: '18 January 2026 11:20 AM', subscriptionEndDate: '18 April 2026 11:59 PM', amount: '£29.99' },
  { id: 6, fullName: 'William Taylor', email: 'william.t@email.com', avatar: 'https://i.pravatar.cc/80?img=6', package: 'Premium', date: '21 January 2026 02:05 PM', subscriptionEndDate: '21 April 2026 11:59 PM', amount: '£49.99' },
  { id: 7, fullName: 'Sophie Anderson', email: 'sophie.a@email.com', avatar: 'https://i.pravatar.cc/80?img=7', package: 'Free Trial', date: '28 January 2026 06:40 PM', subscriptionEndDate: '11 February 2026 11:59 PM', amount: '£0' },
  { id: 8, fullName: 'Daniel Thomas', email: 'daniel.t@email.com', avatar: 'https://i.pravatar.cc/80?img=8', package: 'Standard', date: '2 February 2026 10:00 AM', subscriptionEndDate: '2 May 2026 11:59 PM', amount: '£29.99' },
  { id: 9, fullName: 'Isabella Jackson', email: 'isabella.j@email.com', avatar: 'https://i.pravatar.cc/80?img=9', package: 'Premium', date: '5 February 2026 03:30 PM', subscriptionEndDate: '5 May 2026 11:59 PM', amount: '£49.99' },
  { id: 10, fullName: 'Benjamin White', email: 'benjamin.w@email.com', avatar: 'https://i.pravatar.cc/80?img=10', package: 'Standard', date: '8 February 2026 09:15 AM', subscriptionEndDate: '8 May 2026 11:59 PM', amount: '£29.99' },
]

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

  const [search, setSearch] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [packageFilter, setPackageFilter] = useState('')
  const [records] = useState(STATIC_RECORDS)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [viewDialog, setViewDialog] = useState({ open: false, row: null })
  const [imagePreview, setImagePreview] = useState({ open: false, src: '', alt: '', title: '' })

  const filtered = records.filter((row) => {
    const matchSearch = !search || row.fullName.toLowerCase().includes(search.toLowerCase()) || row.email.toLowerCase().includes(search.toLowerCase())
    const matchPackage = !packageFilter || row.package === packageFilter
    return matchSearch && matchPackage
  })

  const totalRows = filtered.length
  const totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage))
  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  const from = totalRows === 0 ? 0 : page * rowsPerPage + 1
  const to = Math.min(page * rowsPerPage + rowsPerPage, totalRows)

  const handleChangePage = (_, newPage) => setPage(newPage)
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(Number(e.target.value))
    setPage(0)
  }
  const handleSearch = () => {}
  const handleReset = () => {
    setSearch('')
    setDateFrom('')
    setDateTo('')
    setPackageFilter('')
  }
  const handleViewOpen = (row) => setViewDialog({ open: true, row })
  const handleViewClose = () => setViewDialog({ open: false, row: null })

  const handlePrintSlip = (row) => {
    const doc = new jsPDF()
    const primary = hexToRgb(theme.palette.primary.main)
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
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
          Accounting
        </Typography>
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
                  background: primaryGradient,
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
                      borderRadius: 2.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: primaryGradient,
                      color: 'white',
                      flexShrink: 0,
                      transition: 'transform 0.3s ease',
                      boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
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
                    {stat.trendUp && (
                      <Chip
                        label={stat.trend}
                        size="small"
                        sx={{ height: 20, fontSize: '0.6875rem', fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.15), color: theme.palette.primary.dark, border: 'none' }}
                      />
                    )}
                  </Box>
                  <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600, mb: 0, fontSize: { xs: '0.75rem', sm: '0.9375rem' }, lineHeight: 1.2 }} noWrap>
                    {stat.label}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: { xs: '0.65rem', sm: '0.8125rem' }, lineHeight: 1.2 }} display="block">
                    {stat.sub}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      {/* Filters */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 1.5, sm: 2 },
          mb: 2,
          borderRadius: 2,
          border: '1px solid',
          borderColor: alpha(theme.palette.primary.main, 0.12),
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
                borderRadius: 2,
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: alpha(theme.palette.primary.main, 0.3) },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.primary.main, borderWidth: 2 },
              },
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
              '& .MuiOutlinedInput-root': { bgcolor: theme.palette.grey[50], borderRadius: 2 },
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
              '& .MuiOutlinedInput-root': { bgcolor: theme.palette.grey[50], borderRadius: 2 },
            }}
          />
          <FormControl
            size="small"
            sx={{
              minWidth: { xs: '100%', sm: 120 },
              flex: { xs: '1 1 100%', sm: '0 0 auto' },
              '& .MuiOutlinedInput-root': { bgcolor: theme.palette.grey[50], borderRadius: 2 },
            }}
          >
            <InputLabel id="package-filter-label">Package</InputLabel>
            <Select labelId="package-filter-label" value={packageFilter} label="Package" onChange={(e) => setPackageFilter(e.target.value)}>
              {PACKAGE_OPTIONS.map((p) => (
                <MenuItem key={p || 'all'} value={p}>{p || 'All'}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ display: 'flex', gap: 0.75, width: { xs: '100%', sm: 'auto' }, flex: { xs: '1 1 100%', sm: '0 0 auto' }, minWidth: 0 }}>
            <Button
              variant="contained"
              size="small"
              startIcon={<SearchRoundedIcon sx={{ fontSize: 16 }} />}
              onClick={handleSearch}
              fullWidth={isMobile}
              sx={{
                bgcolor: theme.palette.primary.main,
                borderRadius: 1.5,
                px: { xs: 1.5, sm: 1.25 },
                py: 0.75,
                minHeight: 36,
                fontWeight: 600,
                fontSize: '0.75rem',
                flex: { xs: 1, sm: '0 0 auto' },
                whiteSpace: 'nowrap',
                '&:hover': { bgcolor: theme.palette.primary.dark },
              }}
            >
              Search
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<RefreshRoundedIcon sx={{ fontSize: 16 }} />}
              onClick={handleReset}
              fullWidth={isMobile}
              sx={{
                borderColor: theme.palette.grey[300],
                color: 'text.primary',
                borderRadius: 1.5,
                minHeight: 36,
                fontWeight: 600,
                fontSize: '0.75rem',
                px: { xs: 1.5, sm: 1.25 },
                py: 0.75,
                flex: { xs: 1, sm: '0 0 auto' },
                whiteSpace: 'nowrap',
                '&:hover': { borderColor: theme.palette.primary.main, bgcolor: alpha(theme.palette.primary.main, 0.04) },
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
          borderRadius: 2,
          border: '1px solid',
          borderColor: alpha(theme.palette.primary.main, 0.12),
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
                    bgcolor: alpha(theme.palette.primary.main, 0.06),
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
                  <TableCell>Date</TableCell>
                  <TableCell>Subscription end date</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginated.map((row) => (
                  <TableRow
                    key={row.id}
                    hover
                    sx={{
                      '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) },
                      '& .MuiTableCell-body': { borderColor: theme.palette.grey[200], py: 1.5, fontSize: '0.875rem' },
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar
                          src={row.avatar}
                          alt={row.fullName}
                          onClick={() => setImagePreview({ open: true, src: row.avatar, alt: row.fullName, title: row.fullName })}
                          sx={{
                            width: 40,
                            height: 40,
                            cursor: 'pointer',
                            bgcolor: alpha(theme.palette.primary.main, 0.12),
                            color: theme.palette.primary.main,
                            '&:hover': { opacity: 0.9, boxShadow: 1 },
                          }}
                        >
                          {row.fullName.charAt(0)}
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
                          bgcolor: alpha(theme.palette.primary.main, 0.12),
                          color: theme.palette.primary.dark,
                          border: 'none',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                        {row.date}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                        {row.subscriptionEndDate}
                      </Typography>
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
                            '&:hover': { color: theme.palette.primary.main, bgcolor: alpha(theme.palette.primary.main, 0.08) },
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
            {paginated.map((row) => (
              <Paper
                key={row.id}
                elevation={0}
                sx={{
                  p: { xs: 2.5, sm: 2 },
                  borderRadius: { xs: 3, sm: 2 },
                  border: '1px solid',
                  borderColor: { xs: alpha(theme.palette.primary.main, 0.2), sm: theme.palette.grey[200] },
                  bgcolor: theme.palette.background.paper,
                  transition: 'all 0.2s ease',
                  overflow: 'hidden',
                  ...(isMobile && {
                    boxShadow: `0 2px 12px ${alpha(theme.palette.primary.main, 0.06)}`,
                    '&:active': { borderColor: theme.palette.primary.main, boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.12)}` },
                  }),
                  '&:hover': { borderColor: alpha(theme.palette.primary.main, 0.35), boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.1)}` },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1.5, mb: 2, pb: 2, borderBottom: '1px solid', borderColor: theme.palette.divider }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, sm: 1.5 }, minWidth: 0, flex: 1 }}>
                    <Avatar
                      src={row.avatar}
                      alt={row.fullName}
                      onClick={() => setImagePreview({ open: true, src: row.avatar, alt: row.fullName, title: row.fullName })}
                      sx={{
                        width: { xs: 56, sm: 48 },
                        height: { xs: 56, sm: 48 },
                        flexShrink: 0,
                        cursor: 'pointer',
                        bgcolor: alpha(theme.palette.primary.main, 0.12),
                        color: theme.palette.primary.main,
                        '&:hover': { opacity: 0.9, boxShadow: 1 },
                      }}
                    >
                      {row.fullName.charAt(0)}
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
                      <IconButton size="small" onClick={() => handlePrintSlip(row)} sx={{ color: theme.palette.grey[600], '&:hover': { color: theme.palette.primary.main, bgcolor: alpha(theme.palette.primary.main, 0.1) } }}>
                        <PrintRoundedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="View details" placement="top" arrow>
                      <IconButton size="small" onClick={() => handleViewOpen(row)} sx={{ color: theme.palette.info.main, '&:hover': { color: theme.palette.info.dark, bgcolor: alpha(theme.palette.info.main, 0.15) } }}>
                        <VisibilityRoundedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.5 }}>
                  <Chip label={row.package} size="small" sx={{ height: { xs: 28, sm: 26 }, fontSize: '0.75rem', fontWeight: 600, bgcolor: alpha(theme.palette.primary.main, 0.12), color: theme.palette.primary.dark, border: 'none' }} />
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Date: {row.date}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Ends: {row.subscriptionEndDate}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>{row.amount}</Typography>
                </Box>
                {/* Mobile only: Print & View details at end of card, right-aligned */}
                <Box sx={{ display: { xs: 'flex', sm: 'none' }, justifyContent: 'flex-end', alignItems: 'center', gap: 0.5, mt: 2, pt: 2, borderTop: '1px solid', borderColor: theme.palette.divider }}>
                  <Tooltip title="Print slip" placement="top" arrow>
                    <IconButton size="medium" onClick={() => handlePrintSlip(row)} sx={{ color: theme.palette.grey[600], bgcolor: theme.palette.grey[100], '&:hover': { color: theme.palette.primary.main, bgcolor: alpha(theme.palette.primary.main, 0.1) } }}>
                      <PrintRoundedIcon fontSize="medium" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="View details" placement="top" arrow>
                    <IconButton size="medium" onClick={() => handleViewOpen(row)} sx={{ color: theme.palette.info.main, bgcolor: alpha(theme.palette.info.main, 0.08), '&:hover': { color: theme.palette.info.dark, bgcolor: alpha(theme.palette.info.main, 0.15) } }}>
                      <VisibilityRoundedIcon fontSize="medium" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Paper>
            ))}
          </Box>
        )}

        {/* Pagination */}
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
            bgcolor: alpha(theme.palette.primary.main, 0.02),
            borderRadius: { xs: '0 0 12px 12px', sm: 0 },
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
                  borderRadius: 2,
                  bgcolor: theme.palette.background.paper,
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.grey[300] },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.primary.main },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.primary.main, borderWidth: 2 },
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
              <ViewListRoundedIcon sx={{ color: 'primary.main', fontSize: { xs: 18, sm: 22 } }} />
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.75rem' } }}>Page {page + 1} of {totalPages}</Typography>
            </Box>
            <Pagination
              count={totalPages}
              page={page + 1}
              onChange={(_, value) => setPage(value - 1)}
              color="primary"
              size={isMobile ? 'small' : 'large'}
              showFirstButton
              showLastButton
              sx={{
                '& .MuiPaginationItem-root': { fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.9375rem' }, borderRadius: 1.5, minWidth: { xs: 28, sm: 40 }, height: { xs: 28, sm: 40 } },
                '& .MuiPaginationItem-page.Mui-selected': {
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  color: theme.palette.primary.contrastText,
                  boxShadow: `0 2px 6px ${alpha(theme.palette.primary.main, 0.35)}`,
                  '&:hover': { background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})` },
                },
                '& .MuiPaginationItem-page:not(.Mui-selected):hover': { backgroundColor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' },
                '& .MuiPaginationItem-icon': { color: 'primary.main', fontSize: { xs: 18, sm: 24 } },
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
            borderRadius: isMobile ? '24px 24px 0 0' : 3,
            border: '1px solid',
            borderColor: alpha(theme.palette.primary.main, 0.25),
            borderBottom: isMobile ? 'none' : undefined,
            boxShadow: isMobile ? `0 -8px 32px rgba(15, 23, 42, 0.2), 0 -4px 16px ${alpha(theme.palette.primary.main, 0.08)}` : `0 12px 40px ${alpha(theme.palette.primary.main, 0.15)}`,
            bgcolor: theme.palette.background.paper,
            overflow: 'hidden',
            position: 'relative',
            '&::before': isMobile ? { content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: 5, background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)` } : undefined,
          },
        }}
        slotProps={{ backdrop: { sx: { bgcolor: alpha(theme.palette.common.black, 0.65), backdropFilter: 'blur(6px)' } } }}
      >
        {isMobile && (
          <Box sx={{ pt: 1.5, pb: 0.5, display: 'flex', justifyContent: 'center', flexShrink: 0, bgcolor: alpha(theme.palette.primary.main, 0.02), borderBottom: '1px solid', borderColor: alpha(theme.palette.primary.main, 0.1) }}>
            <Box sx={{ width: 40, height: 4, borderRadius: 2, bgcolor: theme.palette.grey[400] }} />
          </Box>
        )}
        <DialogTitle sx={{ fontWeight: 700, color: 'text.primary', borderBottom: '1px solid', borderColor: theme.palette.divider, py: 2, px: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
            <Box sx={{ width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, bgcolor: alpha(theme.palette.primary.main, 0.12), color: 'primary.main' }}>
              <AccountBalanceRoundedIcon sx={{ fontSize: 24 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>View details</Typography>
          </Box>
          <IconButton size="small" onClick={handleViewClose} sx={{ color: theme.palette.grey[600], flexShrink: 0, '&:hover': { color: theme.palette.primary.main, bgcolor: alpha(theme.palette.primary.main, 0.08) } }}>
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ px: { xs: 2, sm: 3 }, pt: 0, pb: 3, overflow: 'visible' }}>
          {viewDialog.row && (
            <Box sx={{ pt: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {/* User card */}
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: alpha(theme.palette.primary.main, 0.15),
                  bgcolor: alpha(theme.palette.primary.main, 0.04),
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
                    cursor: 'pointer',
                    bgcolor: alpha(theme.palette.primary.main, 0.12),
                    color: 'primary.main',
                    '&:hover': { opacity: 0.9, boxShadow: 2 },
                  }}
                >
                  {viewDialog.row.fullName.charAt(0)}
                </Avatar>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '1rem' }}>{viewDialog.row.fullName}</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem', mt: 0.25 }}>{viewDialog.row.email}</Typography>
                </Box>
              </Paper>

              {/* Details grid */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap: 1.5,
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: theme.palette.grey[200],
                    bgcolor: theme.palette.grey[50],
                  }}
                >
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>Package</Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip label={viewDialog.row.package} size="small" sx={{ height: 26, fontSize: '0.8125rem', fontWeight: 600, bgcolor: alpha(theme.palette.primary.main, 0.12), color: theme.palette.primary.dark, border: 'none' }} />
                  </Box>
                </Paper>
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: theme.palette.grey[200],
                    bgcolor: theme.palette.grey[50],
                  }}
                >
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>Date</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary', mt: 0.5, display: 'block' }}>{viewDialog.row.date}</Typography>
                </Paper>
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: theme.palette.grey[200],
                    bgcolor: theme.palette.grey[50],
                    gridColumn: { xs: '1', sm: '1 / -1' },
                  }}
                >
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>Subscription end date</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary', mt: 0.5, display: 'block' }}>{viewDialog.row.subscriptionEndDate}</Typography>
                </Paper>
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: alpha(theme.palette.primary.main, 0.35),
                    bgcolor: alpha(theme.palette.primary.main, 0.06),
                    gridColumn: { xs: '1', sm: '1 / -1' },
                  }}
                >
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>Amount</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', mt: 0.5 }}>{viewDialog.row.amount}</Typography>
                </Paper>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2.5, pt: 2, pb: { xs: 'max(20px, env(safe-area-inset-bottom))', sm: 2.5 }, borderTop: '1px solid', borderColor: theme.palette.divider, gap: 1 }}>
          <Button variant="contained" onClick={handleViewClose} sx={{ bgcolor: theme.palette.primary.main, borderRadius: 2, fontWeight: 600, px: 2.5, '&:hover': { bgcolor: theme.palette.primary.dark } }}>Close</Button>
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
