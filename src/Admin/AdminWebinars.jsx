import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
  IconButton,
  Tooltip,
  Chip,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slide,
  Skeleton,
} from '@mui/material'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded'
import VideoCallRoundedIcon from '@mui/icons-material/VideoCallRounded'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import RestoreFromTrashRoundedIcon from '@mui/icons-material/RestoreFromTrashRounded'
import apiClient from '../server'
import { useToast } from '../components/ToastProvider'
import EventRoundedIcon from '@mui/icons-material/EventRounded'
import TitleRoundedIcon from '@mui/icons-material/TitleRounded'
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded'
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded'
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded'
import LinkRoundedIcon from '@mui/icons-material/LinkRounded'
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded'
import EuroRoundedIcon from '@mui/icons-material/EuroRounded'
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded'
import ImageRoundedIcon from '@mui/icons-material/ImageRounded'
import BookOnlineRoundedIcon from '@mui/icons-material/BookOnlineRounded'
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded'
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded'
import ImagePreviewDialog from '../components/ImagePreviewDialog'

const ADMIN_PRIMARY = '#384D84'
const ADMIN_PRIMARY_DARK = '#2a3a64'
const ADMIN_PRIMARY_LIGHT = '#4a5f9a'

const ROWS_PER_PAGE_OPTIONS = [5, 10, 20, 30, 40, 50, 100]
const SKELETON_ROW_COUNT = 5

const Transition = (props) => <Slide {...props} direction="up" />

function AdminWebinars() {
  const theme = useTheme()
  const navigate = useNavigate()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const showAsCards = useMediaQuery(theme.breakpoints.down('md'))
  const { showToast } = useToast()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [webinars, setWebinars] = useState([])
  const [viewDialog, setViewDialog] = useState({ open: false, webinar: null })
  const [imagePreview, setImagePreview] = useState({ open: false, src: '', alt: '', title: '' })
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalRows, setTotalRows] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  const [listLoading, setListLoading] = useState(false)
  const [listError, setListError] = useState('')
  const [rowActionLoading, setRowActionLoading] = useState({})
  const [confirmState, setConfirmState] = useState({
    open: false,
    mode: 'delete', // delete | restore
    row: null,
  })
  const [confirmLoading, setConfirmLoading] = useState(false)

  const [bookingsDialog, setBookingsDialog] = useState({ open: false, webinar: null, bookings: [], loading: false, error: '' })

  const serverPage = page + 1
  const from = totalRows === 0 ? 0 : (serverPage - 1) * rowsPerPage + 1
  const to = Math.min((serverPage - 1) * rowsPerPage + rowsPerPage, totalRows)

  const fetchWebinars = async (opts = {}) => {
    const { applyFilters = false, targetPage = serverPage, targetPerPage = rowsPerPage } = opts

    setListLoading(true)
    setListError('')

    const params = new URLSearchParams()
    params.set('page', String(targetPage))
    params.set('per_page', String(targetPerPage))
    if (applyFilters) {
      params.set('apply_filters', '1')
      if (search.trim()) params.set('text', search.trim())
      if (statusFilter) params.set('status', statusFilter)
    }

    try {
      const { ok, data } = await apiClient(`/webinars?${params.toString()}`, 'GET')
      if (!ok || !data?.success) {
        const message =
          data?.errors && typeof data.errors === 'object'
            ? Object.values(data.errors).flat().join(' ')
            : data?.message
        setListError(message || 'Unable to load webinars.')
        return
      }

      const list = data.data?.webinars || []
      const pagination = data.data?.pagination || {}

      setWebinars(list)
      const total = Number(pagination.total || list.length || 0)
      const perPageValue = Number(pagination.per_page || targetPerPage || 10)
      const currentPageValue = Number(pagination.current_page || targetPage || 1)
      const lastPageValue = Number(pagination.last_page || Math.max(1, Math.ceil(total / perPageValue)))

      setTotalRows(total)
      setRowsPerPage(perPageValue)
      setPage(Math.max(0, currentPageValue - 1))
      setTotalPages(lastPageValue || 1)
    } catch {
      setListError('Unable to reach server. Please try again.')
    } finally {
      setListLoading(false)
    }
  }

  useEffect(() => {
    fetchWebinars({ applyFilters: false, targetPage: 1, targetPerPage: rowsPerPage })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChangePage = (_, value) => {
    const newPage = value - 1
    setPage(newPage)
    fetchWebinars({
      applyFilters: !!(search || statusFilter),
      targetPage: value,
      targetPerPage: rowsPerPage,
    })
  }

  const handleChangeRowsPerPage = (e) => {
    const newPerPage = Number(e.target.value)
    setRowsPerPage(newPerPage)
    setPage(0)
    fetchWebinars({
      applyFilters: !!(search || statusFilter),
      targetPage: 1,
      targetPerPage: newPerPage,
    })
  }

  const handleSearch = () => {
    setPage(0)
    fetchWebinars({ applyFilters: true, targetPage: 1 })
  }
  const handleReset = () => {
    setSearch('')
    setStatusFilter('')
    setPage(0)
    fetchWebinars({ applyFilters: false, targetPage: 1 })
  }

  const handleViewOpen = (webinar) => setViewDialog({ open: true, webinar })
  const handleViewClose = () => setViewDialog({ open: false, webinar: null })

  const handleOpenBookings = async (webinar) => {
    setBookingsDialog({ open: true, webinar, bookings: [], loading: true, error: '' })
    try {
      const { ok, data } = await apiClient(`/webinars/${webinar.id}/bookings`, 'GET')
      if (!ok || !data?.success) {
        setBookingsDialog((prev) => ({ ...prev, loading: false, error: data?.message || 'Failed to load bookings.' }))
        return
      }
      setBookingsDialog((prev) => ({ ...prev, loading: false, bookings: data.data?.bookings || [], confirmed: data.data?.confirmed_bookings, remaining: data.data?.remaining_seats, max: data.data?.max_attendees }))
    } catch {
      setBookingsDialog((prev) => ({ ...prev, loading: false, error: 'Unable to reach server.' }))
    }
  }
  const handleCloseBookings = () => setBookingsDialog({ open: false, webinar: null, bookings: [], loading: false, error: '' })

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—')
  const formatTime = (t) => {
    if (!t) return '—'
    if (t.length === 5 && t.includes(':')) return t // already "HH:MM"
    if (t.length >= 4) return `${t.slice(0, 2)}:${t.slice(2, 4)}`
    return t
  }

  const openConfirmDelete = (row) => {
    setConfirmState({
      open: true,
      mode: 'delete',
      row,
    })
  }

  const openConfirmRestore = (row) => {
    setConfirmState({
      open: true,
      mode: 'restore',
      row,
    })
  }

  const handleConfirmClose = () => {
    if (confirmLoading) return
    setConfirmState({
      open: false,
      mode: 'delete',
      row: null,
    })
  }

  const handleDelete = async (row) => {
    if (!row?.id) return
    setRowActionLoading((prev) => ({ ...prev, [row.id]: true }))
    try {
      const { ok, data } = await apiClient(`/webinars/${row.id}`, 'DELETE')
      if (!ok || !data?.success) {
        const message =
          data?.errors && typeof data.errors === 'object'
            ? Object.values(data.errors).flat().join(' ')
            : data?.message
        showToast(message || 'Unable to delete webinar.', 'error')
        return
      }
      showToast('Webinar deleted successfully.', 'success')
      fetchWebinars({ applyFilters: !!(search || statusFilter), targetPage: serverPage })
    } catch {
      showToast('Unable to reach server. Please try again.', 'error')
    } finally {
      setRowActionLoading((prev) => ({ ...prev, [row.id]: false }))
    }
  }

  const handleRestore = async (row) => {
    if (!row?.id) return
    setRowActionLoading((prev) => ({ ...prev, [row.id]: true }))
    try {
      const { ok, data } = await apiClient(`/webinars/${row.id}/restore`, 'POST')
      if (!ok || !data?.success) {
        const message =
          data?.errors && typeof data.errors === 'object'
            ? Object.values(data.errors).flat().join(' ')
            : data?.message
        showToast(message || 'Unable to restore webinar.', 'error')
        return
      }
      showToast('Webinar restored successfully.', 'success')
      fetchWebinars({ applyFilters: !!(search || statusFilter), targetPage: serverPage })
    } catch {
      showToast('Unable to reach server. Please try again.', 'error')
    } finally {
      setRowActionLoading((prev) => ({ ...prev, [row.id]: false }))
    }
  }

  const handleConfirmProceed = async () => {
    if (!confirmState.row || confirmLoading) return
    setConfirmLoading(true)
    try {
      if (confirmState.mode === 'restore') {
        await handleRestore(confirmState.row)
      } else {
        await handleDelete(confirmState.row)
      }
      handleConfirmClose()
    } finally {
      setConfirmLoading(false)
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
      {/* Page title */}
      <Box sx={{ mb: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 0.25 }}>
          <VideoCallRoundedIcon sx={{ fontSize: { xs: 28, sm: 32 }, color: ADMIN_PRIMARY }} />
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
            Webinars
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
          Manage webinars and online events
        </Typography>
      </Box>

      {/* Filters */}
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
          <FormControl
            size="small"
            sx={{
              minWidth: { xs: '100%', sm: 120 },
              flex: { xs: '1 1 100%', sm: '0 0 auto' },
              '& .MuiOutlinedInput-root': { bgcolor: theme.palette.grey[50], borderRadius: '7px' },
              '& .MuiInputLabel-root.Mui-focused': { color: ADMIN_PRIMARY },
            }}
          >
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
              <MenuItem value="Deleted">Deleted</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', sm: 'auto' }, flex: { xs: '1 1 100%', sm: '0 0 auto' } }}>
            <Button
              variant="contained"
              size="small"
              startIcon={<SearchRoundedIcon sx={{ fontSize: 18 }} />}
              onClick={handleSearch}
              fullWidth
              sx={{
                bgcolor: ADMIN_PRIMARY,
                borderRadius: '7px',
                px: { xs: 2, sm: 1.5 },
                py: 1,
                fontWeight: 600,
                fontSize: '0.8125rem',
                flex: { xs: 1, sm: '0 0 auto' },
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
              fullWidth
              sx={{
                borderColor: theme.palette.grey[300],
                color: 'text.primary',
                borderRadius: '7px',
                fontWeight: 600,
                fontSize: '0.8125rem',
                px: { xs: 2, sm: 1.5 },
                py: 1,
                flex: { xs: 1, sm: '0 0 auto' },
                '&:hover': { borderColor: ADMIN_PRIMARY, bgcolor: alpha(ADMIN_PRIMARY, 0.04) },
              }}
            >
              Reset
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Table section with Add Webinar in header */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: '7px',
          border: '1px solid',
          borderColor: alpha(ADMIN_PRIMARY, 0.12),
          overflow: 'hidden',
          overflowX: { xs: 'hidden', md: 'visible' },
          bgcolor: theme.palette.background.paper,
          '@keyframes spin': {
            from: { transform: 'rotate(0deg)' },
            to: { transform: 'rotate(360deg)' },
          },
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
            Webinar list
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={() => navigate('/admin/webinars/add')}
            sx={{
              bgcolor: ADMIN_PRIMARY,
              borderRadius: '7px',
              fontWeight: 600,
              '&:hover': { bgcolor: ADMIN_PRIMARY_DARK },
            }}
          >
            Add Webinar
          </Button>
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
                  <TableCell>Banner & Title</TableCell>
                  <TableCell>Dated</TableCell>
                  <TableCell>Pricing</TableCell>
                  <TableCell>Seats</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {listLoading
                  ? Array.from({ length: SKELETON_ROW_COUNT }).map((_, idx) => (
                      <TableRow
                        key={`skeleton-${idx}`}
                        sx={{
                          '& .MuiTableCell-body': { borderColor: theme.palette.grey[200], py: 1.5 },
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Skeleton variant="rounded" width={60} height={40} sx={{ borderRadius: '7px' }} />
                            <Skeleton variant="text" width="70%" sx={{ borderRadius: 1, maxWidth: 200 }} />
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" width={140} sx={{ borderRadius: 1 }} />
                          <Skeleton variant="text" width={100} sx={{ borderRadius: 1 }} />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="rounded" width={80} height={24} sx={{ borderRadius: '7px' }} />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="rounded" width={60} height={24} sx={{ borderRadius: '7px' }} />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="rounded" width={80} height={24} sx={{ borderRadius: '7px' }} />
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                            <Skeleton variant="circular" width={32} height={32} />
                            <Skeleton variant="circular" width={32} height={32} />
                            <Skeleton variant="circular" width={32} height={32} />
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  : webinars.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 1,
                        }}
                      >
                        <ViewListRoundedIcon
                          sx={{
                            fontSize: 40,
                            color: alpha(ADMIN_PRIMARY, 0.4),
                          }}
                        />
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600, color: 'text.secondary' }}
                        >
                          No webinars found.
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: 'text.disabled', maxWidth: 320 }}
                        >
                          Use the filters above or click &quot;Add Webinar&quot; to create a new webinar.
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                  ) : webinars.map((row) => (
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
                        <Box
                          component="img"
                          src={row.bannerImage}
                          alt={row.eventTitle}
                          onClick={() => setImagePreview({ open: true, src: row.bannerImage, alt: row.eventTitle, title: row.eventTitle })}
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="60" height="40" viewBox="0 0 60 40"><rect fill="#e0e0e0" width="60" height="40"/><text x="30" y="22" fill="#999" text-anchor="middle" font-size="10">No image</text></svg>')
                          }}
                          sx={{
                            width: 60,
                            height: 40,
                            objectFit: 'cover',
                            borderRadius: '7px',
                            cursor: 'pointer',
                            border: '1px solid',
                            borderColor: theme.palette.grey[200],
                            '&:hover': { boxShadow: `0 2px 8px ${alpha(ADMIN_PRIMARY, 0.3)}` },
                          }}
                        />
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }} noWrap>
                          {row.eventTitle}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8125rem' }}>
                        {formatDate(row.startDate)} – {formatDate(row.endDate)}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {formatTime(row.startTime)} – {formatTime(row.endTime)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {row.price === 0 ? (
                        <Chip label="Free" size="small" sx={{ height: 24, fontSize: '0.75rem', fontWeight: 600, bgcolor: alpha(theme.palette.success.main, 0.12), color: theme.palette.success.dark, borderRadius: '7px', border: 'none' }} />
                      ) : (
                        <Chip label={`€${Number(row.price).toFixed(2)}`} size="small" sx={{ height: 24, fontSize: '0.75rem', fontWeight: 600, bgcolor: alpha(ADMIN_PRIMARY, 0.12), color: ADMIN_PRIMARY_DARK, borderRadius: '7px', border: 'none' }} />
                      )}
                    </TableCell>
                    <TableCell>
                      {row.maxAttendees != null ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Typography variant="caption" sx={{ fontWeight: 700, color: row.remainingSeats === 0 ? 'error.main' : 'success.dark', fontSize: '0.8125rem' }}>
                            {row.remainingSeats ?? '—'} remaining
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                            {row.confirmedBookings ?? 0} / {row.maxAttendees}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>Unlimited</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.status}
                        size="small"
                        sx={{
                          height: 24,
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          bgcolor:
                            row.status === 'Active'
                              ? alpha(theme.palette.success.main, 0.12)
                              : row.status === 'Deleted'
                              ? alpha(theme.palette.error.main, 0.12)
                              : alpha(theme.palette.grey[500], 0.12),
                          color:
                            row.status === 'Active'
                              ? theme.palette.success.dark
                              : row.status === 'Deleted'
                              ? theme.palette.error.dark
                              : theme.palette.grey[700],
                          borderRadius: '7px',
                          border: 'none',
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Bookings" placement="top" arrow>
                        <IconButton size="small" onClick={() => handleOpenBookings(row)} sx={{ color: ADMIN_PRIMARY, '&:hover': { color: ADMIN_PRIMARY_DARK, bgcolor: alpha(ADMIN_PRIMARY, 0.1) } }}>
                          <BookOnlineRoundedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="View" placement="top" arrow>
                        <IconButton size="small" onClick={() => handleViewOpen(row)} sx={{ color: theme.palette.info.main, '&:hover': { color: theme.palette.info.dark, bgcolor: alpha(theme.palette.info.main, 0.12) } }}>
                          <VisibilityRoundedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit" placement="top" arrow>
                        <IconButton
                          size="small"
                          onClick={() => navigate('/admin/webinars/add', { state: { webinar: row } })}
                          sx={{ color: theme.palette.grey[600], ml: 0.5, '&:hover': { color: ADMIN_PRIMARY, bgcolor: alpha(ADMIN_PRIMARY, 0.08) } }}
                        >
                          <EditRoundedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={row.status === 'Deleted' ? 'Restore' : 'Delete'} placement="top" arrow>
                        <span>
                          <IconButton
                            size="small"
                            disabled={!!rowActionLoading[row.id]}
                            onClick={() =>
                              row.status === 'Deleted' ? openConfirmRestore(row) : openConfirmDelete(row)
                            }
                            sx={{
                              color:
                                row.status === 'Deleted'
                                  ? theme.palette.success.main
                                  : theme.palette.error.main,
                              ml: 0.5,
                              '&:hover': {
                                color:
                                  row.status === 'Deleted'
                                    ? theme.palette.success.dark
                                    : theme.palette.error.dark,
                                bgcolor:
                                  row.status === 'Deleted'
                                    ? alpha(theme.palette.success.main, 0.12)
                                    : alpha(theme.palette.error.main, 0.12),
                              },
                              '&.Mui-disabled': {
                                color:
                                  row.status === 'Deleted'
                                    ? alpha(theme.palette.success.main, 0.6)
                                    : alpha(theme.palette.error.main, 0.6),
                              },
                            }}
                          >
                            {rowActionLoading[row.id] ? (
                              <AutorenewIcon
                                sx={{
                                  fontSize: 18,
                                  animation: 'spin 0.8s linear infinite',
                                }}
                              />
                            ) : row.status === 'Deleted' ? (
                              <RestoreFromTrashRoundedIcon fontSize="small" />
                            ) : (
                              <DeleteRoundedIcon fontSize="small" />
                            )}
                          </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Mobile/Tablet: card list — same layout as Services */}
        {showAsCards && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: { xs: 2, sm: 1.5 },
              p: { xs: 2, sm: 2 },
              pb: 2,
              overflowX: 'hidden',
            }}
          >
            {webinars.map((row) => (
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
                    '&:active': {
                      borderColor: ADMIN_PRIMARY,
                      boxShadow: `0 4px 20px ${alpha(ADMIN_PRIMARY, 0.12)}`,
                    },
                  }),
                  '&:hover': {
                    borderColor: alpha(ADMIN_PRIMARY, 0.35),
                    boxShadow: `0 4px 20px ${alpha(ADMIN_PRIMARY, 0.1)}`,
                  },
                }}
              >
                {/* Top row: banner thumbnail + title & date/time + actions (tablet only) */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: 1.5,
                    mb: 2,
                    pb: 2,
                    borderBottom: '1px solid',
                    borderColor: theme.palette.divider,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, sm: 1.5 }, minWidth: 0, flex: 1 }}>
                    <Box
                      component="img"
                      src={row.bannerImage}
                      alt={row.eventTitle}
                      onClick={() => setImagePreview({ open: true, src: row.bannerImage, alt: row.eventTitle, title: row.eventTitle })}
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56"><rect fill="#e0e0e0" width="56" height="56"/></svg>')
                      }}
                      sx={{
                        width: { xs: 56, sm: 48 },
                        height: { xs: 56, sm: 48 },
                        objectFit: 'cover',
                        borderRadius: '7px',
                        cursor: 'pointer',
                        border: '2px solid',
                        borderColor: alpha(ADMIN_PRIMARY, 0.2),
                        flexShrink: 0,
                        bgcolor: alpha(ADMIN_PRIMARY, 0.06),
                        '&:hover': { boxShadow: `0 4px 12px ${alpha(ADMIN_PRIMARY, 0.25)}` },
                      }}
                    />
                    <Box sx={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
                      <Typography
                        variant="subtitle1"
                        noWrap
                        sx={{
                          fontWeight: 700,
                          color: 'text.primary',
                          lineHeight: 1.3,
                          fontSize: { xs: '1rem', sm: '0.9rem' },
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {row.eventTitle}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          fontSize: { xs: '0.9375rem', sm: '0.875rem' },
                          mt: 0.5,
                        }}
                      >
                        Start: {formatDate(row.startDate)}, {formatTime(row.startTime)}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                          mt: 0.25,
                        }}
                      >
                        End: {formatDate(row.endDate)}, {formatTime(row.endTime)}
                      </Typography>
                    </Box>
                  </Box>
                  {/* Actions: tablet+ only; on mobile they move to card footer */}
                  <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', flexShrink: 0, gap: 0.25 }}>
                    <Tooltip title="Bookings" placement="top" arrow>
                      <IconButton size="medium" onClick={() => handleOpenBookings(row)} sx={{ color: ADMIN_PRIMARY, '&:hover': { color: ADMIN_PRIMARY_DARK, bgcolor: alpha(ADMIN_PRIMARY, 0.1) } }}>
                        <BookOnlineRoundedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="View" placement="top" arrow>
                      <IconButton
                        size="medium"
                        onClick={() => handleViewOpen(row)}
                        sx={{
                          color: theme.palette.info.main,
                          '&:hover': {
                            color: theme.palette.info.dark,
                            bgcolor: alpha(theme.palette.info.main, 0.1),
                          },
                        }}
                      >
                        <VisibilityRoundedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit" placement="top" arrow>
                      <IconButton
                        size="medium"
                        onClick={() => navigate('/admin/webinars/add', { state: { webinar: row } })}
                        sx={{
                          color: theme.palette.grey[600],
                          '&:hover': {
                            color: ADMIN_PRIMARY,
                            bgcolor: alpha(ADMIN_PRIMARY, 0.08),
                          },
                        }}
                      >
                        <EditRoundedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip
                      title={row.status === 'Deleted' ? 'Restore' : 'Delete'}
                      placement="top"
                      arrow
                    >
                      <span>
                        <IconButton
                          size="medium"
                          disabled={!!rowActionLoading[row.id]}
                          onClick={() =>
                            row.status === 'Deleted'
                              ? openConfirmRestore(row)
                              : openConfirmDelete(row)
                          }
                          sx={{
                            color:
                              row.status === 'Deleted'
                                ? theme.palette.success.main
                                : theme.palette.error.main,
                            '&:hover': {
                              color:
                                row.status === 'Deleted'
                                  ? theme.palette.success.dark
                                  : theme.palette.error.dark,
                              bgcolor:
                                row.status === 'Deleted'
                                  ? alpha(theme.palette.success.main, 0.12)
                                  : alpha(theme.palette.error.main, 0.15),
                            },
                            '&.Mui-disabled': {
                              color:
                                row.status === 'Deleted'
                                  ? alpha(theme.palette.success.main, 0.6)
                                  : alpha(theme.palette.error.main, 0.6),
                            },
                          }}
                        >
                          {rowActionLoading[row.id] ? (
                            <AutorenewIcon
                              sx={{
                                fontSize: 18,
                                animation: 'spin 0.8s linear infinite',
                              }}
                            />
                          ) : row.status === 'Deleted' ? (
                            <RestoreFromTrashRoundedIcon fontSize="small" />
                          ) : (
                            <DeleteRoundedIcon fontSize="small" />
                          )}
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Box>
                </Box>

                {/* Bottom row: pricing & status chips + mobile-only action buttons */}
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1.5,
                  }}
                >
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: { xs: 1, sm: 1 } }}>
                    {row.price === 0 ? (
                      <Chip
                        label="Free"
                        size="small"
                        sx={{
                          height: { xs: 28, sm: 26 },
                          fontSize: { xs: '0.8125rem', sm: '0.75rem' },
                          fontWeight: 600,
                          borderRadius: '7px',
                          bgcolor: alpha(theme.palette.success.main, 0.12),
                          color: theme.palette.success.dark,
                          border: 'none',
                        }}
                      />
                    ) : (
                      <Chip
                        label={`€${row.price.toFixed(2)}`}
                        size="small"
                        sx={{
                          height: { xs: 28, sm: 26 },
                          fontSize: { xs: '0.8125rem', sm: '0.75rem' },
                          fontWeight: 600,
                          borderRadius: '7px',
                          bgcolor: alpha(ADMIN_PRIMARY, 0.12),
                          color: ADMIN_PRIMARY_DARK,
                          border: 'none',
                        }}
                      />
                    )}
                    <Chip
                      label={row.status}
                      size="small"
                      sx={{
                        height: { xs: 28, sm: 26 },
                        fontSize: { xs: '0.8125rem', sm: '0.75rem' },
                        fontWeight: 600,
                        borderRadius: '7px',
                        border: 'none',
                        ...(row.status === 'Active'
                          ? { bgcolor: alpha(theme.palette.success.main, 0.12), color: theme.palette.success.dark }
                          : { bgcolor: alpha(theme.palette.grey[500], 0.12), color: theme.palette.grey[700] }),
                      }}
                    />
                  </Box>
                  {/* Mobile only: View, Edit, Delete/Restore in card footer — same as table */}
                  <Box sx={{ display: { xs: 'flex', sm: 'none' }, alignItems: 'center', flexShrink: 0, gap: 0.25 }}>
                    <Tooltip title="Bookings" placement="top" arrow>
                      <IconButton size="large" onClick={() => handleOpenBookings(row)} sx={{ color: ADMIN_PRIMARY, bgcolor: alpha(ADMIN_PRIMARY, 0.08), '&:hover': { color: ADMIN_PRIMARY_DARK, bgcolor: alpha(ADMIN_PRIMARY, 0.15) } }}>
                        <BookOnlineRoundedIcon fontSize="medium" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="View" placement="top" arrow>
                      <IconButton
                        size="large"
                        onClick={() => handleViewOpen(row)}
                        sx={{
                          color: theme.palette.info.main,
                          bgcolor: alpha(theme.palette.info.main, 0.08),
                          '&:hover': {
                            color: theme.palette.info.dark,
                            bgcolor: alpha(theme.palette.info.main, 0.15),
                          },
                        }}
                      >
                        <VisibilityRoundedIcon fontSize="medium" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit" placement="top" arrow>
                      <IconButton
                        size="large"
                        onClick={() => navigate('/admin/webinars/add', { state: { webinar: row } })}
                        sx={{
                          color: theme.palette.grey[600],
                          bgcolor: theme.palette.grey[100],
                          '&:hover': {
                            color: ADMIN_PRIMARY,
                            bgcolor: alpha(ADMIN_PRIMARY, 0.08),
                          },
                        }}
                      >
                        <EditRoundedIcon fontSize="medium" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip
                      title={row.status === 'Deleted' ? 'Restore' : 'Delete'}
                      placement="top"
                      arrow
                    >
                      <span>
                        <IconButton
                          size="large"
                          disabled={!!rowActionLoading[row.id]}
                          onClick={() =>
                            row.status === 'Deleted'
                              ? openConfirmRestore(row)
                              : openConfirmDelete(row)
                          }
                          sx={{
                            color:
                              row.status === 'Deleted'
                                ? theme.palette.success.main
                                : theme.palette.error.main,
                            bgcolor: alpha(
                              row.status === 'Deleted'
                                ? theme.palette.success.main
                                : theme.palette.error.main,
                              0.08
                            ),
                            '&:hover': {
                              color:
                                row.status === 'Deleted'
                                  ? theme.palette.success.dark
                                  : theme.palette.error.dark,
                              bgcolor: alpha(
                                row.status === 'Deleted'
                                  ? theme.palette.success.main
                                  : theme.palette.error.main,
                                0.15
                              ),
                            },
                            '&.Mui-disabled': {
                              color:
                                row.status === 'Deleted'
                                  ? alpha(theme.palette.success.main, 0.6)
                                  : alpha(theme.palette.error.main, 0.6),
                            },
                          }}
                        >
                          {rowActionLoading[row.id] ? (
                            <AutorenewIcon
                              sx={{
                                fontSize: 20,
                                animation: 'spin 0.8s linear infinite',
                              }}
                            />
                          ) : row.status === 'Deleted' ? (
                            <RestoreFromTrashRoundedIcon fontSize="medium" />
                          ) : (
                            <DeleteRoundedIcon fontSize="medium" />
                          )}
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Box>
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
            alignItems: 'center',
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
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: { xs: 1, sm: 1.5 }, width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}>
              Rows per page
            </Typography>
            <FormControl size="small" variant="outlined" sx={{ minWidth: 72 }}>
              <Select value={rowsPerPage} onChange={handleChangeRowsPerPage} sx={{ height: 36, fontSize: '0.8125rem', fontWeight: 600, borderRadius: '7px', bgcolor: theme.palette.background.paper }}>
                {ROWS_PER_PAGE_OPTIONS.map((opt) => (
                  <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}>
              {totalRows === 0 ? '0–0 of 0' : `${from}–${to} of ${totalRows}`}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'center', sm: 'flex-end' } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <ViewListRoundedIcon sx={{ color: ADMIN_PRIMARY, fontSize: { xs: 18, sm: 22 } }} />
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                Page {page + 1} of {totalPages}
              </Typography>
            </Box>
            <Pagination
              count={totalPages}
              page={page + 1}
              onChange={handleChangePage}
              size="small"
              showFirstButton
              showLastButton
              sx={{
                '& .MuiPaginationItem-root': { fontWeight: 600, fontSize: '0.8125rem', borderRadius: '7px', minWidth: 32, height: 32, color: ADMIN_PRIMARY },
                '& .MuiPaginationItem-page.Mui-selected': {
                  background: `linear-gradient(135deg, ${ADMIN_PRIMARY}, ${ADMIN_PRIMARY_DARK})`,
                  color: '#fff',
                  boxShadow: `0 2px 6px ${alpha(ADMIN_PRIMARY, 0.35)}`,
                  '&:hover': { background: `linear-gradient(135deg, ${ADMIN_PRIMARY_LIGHT}, ${ADMIN_PRIMARY})` },
                },
                '& .MuiPaginationItem-page:not(.Mui-selected):hover': { backgroundColor: alpha(ADMIN_PRIMARY, 0.1), color: ADMIN_PRIMARY },
                '& .MuiPaginationItem-icon': { color: ADMIN_PRIMARY, fontSize: 20 },
              }}
            />
          </Box>
        </Box>
      </Paper>

      {/* View Webinar Dialog — polished, icons-friendly */}
      <Dialog
        open={viewDialog.open}
        onClose={handleViewClose}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Transition}
        TransitionProps={{ direction: 'up' }}
        sx={isMobile ? { '& .MuiDialog-container': { alignItems: 'flex-end', justifyContent: 'center' } } : {}}
        PaperProps={{
          sx: {
            margin: isMobile ? 0 : 24,
            maxHeight: isMobile ? '90vh' : 'calc(100vh - 48px)',
            width: isMobile ? '100%' : undefined,
            maxWidth: isMobile ? '100%' : undefined,
            borderRadius: isMobile ? '16px 16px 0 0' : '16px',
            border: '1px solid',
            borderColor: alpha(ADMIN_PRIMARY, 0.12),
            borderBottom: isMobile ? 'none' : undefined,
            boxShadow: isMobile
              ? `0 -12px 40px rgba(15, 23, 42, 0.18), 0 -4px 20px ${alpha(ADMIN_PRIMARY, 0.06)}`
              : `0 28px 56px rgba(15, 23, 42, 0.18), 0 0 0 1px ${alpha(ADMIN_PRIMARY, 0.04)}`,
            overflow: 'hidden',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 6,
              background: `linear-gradient(90deg, ${ADMIN_PRIMARY} 0%, ${ADMIN_PRIMARY_LIGHT} 100%)`,
              opacity: 0.95,
            },
          },
        }}
      >
        {isMobile && (
          <Box sx={{ pt: 2, pb: 0.5, display: 'flex', justifyContent: 'center', flexShrink: 0, bgcolor: alpha(ADMIN_PRIMARY, 0.02), borderBottom: '1px solid', borderColor: alpha(ADMIN_PRIMARY, 0.08) }}>
            <Box sx={{ width: 44, height: 5, borderRadius: '10px', bgcolor: theme.palette.grey[400] }} />
          </Box>
        )}
        <DialogTitle
          component="div"
          sx={{
            pt: { xs: 2.5, sm: 3.5 },
            pb: 2.5,
            px: { xs: 2.5, sm: 3.5 },
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            borderBottom: '1px solid',
            borderColor: alpha(ADMIN_PRIMARY, 0.08),
            bgcolor: alpha(ADMIN_PRIMARY, 0.03),
          }}
        >
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              bgcolor: alpha(ADMIN_PRIMARY, 0.1),
              color: ADMIN_PRIMARY,
              border: '2px solid',
              borderColor: alpha(ADMIN_PRIMARY, 0.18),
              boxShadow: `0 6px 16px ${alpha(ADMIN_PRIMARY, 0.15)}`,
            }}
          >
            <EventRoundedIcon sx={{ fontSize: 30 }} />
          </Box>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', letterSpacing: '-0.02em', lineHeight: 1.3, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
              {viewDialog.webinar?.eventTitle || 'Webinar details'}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5, fontSize: '0.9375rem' }}>
              Complete event information
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2, px: { xs: 2.5, sm: 3.5 }, bgcolor: theme.palette.grey[50], minHeight: 220 }}>
          {viewDialog.webinar && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {/* Banner Image — with icon label */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Box sx={{ width: 32, height: 32, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: alpha(ADMIN_PRIMARY, 0.1), color: ADMIN_PRIMARY }}>
                    <ImageRoundedIcon sx={{ fontSize: 18 }} />
                  </Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6 }}>
                    Banner Image
                  </Typography>
                </Box>
                <Box
                  component="img"
                  src={viewDialog.webinar.bannerImage}
                  alt={viewDialog.webinar.eventTitle}
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="160" viewBox="0 0 400 160"><rect fill="#e0e0e0" width="400" height="160"/><text x="200" y="85" fill="#999" text-anchor="middle" font-size="14">No image</text></svg>')
                  }}
                  sx={{
                    width: '100%',
                    maxHeight: 200,
                    objectFit: 'cover',
                    borderRadius: '12px',
                    border: '1px solid',
                    borderColor: theme.palette.grey[200],
                    boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.06)}`,
                  }}
                />
              </Box>
              {/* Field rows with icons */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <FieldRow icon={<TitleRoundedIcon sx={{ fontSize: 20 }} />} label="Event Title" value={viewDialog.webinar.eventTitle} />
                <FieldRow icon={<DescriptionRoundedIcon sx={{ fontSize: 20 }} />} label="Description" value={viewDialog.webinar.description} multiline />
                <FieldRow icon={<CalendarMonthRoundedIcon sx={{ fontSize: 20 }} />} label="Start Date" value={formatDate(viewDialog.webinar.startDate)} />
                <FieldRow icon={<CalendarMonthRoundedIcon sx={{ fontSize: 20 }} />} label="End Date" value={formatDate(viewDialog.webinar.endDate)} />
                <FieldRow icon={<ScheduleRoundedIcon sx={{ fontSize: 20 }} />} label="Start Time" value={formatTime(viewDialog.webinar.startTime)} />
                <FieldRow icon={<ScheduleRoundedIcon sx={{ fontSize: 20 }} />} label="End Time" value={formatTime(viewDialog.webinar.endTime)} />
                {viewDialog.webinar.presence === 'Online' ? (
                  <FieldRow icon={<LinkRoundedIcon sx={{ fontSize: 20 }} />} label="Online Event (Zoom meeting link)" value={viewDialog.webinar.zoomMeetingLink || '—'} />
                ) : (
                  <FieldRow icon={<LocationOnRoundedIcon sx={{ fontSize: 20 }} />} label="Address" value={viewDialog.webinar.address || '—'} />
                )}
                <FieldRow icon={<EuroRoundedIcon sx={{ fontSize: 20 }} />} label="Price" value={viewDialog.webinar.price === 0 ? 'Free' : `€${viewDialog.webinar.price.toFixed(2)}`} />
                <FieldRow icon={<GroupsRoundedIcon sx={{ fontSize: 20 }} />} label="Max Attendees" value={String(viewDialog.webinar.maxAttendees)} />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            px: { xs: 2.5, sm: 3.5 },
            py: 2,
            pt: 1.5,
            pb: { xs: 'max(16px, env(safe-area-inset-bottom))', sm: 2 },
            borderTop: '1px solid',
            borderColor: theme.palette.grey[200],
            bgcolor: theme.palette.background.paper,
            gap: 1,
          }}
        >
          <Button
            onClick={handleViewClose}
            startIcon={<CloseOutlinedIcon sx={{ fontSize: 20 }} />}
            sx={{
              color: 'text.secondary',
              fontWeight: 600,
              fontSize: '0.9375rem',
              textTransform: 'none',
              borderRadius: '10px',
              px: 2.5,
              py: 1,
              '&:hover': { bgcolor: alpha(ADMIN_PRIMARY, 0.08), color: ADMIN_PRIMARY },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete / Restore confirmation dialog — icons friendly */}
      <Dialog
        open={confirmState.open}
        onClose={handleConfirmClose}
        TransitionComponent={Transition}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            border: '1px solid',
            borderColor: alpha(ADMIN_PRIMARY, 0.18),
            boxShadow: `0 18px 40px ${alpha('#0f172a', 0.35)}`,
            overflow: 'hidden',
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            pb: 1.5,
            borderBottom: '1px solid',
            borderColor: alpha(ADMIN_PRIMARY, 0.08),
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '999px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor:
                confirmState.mode === 'restore'
                  ? alpha('#22c55e', 0.12)
                  : alpha('#ef4444', 0.1),
              color: confirmState.mode === 'restore' ? '#16a34a' : '#dc2626',
            }}
          >
            {confirmState.mode === 'restore' ? (
              <RestoreFromTrashRoundedIcon />
            ) : (
              <DeleteRoundedIcon />
            )}
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
              {confirmState.mode === 'restore' ? 'Restore webinar' : 'Delete webinar'}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
              {confirmState.mode === 'restore'
                ? 'This webinar will become Active or Inactive again.'
                : 'This webinar will be marked as Deleted, not permanently removed.'}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent
          sx={{
            py: 2,
            px: 3,
            bgcolor: alpha(ADMIN_PRIMARY, 0.01),
          }}
        >
          {confirmState.row && (
            <Box
              sx={{
                p: 1.25,
                mb: 1.5,
                borderRadius: 2,
                border: '1px solid',
                borderColor: alpha(ADMIN_PRIMARY, 0.12),
                bgcolor: 'background.paper',
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, color: 'text.primary', mb: 0.25 }}
              >
                {confirmState.row.eventTitle}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {formatDate(confirmState.row.startDate)} –{' '}
                {formatDate(confirmState.row.endDate)}
              </Typography>
            </Box>
          )}
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {confirmState.mode === 'restore'
              ? 'Are you sure you want to restore this webinar?'
              : 'Are you sure you want to move this webinar to Deleted? You can restore it later from the Deleted status filter.'}
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            px: 2.5,
            py: 1.75,
            borderTop: '1px solid',
            borderColor: alpha(ADMIN_PRIMARY, 0.08),
          }}
        >
          <Button
            onClick={handleConfirmClose}
            disabled={confirmLoading}
            startIcon={<CloseOutlinedIcon sx={{ fontSize: 18 }} />}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 999,
              px: 2.5,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmProceed}
            variant="contained"
            disabled={confirmLoading}
            color={confirmState.mode === 'restore' ? 'success' : 'error'}
            startIcon={
              confirmLoading ? (
                <AutorenewIcon
                  sx={{ fontSize: 18, animation: 'spin 0.8s linear infinite' }}
                />
              ) : confirmState.mode === 'restore' ? (
                <RestoreFromTrashRoundedIcon sx={{ fontSize: 18 }} />
              ) : (
                <DeleteRoundedIcon sx={{ fontSize: 18 }} />
              )
            }
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: 999,
              px: 2.75,
            }}
          >
            {confirmState.mode === 'restore' ? 'Restore webinar' : 'Delete webinar'}
          </Button>
        </DialogActions>
      </Dialog>

      <ImagePreviewDialog open={imagePreview.open} onClose={() => setImagePreview((p) => ({ ...p, open: false }))} src={imagePreview.src} alt={imagePreview.alt} title={imagePreview.title} />

      {/* Bookings dialog */}
      <Dialog
        open={bookingsDialog.open}
        onClose={handleCloseBookings}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Transition}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            border: '1px solid',
            borderColor: alpha(ADMIN_PRIMARY, 0.15),
            overflow: 'hidden',
            '&::before': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${ADMIN_PRIMARY} 0%, ${ADMIN_PRIMARY_LIGHT} 100%)` },
          },
        }}
      >
        <DialogTitle component="div" sx={{ pt: 3, pb: 2, px: 3, display: 'flex', alignItems: 'center', gap: 2, borderBottom: '1px solid', borderColor: alpha(ADMIN_PRIMARY, 0.1), bgcolor: alpha(ADMIN_PRIMARY, 0.02) }}>
          <Box sx={{ width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, bgcolor: alpha(ADMIN_PRIMARY, 0.12), color: ADMIN_PRIMARY, border: '2px solid', borderColor: alpha(ADMIN_PRIMARY, 0.2) }}>
            <BookOnlineRoundedIcon sx={{ fontSize: 26 }} />
          </Box>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', lineHeight: 1.3 }}>Bookings</Typography>
            {bookingsDialog.webinar && <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }} noWrap>{bookingsDialog.webinar.eventTitle}</Typography>}
          </Box>
          <IconButton size="small" onClick={handleCloseBookings} sx={{ color: 'text.secondary', '&:hover': { bgcolor: alpha(ADMIN_PRIMARY, 0.08) } }}>
            <CloseOutlinedIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          {bookingsDialog.loading ? (
            <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {Array.from({ length: 3 }).map((_, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1.5, borderRadius: '8px', border: '1px solid', borderColor: 'grey.200' }}>
                  <Skeleton variant="circular" width={40} height={40} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="60%" height={20} />
                    <Skeleton variant="text" width="40%" height={16} />
                  </Box>
                  <Skeleton variant="rounded" width={70} height={24} sx={{ borderRadius: '7px' }} />
                </Box>
              ))}
            </Box>
          ) : bookingsDialog.error ? (
            <Box sx={{ p: 3 }}>
              <Typography variant="body2" color="error" sx={{ fontWeight: 600 }}>{bookingsDialog.error}</Typography>
            </Box>
          ) : (
            <>
              {/* Summary bar */}
              <Box sx={{ px: 3, py: 1.75, display: 'flex', gap: 2, flexWrap: 'wrap', bgcolor: alpha(ADMIN_PRIMARY, 0.03), borderBottom: '1px solid', borderColor: alpha(ADMIN_PRIMARY, 0.1) }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <PeopleAltRoundedIcon sx={{ fontSize: 18, color: ADMIN_PRIMARY }} />
                  <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>{bookingsDialog.confirmed ?? 0} confirmed</Typography>
                </Box>
                {bookingsDialog.max != null && (
                  <>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <GroupsRoundedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>Max: {bookingsDialog.max}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <EventAvailableRoundedIcon sx={{ fontSize: 18, color: bookingsDialog.remaining === 0 ? 'error.main' : 'success.main' }} />
                      <Typography variant="body2" sx={{ fontWeight: 700, color: bookingsDialog.remaining === 0 ? 'error.main' : 'success.dark' }}>
                        {bookingsDialog.remaining} seats remaining
                      </Typography>
                    </Box>
                  </>
                )}
              </Box>

              {bookingsDialog.bookings.length === 0 ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <BookOnlineRoundedIcon sx={{ fontSize: 48, color: 'grey.400', mb: 1.5 }} />
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>No bookings yet for this webinar.</Typography>
                </Box>
              ) : (
                <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
                  {bookingsDialog.bookings.map((b, idx) => (
                    <Box key={b.id} sx={{ px: 3, py: 1.75, display: 'flex', alignItems: 'center', gap: 2, borderBottom: idx < bookingsDialog.bookings.length - 1 ? '1px solid' : 'none', borderColor: 'grey.200', '&:hover': { bgcolor: alpha(ADMIN_PRIMARY, 0.03) } }}>
                      {b.user?.profile_image ? (
                        <Box component="img" src={b.user.profile_image} alt={b.user.first_name} sx={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '2px solid', borderColor: alpha(ADMIN_PRIMARY, 0.2), flexShrink: 0 }} />
                      ) : (
                        <Box sx={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: alpha(ADMIN_PRIMARY, 0.12), color: ADMIN_PRIMARY, fontWeight: 700, fontSize: '1rem', flexShrink: 0, border: '2px solid', borderColor: alpha(ADMIN_PRIMARY, 0.2) }}>
                          {(b.user?.first_name?.[0] || 'U').toUpperCase()}
                        </Box>
                      )}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }} noWrap>
                          {b.user ? `${b.user.first_name || ''} ${b.user.last_name || ''}`.trim() || 'Unknown User' : 'Unknown User'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>{b.user?.email || '—'}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5, flexShrink: 0 }}>
                        <Chip
                          label={b.status}
                          size="small"
                          sx={{ height: 22, fontSize: '0.6875rem', fontWeight: 700, borderRadius: '6px', bgcolor: b.status === 'Confirmed' ? alpha(theme.palette.success.main, 0.12) : alpha(theme.palette.error.main, 0.12), color: b.status === 'Confirmed' ? theme.palette.success.dark : theme.palette.error.dark }}
                        />
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.6875rem' }}>
                          {b.created_at ? new Date(b.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: alpha(ADMIN_PRIMARY, 0.1), bgcolor: 'grey.50' }}>
          <Button onClick={handleCloseBookings} sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'none', borderRadius: '7px', '&:hover': { bgcolor: alpha(ADMIN_PRIMARY, 0.06) } }} startIcon={<CloseOutlinedIcon sx={{ fontSize: 18 }} />}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

/** Icon + label + value row for the view dialog (icons-friendly) */
function FieldRow({ icon, label, value, multiline }) {
  const theme = useTheme()
  return (
    <Paper
      elevation={0}
      sx={{
        display: 'flex',
        alignItems: multiline ? 'flex-start' : 'center',
        gap: 1.5,
        p: 1.5,
        borderRadius: '10px',
        border: '1px solid',
        borderColor: theme.palette.grey[200],
        bgcolor: theme.palette.background.paper,
        transition: 'border-color 0.2s, box-shadow 0.2s',
        '&:hover': {
          borderColor: theme.palette.grey[300],
          boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.04)}`,
        },
      }}
    >
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          bgcolor: alpha('#384D84', 0.08),
          color: '#384D84',
        }}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', mb: 0.25 }}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500, whiteSpace: multiline ? 'pre-wrap' : 'normal', lineHeight: 1.5 }}>
          {value || '—'}
        </Typography>
      </Box>
    </Paper>
  )
}

export default AdminWebinars
