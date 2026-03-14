import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { alpha } from '@mui/material/styles'
import {
  Box,
  Typography,
  Button,
  Paper,
  Avatar,
  Rating,
  Pagination,
  FormControl,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
  Skeleton,
} from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded'
import apiClient from '../server'

const ROWS_PER_PAGE_OPTIONS = [5, 10, 20, 30]
const ADMIN_PRIMARY = '#384D84'
const ADMIN_PRIMARY_DARK = '#2a3a64'
const ADMIN_PRIMARY_LIGHT = '#4a5f9a'
const SKELETON_COUNT = 5

function AdminScenarioExamRatings() {
  const theme = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const courseTitle = location.state?.courseTitle || null
  const lectureId = location.state?.lectureId
  const lectureNo = location.state?.lectureNo ?? 1

  const [ratings, setRatings] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalRows, setTotalRows] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [listLoading, setListLoading] = useState(false)
  const [listError, setListError] = useState('')

  const serverPage = page + 1
  const from = totalRows === 0 ? 0 : (serverPage - 1) * rowsPerPage + 1
  const to = Math.min((serverPage - 1) * rowsPerPage + rowsPerPage, totalRows)

  const fetchRatings = async (opts = {}) => {
    if (!lectureId) return
    const { targetPage = serverPage, targetPerPage = rowsPerPage } = opts
    setListLoading(true)
    setListError('')
    const params = new URLSearchParams()
    params.set('scenario_exam_id', String(lectureId))
    params.set('page', String(targetPage))
    params.set('per_page', String(targetPerPage))
    try {
      const { ok, data } = await apiClient(`/scenario-exam-ratings?${params.toString()}`, 'GET')
      if (!ok || !data?.success) {
        const message = data?.errors && typeof data.errors === 'object' ? Object.values(data.errors).flat().join(' ') : data?.message
        setListError(message || 'Unable to load ratings.')
        return
      }
      const list = data.data?.ratings || []
      const pagination = data.data?.pagination || {}
      setRatings(list)
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
    window.scrollTo(0, 0)
    fetchRatings({ targetPage: 1, targetPerPage: rowsPerPage })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChangePage = (_, newPage) => {
    const pg = newPage - 1
    setPage(pg)
    fetchRatings({ targetPage: newPage, targetPerPage: rowsPerPage })
  }
  const handleChangeRowsPerPage = (e) => {
    const newPerPage = Number(e.target.value)
    setRowsPerPage(newPerPage)
    setPage(0)
    fetchRatings({ targetPage: 1, targetPerPage: newPerPage })
  }

  const handleBack = () => {
    navigate('/admin/scenarios/lectures', { state: courseTitle ? { courseTitle } : undefined })
  }

  return (
    <Box sx={{ width: '100%', minWidth: 0, maxWidth: 900, mx: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      {/* Header */}
      <Box sx={{ mb: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Button size="small" startIcon={<ArrowBackRoundedIcon />} onClick={handleBack} sx={{ color: 'text.secondary', fontWeight: 600, '&:hover': { color: ADMIN_PRIMARY, bgcolor: alpha(ADMIN_PRIMARY, 0.08) } }}>
            Back
          </Button>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 0.25 }}>
          <Box sx={{ width: 44, height: 44, borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: alpha(ADMIN_PRIMARY, 0.12) }}>
            <StarRoundedIcon sx={{ fontSize: 26, color: ADMIN_PRIMARY }} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>
              Exam {lectureNo} – Ratings
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
              {courseTitle ? `${courseTitle} · ` : ''}All ratings for this exam
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Error */}
      {listError && !listLoading && (
        <Paper elevation={0} sx={{ p: 3, mb: 2, borderRadius: '7px', border: '1px solid', borderColor: alpha(theme.palette.error.main, 0.2), bgcolor: alpha(theme.palette.error.main, 0.04), textAlign: 'center' }}>
          <Typography variant="body2" color="error">{listError}</Typography>
          <Button size="small" onClick={() => fetchRatings({ targetPage: serverPage })} sx={{ mt: 1, color: ADMIN_PRIMARY }}>Retry</Button>
        </Paper>
      )}

      {/* Ratings list */}
      <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', pb: 3, pr: { xs: 0, sm: 0.5 }, '&::-webkit-scrollbar': { width: 8 }, '&::-webkit-scrollbar-track': { bgcolor: alpha(theme.palette.grey[500], 0.08), borderRadius: 4 }, '&::-webkit-scrollbar-thumb': { bgcolor: alpha(ADMIN_PRIMARY, 0.3), borderRadius: 4 }, '&::-webkit-scrollbar-thumb:hover': { bgcolor: alpha(ADMIN_PRIMARY, 0.5) } }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {listLoading
            ? Array.from({ length: SKELETON_COUNT }).map((_, idx) => (
                <Paper key={`sk-${idx}`} elevation={0} sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: '7px', border: '1px solid', borderColor: alpha(ADMIN_PRIMARY, 0.12), bgcolor: theme.palette.background.paper }}>
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
                      <Skeleton variant="circular" width={isMobile ? 48 : 56} height={isMobile ? 48 : 56} />
                      <Box>
                        <Skeleton variant="text" width={120} sx={{ fontSize: '1rem' }} />
                        <Skeleton variant="rounded" width={80} height={20} sx={{ mt: 0.5, borderRadius: '4px' }} />
                      </Box>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Skeleton variant="text" width="100%" sx={{ fontSize: '0.875rem' }} />
                      <Skeleton variant="text" width="80%" sx={{ fontSize: '0.875rem' }} />
                    </Box>
                  </Box>
                </Paper>
              ))
            : ratings.length === 0 && !listError ? (
                <Paper elevation={0} sx={{ p: 4, borderRadius: '7px', border: '1px dashed', borderColor: alpha(ADMIN_PRIMARY, 0.3), bgcolor: alpha(ADMIN_PRIMARY, 0.02), textAlign: 'center' }}>
                  <StarRoundedIcon sx={{ fontSize: 40, color: alpha(ADMIN_PRIMARY, 0.4), mb: 1 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary' }}>No ratings yet.</Typography>
                  <Typography variant="body2" sx={{ color: 'text.disabled', mt: 0.5 }}>Ratings will appear here once users review this exam.</Typography>
                </Paper>
              )
            : ratings.map((rating) => (
                <Paper key={rating.id} elevation={0} sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: '7px', border: '1px solid', borderColor: alpha(ADMIN_PRIMARY, 0.12), bgcolor: theme.palette.background.paper, transition: 'border-color 0.2s ease, box-shadow 0.2s ease', '&:hover': { borderColor: alpha(ADMIN_PRIMARY, 0.25), boxShadow: `0 4px 16px ${alpha(ADMIN_PRIMARY, 0.08)}` } }}>
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'stretch', sm: 'flex-start' }, gap: { xs: 1.5, sm: 2 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0, minWidth: 0 }}>
                      <Avatar
                        src={rating.profile_image || undefined}
                        alt={rating.full_name}
                        sx={{ width: { xs: 48, sm: 56 }, height: { xs: 48, sm: 56 }, border: '2px solid', borderColor: alpha(ADMIN_PRIMARY, 0.2), bgcolor: alpha(ADMIN_PRIMARY, 0.08) }}
                      >
                        {rating.full_name?.charAt(0)?.toUpperCase() || '?'}
                      </Avatar>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary', lineHeight: 1.3 }}>{rating.full_name}</Typography>
                        <Rating
                          name={`rating-${rating.id}`}
                          value={rating.stars}
                          readOnly
                          size="small"
                          icon={<StarRoundedIcon sx={{ fontSize: 20 }} />}
                          sx={{ mt: 0.5, '& .MuiRating-iconFilled': { color: ADMIN_PRIMARY }, '& .MuiRating-iconEmpty': { color: alpha(ADMIN_PRIMARY, 0.3) } }}
                        />
                      </Box>
                    </Box>
                    {rating.comment && (
                      <Typography variant="body2" sx={{ flex: 1, color: 'text.secondary', lineHeight: 1.6, pt: { xs: 0, sm: 0.5 }, pl: { xs: 0, sm: 2 }, borderLeft: { xs: 'none', sm: '3px solid' }, borderColor: { sm: alpha(ADMIN_PRIMARY, 0.2) } }}>
                        {rating.comment}
                      </Typography>
                    )}
                  </Box>
                </Paper>
              ))}
        </Box>
      </Box>

      {/* Pagination */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: { xs: 1.5, sm: 2 }, px: { xs: 1.5, sm: 2 }, py: { xs: 1.75, sm: 2 }, mt: 2, borderTop: '1px solid', borderColor: theme.palette.grey[200], bgcolor: alpha(ADMIN_PRIMARY, 0.02), borderRadius: '7px' }}>
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
    </Box>
  )
}

export default AdminScenarioExamRatings
