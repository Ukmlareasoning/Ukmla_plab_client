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
  Divider,
  Skeleton,
} from '@mui/material'
import Slide from '@mui/material/Slide'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import NoteRoundedIcon from '@mui/icons-material/NoteRounded'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import CategoryIcon from '@mui/icons-material/Category'
import SummarizeIcon from '@mui/icons-material/Summarize'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import RestoreFromTrashRoundedIcon from '@mui/icons-material/RestoreFromTrashRounded'
import apiClient from '../server'
import { useToast } from '../components/ToastProvider'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import LabelIcon from '@mui/icons-material/Label'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

const ADMIN_PRIMARY = '#384D84'
const ADMIN_PRIMARY_DARK = '#2a3a64'
const ADMIN_PRIMARY_LIGHT = '#4a5f9a'

const ROWS_PER_PAGE_OPTIONS = [5, 10, 20, 30, 40, 50, 100]
const SKELETON_ROW_COUNT = 5

function DetailRow({ label, value, icon }) {
  const theme = useTheme()
  if (value == null || value === '') return null
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'center', sm: 'flex-start' },
        gap: { xs: 1, sm: 1.5 },
        mb: { xs: 1.5, sm: 2 },
        p: { xs: 1.5, sm: 2 },
        borderRadius: '8px',
        bgcolor: alpha(theme.palette.grey[100], 0.5),
        border: '1px solid',
        borderColor: alpha(theme.palette.grey[300], 0.4),
        textAlign: { xs: 'center', sm: 'left' },
      }}
    >
      {icon && (
        <Box
          sx={{
            width: { xs: 40, sm: 36 },
            height: { xs: 40, sm: 36 },
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            bgcolor: alpha(ADMIN_PRIMARY, 0.1),
            color: ADMIN_PRIMARY,
            alignSelf: { xs: 'center', sm: 'flex-start' },
            '& .MuiSvgIcon-root': { fontSize: 20 },
          }}
        >
          {icon}
        </Box>
      )}
      <Box sx={{ minWidth: 0, flex: 1, width: '100%' }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6, display: 'block', mb: 0.5, fontSize: '0.75rem' }}>
          {label}
        </Typography>
        {typeof value === 'string' && (
          <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
            {value}
          </Typography>
        )}
        {Array.isArray(value) && (
          <Box component="ul" sx={{ pl: 2.5, m: 0, '& li': { mb: 0.5, lineHeight: 1.5, fontSize: '0.875rem' } }}>
            {value.map((item, idx) => (
              <li key={idx}>
                <Typography variant="body2" component="span" sx={{ color: 'text.primary' }}>
                  {item}
                </Typography>
              </li>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  )
}

function NoteViewCard({ note, typeName }) {
  const theme = useTheme()
  const difficultyColor =
    note.difficulty_level_name === 'Hard'
      ? theme.palette.error.main
      : note.difficulty_level_name === 'Medium'
        ? theme.palette.warning.main
        : theme.palette.success.main
  const importanceColor =
    note.exam_importance_level === 'High'
      ? theme.palette.error.main
      : note.exam_importance_level === 'Medium'
        ? theme.palette.warning.main
        : theme.palette.info.main

  return (
    <Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, mb: 2 }}>
        <Chip
          label={typeName}
          size="small"
          sx={{ borderRadius: '7px', bgcolor: alpha(ADMIN_PRIMARY, 0.12), color: ADMIN_PRIMARY, fontWeight: 600, fontSize: '0.75rem', height: 28 }}
        />
        <Chip
          icon={<CheckCircleIcon sx={{ fontSize: 14 }} />}
          label={note.status}
          size="small"
          sx={{ borderRadius: '7px', bgcolor: alpha(theme.palette.success.main, 0.12), color: theme.palette.success.dark, fontWeight: 600, height: 28, '& .MuiChip-icon': { fontSize: 14 } }}
        />
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 2 }}>
        {note.title}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <DetailRow label="Description" value={note.description} icon={<DescriptionOutlinedIcon sx={{ fontSize: 20 }} />} />
      <DetailRow label="Type / Specialty" value={typeName} icon={<CategoryIcon sx={{ fontSize: 20 }} />} />
      <DetailRow label="Summary" value={note.summary} icon={<SummarizeIcon sx={{ fontSize: 20 }} />} />
      <DetailRow label="Key Points" value={note.key_points} icon={<FormatListBulletedIcon sx={{ fontSize: 20 }} />} />
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1, mb: 2 }}>
        <Box sx={{ flex: 1, p: 1.5, borderRadius: '8px', bgcolor: alpha(theme.palette.grey[100], 0.5), border: '1px solid', borderColor: alpha(theme.palette.grey[300], 0.4) }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
            <SignalCellularAltIcon sx={{ fontSize: 18, color: difficultyColor }} />
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.6875rem' }}>
              Difficulty
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
              {note.difficulty_level_name}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ flex: 1, p: 1.5, borderRadius: '8px', bgcolor: alpha(theme.palette.grey[100], 0.5), border: '1px solid', borderColor: alpha(theme.palette.grey[300], 0.4) }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
            <StarBorderIcon sx={{ fontSize: 18, color: importanceColor }} />
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.6875rem' }}>
              Importance
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
              {note.exam_importance_level}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box sx={{ mb: 2, p: 1.5, borderRadius: '8px', bgcolor: alpha(theme.palette.grey[100], 0.5), border: '1px solid', borderColor: alpha(theme.palette.grey[300], 0.4) }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', display: 'block', mb: 0.75 }}>
          Tags
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {note.tags.map((tag, idx) => (
            <Chip
              key={idx}
              icon={<LabelIcon sx={{ fontSize: 12 }} />}
              label={tag}
              size="small"
              sx={{ borderRadius: '7px', bgcolor: alpha(ADMIN_PRIMARY, 0.1), color: 'text.primary', fontWeight: 500, height: 24, fontSize: '0.75rem', '& .MuiChip-icon': { fontSize: 12 } }}
            />
          ))}
        </Box>
      </Box>
      <DetailRow
        label="Created At"
        value={new Date(note.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
        icon={<CalendarTodayIcon sx={{ fontSize: 20 }} />}
      />
    </Box>
  )
}

function AdminNotes() {
  const theme = useTheme()
  const navigate = useNavigate()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const showAsCards = useMediaQuery(theme.breakpoints.down('md'))
  const { showToast } = useToast()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [notes, setNotes] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalRows, setTotalRows] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [viewNote, setViewNote] = useState(null)

  const [listLoading, setListLoading] = useState(false)
  const [listError, setListError] = useState('')

  const [rowActionLoading, setRowActionLoading] = useState({})
  const [confirmState, setConfirmState] = useState({
    open: false,
    mode: 'delete', // delete | restore
    row: null,
  })
  const [confirmLoading, setConfirmLoading] = useState(false)

  const serverPage = page + 1

  const from = totalRows === 0 ? 0 : (serverPage - 1) * rowsPerPage + 1
  const to = Math.min((serverPage - 1) * rowsPerPage + rowsPerPage, totalRows)

  const fetchNotes = async (opts = {}) => {
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
      const { ok, data } = await apiClient(`/notes?${params.toString()}`, 'GET')
      if (!ok || !data?.success) {
        const message =
          data?.errors && typeof data.errors === 'object'
            ? Object.values(data.errors).flat().join(' ')
            : data?.message
        setListError(message || 'Unable to load notes.')
        return
      }

      const list = data.data?.notes || []
      const pagination = data.data?.pagination || {}

      setNotes(list)
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
    fetchNotes({ applyFilters: false, targetPage: 1, targetPerPage: rowsPerPage })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChangePage = (_, value) => {
    const newPage = value - 1
    setPage(newPage)
    fetchNotes({
      applyFilters: !!(search || statusFilter),
      targetPage: value,
      targetPerPage: rowsPerPage,
    })
  }

  const handleChangeRowsPerPage = (e) => {
    const newPerPage = Number(e.target.value)
    setRowsPerPage(newPerPage)
    setPage(0)
    fetchNotes({
      applyFilters: !!(search || statusFilter),
      targetPage: 1,
      targetPerPage: newPerPage,
    })
  }

  const handleReset = () => {
    setSearch('')
    setStatusFilter('')
    setPage(0)
    fetchNotes({ applyFilters: false, targetPage: 1 })
  }

  const handleView = (note) => setViewNote(note)
  const handleViewClose = () => setViewNote(null)

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
      const { ok, data } = await apiClient(`/notes/${row.id}`, 'DELETE')
      if (!ok || !data?.success) {
        const message =
          data?.errors && typeof data.errors === 'object'
            ? Object.values(data.errors).flat().join(' ')
            : data?.message
        showToast(message || 'Unable to delete note.', 'error')
        return
      }
      showToast('Note deleted successfully.', 'success')
      fetchNotes({ applyFilters: !!(search || statusFilter), targetPage: serverPage })
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
      const { ok, data } = await apiClient(`/notes/${row.id}/restore`, 'POST')
      if (!ok || !data?.success) {
        const message =
          data?.errors && typeof data.errors === 'object'
            ? Object.values(data.errors).flat().join(' ')
            : data?.message
        showToast(message || 'Unable to restore note.', 'error')
        return
      }
      showToast('Note restored successfully.', 'success')
      fetchNotes({ applyFilters: !!(search || statusFilter), targetPage: serverPage })
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

  const getTypeName = (row) => (row && row.notes_type_name) || 'General'

  const badgeChip = (label, colorBg, colorText) => (
    <Chip
      label={label}
      size="small"
      sx={{
        height: 24,
        fontSize: '0.75rem',
        fontWeight: 600,
        borderRadius: '7px',
        bgcolor: colorBg,
        color: colorText,
        border: 'none',
      }}
    />
  )

  return (
    <Box sx={{ width: '100%', minWidth: 0, maxWidth: 1400, mx: 'auto', overflowX: 'hidden' }}>
      {/* Page title */}
      <Box sx={{ mb: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 0.25 }}>
          <NoteRoundedIcon sx={{ fontSize: { xs: 28, sm: 32 }, color: ADMIN_PRIMARY }} />
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
            Notes
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
          Manage notes
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
                  ? 'Restore note'
                  : 'Delete note'}
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
                ? 'Are you sure you want to restore this note?'
                : 'Are you sure you want to delete this note? You can restore it later from this list.'}
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
              flexShrink: 0,
              '& .MuiOutlinedInput-root': { bgcolor: theme.palette.grey[50], borderRadius: '7px' },
              '& .MuiInputLabel-root.Mui-focused': { color: ADMIN_PRIMARY },
            }}
          >
            <InputLabel id="status-label">Status</InputLabel>
            <Select labelId="status-label" value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
              <MenuItem value="Deleted">Deleted</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', sm: 'auto' }, flex: { xs: '1 1 100%', sm: '0 0 auto' }, flexShrink: 0 }}>
            <Button
              variant="contained"
              size="small"
              startIcon={<SearchRoundedIcon sx={{ fontSize: 18 }} />}
              onClick={() => fetchNotes({ applyFilters: true, targetPage: 1 })}
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
            Note list
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={() => navigate('/admin/notes/add')}
            sx={{
              bgcolor: ADMIN_PRIMARY,
              borderRadius: '7px',
              fontWeight: 600,
              '&:hover': { bgcolor: ADMIN_PRIMARY_DARK },
            }}
          >
            Add Note
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
                  <TableCell>Title</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Difficulty</TableCell>
                  <TableCell>Importance</TableCell>
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
                          <Skeleton variant="text" width="70%" sx={{ borderRadius: 1, maxWidth: 200 }} />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="rounded" width={100} height={24} sx={{ borderRadius: '7px' }} />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="rounded" width={80} height={24} sx={{ borderRadius: '7px' }} />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="rounded" width={80} height={24} sx={{ borderRadius: '7px' }} />
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
                  : notes.length === 0 ? (
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
                          No notes found.
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: 'text.disabled', maxWidth: 320 }}
                        >
                          Use the filters above or click &quot;Add Note&quot; to create a new note.
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                  ) : notes.map((row) => {
                  const typeName = getTypeName(row)
                  const diffColor = row.difficulty_level_name === 'Hard' ? theme.palette.error.main : row.difficulty_level_name === 'Medium' ? theme.palette.warning.main : theme.palette.success.main
                  const impColor = row.exam_importance_level === 'High' ? theme.palette.error.main : row.exam_importance_level === 'Medium' ? theme.palette.warning.main : theme.palette.info.main
                  return (
                    <TableRow
                      key={row.id}
                      hover
                      sx={{
                        '&:hover': { bgcolor: alpha(ADMIN_PRIMARY, 0.04) },
                        '& .MuiTableCell-body': { borderColor: theme.palette.grey[200], py: 1.5, fontSize: '0.875rem' },
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                          {row.title}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {badgeChip(typeName, alpha(ADMIN_PRIMARY, 0.12), ADMIN_PRIMARY)}
                      </TableCell>
                      <TableCell>
                        {badgeChip(row.difficulty_level_name, alpha(diffColor, 0.12), diffColor)}
                      </TableCell>
                      <TableCell>
                        {badgeChip(row.exam_importance_level, alpha(impColor, 0.12), impColor)}
                      </TableCell>
                      <TableCell>
                        {badgeChip(
                          row.status,
                          row.status === 'Active'
                            ? alpha(theme.palette.success.main, 0.12)
                            : row.status === 'Deleted'
                            ? alpha(theme.palette.error.main, 0.12)
                            : alpha(theme.palette.grey[500], 0.12),
                          row.status === 'Active'
                            ? theme.palette.success.dark
                            : row.status === 'Deleted'
                            ? theme.palette.error.dark
                            : theme.palette.grey[600]
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="View" placement="top" arrow>
                          <IconButton
                            size="small"
                            onClick={() => handleView(row)}
                            sx={{ color: theme.palette.grey[600], '&:hover': { color: ADMIN_PRIMARY, bgcolor: alpha(ADMIN_PRIMARY, 0.08) } }}
                          >
                            <VisibilityRoundedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit" placement="top" arrow>
                          <IconButton
                            size="small"
                            onClick={() => navigate('/admin/notes/add', { state: { note: row } })}
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
                  )
                })}
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
            {paginated.map((row) => {
              const typeName = getTypeName(row.type_id)
              const diffColor = row.difficulty_level === 'Hard' ? theme.palette.error.main : row.difficulty_level === 'Medium' ? theme.palette.warning.main : theme.palette.success.main
              const impColor = row.exam_importance_level === 'High' ? theme.palette.error.main : row.exam_importance_level === 'Medium' ? theme.palette.warning.main : theme.palette.info.main
              return (
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
                        <IconButton
                          size="medium"
                          onClick={() => handleView(row)}
                          sx={{ color: theme.palette.info.main, '&:hover': { color: theme.palette.info.dark, bgcolor: alpha(theme.palette.info.main, 0.15) } }}
                        >
                          <VisibilityRoundedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit" placement="top" arrow>
                        <IconButton
                          size="medium"
                          component="a"
                          href="#"
                          sx={{ color: theme.palette.grey[600], '&:hover': { color: ADMIN_PRIMARY, bgcolor: alpha(ADMIN_PRIMARY, 0.1) } }}
                        >
                          <EditRoundedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete" placement="top" arrow>
                        <IconButton
                          size="medium"
                          onClick={() => handleDelete(row.id)}
                          sx={{
                            color: theme.palette.error.main,
                            '&:hover': { color: theme.palette.error.dark, bgcolor: alpha(theme.palette.error.main, 0.15) },
                          }}
                        >
                          <DeleteRoundedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  {/* Bottom row: chips; on mobile, View/Edit/Delete in card footer */}
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
                      {badgeChip(typeName, alpha(ADMIN_PRIMARY, 0.12), ADMIN_PRIMARY)}
                      {badgeChip(row.difficulty_level, alpha(diffColor, 0.12), diffColor)}
                      {badgeChip(row.exam_importance_level, alpha(impColor, 0.12), impColor)}
                      {badgeChip(
                        row.status,
                        row.status === 'Active' ? alpha(theme.palette.success.main, 0.12) : alpha(theme.palette.grey[500], 0.12),
                        row.status === 'Active' ? theme.palette.success.dark : theme.palette.grey[600]
                      )}
                    </Box>
                    <Box sx={{ display: { xs: 'flex', sm: 'none' }, alignItems: 'center', flexShrink: 0, gap: 0.25 }}>
                      <Tooltip title="View" placement="top" arrow>
                        <IconButton
                          size="large"
                          onClick={() => handleView(row)}
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
                          component="a"
                          href="#"
                          sx={{
                            color: theme.palette.grey[600],
                            bgcolor: theme.palette.grey[100],
                            '&:hover': { color: ADMIN_PRIMARY, bgcolor: alpha(ADMIN_PRIMARY, 0.1) },
                          }}
                        >
                          <EditRoundedIcon fontSize="medium" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete" placement="top" arrow>
                        <IconButton
                          size="large"
                          onClick={() => handleDelete(row.id)}
                          sx={{
                            color: theme.palette.error.main,
                            bgcolor: alpha(theme.palette.error.main, 0.08),
                            '&:hover': { color: theme.palette.error.dark, bgcolor: alpha(theme.palette.error.main, 0.15) },
                          }}
                        >
                          <DeleteRoundedIcon fontSize="medium" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Paper>
              )
            })}
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
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
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

      {/* View note dialog */}
      <Dialog
        open={!!viewNote}
        onClose={handleViewClose}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Slide}
        TransitionProps={{ direction: 'up' }}
        slotProps={{
          backdrop: { sx: { bgcolor: alpha(theme.palette.common.black, 0.65), backdropFilter: 'blur(6px)' } },
        }}
        PaperProps={{
          sx: {
            margin: 2,
            maxHeight: 'calc(100vh - 32px)',
            borderRadius: '7px',
            border: '1px solid',
            borderColor: alpha(ADMIN_PRIMARY, 0.25),
            boxShadow: `0 12px 40px ${alpha(ADMIN_PRIMARY, 0.15)}`,
            bgcolor: theme.palette.background.paper,
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
            px: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
            <Box sx={{ width: 44, height: 44, borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, bgcolor: alpha(ADMIN_PRIMARY, 0.12), color: ADMIN_PRIMARY }}>
              <DescriptionOutlinedIcon sx={{ fontSize: 24 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Note details
            </Typography>
          </Box>
          <IconButton size="small" onClick={handleViewClose} sx={{ color: theme.palette.grey[600], flexShrink: 0, '&:hover': { color: ADMIN_PRIMARY, bgcolor: alpha(ADMIN_PRIMARY, 0.08) } }}>
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ px: 3, py: 2, overflow: 'auto' }}>
          {viewNote && <NoteViewCard note={viewNote} typeName={getTypeName(viewNote)} />}
        </DialogContent>
      </Dialog>
    </Box>
  )
}

export default AdminNotes
