import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { alpha } from '@mui/material/styles'
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
  useTheme,
} from '@mui/material'
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded'
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded'
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded'
import GavelRoundedIcon from '@mui/icons-material/GavelRounded'
import UserDashboardLayout from './UserDashboardLayout'

const PAGE_PRIMARY = '#384D84'
const PAGE_PRIMARY_DARK = '#2a3a64'
const PAGE_PRIMARY_LIGHT = '#4a5f9a'

// Announcements for Scenarios and Mocks only
const ANNOUNCEMENTS = [
  { id: 1, title: 'New UKMLA reasoning scenarios added', date: '2025-02-10', excerpt: 'We’ve added 12 new scenario-based questions to the Ethics & GMC section. Check them out in Scenarios.', tag: 'Scenarios' },
  { id: 2, title: 'New mock exam: Data Interpretation & Examiner Traps', date: '2025-02-09', excerpt: 'A new mock exam is now available in Mocks Exams. Covers ECG, blood gas, and lab interpretation.', tag: 'Mocks' },
  { id: 3, title: 'Scenarios update: Patient Safety & Red-Flag Thinking', date: '2025-02-08', excerpt: 'Additional practice scenarios for red-flag thinking are live in the Scenarios section.', tag: 'Scenarios' },
  { id: 4, title: 'PLAB 1 mock format update (2025)', date: '2025-02-05', excerpt: 'Summary of the latest GMC PLAB 1 format and how our mocks align with it.', tag: 'Mocks' },
]

const ANNOUNCEMENT_FILTERS = ['all', 'Scenarios', 'Mocks']

export default function UserCommunityPage() {
  const theme = useTheme()
  const navigate = useNavigate()
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const filteredAnnouncements =
    filter === 'all'
      ? ANNOUNCEMENTS
      : ANNOUNCEMENTS.filter((a) => a.tag === filter)

  return (
    <UserDashboardLayout>
      <Box sx={{ px: { xs: 2, sm: 3 }, py: { xs: 3, sm: 4 }, overflowX: 'hidden', maxWidth: 1200, mx: 'auto' }}>
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              fontSize: { xs: '1.35rem', sm: '1.5rem' },
              letterSpacing: '-0.02em',
            }}
          >
            Community
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Announcements for Scenarios and Mock exams
          </Typography>
        </Box>

        {/* Stats: Announcements (Scenarios & Mocks) */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(3, 1fr)', sm: 'repeat(3, 1fr)' }, gap: { xs: 1, sm: 2 }, mb: 3 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 1.25, sm: 2 },
              borderRadius: '7px',
              border: '1px solid',
              borderColor: alpha(PAGE_PRIMARY, 0.15),
              bgcolor: theme.palette.background.paper,
              textAlign: 'center',
              minWidth: 0,
            }}
          >
            <CampaignRoundedIcon sx={{ fontSize: { xs: 22, sm: 28 }, color: PAGE_PRIMARY, mb: 0.5 }} />
            <Typography variant="h4" sx={{ fontWeight: 800, color: PAGE_PRIMARY, lineHeight: 1, fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
              {ANNOUNCEMENTS.length}
            </Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary', mt: 0.5, fontSize: { xs: '0.7rem', sm: 'inherit' } }}>
              Announcements
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: { xs: '0.65rem', sm: 'inherit' } }}>
              Total
            </Typography>
          </Paper>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 1.25, sm: 2 },
              borderRadius: '7px',
              border: '1px solid',
              borderColor: alpha(PAGE_PRIMARY, 0.15),
              bgcolor: theme.palette.background.paper,
              textAlign: 'center',
              minWidth: 0,
            }}
          >
            <AutoStoriesRoundedIcon sx={{ fontSize: { xs: 22, sm: 28 }, color: PAGE_PRIMARY, mb: 0.5 }} />
            <Typography variant="h4" sx={{ fontWeight: 800, color: PAGE_PRIMARY, lineHeight: 1, fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
              {ANNOUNCEMENTS.filter((a) => a.tag === 'Scenarios').length}
            </Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary', mt: 0.5, fontSize: { xs: '0.7rem', sm: 'inherit' } }}>
              Scenarios
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: { xs: '0.65rem', sm: 'inherit' } }}>
              Updates
            </Typography>
          </Paper>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 1.25, sm: 2 },
              borderRadius: '7px',
              border: '1px solid',
              borderColor: alpha(PAGE_PRIMARY, 0.15),
              bgcolor: theme.palette.background.paper,
              textAlign: 'center',
              minWidth: 0,
            }}
          >
            <MenuBookRoundedIcon sx={{ fontSize: { xs: 22, sm: 28 }, color: PAGE_PRIMARY, mb: 0.5 }} />
            <Typography variant="h4" sx={{ fontWeight: 800, color: PAGE_PRIMARY, lineHeight: 1, fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
              {ANNOUNCEMENTS.filter((a) => a.tag === 'Mocks').length}
            </Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary', mt: 0.5, fontSize: { xs: '0.7rem', sm: 'inherit' } }}>
              Mocks
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: { xs: '0.65rem', sm: 'inherit' } }}>
              Updates
            </Typography>
          </Paper>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3 }}>
          {/* Left: Announcements only */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                mb: 3,
                borderRadius: '7px',
                border: '1px solid',
                borderColor: alpha(PAGE_PRIMARY, 0.15),
                bgcolor: theme.palette.background.paper,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <CampaignRoundedIcon sx={{ color: PAGE_PRIMARY, fontSize: 24 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  Announcements
                </Typography>
              </Box>

              <Paper
                elevation={0}
                sx={{
                  p: 1.5,
                  mb: 2,
                  borderRadius: '7px',
                  border: '1px solid',
                  borderColor: alpha(PAGE_PRIMARY, 0.2),
                  bgcolor: alpha(PAGE_PRIMARY, 0.03),
                }}
              >
                <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 700, mb: 1, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Show
                </Typography>
                <ToggleButtonGroup
                  value={filter}
                  exclusive
                  onChange={(_, v) => v != null && setFilter(v)}
                  size="small"
                  sx={{
                    flexWrap: 'wrap',
                    gap: 0.5,
                    '& .MuiToggleButtonGroup-grouped': { borderRadius: '7px !important', textTransform: 'none', fontWeight: 600 },
                    '& .MuiToggleButton-root': {
                      border: '1px solid',
                      borderColor: alpha(PAGE_PRIMARY, 0.3),
                      color: 'text.secondary',
                      fontSize: '0.8125rem',
                      py: 0.75,
                      '&.Mui-selected': { bgcolor: PAGE_PRIMARY, color: '#fff', borderColor: PAGE_PRIMARY, '&:hover': { bgcolor: PAGE_PRIMARY_DARK } },
                    },
                  }}
                >
                  {ANNOUNCEMENT_FILTERS.map((f) => (
                    <ToggleButton key={f} value={f} aria-label={f}>
                      {f === 'all' ? 'All' : f}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Paper>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {filteredAnnouncements.map((a) => (
                  <Box
                    key={a.id}
                    sx={{
                      p: 1.5,
                      borderRadius: '7px',
                      border: '1px solid',
                      borderColor: alpha(PAGE_PRIMARY, 0.1),
                      bgcolor: alpha(PAGE_PRIMARY, 0.03),
                      '&:hover': { bgcolor: alpha(PAGE_PRIMARY, 0.06) },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 0.5 }}>
                      <Chip label={a.tag} size="small" sx={{ borderRadius: '6px', fontWeight: 600, fontSize: '0.7rem', height: 22 }} />
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {a.date}
                      </Typography>
                    </Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
                      {a.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {a.excerpt}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Box>

          {/* Right: Quick links + Guidelines */}
          <Box sx={{ width: { xs: '100%', lg: 280 }, flexShrink: 0 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                mb: 2,
                borderRadius: '7px',
                border: '1px solid',
                borderColor: alpha(PAGE_PRIMARY, 0.15),
                bgcolor: theme.palette.background.paper,
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary', mb: 1.5 }}>
                Quick links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  fullWidth
                  startIcon={<MenuBookRoundedIcon />}
                  onClick={() => navigate('/user-dashboard/mocks-exams')}
                  sx={{
                    justifyContent: 'flex-start',
                    textTransform: 'none',
                    fontWeight: 600,
                    color: 'text.primary',
                    '&:hover': { bgcolor: alpha(PAGE_PRIMARY, 0.08) },
                  }}
                >
                  Mocks Exams
                </Button>
                <Button
                  fullWidth
                  startIcon={<AutoStoriesRoundedIcon />}
                  onClick={() => navigate('/user-dashboard/scenarios')}
                  sx={{
                    justifyContent: 'flex-start',
                    textTransform: 'none',
                    fontWeight: 600,
                    color: 'text.primary',
                    '&:hover': { bgcolor: alpha(PAGE_PRIMARY, 0.08) },
                  }}
                >
                  Scenarios
                </Button>
              </Box>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: '7px',
                border: '2px solid',
                borderColor: alpha(PAGE_PRIMARY, 0.2),
                bgcolor: alpha(PAGE_PRIMARY, 0.04),
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <GavelRoundedIcon sx={{ color: PAGE_PRIMARY, fontSize: 22 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  Community guidelines
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.5 }}>
                Announcements here cover new content and updates for Scenarios and Mock exams only.
              </Typography>
              <Button
                variant="outlined"
                size="small"
                fullWidth
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: '7px',
                  borderColor: alpha(PAGE_PRIMARY, 0.5),
                  color: PAGE_PRIMARY,
                  '&:hover': { borderColor: PAGE_PRIMARY, bgcolor: alpha(PAGE_PRIMARY, 0.08) },
                }}
              >
                Read full guidelines
              </Button>
            </Paper>
          </Box>
        </Box>
      </Box>
    </UserDashboardLayout>
  )
}
