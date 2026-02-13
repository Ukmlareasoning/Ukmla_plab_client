import { useState } from 'react'
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
import ImagePreviewDialog from '../components/ImagePreviewDialog'

const ADMIN_PRIMARY = '#384D84'
const ADMIN_PRIMARY_DARK = '#2a3a64'
const ADMIN_PRIMARY_LIGHT = '#4a5f9a'

const ROWS_PER_PAGE_OPTIONS = [5, 10, 20, 30, 40, 50, 100]

// Static webinar records
const STATIC_WEBINARS = [
  {
    id: 1,
    eventTitle: 'UKMLA PLAB 1 Overview',
    description: 'A comprehensive overview of the UKMLA PLAB 1 exam structure, preparation tips, and common pitfalls.',
    startDate: '2025-03-15',
    endDate: '2025-03-15',
    startTime: '14:00',
    endTime: '16:00',
    isOnline: true,
    zoomMeetingLink: 'https://zoom.us/j/1234567890',
    address: '',
    price: 0,
    maxAttendees: 100,
    bannerImage: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=400&h=200&fit=crop',
    status: 'Active',
  },
  {
    id: 2,
    eventTitle: 'Clinical Reasoning Workshop',
    description: 'Hands-on workshop on clinical reasoning and decision-making for PLAB 1.',
    startDate: '2025-03-22',
    endDate: '2025-03-22',
    startTime: '10:00',
    endTime: '12:30',
    isOnline: false,
    zoomMeetingLink: '',
    address: '123 Medical Centre, London, UK',
    price: 49.99,
    maxAttendees: 50,
    bannerImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=200&fit=crop',
    status: 'Active',
  },
  {
    id: 3,
    eventTitle: 'Ethics & Communication',
    description: 'Ethics and communication skills session for UKMLA candidates.',
    startDate: '2025-04-05',
    endDate: '2025-04-05',
    startTime: '09:00',
    endTime: '11:00',
    isOnline: true,
    zoomMeetingLink: 'https://zoom.us/j/9876543210',
    address: '',
    price: 29.99,
    maxAttendees: 80,
    bannerImage: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=200&fit=crop',
    status: 'Inactive',
  },
]

const Transition = (props) => <Slide {...props} direction="up" />

function AdminWebinars() {
  const theme = useTheme()
  const navigate = useNavigate()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const showAsCards = useMediaQuery(theme.breakpoints.down('md'))

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [webinars] = useState(STATIC_WEBINARS)
  const [viewDialog, setViewDialog] = useState({ open: false, webinar: null })
  const [imagePreview, setImagePreview] = useState({ open: false, src: '', alt: '', title: '' })
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const totalRows = webinars.length
  const totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage))
  const paginatedWebinars = webinars.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
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
    setStatusFilter('')
  }

  const handleViewOpen = (webinar) => setViewDialog({ open: true, webinar })
  const handleViewClose = () => setViewDialog({ open: false, webinar: null })

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—')
  const formatTime = (t) => {
    if (!t) return '—'
    if (t.length === 5 && t.includes(':')) return t // already "HH:MM"
    if (t.length >= 4) return `${t.slice(0, 2)}:${t.slice(2, 4)}`
    return t
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
            <Select labelId="status-label" value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
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
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedWebinars.map((row) => (
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
                        <Chip label={`€${row.price.toFixed(2)}`} size="small" sx={{ height: 24, fontSize: '0.75rem', fontWeight: 600, bgcolor: alpha(ADMIN_PRIMARY, 0.12), color: ADMIN_PRIMARY_DARK, borderRadius: '7px', border: 'none' }} />
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
                          bgcolor: row.status === 'Active' ? alpha(theme.palette.success.main, 0.12) : alpha(theme.palette.grey[500], 0.12),
                          color: row.status === 'Active' ? theme.palette.success.dark : theme.palette.grey[700],
                          borderRadius: '7px',
                          border: 'none',
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="View" placement="top" arrow>
                        <IconButton size="small" onClick={() => handleViewOpen(row)} sx={{ color: theme.palette.info.main, '&:hover': { color: theme.palette.info.dark, bgcolor: alpha(theme.palette.info.main, 0.12) } }}>
                          <VisibilityRoundedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit" placement="top" arrow>
                        <IconButton size="small" sx={{ color: theme.palette.grey[600], ml: 0.5, '&:hover': { color: ADMIN_PRIMARY, bgcolor: alpha(ADMIN_PRIMARY, 0.08) } }}>
                          <EditRoundedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete" placement="top" arrow>
                        <IconButton size="small" sx={{ color: theme.palette.error.main, ml: 0.5, '&:hover': { color: theme.palette.error.dark, bgcolor: alpha(theme.palette.error.main, 0.12) } }}>
                          <DeleteRoundedIcon fontSize="small" />
                        </IconButton>
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
            {paginatedWebinars.map((row) => (
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
                    <Tooltip title="Delete" placement="top" arrow>
                      <IconButton
                        size="medium"
                        sx={{
                          color: theme.palette.error.main,
                          '&:hover': {
                            color: theme.palette.error.dark,
                            bgcolor: alpha(theme.palette.error.main, 0.15),
                          },
                        }}
                      >
                        <DeleteRoundedIcon fontSize="small" />
                      </IconButton>
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
                  {/* Mobile only: View, Edit, Delete in card footer — same as Services */}
                  <Box sx={{ display: { xs: 'flex', sm: 'none' }, alignItems: 'center', flexShrink: 0, gap: 0.25 }}>
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
                    <Tooltip title="Delete" placement="top" arrow>
                      <IconButton
                        size="large"
                        sx={{
                          color: theme.palette.error.main,
                          bgcolor: alpha(theme.palette.error.main, 0.08),
                          '&:hover': {
                            color: theme.palette.error.dark,
                            bgcolor: alpha(theme.palette.error.main, 0.15),
                          },
                        }}
                      >
                        <DeleteRoundedIcon fontSize="medium" />
                      </IconButton>
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
              onChange={(_, value) => setPage(value - 1)}
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
                {viewDialog.webinar.isOnline ? (
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

      <ImagePreviewDialog open={imagePreview.open} onClose={() => setImagePreview((p) => ({ ...p, open: false }))} src={imagePreview.src} alt={imagePreview.alt} title={imagePreview.title} />
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
