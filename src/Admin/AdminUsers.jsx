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
  Avatar,
  IconButton,
  Tooltip,
  Chip,
  Pagination,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded'
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded'
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import RestoreFromTrashRoundedIcon from '@mui/icons-material/RestoreFromTrashRounded'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import ImagePreviewDialog from '../components/ImagePreviewDialog'
import apiClient from '../server'
import { useToast } from '../components/ToastProvider'

// Admin screen primary (#384D84 — no green/teal)
const ADMIN_PRIMARY = '#384D84'
const ADMIN_PRIMARY_DARK = '#2a3a64'
const ADMIN_PRIMARY_LIGHT = '#4a5f9a'

const ROWS_PER_PAGE_OPTIONS = [5, 10, 20, 30, 40, 50, 100]

const SKELETON_ROW_COUNT = 5

const keyframes = {
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
}

function AdminUsers() {
  const theme = useTheme()
  const navigate = useNavigate()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const showAsCards = useMediaQuery(theme.breakpoints.down('md'))
  const { showToast } = useToast()

  const [search, setSearch] = useState('')
  const [genderFilter, setGenderFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [users, setUsers] = useState([])
  const [imagePreview, setImagePreview] = useState({ open: false, src: '', alt: '', title: '' })
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalRows, setTotalRows] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [listLoading, setListLoading] = useState(false)
  const [listError, setListError] = useState('')
  const [confirmState, setConfirmState] = useState({
    open: false,
    mode: 'delete', // 'delete' | 'restore'
    row: null,
    loading: false,
  })

  const serverPage = page + 1
  const from = totalRows === 0 ? 0 : (serverPage - 1) * rowsPerPage + 1
  const to = Math.min((serverPage - 1) * rowsPerPage + rowsPerPage, totalRows)

  const handleChangePage = (_, value) => {
    const newPage = value - 1
    setPage(newPage)
    fetchUsers({
      applyFilters: !!(search || genderFilter || statusFilter),
      targetPage: value,
      targetPerPage: rowsPerPage,
    })
  }
  const handleChangeRowsPerPage = (e) => {
    const newPerPage = Number(e.target.value)
    setRowsPerPage(newPerPage)
    setPage(0)
    fetchUsers({
      applyFilters: !!(search || genderFilter || statusFilter),
      targetPage: 1,
      targetPerPage: newPerPage,
    })
  }

  const fetchUsers = async (opts = {}) => {
    const { applyFilters = false, targetPage = serverPage, targetPerPage = rowsPerPage } = opts
    setListLoading(true)
    setListError('')
    const params = new URLSearchParams()
    params.set('page', String(targetPage))
    params.set('per_page', String(targetPerPage))
    if (applyFilters) {
      if (search.trim()) params.set('text', search.trim())
      if (genderFilter) params.set('gender', genderFilter)
      if (statusFilter) {
        if (statusFilter === 'online' || statusFilter === 'offline') {
          params.set('availability', statusFilter)
        } else {
          params.set('status', statusFilter)
        }
      }
    }
    try {
      const { ok, data } = await apiClient(`/users?${params.toString()}`, 'GET')
      if (!ok || !data?.success) {
        const message =
          data?.errors && typeof data.errors === 'object'
            ? Object.values(data.errors).flat().join(' ')
            : data?.message
        setListError(message || 'Unable to load users.')
        showToast(message || 'Unable to load users.', 'error')
        return
      }
      const list = data.data?.users || []
      const pagination = data.data?.pagination || {}
      const mapped = list.map((u) => ({
        id: u.id,
        firstName: u.first_name ?? '',
        lastName: u.last_name ?? '',
        fullName: `${u.first_name ?? ''} ${u.last_name ?? ''}`.trim() || u.email,
        email: u.email,
        gender: u.gender ? (String(u.gender).toLowerCase() === 'male' ? 'Male' : String(u.gender).charAt(0).toUpperCase() + String(u.gender).slice(1)) : 'N/A',
        rawGender: u.gender || '',
        subscription: u.subscription_plan || u.subscription_type || (u.is_subscribed ? 'Subscribed' : 'None'),
        avatar: u.profile_image_url || '',
        status: u.status || 'Active',
        isOnline: typeof u.is_online === 'boolean' ? u.is_online : !!u.is_online,
        availability: u.availability || null,
        availabilityLabel: u.availability_label || null,
      }))
      setUsers(mapped)
      const total = Number(pagination.total ?? list.length ?? 0)
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
    fetchUsers({ applyFilters: false, targetPage: 1, targetPerPage: rowsPerPage })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSearch = () => {
    setPage(0)
    fetchUsers({ applyFilters: true, targetPage: 1 })
  }

  const handleReset = () => {
    setSearch('')
    setGenderFilter('')
    setStatusFilter('')
    setPage(0)
    fetchUsers({ applyFilters: false, targetPage: 1 })
  }

  const getSubscriptionColor = (sub) => {
    if (!sub || sub === 'None') return theme.palette.grey[500]
    const s = String(sub).toLowerCase()
    if (s.includes('premium')) return ADMIN_PRIMARY
    if (s.includes('standard')) return theme.palette.grey[700]
    return theme.palette.grey[600]
  }

  const openConfirmDelete = (row) =>
    setConfirmState({
      open: true,
      mode: 'delete',
      row,
      loading: false,
    })

  const openConfirmRestore = (row) =>
    setConfirmState({
      open: true,
      mode: 'restore',
      row,
      loading: false,
    })

  const handleCloseConfirm = () => {
    if (confirmState.loading) return
    setConfirmState((prev) => ({ ...prev, open: false, row: null }))
  }

  const handleConfirmSubmit = async () => {
    if (!confirmState.row) return
    const { mode, row } = confirmState
    setConfirmState((prev) => ({ ...prev, loading: true }))
    try {
      const payload = {
        first_name: row.firstName || '',
        last_name: row.lastName || '',
        gender: row.rawGender || 'male',
        status: mode === 'delete' ? 'InActive' : 'Active',
      }
      const { ok, data } = await apiClient(`/users/${row.id}`, 'POST', payload)
      if (!ok || !data?.success) {
        const message =
          data?.errors && typeof data.errors === 'object'
            ? Object.values(data.errors).flat().join(' ')
            : data?.message
        showToast(message || 'Unable to update user.', 'error')
        setConfirmState((prev) => ({ ...prev, loading: false }))
        return
      }
      showToast(mode === 'delete' ? 'User deleted successfully.' : 'User restored successfully.', 'success')
      setConfirmState({ open: false, mode: 'delete', row: null, loading: false })
      fetchUsers({
        applyFilters: !!(search || genderFilter || statusFilter),
        targetPage: serverPage,
        targetPerPage: rowsPerPage,
      })
    } catch {
      showToast('Unable to update user.', 'error')
      setConfirmState((prev) => ({ ...prev, loading: false }))
    }
  }

  return (
    <Box
      sx={{
        ...keyframes,
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
          <PeopleRoundedIcon sx={{ fontSize: { xs: 28, sm: 32 }, color: ADMIN_PRIMARY }} />
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
            Users
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
          Manage platform users
        </Typography>
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
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: { xs: 1, sm: 2 },
          }}
        >
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
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: alpha(ADMIN_PRIMARY, 0.3),
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: ADMIN_PRIMARY,
                  borderWidth: 2,
                },
              },
              '& .MuiInputLabel-root.Mui-focused': { color: ADMIN_PRIMARY },
            }}
          />
          <FormControl
            size="small"
            sx={{
              minWidth: { xs: '100%', sm: 100 },
              flex: { xs: '1 1 100%', sm: '0 0 auto' },
              flexShrink: 0,
              '& .MuiOutlinedInput-root': {
                bgcolor: theme.palette.grey[50],
                borderRadius: '7px',
              },
              '& .MuiInputLabel-root.Mui-focused': { color: ADMIN_PRIMARY },
            }}
          >
            <InputLabel id="gender-label">Gender</InputLabel>
            <Select
              labelId="gender-label"
              value={genderFilter}
              label="Gender"
              onChange={(e) => setGenderFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
            </Select>
          </FormControl>
          <FormControl
            size="small"
            sx={{
              minWidth: { xs: '100%', sm: 110 },
              flex: { xs: '1 1 100%', sm: '0 0 auto' },
              flexShrink: 0,
              '& .MuiOutlinedInput-root': {
                bgcolor: theme.palette.grey[50],
                borderRadius: '7px',
              },
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
              <MenuItem value="InActive">Deleted/InActive</MenuItem>
              <MenuItem value="online">Online</MenuItem>
              <MenuItem value="offline">Offline</MenuItem>
            </Select>
          </FormControl>
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              width: { xs: '100%', sm: 'auto' },
              flex: { xs: '1 1 100%', sm: '0 0 auto' },
              flexShrink: 0,
            }}
          >
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
                minWidth: { sm: 'auto' },
                whiteSpace: 'nowrap',
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
                minWidth: { sm: 'auto' },
                whiteSpace: 'nowrap',
                '&:hover': {
                  borderColor: ADMIN_PRIMARY,
                  bgcolor: alpha(ADMIN_PRIMARY, 0.04),
                },
              }}
            >
              Reset
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Table section with Add User in header */}
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
            User list
          </Typography>
          {/* <Button
            variant="contained"
            startIcon={<PersonAddRoundedIcon />}
            onClick={() => navigate('/admin/users')}
            sx={{
              bgcolor: ADMIN_PRIMARY,
              borderRadius: '7px',
              fontWeight: 600,
              '&:hover': { bgcolor: ADMIN_PRIMARY_DARK },
            }}
          >
            Add User
          </Button> */}
        </Box>

        {/* Desktop: table */}
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
                  <TableCell>Gender</TableCell>
                  <TableCell>Subscription</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Availability</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {listLoading
                  ? Array.from({ length: SKELETON_ROW_COUNT }).map((_, idx) => (
                      <TableRow
                        key={`skeleton-${idx}`}
                        sx={{
                          '& .MuiTableCell-body': {
                            borderColor: theme.palette.grey[200],
                            py: 1.5,
                          },
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Skeleton variant="circular" width={40} height={40} />
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, flex: 1 }}>
                              <Skeleton variant="text" width="60%" sx={{ borderRadius: 1, maxWidth: 160 }} />
                              <Skeleton variant="text" width="80%" sx={{ borderRadius: 1, maxWidth: 220 }} />
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="rounded" width={72} height={24} sx={{ borderRadius: '7px' }} />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="rounded" width={96} height={24} sx={{ borderRadius: '7px' }} />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="rounded" width={80} height={24} sx={{ borderRadius: '7px' }} />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="rounded" width={72} height={24} sx={{ borderRadius: '7px' }} />
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                            <Skeleton variant="circular" width={32} height={32} />
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  : users.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
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
                              No users found.
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: 'text.disabled', maxWidth: 320 }}
                            >
                              Use the filters above to refine your search.
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )
                  : users.map((row) => (
                      <TableRow
                        key={row.id}
                        hover
                        sx={{
                          '&:hover': { bgcolor: alpha(ADMIN_PRIMARY, 0.04) },
                          '& .MuiTableCell-body': {
                            borderColor: theme.palette.grey[200],
                            py: 1.5,
                            fontSize: '0.875rem',
                          },
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                              <Avatar
                                src={row.avatar}
                                alt={row.fullName}
                                onClick={() =>
                                  row.avatar &&
                                  setImagePreview({
                                    open: true,
                                    src: row.avatar,
                                    alt: row.fullName,
                                    title: row.fullName,
                                  })
                                }
                                sx={{
                                  width: 40,
                                  height: 40,
                                  borderRadius: '7px',
                                  bgcolor: alpha(ADMIN_PRIMARY, 0.12),
                                  color: ADMIN_PRIMARY,
                                  cursor: row.avatar ? 'pointer' : 'default',
                                  '&:hover': row.avatar
                                    ? { opacity: 0.9, boxShadow: `0 2px 8px ${alpha(ADMIN_PRIMARY, 0.3)}` }
                                    : undefined,
                                }}
                              >
                                {row.fullName?.charAt(0) || row.email?.charAt(0)}
                              </Avatar>
                              <Box
                                sx={{
                                  position: 'absolute',
                                  bottom: -2,
                                  right: -2,
                                  width: 12,
                                  height: 12,
                                  borderRadius: '50%',
                                  bgcolor: row.isOnline ? '#22c55e' : theme.palette.grey[600],
                                  border: '2px solid',
                                  borderColor: theme.palette.background.paper,
                                  boxShadow: row.isOnline ? '0 0 0 1px rgba(34, 197, 94, 0.4), 0 0 6px rgba(34, 197, 94, 0.5)' : 'none',
                                }}
                              />
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 600, color: 'text.primary' }}
                                noWrap
                              >
                                {row.fullName}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{ color: 'text.secondary', fontSize: '0.8125rem' }}
                                noWrap
                              >
                                {row.email}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={row.gender}
                            size="small"
                            sx={{
                              height: 24,
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              bgcolor:
                                row.gender === 'Male'
                                  ? alpha(ADMIN_PRIMARY, 0.12)
                                  : alpha(ADMIN_PRIMARY_LIGHT, 0.15),
                              color: row.gender === 'Male' ? ADMIN_PRIMARY_DARK : ADMIN_PRIMARY,
                              borderRadius: '7px',
                              border: 'none',
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={row.subscription}
                            size="small"
                            sx={{
                              height: 24,
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              bgcolor: alpha(getSubscriptionColor(row.subscription), 0.12),
                              color: getSubscriptionColor(row.subscription),
                              borderRadius: '7px',
                              border: 'none',
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={row.status}
                            size="small"
                            sx={{
                              height: 24,
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              borderRadius: '7px',
                              bgcolor:
                                row.status === 'Active'
                                  ? alpha(theme.palette.success.main, 0.12)
                                  : alpha(theme.palette.error.main, 0.12),
                              color:
                                row.status === 'Active'
                                  ? theme.palette.success.dark
                                  : theme.palette.error.dark,
                              border: 'none',
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={row.availability === 'online' ? (row.availabilityLabel || 'Online') : (row.availabilityLabel || 'Offline')}
                            size="small"
                            sx={{
                              height: 24,
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              borderRadius: '7px',
                              bgcolor:
                                row.availability === 'online'
                                  ? alpha(theme.palette.success.main, 0.12)
                                  : alpha(theme.palette.grey[500], 0.12),
                              color:
                                row.availability === 'online'
                                  ? theme.palette.success.dark
                                  : theme.palette.grey[700],
                              border: 'none',
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                            <Tooltip title="View details" placement="top" arrow>
                              <IconButton
                                size="small"
                                onClick={() => navigate(`/admin/users/view/${row.id}`, { state: { user: row } })}
                                sx={{
                                  color: theme.palette.info.main,
                                  '&:hover': {
                                    color: theme.palette.info.dark,
                                    bgcolor: alpha(theme.palette.info.main, 0.12),
                                  },
                                }}
                              >
                                <VisibilityRoundedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            {row.status === 'Active' ? (
                              <Tooltip title="Delete user" placement="top" arrow>
                                <IconButton
                                  size="small"
                                  onClick={() => openConfirmDelete(row)}
                                  sx={{
                                    color: theme.palette.error.main,
                                    '&:hover': {
                                      color: theme.palette.error.dark,
                                      bgcolor: alpha(theme.palette.error.main, 0.12),
                                    },
                                  }}
                                >
                                  <DeleteRoundedIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            ) : (
                              <Tooltip title="Restore user" placement="top" arrow>
                                <IconButton
                                  size="small"
                                  onClick={() => openConfirmRestore(row)}
                                  sx={{
                                    color: theme.palette.success.main,
                                    '&:hover': {
                                      color: theme.palette.success.dark,
                                      bgcolor: alpha(theme.palette.success.main, 0.12),
                                    },
                                  }}
                                >
                                  <RestoreFromTrashRoundedIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Mobile/Tablet: card list — no horizontal scroll, full data in single view */}
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
            {paginatedUsers.map((row) => (
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
                {/* Top row: avatar + name/email + actions */}
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
                    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                      <Avatar
                        src={row.avatar}
                        alt={row.fullName}
                        onClick={() => setImagePreview({ open: true, src: row.avatar, alt: row.fullName, title: row.fullName })}
                        sx={{
                          width: { xs: 56, sm: 48 },
                          height: { xs: 56, sm: 48 },
                          flexShrink: 0,
                          bgcolor: alpha(ADMIN_PRIMARY, 0.12),
                          color: ADMIN_PRIMARY,
                          cursor: 'pointer',
                          borderRadius: '7px',
                          border: `2px solid ${alpha(ADMIN_PRIMARY, 0.2)}`,
                          '&:hover': {
                            opacity: 0.9,
                            boxShadow: `0 4px 12px ${alpha(ADMIN_PRIMARY, 0.25)}`,
                            borderColor: ADMIN_PRIMARY,
                          },
                        }}
                      >
                        {row.fullName.charAt(0)}
                      </Avatar>
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: -2,
                          right: -2,
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          bgcolor: row.isOnline ? '#22c55e' : theme.palette.grey[600],
                          border: '2px solid',
                          borderColor: theme.palette.background.paper,
                          boxShadow: row.isOnline ? '0 0 0 1px rgba(34, 197, 94, 0.4), 0 0 6px rgba(34, 197, 94, 0.5)' : 'none',
                        }}
                      />
                    </Box>
                    <Box sx={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
                      <Typography
                        variant="subtitle1"
                        noWrap
                        sx={{
                          fontWeight: 700,
                          color: 'text.primary',
                          lineHeight: 1.3,
                          fontSize: { xs: '1rem', sm: '0.875rem' },
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {row.fullName}
                      </Typography>
                      <Typography
                        variant="body2"
                        noWrap
                        sx={{
                          color: 'text.secondary',
                          fontSize: { xs: '0.9375rem', sm: '0.875rem' },
                          mt: 0.5,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {row.email}
                      </Typography>
                    </Box>
                  </Box>
                  {/* View: shown next to name on tablet+ only; on mobile in card footer */}
                  <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', flexShrink: 0, gap: 0.25 }}>
                    <Tooltip title="View details" placement="top" arrow>
                      <IconButton
                        size="medium"
                        onClick={() => navigate(`/admin/users/view/${row.id}`, { state: { user: row } })}
                        sx={{
                          color: theme.palette.info.main,
                          '&:hover': {
                            color: theme.palette.info.dark,
                            bgcolor: alpha(theme.palette.info.main, 0.15),
                          },
                        }}
                      >
                        <VisibilityRoundedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                {/* Bottom row: chips (labels only on tablet+); on mobile, View/Edit/Delete in footer */}
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
                    <Typography
                      variant="caption"
                      sx={{
                        display: { xs: 'none', sm: 'inline' },
                        color: 'text.secondary',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                        flexShrink: 0,
                      }}
                    >
                      Gender
                    </Typography>
                    <Chip
                      label={row.gender}
                      size="small"
                      sx={{
                        height: { xs: 28, sm: 26 },
                        fontSize: { xs: '0.8125rem', sm: '0.75rem' },
                        fontWeight: 600,
                        bgcolor: row.gender === 'Male' ? alpha(ADMIN_PRIMARY, 0.12) : alpha(ADMIN_PRIMARY_LIGHT, 0.15),
                        color: row.gender === 'Male' ? ADMIN_PRIMARY_DARK : ADMIN_PRIMARY,
                        borderRadius: '7px',
                        border: 'none',
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        display: { xs: 'none', sm: 'inline' },
                        color: 'text.secondary',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                        flexShrink: 0,
                      }}
                    >
                      Plan
                    </Typography>
                    <Chip
                      label={row.subscription}
                      size="small"
                      sx={{
                        height: { xs: 28, sm: 26 },
                        fontSize: { xs: '0.8125rem', sm: '0.75rem' },
                        fontWeight: 600,
                        borderRadius: '7px',
                        bgcolor: alpha(getSubscriptionColor(row.subscription), 0.12),
                        color: getSubscriptionColor(row.subscription),
                        border: 'none',
                      }}
                    />
                    <Chip
                      label={row.availability === 'online' ? (row.availabilityLabel || 'Online') : (row.availabilityLabel || 'Offline')}
                      size="small"
                      sx={{
                        height: { xs: 28, sm: 26 },
                        fontSize: { xs: '0.8125rem', sm: '0.75rem' },
                        fontWeight: 600,
                        borderRadius: '7px',
                        bgcolor: row.availability === 'online' ? alpha(theme.palette.success.main, 0.12) : alpha(theme.palette.grey[500], 0.12),
                        color: row.availability === 'online' ? theme.palette.success.dark : theme.palette.grey[700],
                        border: 'none',
                      }}
                    />
                  </Box>
                  {/* Mobile only: View in card footer */}
                  <Box sx={{ display: { xs: 'flex', sm: 'none' }, alignItems: 'center', flexShrink: 0, gap: 0.25 }}>
                    <Tooltip title="View details" placement="top" arrow>
                      <IconButton
                        size="large"
                        onClick={() => navigate(`/admin/users/view/${row.id}`, { state: { user: row } })}
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
                  </Box>
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
          {/* Row 1 on mobile: Rows per page + dropdown + count in one line */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: { xs: 'center', sm: 'flex-start' },
              gap: { xs: 1, sm: 1.5 },
              width: { xs: '100%', sm: 'auto' },
              minWidth: 0,
            }}
          >
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: { xs: '0.8125rem', sm: '0.875rem' }, flexShrink: 0 }}>
              Rows per page
            </Typography>
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
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.grey[300],
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: ADMIN_PRIMARY,
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: ADMIN_PRIMARY,
                    borderWidth: 2,
                  },
                }}
              >
                {ROWS_PER_PAGE_OPTIONS.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                fontWeight: 500,
                fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                flexShrink: 0,
              }}
            >
              {totalRows === 0 ? '0–0 of 0' : `${from}–${to} of ${totalRows}`}
            </Typography>
          </Box>

          {/* Row 2 on mobile: Page X of Y + pagination on same line */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'nowrap',
              alignItems: 'center',
              justifyContent: { xs: 'center', sm: 'flex-end' },
              gap: { xs: 1, sm: 1.5 },
              width: { xs: '100%', sm: 'auto' },
              minWidth: 0,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
              <ViewListRoundedIcon sx={{ color: ADMIN_PRIMARY, fontSize: { xs: 18, sm: 22 } }} />
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.75rem' } }}>
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
                  '&:hover': {
                    background: `linear-gradient(135deg, ${ADMIN_PRIMARY_LIGHT}, ${ADMIN_PRIMARY})`,
                  },
                },
                '& .MuiPaginationItem-page:not(.Mui-selected):hover': {
                  backgroundColor: alpha(ADMIN_PRIMARY, 0.1),
                  color: ADMIN_PRIMARY,
                },
                '& .MuiPaginationItem-icon': {
                  color: ADMIN_PRIMARY,
                  fontSize: 20,
                },
              }}
            />
          </Box>
        </Box>
      </Paper>

      {/* Confirm delete / restore dialog */}
      <Dialog
        open={confirmState.open}
        onClose={handleCloseConfirm}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '7px',
            border: '1px solid',
            borderColor: alpha(ADMIN_PRIMARY, 0.2),
            overflow: 'hidden',
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            borderBottom: '1px solid',
            borderColor: theme.palette.divider,
            py: 2,
            px: 2.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '7px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor:
                  confirmState.mode === 'restore'
                    ? alpha(theme.palette.success.main, 0.12)
                    : alpha(theme.palette.error.main, 0.08),
              }}
            >
              {confirmState.mode === 'restore' ? (
                <RestoreFromTrashRoundedIcon sx={{ fontSize: 22, color: theme.palette.success.dark }} />
              ) : (
                <DeleteRoundedIcon sx={{ fontSize: 22, color: theme.palette.error.dark }} />
              )}
            </Box>
            {confirmState.mode === 'restore' ? 'Restore user' : 'Delete user'}
          </Box>
        </DialogTitle>
        <DialogContent sx={{ px: 2.5, pt: 2.5, pb: 1 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {confirmState.mode === 'restore'
              ? 'Are you sure you want to restore this user?'
              : 'Are you sure you want to delete this user? You can restore them later from the list.'}
          </Typography>
          {confirmState.row && (
            <Typography variant="subtitle2" sx={{ mt: 1.5, fontWeight: 600, color: 'text.primary' }}>
              {confirmState.row.fullName}
            </Typography>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            px: 2.5,
            py: 2,
            borderTop: '1px solid',
            borderColor: theme.palette.divider,
            gap: 1,
          }}
        >
          <Button
            variant="outlined"
            onClick={handleCloseConfirm}
            disabled={confirmState.loading}
            sx={{
              borderColor: theme.palette.grey[300],
              color: 'text.primary',
              borderRadius: '7px',
              fontWeight: 600,
              '&:hover': { borderColor: ADMIN_PRIMARY, bgcolor: alpha(ADMIN_PRIMARY, 0.04) },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmSubmit}
            variant="contained"
            disabled={confirmState.loading}
            startIcon={
              confirmState.loading ? (
                <AutorenewIcon
                  sx={{
                    animation: 'spin 0.8s linear infinite',
                    color: '#fff',
                  }}
                />
              ) : confirmState.mode === 'restore' ? (
                <RestoreFromTrashRoundedIcon sx={{ fontSize: 20, color: '#fff' }} />
              ) : (
                <DeleteRoundedIcon sx={{ fontSize: 20, color: '#fff' }} />
              )
            }
            sx={{
              bgcolor: confirmState.mode === 'restore' ? ADMIN_PRIMARY : theme.palette.error.main,
              borderRadius: '7px',
              fontWeight: 600,
              px: 2.5,
              color: '#fff',
              '&:hover': {
                bgcolor: confirmState.mode === 'restore' ? ADMIN_PRIMARY_DARK : theme.palette.error.dark,
              },
              '&.Mui-disabled': {
                color: '#fff',
                bgcolor: confirmState.mode === 'restore' ? ADMIN_PRIMARY : theme.palette.error.main,
                opacity: 1,
              },
            }}
          >
            {confirmState.loading
              ? 'Processing…'
              : confirmState.mode === 'restore'
              ? 'Yes, restore'
              : 'Yes, delete'}
          </Button>
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

export default AdminUsers
