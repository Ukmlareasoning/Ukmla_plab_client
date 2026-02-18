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
} from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded'

const ROWS_PER_PAGE_OPTIONS = [5, 10, 20, 30]

const ADMIN_PRIMARY = '#384D84'
const ADMIN_PRIMARY_DARK = '#2a3a64'
const ADMIN_PRIMARY_LIGHT = '#4a5f9a'

// Mock: ~10 rating records for this exam (replace with API later)
const MOCK_RATINGS = [
  { id: 1, fullName: 'Dr. Sarah Mitchell', profileImage: 'https://i.pravatar.cc/100?img=1', stars: 5, comment: 'Excellent scenario exam. Very relevant to UKMLA and the feedback was clear.' },
  { id: 2, fullName: 'James Chen', profileImage: 'https://i.pravatar.cc/100?img=2', stars: 4, comment: 'Helpful for revision. Would have liked more time on the descriptive questions.' },
  { id: 3, fullName: 'Dr. Emma Watson', profileImage: 'https://i.pravatar.cc/100?img=3', stars: 5, comment: 'Best scenario pack I have used. Structure mirrors the real exam.' },
  { id: 4, fullName: 'Oliver Brown', profileImage: 'https://i.pravatar.cc/100?img=4', stars: 3, comment: 'Good mix of topics. Some questions were quite challenging.' },
  { id: 5, fullName: 'Dr. Aisha Patel', profileImage: 'https://i.pravatar.cc/100?img=5', stars: 5, comment: 'Very useful for GMC-aligned practice. Recommended to my colleagues.' },
  { id: 6, fullName: 'Lucas Garcia', profileImage: 'https://i.pravatar.cc/100?img=6', stars: 4, comment: 'Clear explanations and good difficulty progression.' },
  { id: 7, fullName: 'Dr. Sophie Turner', profileImage: 'https://i.pravatar.cc/100?img=7', stars: 5, comment: 'Exactly what I needed for PLAB 1 preparation. Thank you.' },
  { id: 8, fullName: 'Noah Wilson', profileImage: 'https://i.pravatar.cc/100?img=8', stars: 4, comment: 'Solid content. Would be great to have more ethics scenarios.' },
  { id: 9, fullName: 'Dr. Fatima Khan', profileImage: 'https://i.pravatar.cc/100?img=9', stars: 5, comment: 'Professional and well organised. Helped me identify weak areas.' },
  { id: 10, fullName: 'Ethan Davis', profileImage: 'https://i.pravatar.cc/100?img=10', stars: 4, comment: 'Good value. The one-by-one release kept me focused.' },
]

function AdminScenarioExamRatings() {
  const theme = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const courseTitle = location.state?.courseTitle || null
  const lectureId = location.state?.lectureId
  const lectureNo = location.state?.lectureNo ?? 1

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const totalRows = MOCK_RATINGS.length
  const totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage))
  const paginatedRatings = MOCK_RATINGS.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  const from = totalRows === 0 ? 0 : page * rowsPerPage + 1
  const to = Math.min(page * rowsPerPage + rowsPerPage, totalRows)

  const handleChangePage = (_, newPage) => setPage(newPage - 1)
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(Number(e.target.value))
    setPage(0)
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (page >= totalPages && totalPages > 0) setPage(0)
  }, [totalPages, page])

  const handleBack = () => {
    navigate('/admin/scenarios/lectures', { state: courseTitle ? { courseTitle } : undefined })
  }

  return (
    <Box
      sx={{
        width: '100%',
        minWidth: 0,
        maxWidth: 900,
        mx: 'auto',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100%',
      }}
    >
      {/* Page header */}
      <Box sx={{ mb: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Button
            size="small"
            startIcon={<ArrowBackRoundedIcon />}
            onClick={handleBack}
            sx={{
              color: 'text.secondary',
              fontWeight: 600,
              '&:hover': { color: ADMIN_PRIMARY, bgcolor: alpha(ADMIN_PRIMARY, 0.08) },
            }}
          >
            Back
          </Button>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 0.25 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '7px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: alpha(ADMIN_PRIMARY, 0.12),
            }}
          >
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

      {/* Scrollable list of ratings */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          pb: 3,
          pr: { xs: 0, sm: 0.5 },
          '&::-webkit-scrollbar': { width: 8 },
          '&::-webkit-scrollbar-track': { bgcolor: alpha(theme.palette.grey[500], 0.08), borderRadius: 4 },
          '&::-webkit-scrollbar-thumb': { bgcolor: alpha(ADMIN_PRIMARY, 0.3), borderRadius: 4 },
          '&::-webkit-scrollbar-thumb:hover': { bgcolor: alpha(ADMIN_PRIMARY, 0.5) },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {paginatedRatings.map((rating) => (
            <Paper
              key={rating.id}
              elevation={0}
              sx={{
                p: { xs: 2, sm: 2.5 },
                borderRadius: '7px',
                border: '1px solid',
                borderColor: alpha(ADMIN_PRIMARY, 0.12),
                bgcolor: theme.palette.background.paper,
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  borderColor: alpha(ADMIN_PRIMARY, 0.25),
                  boxShadow: `0 4px 16px ${alpha(ADMIN_PRIMARY, 0.08)}`,
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: { xs: 'stretch', sm: 'flex-start' },
                  gap: { xs: 1.5, sm: 2 },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    flexShrink: 0,
                    minWidth: 0,
                  }}
                >
                  <Avatar
                    src={rating.profileImage}
                    alt={rating.fullName}
                    sx={{
                      width: { xs: 48, sm: 56 },
                      height: { xs: 48, sm: 56 },
                      border: '2px solid',
                      borderColor: alpha(ADMIN_PRIMARY, 0.2),
                      bgcolor: alpha(ADMIN_PRIMARY, 0.08),
                    }}
                  />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary', lineHeight: 1.3 }}>
                      {rating.fullName}
                    </Typography>
                    <Rating
                      name={`rating-${rating.id}`}
                      value={rating.stars}
                      readOnly
                      size="small"
                      icon={<StarRoundedIcon sx={{ fontSize: 20 }} />}
                      sx={{
                        mt: 0.5,
                        '& .MuiRating-iconFilled': { color: ADMIN_PRIMARY },
                        '& .MuiRating-iconEmpty': { color: alpha(ADMIN_PRIMARY, 0.3) },
                      }}
                    />
                  </Box>
                </Box>
                {rating.comment && (
                  <Typography
                    variant="body2"
                    sx={{
                      flex: 1,
                      color: 'text.secondary',
                      lineHeight: 1.6,
                      pt: { xs: 0, sm: 0.5 },
                      pl: { xs: 0, sm: 2 },
                      borderLeft: { xs: 'none', sm: '3px solid' },
                      borderColor: { sm: alpha(ADMIN_PRIMARY, 0.2) },
                    }}
                  >
                    {rating.comment}
                  </Typography>
                )}
              </Box>
            </Paper>
          ))}
        </Box>
      </Box>

      {/* Pagination — same style as AdminScenariosLectures */}
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
          mt: 2,
          borderTop: '1px solid',
          borderColor: theme.palette.grey[200],
          bgcolor: alpha(ADMIN_PRIMARY, 0.02),
          borderRadius: '7px',
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
    </Box>
  )
}

export default AdminScenarioExamRatings
