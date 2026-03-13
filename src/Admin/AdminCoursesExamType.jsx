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
  Skeleton,
} from '@mui/material'
import Slide from '@mui/material/Slide'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import QuizRoundedIcon from '@mui/icons-material/QuizRounded'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import RestoreFromTrashRoundedIcon from '@mui/icons-material/RestoreFromTrashRounded'
import SaveRoundedIcon from '@mui/icons-material/SaveRounded'
import apiClient from '../server'
import { useToast } from '../components/ToastProvider'

// Admin screen primary (#384D84 — same as AdminUsers)
const ADMIN_PRIMARY = '#384D84'
const ADMIN_PRIMARY_DARK = '#2a3a64'
const ADMIN_PRIMARY_LIGHT = '#4a5f9a'

const keyframes = {
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
}

const ROWS_PER_PAGE_OPTIONS = [5, 10, 20, 30, 40, 50, 100]
const SKELETON_ROW_COUNT = 5

function AdminCoursesExamType() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const showAsCards = useMediaQuery(theme.breakpoints.down('md'))
  const { showToast } = useToast()

  // Filters
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  // Server-side pagination meta
  const [examTypes, setExamTypes] = useState([])
  const [page, setPage] = useState(0) // zero-based UI page
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalRows, setTotalRows] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  const [listLoading, setListLoading] = useState(false)
  const [listError, setListError] = useState('')

  // Add/Edit dialog state
  const [dialogState, setDialogState] = useState({
    open: false,
    mode: 'add', // 'add' | 'edit'
    id: null,
    name: '',
    status: 'Active',
  })
  const [dialogNameError, setDialogNameError] = useState('')
  const [dialogStatusError, setDialogStatusError] = useState('')
  const [dialogLoading, setDialogLoading] = useState(false)

  // Delete / Restore loading per row
  const [rowActionLoading, setRowActionLoading] = useState({})

  // Confirm dialog for delete / restore
  const [confirmState, setConfirmState] = useState({
    open: false,
    mode: 'delete', // 'delete' | 'restore'
    row: null,
  })
  const [confirmLoading, setConfirmLoading] = useState(false)

  const serverPage = page + 1

  const from = totalRows === 0 ? 0 : (serverPage - 1) * rowsPerPage + 1
  const to = Math.min((serverPage - 1) * rowsPerPage + rowsPerPage, totalRows)

  const handleChangePage = (_, value) => {
    const newPage = value - 1
    setPage(newPage)
    fetchExamTypes({
      applyFilters: !!(search || statusFilter),
      targetPage: value,
      targetPerPage: rowsPerPage,
    })
  }
  const handleChangeRowsPerPage = (e) => {
    const newPerPage = Number(e.target.value)
    setRowsPerPage(newPerPage)
    setPage(0)
    fetchExamTypes({
      applyFilters: !!(search || statusFilter),
      targetPage: 1,
      targetPerPage: newPerPage,
    })
  }

  const fetchExamTypes = async (opts = {}) => {
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
      const { ok, data } = await apiClient(`/exam-types?${params.toString()}`, 'GET')
      if (!ok || !data?.success) {
        const message =
          data?.errors && typeof data.errors === 'object'
            ? Object.values(data.errors).flat().join(' ')
            : data?.message
        setListError(message || 'Unable to load exam types.')
        return
      }

      const list = data.data?.exam_types || []
      const pagination = data.data?.pagination || {}

      setExamTypes(list)
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
    fetchExamTypes({ applyFilters: false, targetPage: 1, targetPerPage: rowsPerPage })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSearch = () => {
    setPage(0)
    fetchExamTypes({ applyFilters: true, targetPage: 1 })
  }

  const handleReset = () => {
    setSearch('')
    setStatusFilter('')
    setPage(0)
    fetchExamTypes({ applyFilters: false, targetPage: 1 })
  }

  const openAddDialog = () => {
    setDialogState({
      open: true,
      mode: 'add',
      id: null,
      name: '',
      status: 'Active',
    })
    setDialogNameError('')
    setDialogStatusError('')
  }

  const openEditDialog = (row) => {
    setDialogState({
      open: true,
      mode: 'edit',
      id: row.id,
      name: row.name || '',
      status: row.status === 'Deleted' ? 'Inactive' : row.status || 'Active',
    })
    setDialogNameError('')
    setDialogStatusError('')
  }

  const handleDialogClose = () => {
    if (dialogLoading) return
    setDialogState((prev) => ({
      ...prev,
      open: false,
    }))
    setDialogNameError('')
    setDialogStatusError('')
  }

  const handleDialogSubmit = async (e) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault()
    }
    if (dialogLoading) return

    setDialogLoading(true)
    setDialogNameError('')
    setDialogStatusError('')

    const payload =
      dialogState.mode === 'edit'
        ? {
            name: dialogState.name.trim(),
            status: dialogState.status || 'Active',
          }
        : {
            name: dialogState.name.trim(),
          }

    const method = dialogState.mode === 'edit' ? 'POST' : 'POST'
    const path =
      dialogState.mode === 'edit'
        ? `/exam-types/${dialogState.id}`
        : '/exam-types'

    try {
      const { ok, data } = await apiClient(path, method, payload)
      if (!ok || !data?.success) {
        const errors = data?.errors || {}
        if (errors.name) {
          const msg = Array.isArray(errors.name) ? errors.name[0] : errors.name
          if (msg) setDialogNameError(String(msg))
        }
        if (errors.status) {
          const msg = Array.isArray(errors.status) ? errors.status[0] : errors.status
          if (msg) setDialogStatusError(String(msg))
        }
        if (!errors.name && !errors.status) {
          const serverMessage =
            data?.errors && typeof data.errors === 'object'
              ? Object.values(data.errors).flat().join(' ')
              : data?.message
          setDialogNameError(serverMessage || 'Unable to save exam type. Please try again.')
        }
        return
      }

      showToast(
        dialogState.mode === 'edit'
          ? 'Exam type updated successfully.'
          : 'Exam type added successfully.',
        'success',
      )
      handleDialogClose()
      fetchExamTypes({ applyFilters: !!(search || statusFilter), targetPage: serverPage })
    } catch {
      setDialogNameError('Unable to reach server. Please try again.')
    } finally {
      setDialogLoading(false)
    }
  }

  const handleDelete = async (row) => {
    if (!row?.id) return
    setRowActionLoading((prev) => ({ ...prev, [row.id]: true }))
    try {
      const { ok, data } = await apiClient(`/exam-types/${row.id}`, 'DELETE')
      if (!ok || !data?.success) {
        const message =
          data?.errors && typeof data.errors === 'object'
            ? Object.values(data.errors).flat().join(' ')
            : data?.message
        showToast(message || 'Unable to delete exam type.', 'error')
        return
      }
      showToast('Exam type deleted successfully.', 'success')
      fetchExamTypes({ applyFilters: !!(search || statusFilter), targetPage: serverPage })
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
      const { ok, data } = await apiClient(`/exam-types/${row.id}/restore`, 'POST')
      if (!ok || !data?.success) {
        const message =
          data?.errors && typeof data.errors === 'object'
            ? Object.values(data.errors).flat().join(' ')
            : data?.message
        showToast(message || 'Unable to restore exam type.', 'error')
        return
      }
      showToast('Exam type restored successfully.', 'success')
      fetchExamTypes({ applyFilters: !!(search || statusFilter), targetPage: serverPage })
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
      {/* Page title */}
      <Box sx={{ mb: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 0.25 }}>
          <QuizRoundedIcon sx={{ fontSize: { xs: 28, sm: 32 }, color: ADMIN_PRIMARY }} />
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
            Exam Type
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
          Manage exam types
        </Typography>
      </Box>

      {/* Filters — same style as AdminUsers */}
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
              minWidth: { xs: '100%', sm: 120 },
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
              <MenuItem value="Inactive">Inactive</MenuItem>
              <MenuItem value="Deleted">Deleted</MenuItem>
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

      {/* Confirm delete / restore dialog — bottom sheet on mobile, centered on desktop */}
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
              {confirmState.mode === 'restore' ? 'Restore exam type' : 'Delete exam type'}
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
              ? 'Are you sure you want to restore this exam type?'
              : 'Are you sure you want to delete this exam type? You can restore it later from this list.'}
          </Typography>
          {confirmState.row && (
            <Typography
              variant="subtitle2"
              sx={{ mt: 1.5, fontWeight: 600, color: 'text.primary' }}
            >
              {confirmState.row.name}
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
              ? confirmState.mode === 'restore'
                ? 'Processing…'
                : 'Processing…'
              : confirmState.mode === 'restore'
              ? 'Yes, restore'
              : 'Yes, delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Table section — same style as AdminUsers */}
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
            Exam type list
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={openAddDialog}
            sx={{
              bgcolor: ADMIN_PRIMARY,
              borderRadius: '7px',
              fontWeight: 600,
              '&:hover': { bgcolor: ADMIN_PRIMARY_DARK },
            }}
          >
            Add Exam Type
          </Button>
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
                  <TableCell>Exam type</TableCell>
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
                          <Skeleton variant="text" width="60%" sx={{ borderRadius: 1, maxWidth: 160 }} />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="rounded" width={64} height={24} sx={{ borderRadius: '7px' }} />
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                            <Skeleton variant="circular" width={32} height={32} />
                            <Skeleton variant="circular" width={32} height={32} />
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  : examTypes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ py: 6 }}>
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
                          No exam types found.
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: 'text.disabled', maxWidth: 320 }}
                        >
                          Use the filters above or click &quot;Add Exam Type&quot; to create a new exam type.
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                  ) : examTypes.map((row) => (
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
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        {row.name}
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
                          borderRadius: '7px',
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
                          border: 'none',
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit" placement="top" arrow>
                        <IconButton
                          size="small"
                          onClick={() => openEditDialog(row)}
                          sx={{
                            color: theme.palette.grey[600],
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
                            {row.status === 'Deleted' ? (
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
                          sx={{ borderRadius: 1, maxWidth: 180, fontSize: '1rem' }}
                        />
                        <Skeleton
                          variant="rounded"
                          width={64}
                          height={26}
                          sx={{ mt: 1, borderRadius: '7px' }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Skeleton variant="circular" width={isMobile ? 40 : 36} height={isMobile ? 40 : 36} />
                        <Skeleton variant="circular" width={isMobile ? 40 : 36} height={isMobile ? 40 : 36} />
                      </Box>
                    </Box>
                  </Paper>
                ))
              : examTypes.length === 0 ? (
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
                      No exam types found.
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: 'text.disabled', maxWidth: 260 }}
                    >
                      Adjust your filters or add a new exam type to get started.
                    </Typography>
                  </Box>
                </Paper>
              ) : examTypes.map((row) => (
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
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 700,
                            color: 'text.primary',
                            fontSize: { xs: '1rem', sm: '0.875rem' },
                          }}
                        >
                          {row.name}
                        </Typography>
                        <Chip
                          label={row.status}
                          size="small"
                          sx={{
                            mt: 1,
                            height: { xs: 28, sm: 26 },
                            fontSize: { xs: '0.8125rem', sm: '0.75rem' },
                            fontWeight: 600,
                            borderRadius: '7px',
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
                            border: 'none',
                          }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0, gap: 0.25 }}>
                        <Tooltip title="Edit" placement="top" arrow>
                          <IconButton
                            size={isMobile ? 'large' : 'medium'}
                            onClick={() => openEditDialog(row)}
                            sx={{
                              color: theme.palette.grey[600],
                              ...(isMobile && { bgcolor: theme.palette.grey[100] }),
                              '&:hover': {
                                color: ADMIN_PRIMARY,
                                bgcolor: alpha(ADMIN_PRIMARY, 0.1),
                              },
                            }}
                          >
                            <EditRoundedIcon fontSize={isMobile ? 'medium' : 'small'} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={row.status === 'Deleted' ? 'Restore' : 'Delete'} placement="top" arrow>
                          <span>
                            <IconButton
                              size={isMobile ? 'large' : 'medium'}
                              disabled={!!rowActionLoading[row.id]}
                              onClick={() =>
                                row.status === 'Deleted' ? openConfirmRestore(row) : openConfirmDelete(row)
                              }
                              sx={{
                                color:
                                  row.status === 'Deleted'
                                    ? theme.palette.success.main
                                    : theme.palette.error.main,
                                ...(isMobile && {
                                  bgcolor:
                                    row.status === 'Deleted'
                                      ? alpha(theme.palette.success.main, 0.08)
                                      : alpha(theme.palette.error.main, 0.08),
                                }),
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
                              {row.status === 'Deleted' ? (
                                <RestoreFromTrashRoundedIcon fontSize={isMobile ? 'medium' : 'small'} />
                              ) : (
                                <DeleteRoundedIcon fontSize={isMobile ? 'medium' : 'small'} />
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

        {/* Pagination — same style as AdminUsers */}
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
              onChange={handleChangePage}
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

      {/* Add/Edit Exam Type dialog — style matched to AdminContacts */}
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
              <QuizRoundedIcon sx={{ fontSize: 24 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {dialogState.mode === 'edit' ? 'Edit Exam type' : 'Add Exam type'}
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
              label="Exam type"
              value={dialogState.name}
              onChange={(e) => {
                setDialogState((p) => ({ ...p, name: e.target.value }))
                if (dialogNameError) setDialogNameError('')
              }}
              fullWidth
              size="small"
              placeholder="e.g. UKMLA, PLAB"
              error={!!dialogNameError}
              helperText={dialogNameError}
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
            {dialogState.mode === 'edit' && (
              <FormControl
                size="small"
                fullWidth
                error={!!dialogStatusError}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '7px',
                    bgcolor: theme.palette.grey[50],
                  },
                  '& .MuiInputLabel-root.Mui-focused': { color: ADMIN_PRIMARY },
                }}
              >
                <InputLabel id="exam-type-status-label">Status</InputLabel>
                <Select
                  labelId="exam-type-status-label"
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
              color: '#fff',
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

export default AdminCoursesExamType
