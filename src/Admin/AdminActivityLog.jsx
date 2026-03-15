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
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Pagination,
  Skeleton,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import Slide from '@mui/material/Slide'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded'
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import apiClient from '../server'
import { useToast } from '../components/ToastProvider'

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

function formatActivityDate(isoString) {
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

const IMAGE_BASE_URL = import.meta.env.VITE_API_IMAGE_UPLOAD_BASE_URL || 'http://127.0.0.1:8000/'

function AdminActivityLog() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const showAsCards = useMediaQuery(theme.breakpoints.down('md'))
  const { showToast } = useToast()

  const getProfileImageUrl = (user) => {
    if (!user?.profile_image_url) return ''
    const url = user.profile_image_url
    if (url.startsWith('http')) return url
    return `${IMAGE_BASE_URL.replace(/\/+$/, '')}/${url.replace(/^\/+/, '')}`
  }

  const [search, setSearch] = useState('')
  const [logs, setLogs] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalRows, setTotalRows] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  const [listLoading, setListLoading] = useState(false)
  const [listError, setListError] = useState('')

  const [selectedIds, setSelectedIds] = useState([])
  const [confirmState, setConfirmState] = useState({ open: false, ids: [] })
  const [confirmLoading, setConfirmLoading] = useState(false)

  const serverPage = page + 1

  const pageIds = logs.map((r) => r.id)
  const isAllSelected =
    logs.length > 0 && pageIds.every((id) => selectedIds.includes(id))
  const isIndeterminate =
    selectedIds.length > 0 && selectedIds.length < pageIds.length

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds((prev) => [...new Set([...prev, ...pageIds])])
    } else {
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)))
    }
  }

  const handleToggleRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const from = totalRows === 0 ? 0 : (serverPage - 1) * rowsPerPage + 1
  const to = Math.min((serverPage - 1) * rowsPerPage + rowsPerPage, totalRows)

  const fetchLogs = async (opts = {}) => {
    const { applyFilters = false, targetPage = serverPage, targetPerPage = rowsPerPage } = opts

    setListLoading(true)
    setListError('')

    const params = new URLSearchParams()
    params.set('page', String(targetPage))
    params.set('per_page', String(targetPerPage))
    if (applyFilters) {
      params.set('apply_filters', '1')
      if (search.trim()) params.set('text', search.trim())
    }

    try {
      const { ok, data } = await apiClient(`/activity-logs?${params.toString()}`, 'GET')
      if (!ok || !data?.success) {
        const message =
          data?.errors && typeof data.errors === 'object'
            ? Object.values(data.errors).flat().join(' ')
            : data?.message
        setListError(message || 'Unable to load activity logs.')
        showToast(message || 'Unable to load activity logs.', 'error')
        return
      }

      const list = data.data?.activity_logs || []
      const pagination = data.data?.pagination || {}

      setLogs(list)
      const total = Number(pagination.total ?? list.length ?? 0)
      const perPageValue = Number(pagination.per_page ?? targetPerPage ?? 10)
      const currentPageValue = Number(pagination.current_page ?? targetPage ?? 1)
      const lastPageValue = Number(
        pagination.last_page ?? Math.max(1, Math.ceil(total / perPageValue))
      )

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
    fetchLogs({ applyFilters: false, targetPage: 1, targetPerPage: rowsPerPage })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSearch = () => {
    setPage(0)
    fetchLogs({ applyFilters: true, targetPage: 1 })
  }

  const handleReset = () => {
    setSearch('')
    setPage(0)
    fetchLogs({ applyFilters: false, targetPage: 1 })
  }

  const handleChangePage = (_, value) => {
    const newPage = value - 1
    setPage(newPage)
    fetchLogs({
      applyFilters: !!search.trim(),
      targetPage: value,
      targetPerPage: rowsPerPage,
    })
  }

  const handleChangeRowsPerPage = (e) => {
    const newPerPage = Number(e.target.value)
    setRowsPerPage(newPerPage)
    setPage(0)
    fetchLogs({
      applyFilters: !!search.trim(),
      targetPage: 1,
      targetPerPage: newPerPage,
    })
  }

  const openConfirmBulkDelete = () => {
    if (selectedIds.length === 0) return
    setConfirmState({ open: true, ids: [...selectedIds] })
  }

  const handleConfirmClose = () => {
    if (confirmLoading) return
    setConfirmState({ open: false, ids: [] })
  }

  const handleConfirmProceed = async () => {
    if (confirmState.ids.length === 0 || confirmLoading) return
    setConfirmLoading(true)
    try {
      const { ok, data } = await apiClient('/activity-logs/bulk-delete', 'POST', {
        ids: confirmState.ids,
      })
      if (!ok || !data?.success) {
        const message =
          data?.errors && typeof data.errors === 'object'
            ? Object.values(data.errors).flat().join(' ')
            : data?.message
        showToast(message || 'Unable to delete activity logs.', 'error')
        return
      }
      showToast(
        data?.data?.deleted_count === 1
          ? '1 activity log deleted permanently.'
          : `${data?.data?.deleted_count ?? confirmState.ids.length} activity logs deleted permanently.`,
        'success'
      )
      setSelectedIds((prev) => prev.filter((id) => !confirmState.ids.includes(id)))
      handleConfirmClose()
      fetchLogs({
        applyFilters: !!search.trim(),
        targetPage: serverPage,
        targetPerPage: rowsPerPage,
      })
    } catch {
      showToast('Unable to reach server. Please try again.', 'error')
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
      {/* Confirm bulk delete dialog */}
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
                bgcolor: alpha(theme.palette.error.main, 0.08),
              }}
            >
              <DeleteRoundedIcon
                sx={{ fontSize: 22, color: theme.palette.error.dark }}
              />
            </Box>
            <Typography component="span" sx={{ fontWeight: 700 }}>
              Delete activity logs
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ px: 3, pt: 3, pb: 3 }}>
          <Typography
            variant="body2"
            sx={{ color: 'text.secondary', mt: 1.5 }}
          >
            Are you sure you want to permanently delete{' '}
            {confirmState.ids.length === 1
              ? 'this activity log'
              : `${confirmState.ids.length} selected activity logs`}
            ? This action cannot be undone.
          </Typography>
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
              ) : (
                <DeleteRoundedIcon sx={{ fontSize: 20, color: '#fff' }} />
              )
            }
            sx={{
              bgcolor: theme.palette.error.main,
              borderRadius: '7px',
              fontWeight: 600,
              px: 2.5,
              color: '#fff',
              '&:hover': {
                bgcolor: theme.palette.error.dark,
              },
              '&.Mui-disabled': {
                color: '#fff',
                bgcolor: theme.palette.error.main,
                opacity: 1,
              },
            }}
          >
            {confirmLoading ? 'Deleting…' : 'Yes, delete permanently'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Page title */}
      <Box sx={{ mb: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 0.25 }}>
          <HistoryRoundedIcon
            sx={{ fontSize: { xs: 28, sm: 32 }, color: ADMIN_PRIMARY }}
          />
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
            }}
          >
            Activity Log
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
          View and manage activity logs
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
            placeholder="Search action"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
            sx={{
              flex: { xs: '1 1 100%', sm: '1 1 240px', md: '1 1 320px' },
              minWidth: { xs: 0, sm: 180 },
              maxWidth: { sm: 320, md: 420 },
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
            Activity log list
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {selectedIds.length > 0 && (
              <Button
                variant="contained"
                startIcon={<DeleteRoundedIcon />}
                onClick={openConfirmBulkDelete}
                disabled={listLoading}
                sx={{
                  bgcolor: theme.palette.error.main,
                  borderRadius: '7px',
                  fontWeight: 600,
                  '&:hover': { bgcolor: theme.palette.error.dark },
                }}
              >
                Delete selected ({selectedIds.length})
              </Button>
            )}
          </Box>
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
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={isIndeterminate}
                      checked={isAllSelected}
                      onChange={handleSelectAll}
                      disabled={listLoading || logs.length === 0}
                      size="small"
                      sx={{
                        color: theme.palette.grey[600],
                        '&.Mui-checked': { color: ADMIN_PRIMARY },
                        '&.Mui-indeterminate': { color: ADMIN_PRIMARY },
                      }}
                    />
                  </TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Action</TableCell>
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
                        <TableCell padding="checkbox">
                          <Skeleton variant="rectangular" width={20} height={20} sx={{ borderRadius: 0.5 }} />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Skeleton variant="circular" width={40} height={40} sx={{ flexShrink: 0 }} />
                            <Box sx={{ minWidth: 0 }}>
                              <Skeleton variant="text" width={120} sx={{ borderRadius: 1 }} />
                              <Skeleton variant="text" width={100} sx={{ borderRadius: 1, mt: 0.5 }} />
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" width="80%" sx={{ borderRadius: 1, maxWidth: 280 }} />
                        </TableCell>
                      </TableRow>
                    ))
                  : logs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} align="center" sx={{ py: 6 }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                            <ViewListRoundedIcon sx={{ fontSize: 40, color: alpha(ADMIN_PRIMARY, 0.4) }} />
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                              No activity logs found.
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.disabled', maxWidth: 320 }}>
                              Use the search above to filter by action or wait for new activity.
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )
                  : logs.map((row) => (
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
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedIds.includes(row.id)}
                            onChange={() => handleToggleRow(row.id)}
                            size="small"
                            sx={{
                              color: theme.palette.grey[600],
                              '&.Mui-checked': { color: ADMIN_PRIMARY },
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                              <Avatar
                                src={getProfileImageUrl(row.user)}
                                alt={row.user?.full_name || row.user?.email}
                                sx={{
                                  width: 40,
                                  height: 40,
                                  borderRadius: '50%',
                                  bgcolor: alpha(ADMIN_PRIMARY, 0.12),
                                  color: ADMIN_PRIMARY,
                                }}
                              >
                                {(row.user?.full_name || row.user?.email || '?').charAt(0)}
                              </Avatar>
                              <Box
                                sx={{
                                  position: 'absolute',
                                  bottom: -2,
                                  right: -2,
                                  width: 12,
                                  height: 12,
                                  borderRadius: '50%',
                                  bgcolor: row.user?.is_online ? '#22c55e' : theme.palette.grey[600],
                                  border: '2px solid',
                                  borderColor: theme.palette.background.paper,
                                  boxShadow: row.user?.is_online ? '0 0 0 1px rgba(34, 197, 94, 0.4), 0 0 6px rgba(34, 197, 94, 0.5)' : 'none',
                                }}
                              />
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }} noWrap>
                                {row.user?.full_name || row.user?.email || '—'}
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8125rem' }} noWrap>
                                {row.user?.email || '—'}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 0.5, minWidth: 0 }}>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }} component="span">
                              {row.action || '—'}
                            </Typography>
                            <Typography
                              component="span"
                              sx={{
                                fontSize: '0.75rem',
                                color: ADMIN_PRIMARY,
                                fontWeight: 600,
                                flexShrink: 0,
                              }}
                            >
                              · {formatActivityDate(row.created_at)}
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Mobile/Tablet: card list */}
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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Skeleton variant="rectangular" width={24} height={24} sx={{ borderRadius: 0.5, flexShrink: 0 }} />
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Skeleton variant="text" width="70%" sx={{ borderRadius: 1, maxWidth: 220, fontSize: '1rem' }} />
                        <Skeleton variant="text" width="50%" sx={{ mt: 1, borderRadius: 1, maxWidth: 140 }} />
                      </Box>
                    </Box>
                  </Paper>
                ))
              : logs.length === 0 ? (
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
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 1 }}>
                      <ViewListRoundedIcon sx={{ fontSize: 36, color: alpha(ADMIN_PRIMARY, 0.5) }} />
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                        No activity logs found.
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.disabled', maxWidth: 260 }}>
                        Adjust your search or wait for new activity.
                      </Typography>
                    </Box>
                  </Paper>
                )
              : logs.map((row) => (
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
                      '&:hover': {
                        borderColor: alpha(ADMIN_PRIMARY, 0.35),
                        boxShadow: `0 4px 20px ${alpha(ADMIN_PRIMARY, 0.1)}`,
                      },
                      ...(isMobile && { boxShadow: `0 2px 12px ${alpha(ADMIN_PRIMARY, 0.06)}` }),
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1.5, mb: 2, pb: 2, borderBottom: '1px solid', borderColor: theme.palette.divider }}>
                      <Checkbox
                        checked={selectedIds.includes(row.id)}
                        onChange={() => handleToggleRow(row.id)}
                        size="small"
                        sx={{ color: theme.palette.grey[600], mt: -0.5, flexShrink: 0, '&.Mui-checked': { color: ADMIN_PRIMARY } }}
                      />
                      <Box sx={{ position: 'relative', display: 'inline-flex', flexShrink: 0 }}>
                        <Avatar
                          src={getProfileImageUrl(row.user)}
                          alt={row.user?.full_name || row.user?.email}
                          sx={{
                            width: { xs: 48, sm: 40 },
                            height: { xs: 48, sm: 40 },
                            borderRadius: '50%',
                            bgcolor: alpha(ADMIN_PRIMARY, 0.12),
                            color: ADMIN_PRIMARY,
                          }}
                        >
                          {(row.user?.full_name || row.user?.email || '?').charAt(0)}
                        </Avatar>
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: -2,
                            right: -2,
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            bgcolor: row.user?.is_online ? '#22c55e' : theme.palette.grey[600],
                            border: '2px solid',
                            borderColor: theme.palette.background.paper,
                            boxShadow: row.user?.is_online ? '0 0 0 1px rgba(34, 197, 94, 0.4), 0 0 6px rgba(34, 197, 94, 0.5)' : 'none',
                          }}
                        />
                      </Box>
                      <Box sx={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
                        <Typography variant="subtitle1" noWrap sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '1rem', sm: '0.9rem' } }}>
                          {row.user?.full_name || row.user?.email || '—'}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8125rem' }} noWrap>
                          {row.user?.email || '—'}
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 0.5, mt: 0.5 }}>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }} component="span">
                            {row.action || '—'}
                          </Typography>
                          <Typography
                            component="span"
                            sx={{
                              fontSize: '0.75rem',
                              color: ADMIN_PRIMARY,
                              fontWeight: 600,
                            }}
                          >
                            · {formatActivityDate(row.created_at)}
                          </Typography>
                        </Box>
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
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: { xs: '0.8125rem', sm: '0.875rem' }, flexShrink: 0 }}>
              Rows per page
            </Typography>
            <FormControl size="small" variant="outlined" sx={{ minWidth: 72, flexShrink: 0 }}>
              <Select
                value={rowsPerPage}
                onChange={handleChangeRowsPerPage}
                sx={{
                  height: 36,
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
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem' }}>
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
    </Box>
  )
}

export default AdminActivityLog
