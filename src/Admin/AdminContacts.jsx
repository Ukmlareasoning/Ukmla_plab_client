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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slide,
  Skeleton,
  Chip,
} from '@mui/material'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import ContactMailRoundedIcon from '@mui/icons-material/ContactMailRounded'
import SubjectRoundedIcon from '@mui/icons-material/SubjectRounded'
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded'
import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded'
import SendRoundedIcon from '@mui/icons-material/SendRounded'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import RestoreFromTrashRoundedIcon from '@mui/icons-material/RestoreFromTrashRounded'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import apiClient from '../server'
import { useToast } from '../components/ToastProvider'

const ADMIN_PRIMARY = '#384D84'
const ADMIN_PRIMARY_DARK = '#2a3a64'
const ADMIN_PRIMARY_LIGHT = '#4a5f9a'

const ROWS_PER_PAGE_OPTIONS = [5, 10, 20, 30, 40, 50, 100]

const keyframes = {
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
}

const SKELETON_ROW_COUNT = 5

function AdminContacts() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const showAsCards = useMediaQuery(theme.breakpoints.down('md'))
  const { showToast } = useToast()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [contacts, setContacts] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalRows, setTotalRows] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  const [listLoading, setListLoading] = useState(false)
  const [listError, setListError] = useState('')

  const [viewDialog, setViewDialog] = useState({ open: false, subject: '', message: '' })
  const [replyDialog, setReplyDialog] = useState({
    open: false,
    id: null,
    toEmail: '',
    originalSubject: '',
    replySubject: '',
    replyMessage: '',
  })
  const [replySubjectError, setReplySubjectError] = useState('')
  const [replyMessageError, setReplyMessageError] = useState('')
  const [replyLoading, setReplyLoading] = useState(false)

  const [rowActionLoading, setRowActionLoading] = useState({})
  const [confirmState, setConfirmState] = useState({
    open: false,
    mode: 'delete',
    row: null,
  })
  const [confirmLoading, setConfirmLoading] = useState(false)

  const serverPage = page + 1
  const from = totalRows === 0 ? 0 : (serverPage - 1) * rowsPerPage + 1
  const to = Math.min((serverPage - 1) * rowsPerPage + rowsPerPage, totalRows)

  const fetchContacts = async (opts = {}) => {
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
      const { ok, data } = await apiClient(`/contacts?${params.toString()}`, 'GET')
      if (!ok || !data?.success) {
        const message =
          data?.errors && typeof data.errors === 'object'
            ? Object.values(data.errors).flat().join(' ')
            : data?.message
        setListError(message || 'Unable to load contacts.')
        return
      }
      const list = data.data?.contacts || []
      const pagination = data.data?.pagination || {}
      setContacts(list)
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
    } finally {
      setListLoading(false)
    }
  }

  useEffect(() => {
    fetchContacts({ applyFilters: false, targetPage: 1, targetPerPage: rowsPerPage })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSearch = () => {
    setPage(0)
    fetchContacts({ applyFilters: true, targetPage: 1 })
  }

  const handleReset = () => {
    setSearch('')
    setStatusFilter('')
    setPage(0)
    fetchContacts({ applyFilters: false, targetPage: 1 })
  }

  const handleChangePage = (_, value) => {
    setPage(value - 1)
    fetchContacts({
      applyFilters: !!(search || statusFilter),
      targetPage: value,
      targetPerPage: rowsPerPage,
    })
  }

  const handleChangeRowsPerPage = (e) => {
    const newPerPage = Number(e.target.value)
    setRowsPerPage(newPerPage)
    setPage(0)
    fetchContacts({
      applyFilters: !!(search || statusFilter),
      targetPage: 1,
      targetPerPage: newPerPage,
    })
  }

  const openViewDialog = (row) => {
    setViewDialog({ open: true, subject: row.subject || '', message: row.message || '' })
  }

  const openReplyDialog = (row) => {
    setReplyDialog({
      open: true,
      id: row.id,
      toEmail: row.email || '',
      originalSubject: row.subject || '',
      replySubject: row.reply_subject || `Re: ${row.subject || ''}`,
      replyMessage: row.reply_message || '',
    })
    setReplySubjectError('')
    setReplyMessageError('')
  }

  const handleReplyDialogClose = () => {
    if (replyLoading) return
    setReplyDialog((p) => ({ ...p, open: false, id: null, replySubject: '', replyMessage: '' }))
    setReplySubjectError('')
    setReplyMessageError('')
  }

  const handleSendReply = async (e) => {
    if (e?.preventDefault) e.preventDefault()
    if (replyLoading || !replyDialog.id) return
    setReplyLoading(true)
    setReplySubjectError('')
    setReplyMessageError('')
    const sub = (replyDialog.replySubject || '').trim()
    const msg = (replyDialog.replyMessage || '').trim()
    if (!sub) {
      setReplySubjectError('Reply subject is required.')
      setReplyLoading(false)
      return
    }
    if (!msg) {
      setReplyMessageError('Reply message is required.')
      setReplyLoading(false)
      return
    }
    try {
      const { ok, data } = await apiClient(`/contacts/${replyDialog.id}/reply`, 'POST', {
        reply_subject: sub,
        reply_message: msg,
      })
      if (!ok || !data?.success) {
        const errors = data?.errors || {}
        if (errors.reply_subject) {
          const m = Array.isArray(errors.reply_subject) ? errors.reply_subject[0] : errors.reply_subject
          if (m) setReplySubjectError(String(m))
        }
        if (errors.reply_message) {
          const m = Array.isArray(errors.reply_message) ? errors.reply_message[0] : errors.reply_message
          if (m) setReplyMessageError(String(m))
        }
        if (!errors.reply_subject && !errors.reply_message) {
          showToast(
            (data?.errors && typeof data.errors === 'object'
              ? Object.values(data.errors).flat().join(' ')
              : data?.message) || 'Unable to save reply.',
            'error'
          )
        }
        setReplyLoading(false)
        return
      }
      showToast('Reply saved successfully.', 'success')
      handleReplyDialogClose()
      fetchContacts({ applyFilters: !!(search || statusFilter), targetPage: serverPage })
    } catch {
      showToast('Unable to reach server. Please try again.', 'error')
      setReplyLoading(false)
    }
  }

  const handleDelete = async (row) => {
    if (!row?.id) return
    setRowActionLoading((prev) => ({ ...prev, [row.id]: true }))
    try {
      const { ok, data } = await apiClient(`/contacts/${row.id}`, 'DELETE')
      if (!ok || !data?.success) {
        const message =
          data?.errors && typeof data.errors === 'object'
            ? Object.values(data.errors).flat().join(' ')
            : data?.message
        showToast(message || 'Unable to delete contact.', 'error')
        return
      }
      showToast('Contact deleted successfully.', 'success')
      fetchContacts({ applyFilters: !!(search || statusFilter), targetPage: serverPage })
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
      const { ok, data } = await apiClient(`/contacts/${row.id}/restore`, 'POST')
      if (!ok || !data?.success) {
        const message =
          data?.errors && typeof data.errors === 'object'
            ? Object.values(data.errors).flat().join(' ')
            : data?.message
        showToast(message || 'Unable to restore contact.', 'error')
        return
      }
      showToast('Contact restored successfully.', 'success')
      fetchContacts({ applyFilters: !!(search || statusFilter), targetPage: serverPage })
    } catch {
      showToast('Unable to reach server. Please try again.', 'error')
    } finally {
      setRowActionLoading((prev) => ({ ...prev, [row.id]: false }))
    }
  }

  const openConfirmDelete = (row) => setConfirmState({ open: true, mode: 'delete', row })
  const openConfirmRestore = (row) => setConfirmState({ open: true, mode: 'restore', row })

  const handleConfirmClose = () => {
    if (confirmLoading) return
    setConfirmState({ open: false, mode: 'delete', row: null })
  }

  const handleConfirmProceed = async () => {
    if (!confirmState.row || confirmLoading) return
    setConfirmLoading(true)
    try {
      if (confirmState.mode === 'restore') await handleRestore(confirmState.row)
      else await handleDelete(confirmState.row)
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
            '& .MuiDialog-container': { alignItems: 'flex-end', justifyContent: 'center' },
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
            sx: { bgcolor: alpha(theme.palette.common.black, 0.65), backdropFilter: 'blur(6px)' },
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
            <Box sx={{ width: 40, height: 4, borderRadius: '7px', bgcolor: theme.palette.grey[400] }} />
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
                <RestoreFromTrashRoundedIcon sx={{ fontSize: 22, color: theme.palette.success.dark }} />
              ) : (
                <DeleteRoundedIcon sx={{ fontSize: 22, color: theme.palette.error.dark }} />
              )}
            </Box>
            <Typography component="span" sx={{ fontWeight: 700 }}>
              {confirmState.mode === 'restore' ? 'Restore contact' : 'Delete contact'}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ px: 3, pt: 3, pb: 3 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1.5 }}>
            {confirmState.mode === 'restore'
              ? 'Are you sure you want to restore this contact?'
              : 'Are you sure you want to delete this contact? You can restore it later from this list.'}
          </Typography>
          {confirmState.row && (
            <Typography variant="subtitle2" sx={{ mt: 1.5, fontWeight: 600, color: 'text.primary' }}>
              {confirmState.row.full_name}
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
              '&:hover': { borderColor: ADMIN_PRIMARY, bgcolor: alpha(ADMIN_PRIMARY, 0.04) },
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
                <AutorenewIcon sx={{ animation: 'spin 0.8s linear infinite', color: '#fff' }} />
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
            {confirmLoading ? 'Processing…' : confirmState.mode === 'restore' ? 'Yes, restore' : 'Yes, delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Page title */}
      <Box sx={{ mb: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 0.25 }}>
          <ContactMailRoundedIcon sx={{ fontSize: { xs: 28, sm: 32 }, color: ADMIN_PRIMARY }} />
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
            Contacts
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
          View contact messages
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
            placeholder="Search by name or email..."
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
            <InputLabel id="contacts-status-label">Status</InputLabel>
            <Select
              labelId="contacts-status-label"
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
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
            Contact list
          </Typography>
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
                  <TableCell>Fullname</TableCell>
                  <TableCell>Email</TableCell>
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
                          <Skeleton variant="text" width="60%" sx={{ borderRadius: 1, maxWidth: 140 }} />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" width="70%" sx={{ borderRadius: 1, maxWidth: 160 }} />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="rounded" width={64} height={24} sx={{ borderRadius: '7px' }} />
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                            <Skeleton variant="circular" width={32} height={32} />
                            <Skeleton variant="circular" width={32} height={32} />
                            <Skeleton variant="circular" width={32} height={32} />
                            <Skeleton variant="circular" width={32} height={32} />
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  : contacts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                            <ViewListRoundedIcon sx={{ fontSize: 40, color: alpha(ADMIN_PRIMARY, 0.4) }} />
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                              No contacts found.
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.disabled', maxWidth: 320 }}>
                              Use the filters above to search by name or email.
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )
                  : contacts.map((row) => (
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
                            {row.full_name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                            {row.email}
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
                                  : alpha(theme.palette.error.main, 0.12),
                              color:
                                row.status === 'Active'
                                  ? theme.palette.success.dark
                                  : theme.palette.error.dark,
                              border: 'none',
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="View" placement="top" arrow>
                            <IconButton
                              size="small"
                              onClick={() => openViewDialog(row)}
                              sx={{
                                color: theme.palette.grey[600],
                                '&:hover': { color: ADMIN_PRIMARY, bgcolor: alpha(ADMIN_PRIMARY, 0.08) },
                              }}
                            >
                              <VisibilityRoundedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Reply" placement="top" arrow>
                            <IconButton
                              size="small"
                              onClick={() => openReplyDialog(row)}
                              disabled={row.status === 'Deleted'}
                              sx={{
                                color: theme.palette.info.main,
                                ml: 0.5,
                                '&:hover': { color: theme.palette.info.dark, bgcolor: alpha(theme.palette.info.main, 0.12) },
                              }}
                            >
                              <ReplyRoundedIcon fontSize="small" />
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
                                  <AutorenewIcon sx={{ fontSize: 18, animation: 'spin 0.8s linear infinite' }} />
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
                      p: { xs: 2, sm: 2 },
                      borderRadius: '7px',
                      border: '1px solid',
                      borderColor: theme.palette.grey[200],
                      bgcolor: theme.palette.background.paper,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1.5 }}>
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Skeleton variant="text" width="70%" sx={{ borderRadius: 1, maxWidth: 160 }} />
                        <Skeleton variant="text" width="50%" sx={{ mt: 1, borderRadius: 1, maxWidth: 200 }} />
                        <Skeleton variant="rounded" width={64} height={24} sx={{ mt: 1, borderRadius: '7px' }} />
                      </Box>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Skeleton variant="circular" width={36} height={36} />
                        <Skeleton variant="circular" width={36} height={36} />
                        <Skeleton variant="circular" width={36} height={36} />
                      </Box>
                    </Box>
                  </Paper>
                ))
              : contacts.length === 0 ? (
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
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
                        No contacts found.
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.disabled', maxWidth: 260 }}>
                        Adjust your filters to see contacts.
                      </Typography>
                    </Box>
                  </Paper>
                )
              : contacts.map((row) => (
                  <Paper
                    key={row.id}
                    elevation={0}
                    sx={{
                      p: { xs: 2, sm: 2 },
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
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        gap: 1.5,
                        ...(isMobile ? { pb: 1.5 } : { mb: 2, pb: 2, borderBottom: '1px solid', borderColor: theme.palette.divider }),
                      }}
                    >
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography
                          variant="subtitle1"
                          noWrap
                          sx={{
                            fontWeight: 700,
                            color: 'text.primary',
                            fontSize: { xs: '1rem', sm: '0.875rem' },
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {row.full_name}
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
                        <Chip
                          label={row.status}
                          size="small"
                          sx={{
                            mt: 1,
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
                      </Box>
                      <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', flexShrink: 0, gap: 0.25 }}>
                        <Tooltip title="View" placement="top" arrow>
                          <IconButton
                            size="medium"
                            onClick={() => openViewDialog(row)}
                            sx={{
                              color: theme.palette.grey[600],
                              '&:hover': { color: ADMIN_PRIMARY, bgcolor: alpha(ADMIN_PRIMARY, 0.08) },
                            }}
                          >
                            <VisibilityRoundedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Reply" placement="top" arrow>
                          <IconButton
                            size="medium"
                            onClick={() => openReplyDialog(row)}
                            disabled={row.status === 'Deleted'}
                            sx={{
                              color: theme.palette.info.main,
                              '&:hover': {
                                color: theme.palette.info.dark,
                                bgcolor: alpha(theme.palette.info.main, 0.1),
                              },
                            }}
                          >
                            <ReplyRoundedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={row.status === 'Deleted' ? 'Restore' : 'Delete'} placement="top" arrow>
                          <span>
                            <IconButton
                              size="medium"
                              disabled={!!rowActionLoading[row.id]}
                              onClick={() =>
                                row.status === 'Deleted' ? openConfirmRestore(row) : openConfirmDelete(row)
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
                                      : alpha(theme.palette.error.main, 0.12),
                                },
                              }}
                            >
                              {rowActionLoading[row.id] ? (
                                <AutorenewIcon sx={{ fontSize: 18, animation: 'spin 0.8s linear infinite' }} />
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
                    {isMobile && (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          flexWrap: 'wrap',
                          gap: 1,
                          pt: 1,
                          borderTop: '1px solid',
                          borderColor: theme.palette.divider,
                        }}
                      >
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<VisibilityRoundedIcon sx={{ fontSize: 20 }} />}
                          onClick={() => openViewDialog(row)}
                          sx={{
                            borderColor: ADMIN_PRIMARY,
                            color: ADMIN_PRIMARY,
                            fontWeight: 600,
                            fontSize: '0.8125rem',
                            borderRadius: '7px',
                            py: 0.75,
                            px: 1.5,
                            textTransform: 'none',
                            '&:hover': { borderColor: ADMIN_PRIMARY_DARK, bgcolor: alpha(ADMIN_PRIMARY, 0.08) },
                          }}
                        >
                          View message
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<ReplyRoundedIcon sx={{ fontSize: 20 }} />}
                          onClick={() => openReplyDialog(row)}
                          disabled={row.status === 'Deleted'}
                          sx={{
                            borderColor: theme.palette.info.main,
                            color: theme.palette.info.main,
                            fontWeight: 600,
                            fontSize: '0.8125rem',
                            borderRadius: '7px',
                            py: 0.75,
                            px: 1.5,
                            textTransform: 'none',
                            '&:hover': {
                              borderColor: theme.palette.info.dark,
                              bgcolor: alpha(theme.palette.info.main, 0.08),
                            },
                          }}
                        >
                          Reply
                        </Button>
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
                          }}
                        >
                          {rowActionLoading[row.id] ? (
                            <AutorenewIcon sx={{ fontSize: 18, animation: 'spin 0.8s linear infinite' }} />
                          ) : row.status === 'Deleted' ? (
                            <RestoreFromTrashRoundedIcon fontSize="small" />
                          ) : (
                            <DeleteRoundedIcon fontSize="small" />
                          )}
                        </IconButton>
                      </Box>
                    )}
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
            borderRadius: '0 0 7px 7px',
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

      {/* View dialog: bottom sheet on mobile (slide up), centered modal on desktop */}
      <Dialog
        open={viewDialog.open}
        onClose={() => setViewDialog((p) => ({ ...p, open: false }))}
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
                borderRadius: 2,
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
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                bgcolor: alpha(ADMIN_PRIMARY, 0.12),
                color: ADMIN_PRIMARY,
              }}
            >
              <ContactMailRoundedIcon sx={{ fontSize: 24 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Contact message
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={() => setViewDialog((p) => ({ ...p, open: false }))}
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
            pt: 4,
            pb: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 3.25,
            borderTop: '1px solid',
            borderColor: alpha(theme.palette.divider, 0.8),
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
            <SubjectRoundedIcon sx={{ fontSize: 22, color: ADMIN_PRIMARY, mt: 0.25 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, minWidth: 0 }}>
              <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: 0.8 }}>
                Subject
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 600, lineHeight: 1.5 }}>
                {viewDialog.subject}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
            <ChatBubbleOutlineRoundedIcon sx={{ fontSize: 22, color: ADMIN_PRIMARY, mt: 0.3 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, minWidth: 0 }}>
              <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: 0.8 }}>
                Message
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.primary', whiteSpace: 'pre-wrap', lineHeight: 1.65 }}>
                {viewDialog.message}
              </Typography>
            </Box>
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
            variant="contained"
            startIcon={<CloseRoundedIcon sx={{ fontSize: 20 }} />}
            onClick={() => setViewDialog((p) => ({ ...p, open: false }))}
            sx={{
              bgcolor: ADMIN_PRIMARY,
              borderRadius: '7px',
              fontWeight: 600,
              px: 2.5,
              '&:hover': { bgcolor: ADMIN_PRIMARY_DARK },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reply dialog: theme-matched, subject + message, Send email */}
      <Dialog
        open={replyDialog.open}
        onClose={handleReplyDialogClose}
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
                borderRadius: 2,
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
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                bgcolor: alpha(ADMIN_PRIMARY, 0.12),
                color: ADMIN_PRIMARY,
              }}
            >
              <ReplyRoundedIcon sx={{ fontSize: 24 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Reply email
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={handleReplyDialogClose}
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
            pt: 4,
            pb: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            borderTop: '1px solid',
            borderColor: alpha(theme.palette.divider, 0.8),
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
            <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: 0.8 }}>
              To
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600 }}>
              {replyDialog.toEmail}
            </Typography>
          </Box>
          <TextField
            label="Subject"
            value={replyDialog.replySubject}
            onChange={(e) => {
              setReplyDialog((p) => ({ ...p, replySubject: e.target.value }))
              if (replySubjectError) setReplySubjectError('')
            }}
            fullWidth
            size="small"
            error={!!replySubjectError}
            helperText={replySubjectError}
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
          <TextField
            label="Message"
            value={replyDialog.replyMessage}
            onChange={(e) => {
              setReplyDialog((p) => ({ ...p, replyMessage: e.target.value }))
              if (replyMessageError) setReplyMessageError('')
            }}
            fullWidth
            multiline
            minRows={4}
            maxRows={8}
            size="small"
            error={!!replyMessageError}
            helperText={replyMessageError}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '7px',
                bgcolor: theme.palette.grey[50],
                alignItems: 'flex-start',
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
            onClick={handleReplyDialogClose}
            disabled={replyLoading}
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
            variant="contained"
            disabled={replyLoading}
            startIcon={
              replyLoading ? (
                <AutorenewIcon sx={{ animation: 'spin 0.8s linear infinite', color: '#fff', fontSize: 20 }} />
              ) : (
                <SendRoundedIcon sx={{ fontSize: 20 }} />
              )
            }
            onClick={handleSendReply}
            sx={{
              bgcolor: ADMIN_PRIMARY,
              borderRadius: '7px',
              fontWeight: 600,
              px: 2.5,
              '&:hover': { bgcolor: ADMIN_PRIMARY_DARK },
              '&.Mui-disabled': { color: '#fff', bgcolor: ADMIN_PRIMARY, opacity: 1 },
            }}
          >
            {replyLoading ? 'Saving…' : 'Save reply'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AdminContacts
