import { useMemo, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { alpha } from '@mui/material/styles'
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Paper,
  IconButton,
  Chip,
  LinearProgress,
  Button,
  Skeleton,
} from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded'
import QuizRoundedIcon from '@mui/icons-material/QuizRounded'
import LockIcon from '@mui/icons-material/Lock'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import UserDashboardLayout from './UserDashboardLayout'
import apiClient from '../server'

const PAGE_PRIMARY = '#384D84'
const PAGE_PRIMARY_DARK = '#2a3a64'

function ScenarioPractice() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const scenarioFromState = location.state?.scenario
  const scenarioId = scenarioFromState?.id || null
  const courseTitle = scenarioFromState?.title || 'Scenario exam practice'

  const [exams, setExams] = useState([])
  const [releaseMode, setReleaseMode] = useState('all_at_once')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const getScoreColor = (pct) =>
    pct >= 80 ? PAGE_PRIMARY : pct >= 60 ? theme.palette.warning.main : theme.palette.error.main

  const totalCoursePercentage = 0

  useEffect(() => {
    if (!scenarioId) {
      setError('No scenario selected. Please go back and select a scenario.')
      return
    }
    const loadExams = async () => {
      setLoading(true)
      setError('')
      const params = new URLSearchParams()
      params.set('scenario_id', String(scenarioId))
      params.set('per_page', '200')
      try {
        const { ok, data } = await apiClient(`/scenario-exams?${params.toString()}`, 'GET')
        if (!ok || !data?.success) {
          const message =
            data?.errors && typeof data.errors === 'object'
              ? Object.values(data.errors).flat().join(' ')
              : data?.message
          setError(message || 'Unable to load scenario exams.')
          return
        }
        const list = data.data?.scenario_exams || []
        setExams(list)
        const mode = data.data?.exams_release_mode
        if (mode === 'all_at_once' || mode === 'one_after_another') {
          setReleaseMode(mode)
        } else {
          setReleaseMode('all_at_once')
        }
      } catch {
        setError('Unable to reach server. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    loadExams()
  }, [scenarioId])

  const handleBack = () => {
    navigate('/user-dashboard/scenarios')
  }

  const handleStartLecture = (exam) => {
    if (!scenarioId || !exam) return
    navigate('/user-dashboard/scenario-practice/details', {
      state: {
        scenarioId,
        examId: exam.id,
        examNo: exam.exam_no,
        courseTitle,
      },
    })
  }

  const renderLectureTabs = () => {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {(loading ? Array.from({ length: 3 }) : exams).map((exam, index) => {
          if (loading) {
            return (
              <Paper
                key={`skeleton-${index}`}
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: '7px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  border: '1px solid',
                  borderColor: alpha(PAGE_PRIMARY, 0.16),
                  bgcolor: alpha(PAGE_PRIMARY, 0.02),
                }}
              >
                <Skeleton variant="rounded" width={40} height={40} sx={{ borderRadius: '7px' }} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Skeleton variant="text" width="40%" />
                  <Skeleton variant="text" width="30%" />
                  <Skeleton variant="rounded" width="100%" height={8} sx={{ mt: 1, borderRadius: '7px' }} />
                </Box>
                <Skeleton variant="rounded" width={96} height={32} sx={{ borderRadius: '7px' }} />
              </Paper>
            )
          }

          const isUnlocked = releaseMode === 'all_at_once' || index === 0

          return (
            <Paper
              key={exam.id}
              elevation={0}
              sx={{
                p: 2,
                borderRadius: '7px',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                opacity: isUnlocked ? 1 : 0.6,
                cursor: isUnlocked ? 'pointer' : 'default',
                border: '1px solid',
                borderColor: alpha(PAGE_PRIMARY, 0.16),
                bgcolor: alpha(PAGE_PRIMARY, 0.02),
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '7px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: alpha(PAGE_PRIMARY, 0.1),
                  flexShrink: 0,
                }}
              >
                <QuizRoundedIcon sx={{ color: PAGE_PRIMARY }} />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  Exam {exam.exam_no}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {exam.total_questions || 0} questions
                </Typography>
                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ flex: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={0}
                      sx={{
                        height: 8,
                        borderRadius: '7px',
                        bgcolor: alpha(theme.palette.grey[400], 0.2),
                        '& .MuiLinearProgress-bar': {
                          borderRadius: '7px',
                          bgcolor: getScoreColor(0),
                        },
                      }}
                    />
                  </Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 700, color: getScoreColor(0), minWidth: 40, textAlign: 'right' }}
                  >
                    0%
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-end' }}>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={isUnlocked ? <PlayArrowIcon /> : <LockIcon />}
                  disabled={!isUnlocked}
                  onClick={() => isUnlocked && handleStartLecture(exam)}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 700,
                    borderRadius: '7px',
                    bgcolor: isUnlocked ? PAGE_PRIMARY : undefined,
                    '&:hover': isUnlocked ? { bgcolor: PAGE_PRIMARY_DARK } : undefined,
                  }}
                >
                  {isUnlocked ? 'Start' : 'Locked'}
                </Button>
              </Box>
            </Paper>
          )
        })}
      </Box>
    )
  }

  return (
    <UserDashboardLayout>
      <Box
        sx={{
          px: { xs: 2, sm: 3 },
          py: { xs: 3, sm: 4 },
          overflowX: 'hidden',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 3 }}>
          <IconButton
            onClick={handleBack}
            size={isMobile ? 'medium' : 'large'}
            sx={{
              borderRadius: '7px',
              color: PAGE_PRIMARY,
              bgcolor: alpha(PAGE_PRIMARY, 0.08),
              '&:hover': { bgcolor: alpha(PAGE_PRIMARY, 0.15) },
            }}
            aria-label="Back to scenarios"
          >
            <ArrowBackRoundedIcon />
          </IconButton>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                fontSize: { xs: '1.25rem', sm: '1.5rem' },
              }}
            >
              {courseTitle}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
              Work through scenario exams one by one and track your performance.
            </Typography>
          </Box>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            mb: 3,
            borderRadius: '7px',
            border: '1px solid',
            borderColor: alpha(PAGE_PRIMARY, 0.2),
            bgcolor: alpha(PAGE_PRIMARY, 0.04),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '7px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: alpha(getScoreColor(totalCoursePercentage), 0.15),
              }}
            >
              <MenuBookRoundedIcon sx={{ fontSize: 32, color: getScoreColor(totalCoursePercentage) }} />
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.8rem' }}>
                Total scenario exam score
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  color: getScoreColor(totalCoursePercentage),
                  fontSize: '1.75rem',
                }}
              >
                {totalCoursePercentage}%
              </Typography>
            </Box>
          </Box>
          <LinearProgress
            variant="determinate"
            value={totalCoursePercentage}
            sx={{
              width: { xs: '100%', sm: 200 },
              height: 10,
              borderRadius: '7px',
              bgcolor: alpha(theme.palette.grey[400], 0.2),
              '& .MuiLinearProgress-bar': {
                borderRadius: '7px',
                bgcolor: getScoreColor(totalCoursePercentage),
              },
            }}
          />
        </Paper>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
              Scenario exams
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.5 }}>
              First scenario exam is active. Other scenario exams will unlock later.
            </Typography>
            {renderLectureTabs()}
          </Box>
        </Box>
      </Box>
    </UserDashboardLayout>
  )
}

export default ScenarioPractice
