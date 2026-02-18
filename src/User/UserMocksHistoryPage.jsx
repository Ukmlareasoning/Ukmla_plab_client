import { useEffect, useMemo, useState } from 'react'
import { alpha } from '@mui/material/styles'
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slide,
  Rating,
  TextField,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded'
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import UserDashboardLayout from './UserDashboardLayout'
import { HistoryTab } from './UserDashboard'
import { dashboardCoursesData } from './UserDashboardData.jsx'

const PAGE_PRIMARY = '#384D84'
const PAGE_PRIMARY_DARK = '#2a3a64'
const PAGE_PRIMARY_LIGHT = '#4a5f9a'

export default function UserMocksHistoryPage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const completedCourses = dashboardCoursesData.filter((c) => c.enrolled && c.progress >= 100)

  // First 2 mocks: show "Rate this" only. Other 2: show "View rate" only with static rating.
  const rateThisIds = useMemo(() => new Set(completedCourses.slice(0, 2).map((c) => c.id)), [completedCourses])
  const viewRateIds = useMemo(() => new Set(completedCourses.slice(2, 4).map((c) => c.id)), [completedCourses])

  const initialStaticRatings = useMemo(() => {
    const ids = completedCourses.slice(2, 4).map((c) => c.id)
    const obj = {}
    ids.forEach((id, i) => {
      obj[id] = {
        stars: i === 0 ? 4 : 5,
        comment: i === 0
          ? 'Very helpful for exam preparation. Clear structure and good question mix.'
          : 'Excellent mock pack. Good mix of difficulty and topics.',
      }
    })
    return obj
  }, [completedCourses])

  const [ratingDialogOpen, setRatingDialogOpen] = useState(false)
  const [ratingDialogMode, setRatingDialogMode] = useState('rate') // 'rate' | 'view'
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [formStars, setFormStars] = useState(0)
  const [formComment, setFormComment] = useState('')
  const [savedRatings, setSavedRatings] = useState(initialStaticRatings) // { [courseId]: { stars, comment } }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleOpenRateThis = (course) => {
    setSelectedCourse(course)
    setRatingDialogMode('rate')
    const existing = savedRatings[course.id]
    setFormStars(existing?.stars ?? 0)
    setFormComment(existing?.comment ?? '')
    setRatingDialogOpen(true)
  }

  const handleOpenViewRate = (course) => {
    setSelectedCourse(course)
    setRatingDialogMode('view')
    setRatingDialogOpen(true)
  }

  const handleCloseRatingDialog = () => {
    setRatingDialogOpen(false)
    setSelectedCourse(null)
    setFormStars(0)
    setFormComment('')
  }

  const handleSubmitRating = () => {
    if (!selectedCourse) return
    setSavedRatings((prev) => ({
      ...prev,
      [selectedCourse.id]: { stars: formStars, comment: formComment.trim() },
    }))
    handleCloseRatingDialog()
  }

  const getRatingForCourse = (courseId) => savedRatings[courseId] ?? null

  const buttonSx = {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '0.75rem',
    borderRadius: '7px',
    py: 0.5,
    px: 1.25,
    borderColor: alpha(PAGE_PRIMARY, 0.5),
    color: PAGE_PRIMARY,
    whiteSpace: 'nowrap',
    '&:hover': { borderColor: PAGE_PRIMARY, bgcolor: alpha(PAGE_PRIMARY, 0.08) },
  }

  const renderCardActions = (course) => (
    <>
      {rateThisIds.has(course.id) && (
        <Button
          size="small"
          variant="outlined"
          startIcon={<RateReviewOutlinedIcon sx={{ fontSize: 18 }} />}
          onClick={() => handleOpenRateThis(course)}
          sx={buttonSx}
        >
          Rate this
        </Button>
      )}
      {viewRateIds.has(course.id) && (
        <Button
          size="small"
          variant="outlined"
          startIcon={<VisibilityOutlinedIcon sx={{ fontSize: 18 }} />}
          onClick={() => handleOpenViewRate(course)}
          sx={buttonSx}
        >
          View rate
        </Button>
      )}
    </>
  )

  return (
    <UserDashboardLayout>
      <Box sx={{ px: { xs: 2, sm: 3 }, py: { xs: 3, sm: 4 } }}>
        <Box sx={{ mb: { xs: 2.5, sm: 3 } }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '1.35rem', sm: '1.5rem' }, letterSpacing: '-0.02em' }}>
            Mocks History
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            View your completed mock exams
          </Typography>
        </Box>
        <HistoryTab
          completedCourses={completedCourses}
          detailsPath="/user-dashboard/course-details"
          sectionTitle="Completed Mocks Exams"
          singularLabel="mock exam"
          pluralLabel="mocks exams"
          emptyTitle="No completed mocks exams yet"
          emptySubtitle="Complete mock exams to see them here."
          renderCardActions={renderCardActions}
        />
      </Box>

      {/* Rating dialog — Rate this (form) or View rate (display) */}
      <Dialog
        open={ratingDialogOpen}
        onClose={handleCloseRatingDialog}
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
            borderColor: alpha(PAGE_PRIMARY, 0.15),
            borderBottom: isMobile ? 'none' : undefined,
            boxShadow: isMobile
              ? `0 -8px 32px rgba(15, 23, 42, 0.2), 0 -4px 16px ${alpha(PAGE_PRIMARY, 0.08)}`
              : `0 24px 48px rgba(15, 23, 42, 0.16), 0 0 0 1px ${alpha(PAGE_PRIMARY, 0.06)}`,
            overflow: 'hidden',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 5,
              background: `linear-gradient(90deg, ${PAGE_PRIMARY} 0%, ${PAGE_PRIMARY_LIGHT} 100%)`,
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
              bgcolor: alpha(PAGE_PRIMARY, 0.02),
              borderBottom: '1px solid',
              borderColor: alpha(PAGE_PRIMARY, 0.1),
            }}
          >
            <Box sx={{ width: 40, height: 4, borderRadius: '7px', bgcolor: theme.palette.grey[400] }} />
          </Box>
        )}
        <DialogTitle
          component="div"
          sx={{
            pt: { xs: 2.5, sm: 3 },
            pb: 2,
            px: { xs: 2.5, sm: 3.5 },
            borderBottom: '1px solid',
            borderColor: alpha(PAGE_PRIMARY, 0.1),
            bgcolor: alpha(PAGE_PRIMARY, 0.02),
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: alpha(PAGE_PRIMARY, 0.12),
                color: PAGE_PRIMARY,
              }}
            >
              <StarRoundedIcon sx={{ fontSize: 28 }} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                {ratingDialogMode === 'rate' ? 'Rate this mock exam' : 'Your rating'}
              </Typography>
              {selectedCourse && (
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
                  {selectedCourse.title}
                </Typography>
              )}
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2, px: { xs: 2.5, sm: 3.5 } }}>
          {ratingDialogMode === 'rate' ? (
            <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSubmitRating() }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
                Your rating (stars)
              </Typography>
              <Rating
                name="mock-rating"
                value={formStars}
                onChange={(_, v) => setFormStars(v ?? 0)}
                size="large"
                icon={<StarRoundedIcon sx={{ fontSize: 36 }} />}
                emptyIcon={<StarBorderRoundedIcon sx={{ fontSize: 36 }} />}
                sx={{ mb: 2, '& .MuiRating-iconFilled': { color: PAGE_PRIMARY }, '& .MuiRating-iconHover': { color: PAGE_PRIMARY_LIGHT } }}
              />
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
                Comment (optional)
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Share your experience with this mock exam..."
                value={formComment}
                onChange={(e) => setFormComment(e.target.value)}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '7px',
                    bgcolor: theme.palette.background.paper,
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: alpha(PAGE_PRIMARY, 0.5) },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: PAGE_PRIMARY, borderWidth: 2 },
                  },
                }}
              />
            </Box>
          ) : (
            <Box>
              {selectedCourse && getRatingForCourse(selectedCourse.id) ? (
                <>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
                    Stars
                  </Typography>
                  <Rating
                    name="view-rating"
                    value={getRatingForCourse(selectedCourse.id).stars}
                    readOnly
                    size="large"
                    icon={<StarRoundedIcon sx={{ fontSize: 36 }} />}
                    emptyIcon={<StarBorderRoundedIcon sx={{ fontSize: 36 }} />}
                    sx={{ mb: 2, '& .MuiRating-iconFilled': { color: PAGE_PRIMARY } }}
                  />
                  {getRatingForCourse(selectedCourse.id).comment && (
                    <>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
                        Your comment
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                        {getRatingForCourse(selectedCourse.id).comment}
                      </Typography>
                    </>
                  )}
                </>
              ) : (
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  You haven&apos;t rated this mock exam yet. Use &quot;Rate this&quot; to add your rating and comment.
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            px: { xs: 2.5, sm: 3.5 },
            py: 2,
            pt: 1.5,
            pb: { xs: 'max(16px, env(safe-area-inset-bottom))', sm: 2 },
            borderTop: '1px solid',
            borderColor: alpha(theme.palette.grey[300], 0.5),
            bgcolor: theme.palette.grey[50],
          }}
        >
          {ratingDialogMode === 'rate' && (
            <Button
              variant="contained"
              onClick={handleSubmitRating}
              sx={{
                bgcolor: PAGE_PRIMARY,
                borderRadius: '7px',
                fontWeight: 600,
                textTransform: 'none',
                px: 2,
                '&:hover': { bgcolor: PAGE_PRIMARY_DARK },
              }}
            >
              Submit rating
            </Button>
          )}
          <Box sx={{ flex: 1 }} />
          <Button
            onClick={handleCloseRatingDialog}
            startIcon={<CloseOutlinedIcon sx={{ fontSize: 20 }} />}
            sx={{
              color: 'text.secondary',
              fontWeight: 600,
              fontSize: '0.9375rem',
              textTransform: 'none',
              borderRadius: '7px',
              px: 2,
              '&:hover': { bgcolor: alpha(PAGE_PRIMARY, 0.06), color: PAGE_PRIMARY },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </UserDashboardLayout>
  )
}
