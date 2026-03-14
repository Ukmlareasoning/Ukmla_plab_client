import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { alpha } from '@mui/material/styles'
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Paper,
  Button,
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slide,
  Switch,
  FormControlLabel,
  Skeleton,
} from '@mui/material'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import PlayLessonRoundedIcon from '@mui/icons-material/PlayLessonRounded'
import LockRoundedIcon from '@mui/icons-material/LockRounded'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
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

function AdminScenariosLectures() {
  const theme = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const showAsCards = useMediaQuery(theme.breakpoints.down('md'))
  const { showToast } = useToast()

  const scenarioId = location.state?.scenarioId || null
  const courseTitleFromState = location.state?.courseTitle || null
  const initialReleaseMode = location.state?.examsReleaseMode || 'all_at_once'

  const [examNoFilter, setExamNoFilter] = useState('')
  const [exams, setExams] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalRows, setTotalRows] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  const [listLoading, setListLoading] = useState(false)
  const [listError, setListError] = useState('')

  const [blockUnblockDialogOpen, setBlockUnblockDialogOpen] = useState(false)
  const [examsBlocked, setExamsBlocked] = useState(initialReleaseMode === 'one_after_another')
  const [saveReleaseModeLoading, setSaveReleaseModeLoading] = useState(false)

  const serverPage = page + 1
  const from = totalRows === 0 ? 0 : (serverPage - 1) * rowsPerPage + 1
  const to = Math.min((serverPage - 1) * rowsPerPage + rowsPerPage, totalRows)

  const fetchExams = async (opts = {}) => {
    if (!scenarioId) return
    const { applyFilters = false, targetPage = serverPage, targetPerPage = rowsPerPage } = opts
    setListLoading(true)
    setListError('')
    const params = new URLSearchParams()
    params.set('scenario_id', String(scenarioId))
    params.set('page', String(targetPage))
    params.set('per_page', String(targetPerPage))
    if (applyFilters && examNoFilter) {
      params.set('apply_filters', '1')
      params.set('exam_no', examNoFilter)
    }
    try {
      const { ok, data } = await apiClient(`/scenario-exams?${params.toString()}`, 'GET')
      if (!ok || !data?.success) {
        const message = data?.errors && typeof data.errors === 'object' ? Object.values(data.errors).flat().join(' ') : data?.message
        setListError(message || 'Unable to load scenario exams.')
        return
      }
      const list = data.data?.scenario_exams || []
      const pagination = data.data?.pagination || {}
      setExams(list)
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
    if (!scenarioId) {
      setListError('No scenario selected. Please go back and select a scenario.')
      return
    }
    fetchExams({ applyFilters: false, targetPage: 1, targetPerPage: rowsPerPage })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSearch = () => {
    setPage(0)
    fetchExams({ applyFilters: true, targetPage: 1 })
  }
  const handleReset = () => {
    setExamNoFilter('')
    setPage(0)
    fetchExams({ applyFilters: false, targetPage: 1 })
  }
  const handleChangePage = (_, value) => {
    const newPage = value - 1
    setPage(newPage)
    fetchExams({ applyFilters: !!examNoFilter, targetPage: value, targetPerPage: rowsPerPage })
  }
  const handleChangeRowsPerPage = (e) => {
    const newPerPage = Number(e.target.value)
    setRowsPerPage(newPerPage)
    setPage(0)
    fetchExams({ applyFilters: !!examNoFilter, targetPage: 1, targetPerPage: newPerPage })
  }

  const handleSaveReleaseMode = async () => {
    if (!scenarioId || saveReleaseModeLoading) return
    setSaveReleaseModeLoading(true)
    try {
      const { ok, data } = await apiClient('/scenario-exams/release-mode', 'POST', {
        scenario_id: scenarioId,
        exams_release_mode: examsBlocked ? 'one_after_another' : 'all_at_once',
      })
      if (!ok || !data?.success) {
        showToast(data?.message || 'Unable to update release mode.', 'error')
        return
      }
      showToast('Release mode updated successfully.', 'success')
      setBlockUnblockDialogOpen(false)
    } catch {
      showToast('Unable to reach server. Please try again.', 'error')
    } finally {
      setSaveReleaseModeLoading(false)
    }
  }

  const handleBackToScenarios = () => navigate('/admin/scenarios/scenarios')

  const handleViewQuestions = (row) => {
    navigate('/admin/scenarios/lectures/questions', {
      state: { courseTitle: courseTitleFromState, lectureId: row.id, lectureNo: row.exam_no, scenarioId },
    })
  }
  const handleViewRatings = (row) => {
    navigate('/admin/scenarios/lectures/ratings', {
      state: { courseTitle: courseTitleFromState, lectureId: row.id, lectureNo: row.exam_no },
    })
  }

  return (
    <Box sx={{ ...keyframes, width: '100%', minWidth: 0, maxWidth: 1400, mx: 'auto', overflowX: 'hidden' }}>
      {/* Page title */}
      <Box sx={{ mb: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Button size="small" startIcon={<ArrowBackRoundedIcon />} onClick={handleBackToScenarios} sx={{ color: 'text.secondary', fontWeight: 600, '&:hover': { color: ADMIN_PRIMARY, bgcolor: alpha(ADMIN_PRIMARY, 0.08) } }}>
            Back
          </Button>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 0.25 }}>
          <PlayLessonRoundedIcon sx={{ fontSize: { xs: 28, sm: 32 }, color: ADMIN_PRIMARY }} />
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
            Scenario exams
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
          {courseTitleFromState || 'Manage scenario exams'}
        </Typography>
      </Box>

      {/* Filters */}
      <Paper elevation={0} sx={{ p: { xs: 1.5, sm: 2 }, mb: 2, borderRadius: '7px', border: '1px solid', borderColor: alpha(ADMIN_PRIMARY, 0.12), bgcolor: theme.palette.background.paper }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
          <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 100 }, flex: { xs: '1 1 100%', sm: '0 0 auto' }, flexShrink: 0, '& .MuiOutlinedInput-root': { bgcolor: theme.palette.grey[50], borderRadius: '7px', '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: alpha(ADMIN_PRIMARY, 0.3) }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: ADMIN_PRIMARY, borderWidth: 2 } }, '& .MuiInputLabel-root.Mui-focused': { color: ADMIN_PRIMARY } }}>
            <InputLabel id="exam-no-label">Exam No</InputLabel>
            <Select labelId="exam-no-label" value={examNoFilter} label="Exam No" onChange={(e) => setExamNoFilter(e.target.value)}>
              <MenuItem value="">All</MenuItem>
              {Array.from({ length: 30 }, (_, i) => i + 1).map((n) => <MenuItem key={n} value={String(n)}>{n}</MenuItem>)}
            </Select>
          </FormControl>
          <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', sm: 'auto' }, flex: { xs: '1 1 100%', sm: '0 0 auto' }, flexShrink: 0 }}>
            <Button variant="contained" size="small" startIcon={<SearchRoundedIcon sx={{ fontSize: 18 }} />} onClick={handleSearch} fullWidth sx={{ bgcolor: ADMIN_PRIMARY, borderRadius: '7px', px: { xs: 2, sm: 1.5 }, py: 1, fontWeight: 600, fontSize: '0.8125rem', flex: { xs: 1, sm: '0 0 auto' }, whiteSpace: 'nowrap', '&:hover': { bgcolor: ADMIN_PRIMARY_DARK } }}>
              Search
            </Button>
            <Button variant="outlined" size="small" startIcon={<RefreshRoundedIcon sx={{ fontSize: 18 }} />} onClick={handleReset} fullWidth sx={{ borderColor: theme.palette.grey[300], color: 'text.primary', borderRadius: '7px', fontWeight: 600, fontSize: '0.8125rem', px: { xs: 2, sm: 1.5 }, py: 1, flex: { xs: 1, sm: '0 0 auto' }, whiteSpace: 'nowrap', '&:hover': { borderColor: ADMIN_PRIMARY, bgcolor: alpha(ADMIN_PRIMARY, 0.04) } }}>
              Reset
            </Button>
          </Box>
          {courseTitleFromState && (
            <Typography variant="body2" sx={{ display: 'block', ml: 'auto', fontWeight: 600, color: 'text.primary', fontSize: { xs: '0.8125rem', sm: '0.875rem' }, textAlign: { xs: 'left', sm: 'right' }, maxWidth: { xs: '100%', sm: 200, md: 280 }, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {courseTitleFromState}
            </Typography>
          )}
        </Box>
      </Paper>

      {/* Error state */}
      {listError && !listLoading && (
        <Paper elevation={0} sx={{ p: 3, mb: 2, borderRadius: '7px', border: '1px solid', borderColor: alpha(theme.palette.error.main, 0.2), bgcolor: alpha(theme.palette.error.main, 0.04) }}>
          <Typography variant="body2" color="error" sx={{ textAlign: 'center' }}>{listError}</Typography>
          {scenarioId && (
            <Box sx={{ textAlign: 'center', mt: 1 }}>
              <Button size="small" onClick={() => fetchExams({ applyFilters: !!examNoFilter, targetPage: serverPage })} sx={{ color: ADMIN_PRIMARY }}>Retry</Button>
            </Box>
          )}
        </Paper>
      )}

      {/* Table section */}
      <Paper elevation={0} sx={{ borderRadius: '7px', border: '1px solid', borderColor: alpha(ADMIN_PRIMARY, 0.12), overflow: 'hidden', overflowX: { xs: 'hidden', md: 'visible' }, bgcolor: theme.palette.background.paper }}>
        <Box sx={{ px: { xs: 1.5, sm: 2 }, py: 1.5, borderBottom: '1px solid', borderColor: theme.palette.grey[200], display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'nowrap', gap: 1, minWidth: 0 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary', minWidth: 0, flex: '1 1 auto', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            Scenario exam list
          </Typography>
          <Button variant="contained" startIcon={<LockRoundedIcon />} onClick={() => setBlockUnblockDialogOpen(true)} sx={{ bgcolor: ADMIN_PRIMARY, borderRadius: '7px', fontWeight: 600, flexShrink: 0, whiteSpace: 'nowrap', '&:hover': { bgcolor: ADMIN_PRIMARY_DARK } }}>
            {isMobile ? 'Allow' : 'Allow Block/Unblock'}
          </Button>
        </Box>

        {/* Desktop table */}
        {!showAsCards && (
          <TableContainer>
            <Table size="medium" stickyHeader>
              <TableHead>
                <TableRow sx={{ bgcolor: alpha(ADMIN_PRIMARY, 0.06), '& .MuiTableCell-head': { fontWeight: 700, color: 'text.primary', borderColor: theme.palette.grey[200], py: 1.5, fontSize: '0.8125rem' } }}>
                  <TableCell>Exam No</TableCell>
                  <TableCell>Total Questions</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {listLoading
                  ? Array.from({ length: SKELETON_ROW_COUNT }).map((_, idx) => (
                      <TableRow key={`sk-${idx}`} sx={{ '& .MuiTableCell-body': { borderColor: theme.palette.grey[200], py: 1.5 } }}>
                        <TableCell><Skeleton variant="rounded" width={40} height={24} sx={{ borderRadius: '7px' }} /></TableCell>
                        <TableCell><Skeleton variant="rounded" width={40} height={24} sx={{ borderRadius: '7px' }} /></TableCell>
                        <TableCell align="right"><Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}><Skeleton variant="circular" width={32} height={32} /><Skeleton variant="circular" width={32} height={32} /></Box></TableCell>
                      </TableRow>
                    ))
                  : exams.length === 0 && !listError ? (
                      <TableRow>
                        <TableCell colSpan={3} align="center" sx={{ py: 6 }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                            <ViewListRoundedIcon sx={{ fontSize: 40, color: alpha(ADMIN_PRIMARY, 0.4) }} />
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary' }}>No exams found.</Typography>
                            <Typography variant="body2" sx={{ color: 'text.disabled', maxWidth: 280 }}>Exams are created automatically when you add a scenario.</Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )
                  : exams.map((row) => (
                      <TableRow key={row.id} hover sx={{ '&:hover': { bgcolor: alpha(ADMIN_PRIMARY, 0.04) }, '& .MuiTableCell-body': { borderColor: theme.palette.grey[200], py: 1.5, fontSize: '0.875rem' } }}>
                        <TableCell><Chip label={row.exam_no} size="small" sx={{ height: 24, fontSize: '0.75rem', fontWeight: 600, bgcolor: alpha(ADMIN_PRIMARY, 0.12), color: ADMIN_PRIMARY_DARK, borderRadius: '7px', border: 'none' }} /></TableCell>
                        <TableCell><Chip label={row.total_questions ?? 0} size="small" sx={{ height: 24, fontSize: '0.75rem', fontWeight: 600, bgcolor: alpha(ADMIN_PRIMARY, 0.12), color: ADMIN_PRIMARY_DARK, borderRadius: '7px', border: 'none' }} /></TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                            <Tooltip title="View questions" placement="top" arrow>
                              <IconButton size="small" onClick={() => handleViewQuestions(row)} sx={{ color: theme.palette.info.main, '&:hover': { color: theme.palette.info.dark, bgcolor: alpha(theme.palette.info.main, 0.12) } }}>
                                <VisibilityRoundedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="View ratings" placement="top" arrow>
                              <IconButton size="small" onClick={() => handleViewRatings(row)} sx={{ color: theme.palette.warning.main, '&:hover': { color: theme.palette.warning.dark, bgcolor: alpha(theme.palette.warning.main, 0.12) } }}>
                                <StarRoundedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Mobile/Tablet cards */}
        {showAsCards && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 1.5 }, p: { xs: 2, sm: 2 }, pb: 2, overflowX: 'hidden' }}>
            {listLoading
              ? Array.from({ length: SKELETON_ROW_COUNT }).map((_, idx) => (
                  <Paper key={`sk-card-${idx}`} elevation={0} sx={{ p: { xs: 2.5, sm: 2 }, borderRadius: '7px', border: '1px solid', borderColor: theme.palette.grey[200], bgcolor: theme.palette.background.paper }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1.5 }}>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        <Skeleton variant="rounded" width={80} height={26} sx={{ borderRadius: '7px' }} />
                        <Skeleton variant="rounded" width={110} height={26} sx={{ borderRadius: '7px' }} />
                      </Box>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Skeleton variant="circular" width={isMobile ? 40 : 36} height={isMobile ? 40 : 36} />
                        <Skeleton variant="circular" width={isMobile ? 40 : 36} height={isMobile ? 40 : 36} />
                      </Box>
                    </Box>
                  </Paper>
                ))
              : exams.length === 0 && !listError ? (
                  <Paper elevation={0} sx={{ p: 3, borderRadius: '7px', border: '1px dashed', borderColor: alpha(ADMIN_PRIMARY, 0.3), bgcolor: alpha(ADMIN_PRIMARY, 0.02), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 1 }}>
                      <ViewListRoundedIcon sx={{ fontSize: 36, color: alpha(ADMIN_PRIMARY, 0.5) }} />
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary' }}>No exams found.</Typography>
                    </Box>
                  </Paper>
                )
              : exams.map((row) => (
                  <Paper key={row.id} elevation={0} sx={{ p: { xs: 2.5, sm: 2 }, borderRadius: '7px', border: '1px solid', borderColor: { xs: alpha(ADMIN_PRIMARY, 0.2), sm: theme.palette.grey[200] }, bgcolor: theme.palette.background.paper, transition: 'all 0.2s ease', '&:hover': { borderColor: alpha(ADMIN_PRIMARY, 0.35), boxShadow: `0 4px 20px ${alpha(ADMIN_PRIMARY, 0.1)}` }, ...(isMobile && { boxShadow: `0 2px 12px ${alpha(ADMIN_PRIMARY, 0.06)}` }) }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1.5, mb: 2, pb: 2, borderBottom: '1px solid', borderColor: theme.palette.divider }}>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: { xs: 1.5, sm: 1 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Exam No</Typography>
                          <Chip label={row.exam_no} size="small" sx={{ height: { xs: 28, sm: 26 }, fontSize: { xs: '0.8125rem', sm: '0.75rem' }, fontWeight: 600, bgcolor: alpha(ADMIN_PRIMARY, 0.12), color: ADMIN_PRIMARY_DARK, borderRadius: '7px', border: 'none' }} />
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Total Questions</Typography>
                          <Chip label={row.total_questions ?? 0} size="small" sx={{ height: { xs: 28, sm: 26 }, fontSize: { xs: '0.8125rem', sm: '0.75rem' }, fontWeight: 600, bgcolor: alpha(ADMIN_PRIMARY, 0.12), color: ADMIN_PRIMARY_DARK, borderRadius: '7px', border: 'none' }} />
                        </Box>
                      </Box>
                      <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', flexShrink: 0, gap: 0.25 }}>
                        <Tooltip title="View questions" placement="top" arrow>
                          <IconButton size="medium" onClick={() => handleViewQuestions(row)} sx={{ color: theme.palette.info.main, '&:hover': { color: theme.palette.info.dark, bgcolor: alpha(theme.palette.info.main, 0.15) } }}><VisibilityRoundedIcon fontSize="small" /></IconButton>
                        </Tooltip>
                        <Tooltip title="View ratings" placement="top" arrow>
                          <IconButton size="medium" onClick={() => handleViewRatings(row)} sx={{ color: theme.palette.warning.main, '&:hover': { color: theme.palette.warning.dark, bgcolor: alpha(theme.palette.warning.main, 0.15) } }}><StarRoundedIcon fontSize="small" /></IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                    <Box sx={{ display: { xs: 'flex', sm: 'none' }, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                      <Tooltip title="View questions" placement="top" arrow>
                        <IconButton size="large" onClick={() => handleViewQuestions(row)} sx={{ color: theme.palette.info.main, bgcolor: alpha(theme.palette.info.main, 0.08), '&:hover': { color: theme.palette.info.dark, bgcolor: alpha(theme.palette.info.main, 0.15) } }}><VisibilityRoundedIcon fontSize="medium" /></IconButton>
                      </Tooltip>
                      <Tooltip title="View ratings" placement="top" arrow>
                        <IconButton size="large" onClick={() => handleViewRatings(row)} sx={{ color: theme.palette.warning.main, bgcolor: alpha(theme.palette.warning.main, 0.08), '&:hover': { color: theme.palette.warning.dark, bgcolor: alpha(theme.palette.warning.main, 0.15) } }}><StarRoundedIcon fontSize="medium" /></IconButton>
                      </Tooltip>
                    </Box>
                  </Paper>
                ))}
          </Box>
        )}

        {/* Pagination */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: { xs: 1.5, sm: 2 }, px: { xs: 1.5, sm: 2 }, py: { xs: 1.75, sm: 2 }, borderTop: '1px solid', borderColor: theme.palette.grey[200], bgcolor: alpha(ADMIN_PRIMARY, 0.02), borderRadius: { xs: '0 0 7px 7px', sm: 0 } }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: { xs: 'center', sm: 'flex-start' }, gap: { xs: 1, sm: 1.5 }, width: { xs: '100%', sm: 'auto' }, minWidth: 0 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: { xs: '0.8125rem', sm: '0.875rem' }, flexShrink: 0 }}>Rows per page</Typography>
            <FormControl size="small" variant="outlined" sx={{ minWidth: 72, flexShrink: 0 }}>
              <Select value={rowsPerPage} onChange={handleChangeRowsPerPage} sx={{ height: 36, fontSize: '0.8125rem', fontWeight: 600, borderRadius: '7px', bgcolor: theme.palette.background.paper, '& .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.grey[300] }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: ADMIN_PRIMARY }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: ADMIN_PRIMARY, borderWidth: 2 } }}>
                {ROWS_PER_PAGE_OPTIONS.map((opt) => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
              </Select>
            </FormControl>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: { xs: '0.8125rem', sm: '0.875rem' }, flexShrink: 0 }}>{totalRows === 0 ? '0–0 of 0' : `${from}–${to} of ${totalRows}`}</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', alignItems: 'center', justifyContent: { xs: 'center', sm: 'flex-end' }, gap: { xs: 1, sm: 1.5 }, width: { xs: '100%', sm: 'auto' }, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
              <ViewListRoundedIcon sx={{ color: ADMIN_PRIMARY, fontSize: { xs: 18, sm: 22 } }} />
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem' }}>Page {page + 1} of {totalPages}</Typography>
            </Box>
            <Pagination count={totalPages} page={page + 1} onChange={handleChangePage} size="small" showFirstButton showLastButton sx={{ '& .MuiPaginationItem-root': { fontWeight: 600, fontSize: '0.8125rem', borderRadius: '7px', minWidth: 32, height: 32, color: ADMIN_PRIMARY }, '& .MuiPaginationItem-page.Mui-selected': { background: `linear-gradient(135deg, ${ADMIN_PRIMARY}, ${ADMIN_PRIMARY_DARK})`, color: '#fff', boxShadow: `0 2px 6px ${alpha(ADMIN_PRIMARY, 0.35)}`, '&:hover': { background: `linear-gradient(135deg, ${ADMIN_PRIMARY_LIGHT}, ${ADMIN_PRIMARY})` } }, '& .MuiPaginationItem-page:not(.Mui-selected):hover': { backgroundColor: alpha(ADMIN_PRIMARY, 0.1), color: ADMIN_PRIMARY }, '& .MuiPaginationItem-icon': { color: ADMIN_PRIMARY, fontSize: 20 } }} />
          </Box>
        </Box>
      </Paper>

      {/* Block / Unblock dialog */}
      <Dialog
        open={blockUnblockDialogOpen}
        onClose={() => { if (!saveReleaseModeLoading) setBlockUnblockDialogOpen(false) }}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Slide}
        TransitionProps={{ direction: 'up' }}
        sx={{ ...(isMobile && { '& .MuiDialog-container': { alignItems: 'flex-end', justifyContent: 'center' } }) }}
        PaperProps={{ sx: { margin: isMobile ? 0 : 24, maxHeight: isMobile ? '90vh' : 'calc(100vh - 48px)', width: isMobile ? '100%' : undefined, maxWidth: isMobile ? '100%' : undefined, borderRadius: isMobile ? '7px 7px 0 0' : '7px', border: '1px solid', borderColor: alpha(ADMIN_PRIMARY, 0.15), borderBottom: isMobile ? 'none' : undefined, boxShadow: isMobile ? `0 -8px 32px rgba(15,23,42,0.2)` : `0 24px 48px rgba(15,23,42,0.16)`, overflow: 'hidden', position: 'relative', '&::before': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: 5, background: `linear-gradient(90deg, ${ADMIN_PRIMARY} 0%, ${ADMIN_PRIMARY_LIGHT} 100%)` } } }}
      >
        {isMobile && (
          <Box sx={{ pt: 1.5, pb: 0.5, display: 'flex', justifyContent: 'center', flexShrink: 0, bgcolor: alpha(ADMIN_PRIMARY, 0.02), borderBottom: '1px solid', borderColor: alpha(ADMIN_PRIMARY, 0.1) }}>
            <Box sx={{ width: 40, height: 4, borderRadius: '7px', bgcolor: theme.palette.grey[400] }} />
          </Box>
        )}
        <DialogTitle component="div" sx={{ pt: { xs: 2.5, sm: 4 }, pb: 2.5, px: { xs: 2.5, sm: 3.5 }, display: 'flex', alignItems: 'center', gap: 2, borderBottom: '1px solid', borderColor: alpha(ADMIN_PRIMARY, 0.1), bgcolor: alpha(ADMIN_PRIMARY, 0.02) }}>
          <Box sx={{ width: 52, height: 52, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, bgcolor: alpha(ADMIN_PRIMARY, 0.12), color: ADMIN_PRIMARY, border: '2px solid', borderColor: alpha(ADMIN_PRIMARY, 0.2), boxShadow: `0 4px 12px ${alpha(ADMIN_PRIMARY, 0.2)}` }}>
            <LockRoundedIcon sx={{ fontSize: 28 }} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', letterSpacing: '-0.02em', lineHeight: 1.3 }}>Block / Unblock scenario exams</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5, fontSize: '0.9375rem' }}>Control how exams are released to users</Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3.5, pb: 2.5, px: { xs: 2.5, sm: 3.5 }, minHeight: 220 }}>
          <Typography variant="body1" sx={{ color: 'text.primary', lineHeight: 1.7, mb: 2 }}>
            <Box component="span" sx={{ fontWeight: 700, color: ADMIN_PRIMARY }}>Blocked mode:</Box>{' '}
            Exams are released one after another. Users must complete each exam in order before the next one becomes available — ideal for a structured, step-by-step learning path.
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.primary', lineHeight: 1.7, mb: 2.5 }}>
            <Box component="span" sx={{ fontWeight: 700, color: ADMIN_PRIMARY }}>Unblocked mode:</Box>{' '}
            All exams are available at once. Users can attempt any exam in any order and choose what they want to work on — ideal for revision or flexible practice.
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1.5, py: 1.5, px: 2, borderRadius: '7px', border: '1px solid', borderColor: alpha(ADMIN_PRIMARY, 0.2), bgcolor: alpha(ADMIN_PRIMARY, 0.04) }}>
            <FormControlLabel
              control={<Switch checked={examsBlocked} onChange={(e) => setExamsBlocked(e.target.checked)} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: ADMIN_PRIMARY }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: alpha(ADMIN_PRIMARY, 0.5) } }} />}
              label={<Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>{examsBlocked ? 'Blocked — exams open one after another' : 'Unblocked — all exams open at once'}</Typography>}
              labelPlacement="start"
              sx={{ m: 0, flex: '1 1 auto', minWidth: 0 }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: { xs: 2.5, sm: 3.5 }, py: 2, pt: 1.5, pb: { xs: 'max(16px, env(safe-area-inset-bottom))', sm: 2 }, borderTop: '1px solid', borderColor: alpha(theme.palette.grey[300], 0.5), bgcolor: theme.palette.grey[50], gap: 1 }}>
          <Button onClick={() => { if (!saveReleaseModeLoading) setBlockUnblockDialogOpen(false) }} disabled={saveReleaseModeLoading} startIcon={<CloseOutlinedIcon sx={{ fontSize: 20 }} />} sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.9375rem', textTransform: 'none', borderRadius: '7px', px: 2, '&:hover': { bgcolor: alpha(ADMIN_PRIMARY, 0.06), color: ADMIN_PRIMARY } }}>
            Close
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveReleaseMode}
            disabled={saveReleaseModeLoading}
            startIcon={saveReleaseModeLoading ? <AutorenewIcon sx={{ animation: 'spin 0.8s linear infinite', color: '#fff' }} /> : null}
            sx={{ bgcolor: ADMIN_PRIMARY, borderRadius: '7px', fontWeight: 600, px: 2.5, color: '#fff', textTransform: 'none', '&:hover': { bgcolor: ADMIN_PRIMARY_DARK }, '&.Mui-disabled': { bgcolor: ADMIN_PRIMARY, color: '#fff', opacity: 0.85 } }}
          >
            {saveReleaseModeLoading ? 'Saving…' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AdminScenariosLectures
