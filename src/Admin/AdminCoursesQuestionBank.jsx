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
  Skeleton,
} from '@mui/material'
import Slide from '@mui/material/Slide'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import RestoreRoundedIcon from '@mui/icons-material/RestoreRounded'
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import QuizRoundedIcon from '@mui/icons-material/QuizRounded'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import apiClient from '../server'
import { useToast } from '../components/ToastProvider'

const ADMIN_PRIMARY = '#384D84'
const ADMIN_PRIMARY_DARK = '#2a3a64'
const ADMIN_PRIMARY_LIGHT = '#4a5f9a'

const ROWS_PER_PAGE_OPTIONS = [5, 10, 20, 30, 40, 50, 100]
const SKELETON_COUNT = 5

const QUESTION_TYPE_LABELS = {
  mcq: 'Multiple Choice (MCQ)',
  shortAnswer: 'Short Answer',
  descriptive: 'Descriptive',
  trueFalse: 'True / False',
  fillInBlanks: 'Fill in the Blanks',
}

const STATUS_OPTIONS = [
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' },
  { value: 'Deleted', label: 'Deleted' },
]

const keyframes = {
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
}

function AdminCoursesQuestionBank() {
  const theme = useTheme()
  const navigate = useNavigate()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const showAsCards = useMediaQuery(theme.breakpoints.down('md'))
  const { showToast } = useToast()

  const [search, setSearch] = useState('')
  const [questionTypeFilter, setQuestionTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('Active')

  const [questions, setQuestions] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalRows, setTotalRows] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [listLoading, setListLoading] = useState(false)
  const [listError, setListError] = useState('')

  const [viewDialog, setViewDialog] = useState({ open: false, row: null })
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null, title: '', isDeleted: false })
  const [deleteLoading, setDeleteLoading] = useState(false)

  const serverPage = page + 1
  const from = totalRows === 0 ? 0 : (serverPage - 1) * rowsPerPage + 1
  const to = Math.min((serverPage - 1) * rowsPerPage + rowsPerPage, totalRows)

  const fetchQuestions = async (opts = {}) => {
    const {
      targetPage = serverPage,
      targetPerPage = rowsPerPage,
      targetSearch = search,
      targetType = questionTypeFilter,
      targetStatus = statusFilter,
    } = opts
    setListLoading(true)
    setListError('')
    const params = new URLSearchParams()
    params.set('page', String(targetPage))
    params.set('per_page', String(targetPerPage))
    params.set('apply_filters', 'true')
    if (targetSearch.trim()) params.set('text', targetSearch.trim())
    if (targetType) params.set('question_type', targetType)
    params.set('status', targetStatus || 'Active')
    try {
      const { ok, data } = await apiClient(`/mock-questions?${params.toString()}`, 'GET')
      if (!ok || !data?.success) {
        const message = data?.errors && typeof data.errors === 'object' ? Object.values(data.errors).flat().join(' ') : data?.message
        setListError(message || 'Unable to load questions.')
        return
      }
      const list = data.data?.questions || []
      const pagination = data.data?.pagination || {}
      setQuestions(list)
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
    fetchQuestions({ targetPage: 1 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSearch = () => {
    setPage(0)
    fetchQuestions({ targetPage: 1, targetSearch: search, targetType: questionTypeFilter, targetStatus: statusFilter })
  }

  const handleReset = () => {
    setSearch('')
    setQuestionTypeFilter('')
    setStatusFilter('Active')
    setPage(0)
    fetchQuestions({ targetPage: 1, targetSearch: '', targetType: '', targetStatus: 'Active' })
  }

  const handleChangePage = (_, newPage) => {
    const pg = newPage - 1
    setPage(pg)
    fetchQuestions({ targetPage: newPage, targetPerPage: rowsPerPage })
  }

  const handleChangeRowsPerPage = (e) => {
    const newPerPage = Number(e.target.value)
    setRowsPerPage(newPerPage)
    setPage(0)
    fetchQuestions({ targetPage: 1, targetPerPage: newPerPage })
  }

  const handleViewOpen = (row) => setViewDialog({ open: true, row })
  const handleViewClose = () => setViewDialog({ open: false, row: null })

  const handleEdit = (row) => {
    navigate('/admin/courses/question-bank/add', { state: { editQuestion: row } })
  }

  const handleDeleteOpen = (row) => {
    setDeleteDialog({ open: true, id: row.id, title: row.question?.slice(0, 60) || 'this question', isDeleted: row.is_deleted })
  }
  const handleDeleteClose = () => {
    if (!deleteLoading) setDeleteDialog({ open: false, id: null, title: '', isDeleted: false })
  }

  const handleDeleteConfirm = async () => {
    const { id, isDeleted } = deleteDialog
    setDeleteLoading(true)
    try {
      const url = isDeleted ? `/mock-questions/${id}/restore` : `/mock-questions/${id}`
      const method = isDeleted ? 'POST' : 'DELETE'
      const { ok, data } = await apiClient(url, method)
      if (!ok || !data?.success) {
        showToast(data?.message || `${isDeleted ? 'Restore' : 'Delete'} failed.`, 'error')
        return
      }
      showToast(isDeleted ? 'Question restored successfully.' : 'Question deleted successfully.', 'success')
      setDeleteDialog({ open: false, id: null, title: '', isDeleted: false })
      fetchQuestions({ targetPage: serverPage })
    } catch {
      showToast('Operation failed. Please try again.', 'error')
    } finally {
      setDeleteLoading(false)
    }
  }

  const getQuestionTypeColor = (type) => {
    const map = {
      mcq: { bg: alpha(ADMIN_PRIMARY, 0.12), color: ADMIN_PRIMARY_DARK },
      shortAnswer: { bg: alpha(theme.palette.info.main, 0.12), color: theme.palette.info.dark },
      descriptive: { bg: alpha(ADMIN_PRIMARY_LIGHT, 0.15), color: ADMIN_PRIMARY },
      trueFalse: { bg: alpha(theme.palette.warning.main, 0.12), color: theme.palette.warning.dark },
      fillInBlanks: { bg: alpha(theme.palette.success.main, 0.12), color: theme.palette.success.dark },
    }
    return map[type] || { bg: theme.palette.grey[200], color: theme.palette.grey[700] }
  }

  return (
    <Box sx={{ ...keyframes, width: '100%', minWidth: 0, maxWidth: 1400, mx: 'auto', overflowX: 'hidden' }}>
      {/* Page title */}
      <Box sx={{ mb: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 0.25 }}>
          <QuizRoundedIcon sx={{ fontSize: { xs: 28, sm: 32 }, color: ADMIN_PRIMARY }} />
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
            Mock Question Bank
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
          Manage questions for mock exams
        </Typography>
      </Box>

      {/* Filters */}
      <Paper elevation={0} sx={{ p: { xs: 1.5, sm: 2 }, mb: 2, borderRadius: '7px', border: '1px solid', borderColor: alpha(ADMIN_PRIMARY, 0.12), bgcolor: theme.palette.background.paper }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
          <TextField
            size="small"
            placeholder="Search question text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon sx={{ color: 'text.secondary', fontSize: 20 }} /></InputAdornment> }}
            sx={{ flex: { xs: '1 1 100%', sm: '1 1 140px', md: '1 1 200px' }, minWidth: { xs: 0, sm: 120 }, maxWidth: { sm: 220, md: 260 }, '& .MuiOutlinedInput-root': { bgcolor: theme.palette.grey[50], borderRadius: '7px', '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: alpha(ADMIN_PRIMARY, 0.3) }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: ADMIN_PRIMARY, borderWidth: 2 } } }}
          />
          <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 100 }, flex: { xs: '1 1 100%', sm: '0 0 auto' }, '& .MuiOutlinedInput-root': { bgcolor: theme.palette.grey[50], borderRadius: '7px' }, '& .MuiInputLabel-root.Mui-focused': { color: ADMIN_PRIMARY } }}>
            <InputLabel id="q-status-label">Status</InputLabel>
            <Select labelId="q-status-label" value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
              {STATUS_OPTIONS.map((opt) => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
            </Select>
          </FormControl>
          <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', sm: 'auto' }, flex: { xs: '1 1 100%', sm: '0 0 auto' } }}>
            <Button variant="contained" size="small" startIcon={<SearchRoundedIcon sx={{ fontSize: 18 }} />} onClick={handleSearch} fullWidth sx={{ bgcolor: ADMIN_PRIMARY, borderRadius: '7px', px: { xs: 2, sm: 1.5 }, py: 1, fontWeight: 600, fontSize: '0.8125rem', flex: { xs: 1, sm: '0 0 auto' }, whiteSpace: 'nowrap', '&:hover': { bgcolor: ADMIN_PRIMARY_DARK } }}>
              Search
            </Button>
            <Button variant="outlined" size="small" startIcon={<RefreshRoundedIcon sx={{ fontSize: 18 }} />} onClick={handleReset} fullWidth sx={{ borderColor: theme.palette.grey[300], color: 'text.primary', borderRadius: '7px', fontWeight: 600, fontSize: '0.8125rem', px: { xs: 2, sm: 1.5 }, py: 1, flex: { xs: 1, sm: '0 0 auto' }, whiteSpace: 'nowrap', '&:hover': { borderColor: ADMIN_PRIMARY, bgcolor: alpha(ADMIN_PRIMARY, 0.04) } }}>
              Reset
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Error */}
      {listError && !listLoading && (
        <Paper elevation={0} sx={{ p: 3, mb: 2, borderRadius: '7px', border: '1px solid', borderColor: alpha(theme.palette.error.main, 0.2), bgcolor: alpha(theme.palette.error.main, 0.04), textAlign: 'center' }}>
          <Typography variant="body2" color="error">{listError}</Typography>
          <Button size="small" onClick={() => fetchQuestions({ targetPage: serverPage })} sx={{ mt: 1, color: ADMIN_PRIMARY }}>Retry</Button>
        </Paper>
      )}

      {/* Table section */}
      <Paper elevation={0} sx={{ borderRadius: '7px', border: '1px solid', borderColor: alpha(ADMIN_PRIMARY, 0.12), overflow: 'hidden', bgcolor: theme.palette.background.paper }}>
        <Box sx={{ px: { xs: 1.5, sm: 2 }, py: 1.5, borderBottom: '1px solid', borderColor: theme.palette.grey[200], display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
            Mock question list
          </Typography>
          <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => navigate('/admin/courses/question-bank/add')} sx={{ bgcolor: ADMIN_PRIMARY, borderRadius: '7px', fontWeight: 600, '&:hover': { bgcolor: ADMIN_PRIMARY_DARK } }}>
            Add Question
          </Button>
        </Box>

        {/* Desktop: table */}
        {!showAsCards && (
          <TableContainer>
            <Table size="medium" stickyHeader>
              <TableHead>
                <TableRow sx={{ bgcolor: alpha(ADMIN_PRIMARY, 0.06), '& .MuiTableCell-head': { fontWeight: 700, color: 'text.primary', borderColor: theme.palette.grey[200], py: 1.5, fontSize: '0.8125rem' } }}>
                  <TableCell>Mock</TableCell>
                  <TableCell>Exam</TableCell>
                  <TableCell>Question type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {listLoading
                  ? Array.from({ length: SKELETON_COUNT }).map((_, idx) => (
                      <TableRow key={`sk-${idx}`} sx={{ '& .MuiTableCell-body': { borderColor: theme.palette.grey[200], py: 1.5 } }}>
                        <TableCell><Skeleton variant="text" width={160} sx={{ fontSize: '0.875rem' }} /></TableCell>
                        <TableCell><Skeleton variant="rounded" width={48} height={24} sx={{ borderRadius: '7px' }} /></TableCell>
                        <TableCell><Skeleton variant="rounded" width={130} height={24} sx={{ borderRadius: '7px' }} /></TableCell>
                        <TableCell><Skeleton variant="rounded" width={60} height={24} sx={{ borderRadius: '7px' }} /></TableCell>
                        <TableCell align="right"><Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}><Skeleton variant="circular" width={32} height={32} /><Skeleton variant="circular" width={32} height={32} /><Skeleton variant="circular" width={32} height={32} /></Box></TableCell>
                      </TableRow>
                    ))
                  : questions.length === 0 && !listError
                    ? (
                        <TableRow>
                          <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                            <QuizRoundedIcon sx={{ fontSize: 40, color: alpha(ADMIN_PRIMARY, 0.3), display: 'block', mx: 'auto', mb: 1 }} />
                            No questions found.
                          </TableCell>
                        </TableRow>
                      )
                    : questions.map((row) => {
                        const typeStyle = getQuestionTypeColor(row.question_type)
                        const isDeleted = row.is_deleted
                        return (
                          <TableRow key={row.id} hover sx={{ '&:hover': { bgcolor: alpha(ADMIN_PRIMARY, 0.04) }, '& .MuiTableCell-body': { borderColor: theme.palette.grey[200], py: 1.5, fontSize: '0.875rem' }, opacity: isDeleted ? 0.6 : 1 }}>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }} noWrap>{row.mock_title || '—'}</Typography>
                            </TableCell>
                            <TableCell>
                              <Chip label={row.exam_no ? `Exam ${row.exam_no}` : '—'} size="small" sx={{ height: 24, fontSize: '0.75rem', fontWeight: 600, bgcolor: alpha(ADMIN_PRIMARY, 0.12), color: ADMIN_PRIMARY_DARK, borderRadius: '7px', border: 'none' }} />
                            </TableCell>
                            <TableCell>
                              <Chip label={QUESTION_TYPE_LABELS[row.question_type] || row.question_type} size="small" sx={{ height: 24, fontSize: '0.75rem', fontWeight: 600, bgcolor: typeStyle.bg, color: typeStyle.color, borderRadius: '7px', border: 'none' }} />
                            </TableCell>
                            <TableCell>
                              <Chip label={isDeleted ? 'Deleted' : row.status} size="small" sx={{ height: 24, fontSize: '0.75rem', fontWeight: 600, bgcolor: isDeleted ? alpha(theme.palette.error.main, 0.12) : row.status === 'Active' ? alpha(theme.palette.success.main, 0.12) : theme.palette.grey[200], color: isDeleted ? theme.palette.error.dark : row.status === 'Active' ? theme.palette.success.dark : theme.palette.grey[600], borderRadius: '7px', border: 'none' }} />
                            </TableCell>
                            <TableCell align="right">
                              <Tooltip title="View" placement="top" arrow>
                                <IconButton size="small" onClick={() => handleViewOpen(row)} sx={{ color: theme.palette.info.main, '&:hover': { color: theme.palette.info.dark, bgcolor: alpha(theme.palette.info.main, 0.12) } }}><VisibilityRoundedIcon fontSize="small" /></IconButton>
                              </Tooltip>
                              {!isDeleted && (
                                <Tooltip title="Edit" placement="top" arrow>
                                  <IconButton size="small" onClick={() => handleEdit(row)} sx={{ color: theme.palette.grey[600], ml: 0.5, '&:hover': { color: ADMIN_PRIMARY, bgcolor: alpha(ADMIN_PRIMARY, 0.08) } }}><EditRoundedIcon fontSize="small" /></IconButton>
                                </Tooltip>
                              )}
                              <Tooltip title={isDeleted ? 'Restore' : 'Delete'} placement="top" arrow>
                                <IconButton size="small" onClick={() => handleDeleteOpen(row)} sx={{ ml: 0.5, color: isDeleted ? theme.palette.success.main : theme.palette.error.main, '&:hover': { color: isDeleted ? theme.palette.success.dark : theme.palette.error.dark, bgcolor: isDeleted ? alpha(theme.palette.success.main, 0.12) : alpha(theme.palette.error.main, 0.12) } }}>
                                  {isDeleted ? <RestoreRoundedIcon fontSize="small" /> : <DeleteRoundedIcon fontSize="small" />}
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        )
                      })}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Mobile/Tablet: card list */}
        {showAsCards && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 1.5 }, p: { xs: 2, sm: 2 }, pb: 2, overflowX: 'hidden' }}>
            {listLoading
              ? Array.from({ length: SKELETON_COUNT }).map((_, idx) => (
                  <Paper key={`sk-${idx}`} elevation={0} sx={{ p: { xs: 2.5, sm: 2 }, borderRadius: '7px', border: '1px solid', borderColor: alpha(ADMIN_PRIMARY, 0.12), bgcolor: theme.palette.background.paper }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1.5, mb: 2, pb: 2, borderBottom: '1px solid', borderColor: theme.palette.divider }}>
                      <Skeleton variant="text" width="70%" sx={{ fontSize: '1rem' }} />
                      <Box sx={{ display: 'flex', gap: 0.5 }}><Skeleton variant="circular" width={36} height={36} /><Skeleton variant="circular" width={36} height={36} /></Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}><Skeleton variant="rounded" width={80} height={28} sx={{ borderRadius: '7px' }} /><Skeleton variant="rounded" width={130} height={28} sx={{ borderRadius: '7px' }} /></Box>
                  </Paper>
                ))
              : questions.length === 0 && !listError
                ? (
                    <Paper elevation={0} sx={{ p: 4, borderRadius: '7px', border: '1px dashed', borderColor: alpha(ADMIN_PRIMARY, 0.3), bgcolor: alpha(ADMIN_PRIMARY, 0.02), textAlign: 'center' }}>
                      <QuizRoundedIcon sx={{ fontSize: 40, color: alpha(ADMIN_PRIMARY, 0.4), mb: 1 }} />
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary' }}>No questions found.</Typography>
                    </Paper>
                  )
                : questions.map((row) => {
                    const typeStyle = getQuestionTypeColor(row.question_type)
                    const isDeleted = row.is_deleted
                    return (
                      <Paper key={row.id} elevation={0} sx={{ p: { xs: 2.5, sm: 2 }, borderRadius: '7px', border: '1px solid', borderColor: { xs: alpha(ADMIN_PRIMARY, 0.2), sm: theme.palette.grey[200] }, bgcolor: theme.palette.background.paper, opacity: isDeleted ? 0.7 : 1, transition: 'all 0.2s ease', '&:hover': { borderColor: alpha(ADMIN_PRIMARY, 0.35), boxShadow: `0 4px 20px ${alpha(ADMIN_PRIMARY, 0.1)}` } }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1.5, mb: 2, pb: 2, borderBottom: '1px solid', borderColor: theme.palette.divider }}>
                          <Typography variant="subtitle1" noWrap sx={{ fontWeight: 700, color: 'text.primary', lineHeight: 1.3, fontSize: { xs: '1rem', sm: '0.875rem' }, overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0, flex: 1 }}>
                            {row.mock_title || '—'}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0, gap: 0.25 }}>
                            <Tooltip title="View" placement="top" arrow>
                              <IconButton size={isMobile ? 'medium' : 'small'} onClick={() => handleViewOpen(row)} sx={{ color: theme.palette.info.main, '&:hover': { bgcolor: alpha(theme.palette.info.main, 0.12) } }}><VisibilityRoundedIcon fontSize="small" /></IconButton>
                            </Tooltip>
                            {!isDeleted && (
                              <Tooltip title="Edit" placement="top" arrow>
                                <IconButton size={isMobile ? 'medium' : 'small'} onClick={() => handleEdit(row)} sx={{ color: theme.palette.grey[600], '&:hover': { color: ADMIN_PRIMARY, bgcolor: alpha(ADMIN_PRIMARY, 0.08) } }}><EditRoundedIcon fontSize="small" /></IconButton>
                              </Tooltip>
                            )}
                            <Tooltip title={isDeleted ? 'Restore' : 'Delete'} placement="top" arrow>
                              <IconButton size={isMobile ? 'medium' : 'small'} onClick={() => handleDeleteOpen(row)} sx={{ color: isDeleted ? theme.palette.success.main : theme.palette.error.main, '&:hover': { bgcolor: isDeleted ? alpha(theme.palette.success.main, 0.12) : alpha(theme.palette.error.main, 0.12) } }}>
                                {isDeleted ? <RestoreRoundedIcon fontSize="small" /> : <DeleteRoundedIcon fontSize="small" />}
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1 }}>
                          <Chip label={row.exam_no ? `Exam ${row.exam_no}` : '—'} size="small" sx={{ height: 26, fontSize: '0.75rem', fontWeight: 600, bgcolor: alpha(ADMIN_PRIMARY, 0.12), color: ADMIN_PRIMARY_DARK, borderRadius: '7px', border: 'none' }} />
                          <Chip label={QUESTION_TYPE_LABELS[row.question_type] || row.question_type} size="small" sx={{ height: 26, fontSize: '0.75rem', fontWeight: 600, bgcolor: typeStyle.bg, color: typeStyle.color, borderRadius: '7px', border: 'none' }} />
                          <Chip label={isDeleted ? 'Deleted' : row.status} size="small" sx={{ height: 26, fontSize: '0.75rem', fontWeight: 600, bgcolor: isDeleted ? alpha(theme.palette.error.main, 0.12) : row.status === 'Active' ? alpha(theme.palette.success.main, 0.12) : theme.palette.grey[200], color: isDeleted ? theme.palette.error.dark : row.status === 'Active' ? theme.palette.success.dark : theme.palette.grey[600], borderRadius: '7px', border: 'none' }} />
                        </Box>
                      </Paper>
                    )
                  })}
          </Box>
        )}

        {/* Pagination */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: { xs: 1.5, sm: 2 }, px: { xs: 1.5, sm: 2 }, py: { xs: 1.75, sm: 2 }, borderTop: '1px solid', borderColor: theme.palette.grey[200], bgcolor: alpha(ADMIN_PRIMARY, 0.02) }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: { xs: 'center', sm: 'flex-start' }, gap: { xs: 1, sm: 1.5 }, width: { xs: '100%', sm: 'auto' } }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: { xs: '0.8125rem', sm: '0.875rem' }, flexShrink: 0 }}>Rows per page</Typography>
            <FormControl size="small" variant="outlined" sx={{ minWidth: 72, flexShrink: 0 }}>
              <Select value={rowsPerPage} onChange={handleChangeRowsPerPage} sx={{ height: 36, fontSize: '0.8125rem', fontWeight: 600, borderRadius: '7px', bgcolor: theme.palette.background.paper, '& .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.grey[300] }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: ADMIN_PRIMARY }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: ADMIN_PRIMARY, borderWidth: 2 } }}>
                {ROWS_PER_PAGE_OPTIONS.map((opt) => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
              </Select>
            </FormControl>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: { xs: '0.8125rem', sm: '0.875rem' }, flexShrink: 0 }}>{totalRows === 0 ? '0–0 of 0' : `${from}–${to} of ${totalRows}`}</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', alignItems: 'center', justifyContent: { xs: 'center', sm: 'flex-end' }, gap: { xs: 1, sm: 1.5 }, width: { xs: '100%', sm: 'auto' } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
              <ViewListRoundedIcon sx={{ color: ADMIN_PRIMARY, fontSize: { xs: 18, sm: 22 } }} />
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem' }}>Page {page + 1} of {totalPages}</Typography>
            </Box>
            <Pagination count={totalPages} page={page + 1} onChange={handleChangePage} size="small" showFirstButton showLastButton sx={{ '& .MuiPaginationItem-root': { fontWeight: 600, fontSize: '0.8125rem', borderRadius: '7px', minWidth: 32, height: 32, color: ADMIN_PRIMARY }, '& .MuiPaginationItem-page.Mui-selected': { background: `linear-gradient(135deg, ${ADMIN_PRIMARY}, ${ADMIN_PRIMARY_DARK})`, color: '#fff', boxShadow: `0 2px 6px ${alpha(ADMIN_PRIMARY, 0.35)}`, '&:hover': { background: `linear-gradient(135deg, ${ADMIN_PRIMARY_LIGHT}, ${ADMIN_PRIMARY})` } }, '& .MuiPaginationItem-page:not(.Mui-selected):hover': { backgroundColor: alpha(ADMIN_PRIMARY, 0.1), color: ADMIN_PRIMARY }, '& .MuiPaginationItem-icon': { color: ADMIN_PRIMARY, fontSize: 20 } }} />
          </Box>
        </Box>
      </Paper>

      {/* View dialog */}
      <Dialog open={viewDialog.open} onClose={handleViewClose} maxWidth="sm" fullWidth TransitionComponent={Slide} TransitionProps={{ direction: 'up' }}
        sx={{ ...(isMobile && { '& .MuiDialog-container': { alignItems: 'flex-end', justifyContent: 'center' } }) }}
        PaperProps={{ sx: { margin: isMobile ? 0 : 24, maxHeight: isMobile ? '90vh' : 'calc(100vh - 48px)', ...(isMobile && { height: '90vh' }), width: isMobile ? '100%' : undefined, maxWidth: isMobile ? '100%' : undefined, borderRadius: isMobile ? '24px 24px 0 0' : '7px', border: '1px solid', borderColor: alpha(ADMIN_PRIMARY, 0.25), borderBottom: isMobile ? 'none' : undefined, boxShadow: isMobile ? `0 -8px 32px rgba(15,23,42,0.2)` : `0 12px 40px ${alpha(ADMIN_PRIMARY, 0.15)}`, bgcolor: theme.palette.background.paper, overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column', '&::before': isMobile ? { content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: 5, background: `linear-gradient(90deg, ${ADMIN_PRIMARY} 0%, ${ADMIN_PRIMARY_LIGHT} 100%)` } : undefined } }}
        slotProps={{ backdrop: { sx: { bgcolor: alpha(theme.palette.common.black, 0.65), backdropFilter: 'blur(6px)' } } }}
      >
        {isMobile && (
          <Box sx={{ pt: 1.5, pb: 0.5, display: 'flex', justifyContent: 'center', flexShrink: 0, bgcolor: alpha(ADMIN_PRIMARY, 0.02), borderBottom: '1px solid', borderColor: alpha(ADMIN_PRIMARY, 0.1) }}>
            <Box sx={{ width: 40, height: 4, borderRadius: 2, bgcolor: theme.palette.grey[400] }} />
          </Box>
        )}
        <DialogTitle sx={{ flexShrink: 0, fontWeight: 700, color: 'text.primary', borderBottom: '1px solid', borderColor: theme.palette.divider, py: 2, px: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
            <Box sx={{ width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, bgcolor: alpha(ADMIN_PRIMARY, 0.12), color: ADMIN_PRIMARY }}>
              <QuizRoundedIcon sx={{ fontSize: 24 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>View Question</Typography>
          </Box>
          <IconButton size="small" onClick={handleViewClose} sx={{ color: theme.palette.grey[600], flexShrink: 0, '&:hover': { color: ADMIN_PRIMARY, bgcolor: alpha(ADMIN_PRIMARY, 0.08) } }}><CloseRoundedIcon /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden', px: 3, pt: 0, pb: 3, display: 'flex', flexDirection: 'column', gap: 3, borderTop: '1px solid', borderColor: alpha(theme.palette.divider, 0.8), WebkitOverflowScrolling: 'touch' }}>
          {viewDialog.row && (
            <Box sx={{ pt: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Mock / Exam info */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                {viewDialog.row.mock_title && (
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', mb: 0.5 }}>Mock</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>{viewDialog.row.mock_title}</Typography>
                  </Box>
                )}
                {viewDialog.row.exam_no != null && (
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', mb: 0.5 }}>Exam</Typography>
                    <Chip label={`Exam ${viewDialog.row.exam_no}`} size="small" sx={{ height: 24, fontSize: '0.75rem', fontWeight: 600, bgcolor: alpha(ADMIN_PRIMARY, 0.12), color: ADMIN_PRIMARY_DARK, borderRadius: '7px', border: 'none' }} />
                  </Box>
                )}
              </Box>

              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', mb: 0.5 }}>Question</Typography>
                <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 500, whiteSpace: 'pre-wrap' }}>{viewDialog.row.question}</Typography>
              </Box>

              {viewDialog.row.question_type === 'mcq' && viewDialog.row.options?.length > 0 && (
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', mb: 1 }}>Options</Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(12, 1fr)' }, gap: 1.5 }}>
                    {viewDialog.row.options.map((opt, optIndex) => {
                      const isLastOption = optIndex === viewDialog.row.options.length - 1
                      return (
                        <Box key={opt.option_letter} sx={{ gridColumn: { xs: 'span 1', sm: isLastOption ? 'span 12' : 'span 6' }, display: 'flex', alignItems: 'flex-start', gap: 1.5, p: { xs: 1.5, sm: 2 }, borderRadius: '7px', border: '2px solid', borderColor: opt.is_correct ? ADMIN_PRIMARY : 'divider', bgcolor: opt.is_correct ? alpha(ADMIN_PRIMARY, 0.08) : 'transparent', transition: 'all 0.2s ease' }}>
                          <Box sx={{ width: 32, height: 32, borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 700, fontSize: '0.875rem', bgcolor: opt.is_correct ? ADMIN_PRIMARY : 'action.hover', color: opt.is_correct ? '#fff' : 'text.secondary' }}>
                            {opt.option_letter}
                          </Box>
                          <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: opt.is_correct ? 600 : 500, lineHeight: 1.5, pt: 0.5, fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}>
                            {opt.option_text}
                          </Typography>
                          {opt.is_correct && <CheckCircleIcon sx={{ color: ADMIN_PRIMARY, fontSize: 22, ml: 'auto', flexShrink: 0, mt: 0.25 }} />}
                        </Box>
                      )
                    })}
                  </Box>
                </Box>
              )}

              {viewDialog.row.answer && (
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', mb: 0.5 }}>Answer</Typography>
                  <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 600, whiteSpace: 'pre-wrap' }}>{viewDialog.row.answer}</Typography>
                </Box>
              )}

              {viewDialog.row.answer_description && (
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', mb: 0.5 }}>Answer Description</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'pre-wrap' }}>{viewDialog.row.answer_description}</Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ flexShrink: 0, px: 3, py: 2.5, pt: 2, pb: { xs: 'max(20px, env(safe-area-inset-bottom))', sm: 2.5 }, borderTop: '1px solid', borderColor: theme.palette.divider, gap: 1 }}>
          <Button variant="contained" onClick={handleViewClose} sx={{ bgcolor: ADMIN_PRIMARY, borderRadius: '7px', fontWeight: 600, px: 2.5, '&:hover': { bgcolor: ADMIN_PRIMARY_DARK } }}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete/Restore dialog */}
      <Dialog open={deleteDialog.open} onClose={handleDeleteClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '7px', border: '1px solid', borderColor: alpha(deleteDialog.isDeleted ? theme.palette.success.main : theme.palette.error.main, 0.2) } }}>
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>{deleteDialog.isDeleted ? 'Restore Question' : 'Delete Question'}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {deleteDialog.isDeleted
              ? `Restore "${deleteDialog.title}..."?`
              : `Are you sure you want to delete "${deleteDialog.title}..."? This can be restored later.`}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button variant="outlined" onClick={handleDeleteClose} disabled={deleteLoading} sx={{ borderRadius: '7px', fontWeight: 600, borderColor: theme.palette.grey[300], color: 'text.primary', '&:hover': { borderColor: ADMIN_PRIMARY }, '&.Mui-disabled': { opacity: 1, borderColor: theme.palette.grey[300], color: 'text.primary' } }}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleDeleteConfirm}
            disabled={deleteLoading}
            startIcon={deleteLoading ? <AutorenewIcon sx={{ animation: 'spin 0.8s linear infinite', color: '#fff', fontSize: 20 }} /> : deleteDialog.isDeleted ? <RestoreRoundedIcon /> : <DeleteRoundedIcon />}
            sx={{ borderRadius: '7px', fontWeight: 600, color: '#fff', bgcolor: deleteDialog.isDeleted ? theme.palette.success.main : theme.palette.error.main, '&:hover': { bgcolor: deleteDialog.isDeleted ? theme.palette.success.dark : theme.palette.error.dark, color: '#fff' }, '&.Mui-disabled': { opacity: 1, color: '#fff', bgcolor: deleteDialog.isDeleted ? theme.palette.success.main : theme.palette.error.main } }}
          >
            {deleteLoading ? (deleteDialog.isDeleted ? 'Restoring...' : 'Deleting...') : (deleteDialog.isDeleted ? 'Restore' : 'Delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AdminCoursesQuestionBank
