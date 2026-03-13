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
  FormHelperText,
} from '@mui/material'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import RestoreFromTrashRoundedIcon from '@mui/icons-material/RestoreFromTrashRounded'
import SaveRoundedIcon from '@mui/icons-material/SaveRounded'
import apiClient from '../server'
import { useToast } from '../components/ToastProvider'

const ADMIN_PRIMARY = '#384D84'
const ADMIN_PRIMARY_DARK = '#2a3a64'
const ADMIN_PRIMARY_LIGHT = '#4a5f9a'

const ROWS_PER_PAGE_OPTIONS = [5, 10, 20, 30, 50, 100]

const keyframes = {
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
}

const SKELETON_ROW_COUNT = 5

// Format: 1 January 2026 12:15 PM
function formatCreated(dateStr) {
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return '—'
  const day = d.getDate()
  const month = d.toLocaleString('en-GB', { month: 'long' })
  const year = d.getFullYear()
  const h = d.getHours()
  const m = d.getMinutes()
  const ampm = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 || 12
  const time = `${h12}:${m.toString().padStart(2, '0')} ${ampm}`
  return `${day} ${month} ${year} ${time}`
}

function AdminAnnouncements() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const showAsCards = useMediaQuery(theme.breakpoints.down('md'))
  const { showToast } = useToast()

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [announcements, setAnnouncements] = useState([])
  const [viewDialog, setViewDialog] = useState({ open: false, row: null })
  const [dialogState, setDialogState] = useState({
    open: false,
    mode: 'add', // 'add' | 'edit'
    id: null,
    title: '',
    type: '',
    description: '',
    status: 'Active',
  })
  const [dialogTitleError, setDialogTitleError] = useState('')
  const [dialogTypeError, setDialogTypeError] = useState('')
  const [dialogDescriptionError, setDialogDescriptionError] = useState('')
  const [dialogStatusError, setDialogStatusError] = useState('')
  const [dialogLoading, setDialogLoading] = useState(false)

  const [listLoading, setListLoading] = useState(false)
  const [listError, setListError] = useState('')
  const [rowActionLoading, setRowActionLoading] = useState({})

  const [confirmState, setConfirmState] = useState({
    open: false,
    mode: 'delete', // 'delete' | 'restore'
    row: null,
  })
  const [confirmLoading, setConfirmLoading] = useState(false)

  const [page, setPage] = useState(0) // zero-based UI page
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalRows, setTotalRows] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  const serverPage = page + 1

  const from = totalRows === 0 ? 0 : (serverPage - 1) * rowsPerPage + 1
  const to = Math.min((serverPage - 1) * rowsPerPage + rowsPerPage, totalRows)

  const handleChangePage = (_, value) => {
    const newPage = value - 1
    setPage(newPage)
    fetchAnnouncements({
      applyFilters: !!(search || typeFilter || statusFilter),
      targetPage: value,
      targetPerPage: rowsPerPage,
    })
  }
  const handleChangeRowsPerPage = (e) => {
    const newPerPage = Number(e.target.value)
    setRowsPerPage(newPerPage)
    setPage(0)
    fetchAnnouncements({
      applyFilters: !!(search || typeFilter || statusFilter),
      targetPage: 1,
      targetPerPage: newPerPage,
    })
  }

  const fetchAnnouncements = async (opts = {}) => {
    const { applyFilters = false, targetPage = serverPage, targetPerPage = rowsPerPage } = opts

    setListLoading(true)
    setListError('')

    const params = new URLSearchParams()
    params.set('page', String(targetPage))
    params.set('per_page', String(targetPerPage))
    if (applyFilters) {
      params.set('apply_filters', '1')
      if (search.trim()) params.set('text', search.trim())
      if (typeFilter) params.set('type', typeFilter)
      if (statusFilter) params.set('status', statusFilter)
    }

    try {
      const { ok, data } = await apiClient(`/announcements?${params.toString()}`, 'GET')
      if (!ok || !data?.success) {
        const message =
          data?.errors && typeof data.errors === 'object'
            ? Object.values(data.errors).flat().join(' ')
            : data?.message
        setListError(message || 'Unable to load announcements.')
        return
      }

      const list = data.data?.announcements || []
      const pagination = data.data?.pagination || {}

      setAnnouncements(list)
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
    fetchAnnouncements({ applyFilters: false, targetPage: 1, targetPerPage: rowsPerPage })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSearch = () => {
    setPage(0)
    fetchAnnouncements({ applyFilters: true, targetPage: 1 })
  }
  const handleReset = () => {
    setSearch('')
    setTypeFilter('')
    setStatusFilter('')
    setPage(0)
    fetchAnnouncements({ applyFilters: false, targetPage: 1 })
  }

  const handleViewOpen = (row) => setViewDialog({ open: true, row })
  const handleViewClose = () => setViewDialog({ open: false, row: null })

  const handleAddDialogOpen = () => {
    setDialogState({
      open: true,
      mode: 'add',
      id: null,
      title: '',
      type: '',
      description: '',
      status: 'Active',
    })
    setDialogTitleError('')
    setDialogTypeError('')
    setDialogDescriptionError('')
    setDialogStatusError('')
  }

  const handleDialogClose = () => {
    if (dialogLoading) return
    setDialogState((prev) => ({
      ...prev,
      open: false,
    }))
    setDialogTitleError('')
    setDialogTypeError('')
    setDialogDescriptionError('')
    setDialogStatusError('')
  }

  const openEditDialog = (row) => {
    setDialogState({
      open: true,
      mode: 'edit',
      id: row.id,
      title: row.title || '',
      type: row.type || '',
      description: row.description || '',
      status: row.status === 'Deleted' ? 'Inactive' : row.status || 'Active',
    })
    setDialogTitleError('')
    setDialogTypeError('')
    setDialogDescriptionError('')
    setDialogStatusError('')
  }

  const handleDialogSubmit = async (e) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault()
    }
    if (dialogLoading) return

    setDialogLoading(true)
    setDialogTitleError('')
    setDialogTypeError('')
    setDialogDescriptionError('')
    setDialogStatusError('')

    const payload =
      dialogState.mode === 'edit'
        ? {
            title: dialogState.title.trim(),
            type: dialogState.type || '',
            description: dialogState.description.trim(),
            status: dialogState.status || 'Active',
          }
        : {
            title: dialogState.title.trim(),
            type: dialogState.type || '',
            description: dialogState.description.trim(),
          }

    const method = 'POST'
    const path =
      dialogState.mode === 'edit'
        ? `/announcements/${dialogState.id}`
        : '/announcements'

    try {
      const { ok, data } = await apiClient(path, method, payload)
      if (!ok || !data?.success) {
        const errors = data?.errors || {}
        if (errors.title) {
          const msg = Array.isArray(errors.title) ? errors.title[0] : errors.title
          if (msg) setDialogTitleError(String(msg))
        }
        if (errors.type) {
          const msg = Array.isArray(errors.type) ? errors.type[0] : errors.type
          if (msg) setDialogTypeError(String(msg))
        }
        if (errors.description) {
          const msg = Array.isArray(errors.description) ? errors.description[0] : errors.description
          if (msg) setDialogDescriptionError(String(msg))
        }
        if (errors.status) {
          const msg = Array.isArray(errors.status) ? errors.status[0] : errors.status
          if (msg) setDialogStatusError(String(msg))
        }
        if (!errors.title && !errors.type && !errors.description && !errors.status) {
          const serverMessage =
            data?.errors && typeof data.errors === 'object'
              ? Object.values(data.errors).flat().join(' ')
              : data?.message
          setDialogTitleError(serverMessage || 'Unable to save announcement. Please try again.')
        }
        return
      }

      showToast(
        dialogState.mode === 'edit'
          ? 'Announcement updated successfully.'
          : 'Announcement added successfully.',
        'success',
      )
      handleDialogClose()
      fetchAnnouncements({ applyFilters: !!(search || typeFilter || statusFilter), targetPage: serverPage })
    } catch {
      setDialogTitleError('Unable to reach server. Please try again.')
    } finally {
      setDialogLoading(false)
    }
  }

  const handleDelete = async (row) => {
    if (!row?.id) return
    setRowActionLoading((prev) => ({ ...prev, [row.id]: true }))
    try {
      const { ok, data } = await apiClient(`/announcements/${row.id}`, 'DELETE')
      if (!ok || !data?.success) {
        const message =
          data?.errors && typeof data.errors === 'object'
            ? Object.values(data.errors).flat().join(' ')
            : data?.message
        showToast(message || 'Unable to delete announcement.', 'error')
        return
      }
      showToast('Announcement deleted successfully.', 'success')
      fetchAnnouncements({ applyFilters: !!(search || typeFilter || statusFilter), targetPage: serverPage })
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
      const { ok, data } = await apiClient(`/announcements/${row.id}/restore`, 'POST')
      if (!ok || !data?.success) {
        const message =
          data?.errors && typeof data.errors === 'object'
            ? Object.values(data.errors).flat().join(' ')
            : data?.message
        showToast(message || 'Unable to restore announcement.', 'error')
        return
      }
      showToast('Announcement restored successfully.', 'success')
      fetchAnnouncements({ applyFilters: !!(search || typeFilter || statusFilter), targetPage: serverPage })
    } catch {
      showToast('Unable to reach server. Please try again.', 'error')
    } finally {
      setRowActionLoading((prev) => ({ ...prev, [row.id]: false }))
    }
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
        ...keyframes,
        width: '100%',
        minWidth: 0,
        maxWidth: 1400,
        mx: 'auto',
        overflowX: 'hidden',
      }}
    >
      {/* Confirm delete / restore dialog */}
      <Dialog
        open={confirmState.open}
        onClose={handleConfirmClose}
        maxWidth="xs"
        fullWidth
        fullScreen={false}
        TransitionComponent={Slide}
        TransitionProps={{ direction: 'up' }}
        sx={{
          ...(isMobile && {
            '& .MuiDialog-container': {
              alignItems: 'flex-end',
              justifyContent: 'center',
            },
          }),
        }}
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
            boxShadow: isMobile
              ? `0 -8px 32px rgba(15, 23, 42, 0.2), 0 -4px 16px ${alpha(ADMIN_PRIMARY, 0.08)}`
              : `0 12px 40px ${alpha(ADMIN_PRIMARY, 0.15)}`,
            bgcolor: theme.palette.background.paper,
            overflow: 'hidden',
            position: 'relative',
            '&::before': isMobile
              ? {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 5,
                  background: `linear-gradient(90deg, ${ADMIN_PRIMARY} 0%, ${ADMIN_PRIMARY_LIGHT} 100%)`,
                }
              : undefined,
          },
        }}
        slotProps={{
          backdrop: {
            sx: {
              bgcolor: alpha(theme.palette.common.black, 0.65),
              backdropFilter: 'blur(6px)',
            },
          },
        }}
      >
        {isMobile && (
          <Box
            sx={{
              pt: 1.5,
              pb: 0.5,
              display: 'flex',
              justifyContent: 'center',
              flexShrink: 0,
              bgcolor: alpha(ADMIN_PRIMARY, 0.02),
              borderBottom: '1px solid',
              borderColor: alpha(ADMIN_PRIMARY, 0.1),
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 4,
                borderRadius: '7px',
                bgcolor: theme.palette.grey[400],
              }}
            />
          </Box>
        )}
        <DialogTitle
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            borderBottom: '1px solid',
            borderColor: theme.palette.divider,
            py: 2,
            px: 3,
            pt: isMobile ? 2 : 2,
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
                    ? alpha(theme.palette.success.main, 0.1)
                    : alpha(theme.palette.error.main, 0.08),
              }}
            >
              {confirmState.mode === 'restore' ? (
                <RestoreFromTrashRoundedIcon
                  sx={{ fontSize: 22, color: theme.palette.success.dark }}
                />
              ) : (
                <DeleteRoundedIcon
                  sx={{ fontSize: 22, color: theme.palette.error.dark }}
                />
              )}
            </Box>
            <Typography component="span" sx={{ fontWeight: 700 }}>
              {confirmState.mode === 'restore'
                ? 'Restore announcement'
                : 'Delete announcement'}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent
          sx={{
            px: 3,
            pt: 3,
            pb: 3,
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: 'text.secondary', mt: 1.5 }}
          >
            {confirmState.mode === 'restore'
              ? 'Are you sure you want to restore this announcement?'
              : 'Are you sure you want to delete this announcement? You can restore it later from this list.'}
          </Typography>
          {confirmState.row && (
            <Typography
              variant="subtitle2"
              sx={{ mt: 1.5, fontWeight: 600, color: 'text.primary' }}
            >
              {confirmState.row.title}
            </Typography>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            px: 3,
            py: 2.5,
            pt: 2,
            pb: { xs: 'max(20px, env(safe-area-inset-bottom))', sm: 2.5 },
            borderTop: '1px solid',
            borderColor: theme.palette.divider,
            gap: 1,
          }}
        >
          <Button
            variant="outlined"
            onClick={handleConfirmClose}
            disabled={confirmLoading}
            sx={{
              borderColor: theme.palette.grey[300],
              color: 'text.primary',
              borderRadius: '7px',
              fontWeight: 600,
              px: 2.5,
              '&:hover': {
                borderColor: ADMIN_PRIMARY,
                bgcolor: alpha(ADMIN_PRIMARY, 0.04),
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmProceed}
            variant="contained"
            disabled={confirmLoading}
            startIcon={
              confirmLoading ? (
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
                bgcolor:
                  confirmState.mode === 'restore'
                    ? ADMIN_PRIMARY_DARK
                    : theme.palette.error.dark,
              },
              '&.Mui-disabled': {
                color: '#fff',
                bgcolor:
                  confirmState.mode === 'restore'
                    ? ADMIN_PRIMARY
                    : theme.palette.error.main,
                opacity: 1,
              },
            }}
          >
            {confirmLoading
              ? 'Processing…'
              : confirmState.mode === 'restore'
              ? 'Yes, restore'
              : 'Yes, delete'}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Page title */}
      <Box sx={{ mb: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 0.25 }}>
          <CampaignRoundedIcon sx={{ fontSize: { xs: 28, sm: 32 }, color: ADMIN_PRIMARY }} />
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
            Announcements
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
          Manage announcements for Scenarios and Mocks
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
            placeholder="Search by title"
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
            <InputLabel id="type-label">Type</InputLabel>
            <Select labelId="type-label" value={typeFilter} label="Type" onChange={(e) => setTypeFilter(e.target.value)}>
              <MenuItem value="">All</MenuItem>
              <MenuItem value="scenario">Scenario</MenuItem>
              <MenuItem value="mock">Mock</MenuItem>
            </Select>
          </FormControl>
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
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              fontSize: { xs: '0.8125rem', sm: '1rem' },
            }}
          >
            Announcement list
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />}
            onClick={handleAddDialogOpen}
            sx={{
              bgcolor: ADMIN_PRIMARY,
              borderRadius: '7px',
              fontWeight: 600,
              fontSize: { xs: '0.75rem', sm: '0.8125rem' },
              py: { xs: 0.75, sm: 1 },
              px: { xs: 1.5, sm: 2 },
              '&:hover': { bgcolor: ADMIN_PRIMARY_DARK },
            }}
          >
            Add Announcement
          </Button>
        </Box>

        {!showAsCards && (
          <TableContainer>
            <Table size="medium" stickyHeader>
              <TableHead>
                <TableRow sx={{ bgcolor: alpha(ADMIN_PRIMARY, 0.06), '& .MuiTableCell-head': { fontWeight: 700, color: 'text.primary', borderColor: theme.palette.grey[200], py: 1.5, fontSize: '0.8125rem' } }}>
                  <TableCell>Title</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Created</TableCell>
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
                          '& .MuiTableCell-body': {
                            borderColor: theme.palette.grey[200],
                            py: 1.5,
                          },
                        }}
                      >
                        <TableCell>
                          <Skeleton variant="text" width="70%" sx={{ borderRadius: 1, maxWidth: 220 }} />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="rounded" width={80} height={24} sx={{ borderRadius: '7px' }} />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" width="80%" sx={{ borderRadius: 1, maxWidth: 200 }} />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="rounded" width={64} height={24} sx={{ borderRadius: '7px' }} />
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
                  : announcements.length === 0 ? (
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
                          No announcements found.
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: 'text.disabled', maxWidth: 320 }}
                        >
                          Use the filters above or click &quot;Add Announcement&quot; to create a new announcement.
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                  ) : announcements.map((row) => (
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
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }} noWrap>
                        {row.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.type === 'scenario' ? 'Scenario' : 'Mock'}
                        size="small"
                        sx={{
                          height: 24,
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          bgcolor: row.type === 'scenario' ? alpha(ADMIN_PRIMARY_LIGHT, 0.15) : alpha(ADMIN_PRIMARY, 0.12),
                          color: row.type === 'scenario' ? ADMIN_PRIMARY_LIGHT : ADMIN_PRIMARY_DARK,
                          borderRadius: '7px',
                          border: 'none',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {formatCreated(row.created_at || row.created)}
                      </Typography>
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
                              : row.status === 'Inactive'
                              ? alpha(theme.palette.warning.main, 0.12)
                              : alpha(theme.palette.error.main, 0.12),
                          color:
                            row.status === 'Active'
                              ? theme.palette.success.dark
                              : row.status === 'Inactive'
                              ? theme.palette.warning.dark
                              : theme.palette.error.dark,
                          borderRadius: '7px',
                          border: 'none',
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="View" placement="top" arrow>
                        <IconButton
                          size="small"
                          onClick={() => handleViewOpen(row)}
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
                      <Tooltip title="Edit" placement="top" arrow>
                        <IconButton
                          size="small"
                          onClick={() => openEditDialog(row)}
                          sx={{
                            color: theme.palette.grey[600],
                            ml: 0.5,
                            '&:hover': { color: ADMIN_PRIMARY, bgcolor: alpha(ADMIN_PRIMARY, 0.08) },
                          }}
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

        {showAsCards && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
              p: { xs: 2, sm: 2 },
              pb: 2,
              overflowX: 'hidden',
            }}
          >
            {listLoading
              ? Array.from({ length: SKELETON_ROW_COUNT }).map((_, idx) => (
                  <Paper
                    key={`skeleton-card-${idx}`}
                    elevation={0}
                    sx={{
                      p: { xs: 2.5, sm: 2 },
                      borderRadius: '7px',
                      border: '1px solid',
                      borderColor: theme.palette.grey[200],
                      bgcolor: theme.palette.background.paper,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 1.5,
                      }}
                    >
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Skeleton
                          variant="text"
                          width="70%"
                          sx={{ borderRadius: 1, maxWidth: 220, fontSize: '1rem' }}
                        />
                        <Skeleton
                          variant="rounded"
                          width={80}
                          height={26}
                          sx={{ mt: 1, borderRadius: '7px' }}
                        />
                        <Skeleton
                          variant="rounded"
                          width={100}
                          height={24}
                          sx={{ mt: 1, borderRadius: '7px' }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Skeleton variant="circular" width={isMobile ? 40 : 36} height={isMobile ? 40 : 36} />
                        <Skeleton variant="circular" width={isMobile ? 40 : 36} height={isMobile ? 40 : 36} />
                        <Skeleton variant="circular" width={isMobile ? 40 : 36} height={isMobile ? 40 : 36} />
                      </Box>
                    </Box>
                  </Paper>
                ))
              : announcements.length === 0 ? (
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 3, sm: 3 },
                    borderRadius: '7px',
                    border: '1px dashed',
                    borderColor: alpha(ADMIN_PRIMARY, 0.3),
                    bgcolor: alpha(ADMIN_PRIMARY, 0.02),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      gap: 1,
                    }}
                  >
                    <ViewListRoundedIcon
                      sx={{
                        fontSize: 36,
                        color: alpha(ADMIN_PRIMARY, 0.5),
                      }}
                    />
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600, color: 'text.secondary' }}
                    >
                      No announcements found.
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: 'text.disabled', maxWidth: 260 }}
                    >
                      Adjust your filters or add a new announcement to get started.
                    </Typography>
                  </Box>
                </Paper>
              ) : announcements.map((row) => (
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
                {/* Top row: title + actions (actions on sm+ only; on mobile they go to footer) */}
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
                      minWidth: 0,
                      flex: 1,
                    }}
                  >
                    {row.title}
                  </Typography>
                  <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', flexShrink: 0, gap: 0.25 }}>
                    <Tooltip title="View" placement="top" arrow>
                      <IconButton size="small" onClick={() => handleViewOpen(row)} sx={{ color: theme.palette.info.main, '&:hover': { color: theme.palette.info.dark, bgcolor: alpha(theme.palette.info.main, 0.12) } }}>
                        <VisibilityRoundedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit" placement="top" arrow>
                      <IconButton size="small" sx={{ color: theme.palette.grey[600], '&:hover': { color: ADMIN_PRIMARY, bgcolor: alpha(ADMIN_PRIMARY, 0.08) } }}>
                        <EditRoundedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete" placement="top" arrow>
                      <IconButton size="small" sx={{ color: theme.palette.error.main, '&:hover': { color: theme.palette.error.dark, bgcolor: alpha(theme.palette.error.main, 0.12) } }}>
                        <DeleteRoundedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                {/* Bottom row: Type, Created, Status chips; on mobile, View/Edit/Delete in footer */}
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1.5,
                  }}
                >
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1 }}>
                    <Chip
                      label={row.type === 'scenario' ? 'Scenario' : 'Mock'}
                      size="small"
                      sx={{
                        height: { xs: 28, sm: 26 },
                        fontSize: { xs: '0.8125rem', sm: '0.75rem' },
                        fontWeight: 600,
                        bgcolor: row.type === 'scenario' ? alpha(ADMIN_PRIMARY_LIGHT, 0.15) : alpha(ADMIN_PRIMARY, 0.12),
                        color: row.type === 'scenario' ? ADMIN_PRIMARY_LIGHT : ADMIN_PRIMARY_DARK,
                        borderRadius: '7px',
                        border: 'none',
                      }}
                    />
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: { xs: '0.8125rem', sm: '0.75rem' } }}>
                      {formatCreated(row.created_at || row.created)}
                    </Typography>
                    <Chip
                      label={row.status}
                      size="small"
                      sx={{
                        height: { xs: 28, sm: 26 },
                        fontSize: { xs: '0.8125rem', sm: '0.75rem' },
                        fontWeight: 600,
                        bgcolor: row.status === 'Active' ? alpha(theme.palette.success.main, 0.12) : alpha(theme.palette.grey[500], 0.12),
                        color: row.status === 'Active' ? theme.palette.success.dark : theme.palette.grey[700],
                        borderRadius: '7px',
                        border: 'none',
                      }}
                    />
                  </Box>
                  <Box sx={{ display: { xs: 'flex', sm: 'none' }, alignItems: 'center', flexShrink: 0, gap: 0.25 }}>
                    <Tooltip title="View" placement="top" arrow>
                      <IconButton
                        size="large"
                        onClick={() => handleViewOpen(row)}
                        sx={{
                          color: theme.palette.info.main,
                          bgcolor: alpha(theme.palette.info.main, 0.08),
                          '&:hover': { color: theme.palette.info.dark, bgcolor: alpha(theme.palette.info.main, 0.15) },
                        }}
                      >
                        <VisibilityRoundedIcon fontSize="medium" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit" placement="top" arrow>
                      <IconButton
                        size="large"
                        onClick={() => openEditDialog(row)}
                        sx={{
                          color: theme.palette.grey[600],
                          bgcolor: theme.palette.grey[100],
                          '&:hover': { color: ADMIN_PRIMARY, bgcolor: alpha(ADMIN_PRIMARY, 0.1) },
                        }}
                      >
                        <EditRoundedIcon fontSize="medium" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={row.status === 'Deleted' ? 'Restore' : 'Delete'} placement="top" arrow>
                      <IconButton
                        size="large"
                        disabled={!!rowActionLoading[row.id]}
                        onClick={() =>
                          row.status === 'Deleted' ? openConfirmRestore(row) : openConfirmDelete(row)
                        }
                        sx={{
                          color:
                            row.status === 'Deleted'
                              ? theme.palette.success.main
                              : theme.palette.error.main,
                          bgcolor:
                            row.status === 'Deleted'
                              ? alpha(theme.palette.success.main, 0.08)
                              : alpha(theme.palette.error.main, 0.08),
                          '&:hover': {
                            color:
                              row.status === 'Deleted'
                                ? theme.palette.success.dark
                                : theme.palette.error.dark,
                            bgcolor:
                              row.status === 'Deleted'
                                ? alpha(theme.palette.success.main, 0.15)
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
            gap: 1.5,
            px: { xs: 1.5, sm: 2 },
            py: { xs: 1.75, sm: 2 },
            borderTop: '1px solid',
            borderColor: theme.palette.grey[200],
            bgcolor: alpha(ADMIN_PRIMARY, 0.02),
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: '0.8125rem' }}>
              Rows per page
            </Typography>
            <FormControl size="small" variant="outlined" sx={{ minWidth: 72 }}>
              <Select value={rowsPerPage} onChange={handleChangeRowsPerPage} sx={{ height: 36, fontSize: '0.8125rem', fontWeight: 600, borderRadius: '7px', bgcolor: theme.palette.background.paper }}>
                {ROWS_PER_PAGE_OPTIONS.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: '0.8125rem' }}>
              {totalRows === 0 ? '0–0 of 0' : `${from}–${to} of ${totalRows}`}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'center', sm: 'flex-end' } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <ViewListRoundedIcon sx={{ color: ADMIN_PRIMARY, fontSize: 18 }} />
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
                '& .MuiPaginationItem-icon': { color: ADMIN_PRIMARY },
              }}
            />
          </Box>
        </Box>
      </Paper>

      {/* View dialog — SignIn-style */}
      <Dialog
        open={viewDialog.open}
        onClose={handleViewClose}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Slide}
        TransitionProps={{ direction: 'up' }}
        sx={{
          ...(isMobile && {
            '& .MuiDialog-container': { alignItems: 'flex-end', justifyContent: 'center' },
          }),
        }}
        PaperProps={{
          sx: {
            margin: isMobile ? 0 : 24,
            maxHeight: isMobile ? '90vh' : 'calc(100vh - 48px)',
            width: isMobile ? '100%' : undefined,
            maxWidth: isMobile ? '100%' : undefined,
            borderRadius: isMobile ? '7px 7px 0 0' : '7px',
            border: '1px solid',
            borderColor: alpha(ADMIN_PRIMARY, 0.15),
            borderBottom: isMobile ? 'none' : undefined,
            boxShadow: isMobile
              ? `0 -8px 32px rgba(15, 23, 42, 0.2), 0 -4px 16px ${alpha(ADMIN_PRIMARY, 0.08)}`
              : `0 24px 48px rgba(15, 23, 42, 0.16), 0 0 0 1px ${alpha(ADMIN_PRIMARY, 0.06)}`,
            overflow: 'hidden',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 5,
              background: `linear-gradient(90deg, ${ADMIN_PRIMARY} 0%, ${ADMIN_PRIMARY_LIGHT} 100%)`,
            },
          },
        }}
      >
        {isMobile && (
          <Box sx={{ pt: 1.5, pb: 0.5, display: 'flex', justifyContent: 'center', bgcolor: alpha(ADMIN_PRIMARY, 0.02), borderBottom: '1px solid', borderColor: alpha(ADMIN_PRIMARY, 0.1) }}>
            <Box sx={{ width: 40, height: 4, borderRadius: '7px', bgcolor: theme.palette.grey[400] }} />
          </Box>
        )}
        <DialogTitle
          component="div"
          sx={{
            pt: { xs: 2.5, sm: 4 },
            pb: 2.5,
            px: { xs: 2.5, sm: 3.5 },
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            borderBottom: '1px solid',
            borderColor: alpha(ADMIN_PRIMARY, 0.1),
            bgcolor: alpha(ADMIN_PRIMARY, 0.02),
          }}
        >
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              bgcolor: alpha(ADMIN_PRIMARY, 0.12),
              color: ADMIN_PRIMARY,
              border: '2px solid',
              borderColor: alpha(ADMIN_PRIMARY, 0.2),
              boxShadow: `0 4px 12px ${alpha(ADMIN_PRIMARY, 0.2)}`,
            }}
          >
            <DescriptionRoundedIcon sx={{ fontSize: 28 }} />
          </Box>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', letterSpacing: '-0.02em', lineHeight: 1.3 }}>
              {viewDialog.row?.title || 'Announcement'}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5, fontSize: '0.9375rem' }}>
              {viewDialog.row ? `${viewDialog.row.type === 'scenario' ? 'Scenario' : 'Mock'} · ${formatCreated(viewDialog.row.created)}` : ''}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 2.5, pb: 2.5, px: { xs: 2.5, sm: 3.5 }, minHeight: 120 }}>
          {viewDialog.row && (
            <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {viewDialog.row.description}
            </Typography>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            px: { xs: 2.5, sm: 3.5 },
            py: 2,
            pt: 1.5,
            borderTop: '1px solid',
            borderColor: theme.palette.grey[300],
            bgcolor: theme.palette.grey[50],
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
              borderRadius: '7px',
              px: 2,
              '&:hover': { bgcolor: alpha(ADMIN_PRIMARY, 0.06), color: ADMIN_PRIMARY },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit Announcement dialog — style matched to AdminNotesType */}
      <Dialog
        open={dialogState.open}
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
        fullScreen={false}
        TransitionComponent={Slide}
        TransitionProps={{ direction: 'up' }}
        sx={{
          ...(isMobile && {
            '& .MuiDialog-container': {
              alignItems: 'flex-end',
              justifyContent: 'center',
            },
          }),
        }}
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
            boxShadow: isMobile
              ? `0 -8px 32px rgba(15, 23, 42, 0.2), 0 -4px 16px ${alpha(ADMIN_PRIMARY, 0.08)}`
              : `0 12px 40px ${alpha(ADMIN_PRIMARY, 0.15)}`,
            bgcolor: theme.palette.background.paper,
            overflow: 'hidden',
            position: 'relative',
            '&::before': isMobile
              ? {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 5,
                  background: `linear-gradient(90deg, ${ADMIN_PRIMARY} 0%, ${ADMIN_PRIMARY_LIGHT} 100%)`,
                }
              : undefined,
          },
        }}
        slotProps={{
          backdrop: {
            sx: {
              bgcolor: alpha(theme.palette.common.black, 0.65),
              backdropFilter: 'blur(6px)',
            },
          },
        }}
      >
        {isMobile && (
          <Box
            sx={{
              pt: 1.5,
              pb: 0.5,
              display: 'flex',
              justifyContent: 'center',
              flexShrink: 0,
              bgcolor: alpha(ADMIN_PRIMARY, 0.02),
              borderBottom: '1px solid',
              borderColor: alpha(ADMIN_PRIMARY, 0.1),
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 4,
                borderRadius: '7px',
                bgcolor: theme.palette.grey[400],
              }}
            />
          </Box>
        )}
        <DialogTitle
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            borderBottom: '1px solid',
            borderColor: theme.palette.divider,
            py: 2,
            px: 3,
            pt: isMobile ? 2 : 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '7px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                bgcolor: alpha(ADMIN_PRIMARY, 0.12),
                color: ADMIN_PRIMARY,
              }}
            >
              <CampaignRoundedIcon sx={{ fontSize: 24 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {dialogState.mode === 'edit' ? 'Edit Announcement' : 'Add Announcement'}
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={handleDialogClose}
            sx={{
              color: theme.palette.grey[600],
              flexShrink: 0,
              '&:hover': { color: ADMIN_PRIMARY, bgcolor: alpha(ADMIN_PRIMARY, 0.08) },
            }}
          >
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            px: 3,
            pt: 0,
            pb: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            borderTop: '1px solid',
            borderColor: alpha(theme.palette.divider, 0.8),
            overflow: 'visible',
          }}
        >
          <Box
            component="form"
            onSubmit={handleDialogSubmit}
            sx={{ pt: 4, display: 'flex', flexDirection: 'column', gap: 3 }}
          >
            <TextField
              label="Title"
              value={dialogState.title}
              onChange={(e) => {
                setDialogState((p) => ({ ...p, title: e.target.value }))
                if (dialogTitleError) setDialogTitleError('')
              }}
              fullWidth
              size="small"
              placeholder="e.g. New UKMLA scenarios added"
              error={!!dialogTitleError}
              helperText={dialogTitleError}
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '7px',
                  bgcolor: theme.palette.grey[50],
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: alpha(ADMIN_PRIMARY, 0.5),
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
              fullWidth
              size="small"
              error={!!dialogTypeError}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '7px',
                  bgcolor: theme.palette.grey[50],
                },
                '& .MuiInputLabel-root.Mui-focused': { color: ADMIN_PRIMARY },
              }}
            >
              <InputLabel id="add-type-label" shrink>
                Type
              </InputLabel>
              <Select
                labelId="add-type-label"
                value={dialogState.type}
                label="Type"
                onChange={(e) => {
                  setDialogState((p) => ({ ...p, type: e.target.value }))
                  if (dialogTypeError) setDialogTypeError('')
                }}
              >
                <MenuItem value="scenario">Scenario</MenuItem>
                <MenuItem value="mock">Mock</MenuItem>
              </Select>
              {!!dialogTypeError && (
                <FormHelperText>{dialogTypeError}</FormHelperText>
              )}
            </FormControl>
            {dialogState.mode === 'edit' && (
              <FormControl
                fullWidth
                size="small"
                error={!!dialogStatusError}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '7px',
                    bgcolor: theme.palette.grey[50],
                  },
                  '& .MuiInputLabel-root.Mui-focused': { color: ADMIN_PRIMARY },
                }}
              >
                <InputLabel id="announcement-status-label" shrink>
                  Status
                </InputLabel>
                <Select
                  labelId="announcement-status-label"
                  label="Status"
                  value={dialogState.status}
                  onChange={(e) => {
                    setDialogState((p) => ({ ...p, status: e.target.value }))
                    if (dialogStatusError) setDialogStatusError('')
                  }}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            )}
            <TextField
              label="Description"
              value={dialogState.description}
              onChange={(e) => {
                setDialogState((p) => ({ ...p, description: e.target.value }))
                if (dialogDescriptionError) setDialogDescriptionError('')
              }}
              fullWidth
              size="small"
              multiline
              rows={4}
              placeholder="Enter announcement description..."
              error={!!dialogDescriptionError}
              helperText={dialogDescriptionError}
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '7px',
                  bgcolor: theme.palette.grey[50],
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: alpha(ADMIN_PRIMARY, 0.5),
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: ADMIN_PRIMARY,
                    borderWidth: 2,
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': { color: ADMIN_PRIMARY },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            px: 3,
            py: 2.5,
            pt: 2,
            pb: { xs: 'max(20px, env(safe-area-inset-bottom))', sm: 2.5 },
            borderTop: '1px solid',
            borderColor: theme.palette.divider,
            gap: 1,
          }}
        >
          <Button
            variant="outlined"
            onClick={handleDialogClose}
            sx={{
              borderColor: theme.palette.grey[300],
              color: 'text.primary',
              borderRadius: '7px',
              fontWeight: 600,
              px: 2.5,
              '&:hover': {
                borderColor: ADMIN_PRIMARY,
                bgcolor: alpha(ADMIN_PRIMARY, 0.04),
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDialogSubmit}
            variant="contained"
            disabled={dialogLoading}
            startIcon={
              dialogLoading ? (
                <AutorenewIcon
                  sx={{
                    animation: 'spin 0.8s linear infinite',
                    color: '#fff',
                  }}
                />
              ) : dialogState.mode === 'edit' ? (
                <SaveRoundedIcon sx={{ fontSize: 20 }} />
              ) : (
                <AddRoundedIcon sx={{ fontSize: 20 }} />
              )
            }
            sx={{
              bgcolor: ADMIN_PRIMARY,
              borderRadius: '7px',
              fontWeight: 600,
              px: 2.5,
              '&:hover': { bgcolor: ADMIN_PRIMARY_DARK },
              '&.Mui-disabled': {
                color: '#fff',
                bgcolor: ADMIN_PRIMARY,
                opacity: 1,
              },
            }}
          >
            {dialogLoading
              ? dialogState.mode === 'edit'
                ? 'Saving…'
                : 'Adding…'
              : dialogState.mode === 'edit'
              ? 'Save changes'
              : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AdminAnnouncements
