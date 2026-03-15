import { useEffect, useState } from 'react'
import { alpha } from '@mui/material/styles'
import {
  Box,
  Typography,
  Paper,
  Container,
  Chip,
  Divider,
  Button,
  useTheme,
  Skeleton,
} from '@mui/material'
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer'
import ContactMailOutlinedIcon from '@mui/icons-material/ContactMailOutlined'
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined'
import PsychologyOutlinedIcon from '@mui/icons-material/PsychologyOutlined'
import ArticleRoundedIcon from '@mui/icons-material/ArticleRounded'
import PsychologyIcon from '@mui/icons-material/Psychology'
import AssignmentIcon from '@mui/icons-material/Assignment'
import TimelineIcon from '@mui/icons-material/Timeline'
import GavelIcon from '@mui/icons-material/Gavel'
import BarChartIcon from '@mui/icons-material/BarChart'
import GroupsIcon from '@mui/icons-material/Groups'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded'
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded'
import QuizRoundedIcon from '@mui/icons-material/QuizRounded'
import SupportRoundedIcon from '@mui/icons-material/SupportRounded'
import CookieRoundedIcon from '@mui/icons-material/CookieRounded'
import PolicyRoundedIcon from '@mui/icons-material/PolicyRounded'
import HelpCenterRoundedIcon from '@mui/icons-material/HelpCenterRounded'
import LiveHelpRoundedIcon from '@mui/icons-material/LiveHelpRounded'
import HandymanRoundedIcon from '@mui/icons-material/HandymanRounded'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import heroImg from '../assets/hero-img.png'
import apiClient from '../server'

// Page primary (#384D84 — no green, match HowItWorks)
const PAGE_PRIMARY = '#384D84'
const HERO_BG = '#1e3a5f'
const PAGE_PRIMARY_DARK = '#2a3a64'
const PAGE_PRIMARY_LIGHT = '#4a5f9a'

const keyframes = {
  '@keyframes fadeInUp': {
    '0%': { opacity: 0, transform: 'translateY(28px)' },
    '100%': { opacity: 1, transform: 'translateY(0)' },
  },
  '@keyframes scaleIn': {
    '0%': { opacity: 0, transform: 'scale(0.92)' },
    '100%': { opacity: 1, transform: 'scale(1)' },
  },
}

const PAGE_TYPE_FAQS = 'FAQs'

// Icons from static_pages table: each row's icon_key (e.g. "liveHelp" for FAQs) maps here
const STATIC_PAGE_ICONS = {
  psychology: PsychologyIcon,
  assignment: AssignmentIcon,
  timeline: TimelineIcon,
  gavel: GavelIcon,
  barChart: BarChartIcon,
  groups: GroupsIcon,
  localHospital: LocalHospitalIcon,
  school: SchoolRoundedIcon,
  menuBook: MenuBookRoundedIcon,
  quiz: QuizRoundedIcon,
  support: SupportRoundedIcon,
  cookie: CookieRoundedIcon,
  policy: PolicyRoundedIcon,
  helpCenter: HelpCenterRoundedIcon,
  liveHelp: LiveHelpRoundedIcon,
  handyman: HandymanRoundedIcon,
}

const defaultHeroTitle = 'FAQs'
const defaultHeroSubtitle = 'Quick answers to common questions about UKMLA Reasoning Tutor.'

function getSectionIcon(page) {
  const iconKey = page?.icon_key ?? page?.iconKey ?? null
  const IconComponent = STATIC_PAGE_ICONS[iconKey] || ArticleRoundedIcon
  return <IconComponent sx={{ fontSize: 28, color: PAGE_PRIMARY }} />
}

function FAQs() {
  const theme = useTheme()
  const [loading, setLoading] = useState(true)
  const [pages, setPages] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [])

  useEffect(() => {
    let cancelled = false
    async function fetchFAQs() {
      setLoading(true)
      setError('')
      const params = new URLSearchParams()
      params.set('apply_filters', '1')
      params.set('page_type', PAGE_TYPE_FAQS)
      params.set('active', '1')
      params.set('per_page', '50')
      try {
        const { ok, data } = await apiClient(`/static-pages?${params.toString()}`, 'GET')
        if (cancelled) return
        if (!ok || !data?.success) {
          const msg =
            data?.errors && typeof data.errors === 'object'
              ? Object.values(data.errors).flat().join(' ')
              : data?.message
          setError(msg || 'Unable to load content.')
          setPages([])
          return
        }
        const list = data.data?.static_pages || []
        setPages(list)
      } catch (e) {
        if (!cancelled) {
          setError('Unable to reach server. Please try again.')
          setPages([])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchFAQs()
    return () => { cancelled = true }
  }, [])

  return (
    <Box
      sx={{
        width: '100%',
        minWidth: '100%',
        maxWidth: '100vw',
        minHeight: '100vh',
        overflowX: 'hidden',
        bgcolor: 'background.default',
      }}
    >
      <Header />

      <Box sx={{ width: '100%', maxWidth: 1400, mx: 'auto' }}>
        {/* Hero section — same style as Privacy Policy: dark blue bg, title, subtitle, badges, hero-img.png */}
        <Box
          component="section"
          aria-label="Hero"
          sx={{
            width: '100%',
            minHeight: { xs: 420, sm: 460, md: 500 },
            py: { xs: 4, sm: 5, md: 6 },
            px: { xs: 2, sm: 3, md: 4 },
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: { xs: 4, md: 6 },
            bgcolor: HERO_BG,
            background: `linear-gradient(180deg, #243b55 0%, ${HERO_BG} 50%, #182d47 100%)`,
          }}
        >
          <Box
            sx={{
              flex: 1,
              width: { xs: '100%', md: 'auto' },
              maxWidth: { md: '55%' },
            }}
          >
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: '1.65rem', sm: '2.25rem', md: '2.5rem', lg: '2.75rem' },
                fontWeight: 700,
                color: '#ffffff',
                lineHeight: 1.3,
                letterSpacing: '-0.02em',
                mb: 2,
              }}
            >
              {pages.length > 0 ? pages[0].title : defaultHeroTitle}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '0.95rem', sm: '1.1rem' },
                fontWeight: 400,
                color: 'rgba(255,255,255,0.92)',
                lineHeight: 1.6,
                mb: 3,
              }}
            >
              {pages.length > 0 ? pages[0].description : defaultHeroSubtitle}
            </Typography>
            {error && (
              <Typography variant="body2" sx={{ color: 'rgba(255,200,200,0.95)', mb: 2 }}>
                {error}
              </Typography>
            )}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                icon={<SchoolOutlinedIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.9)' }} />}
                label="Platform"
                size="small"
                sx={{
                  borderRadius: '7px',
                  bgcolor: 'rgba(255,255,255,0.15)',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  height: 28,
                  border: '1px solid rgba(255,255,255,0.3)',
                  '& .MuiChip-icon': { color: 'rgba(255,255,255,0.9)' },
                }}
              />
              <Chip
                icon={<PsychologyOutlinedIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.9)' }} />}
                label="AI tutor"
                size="small"
                sx={{
                  borderRadius: '7px',
                  bgcolor: 'rgba(255,255,255,0.15)',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  height: 28,
                  border: '1px solid rgba(255,255,255,0.3)',
                  '& .MuiChip-icon': { color: 'rgba(255,255,255,0.9)' },
                }}
              />
              <Chip
                icon={<ContactMailOutlinedIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.9)' }} />}
                label="Support"
                size="small"
                sx={{
                  borderRadius: '7px',
                  bgcolor: 'rgba(255,255,255,0.15)',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  height: 28,
                  border: '1px solid rgba(255,255,255,0.3)',
                  '& .MuiChip-icon': { color: 'rgba(255,255,255,0.9)' },
                }}
              />
            </Box>
          </Box>
          <Box
            sx={{
              flex: 1,
              maxWidth: { xs: '100%', md: '45%' },
              display: 'flex',
              alignItems: 'center',
              justifyContent: { xs: 'center', md: 'flex-end' },
              minHeight: { xs: 260, md: 340 },
            }}
          >
            <Box
              component="img"
              src={heroImg}
              alt="UKMLA clinical reasoning interface"
              sx={{
                maxWidth: '100%',
                height: 'auto',
                maxHeight: { xs: 260, md: 360 },
                objectFit: 'contain',
                borderRadius: '7px',
              }}
            />
          </Box>
        </Box>

        {/* FAQ list */}
        <Box
          component="section"
          aria-labelledby="faqs-content-heading"
          sx={{
            ...keyframes,
            py: { xs: 6, md: 8 },
            bgcolor: 'grey.50',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '1px',
              background: `linear-gradient(90deg, transparent 0%, ${alpha(PAGE_PRIMARY, 0.2)} 50%, transparent 100%)`,
            },
          }}
        >
          <Container maxWidth="md" sx={{ px: { xs: 1.5, sm: 3, md: 4 } }}>
            <Box sx={{ textAlign: 'center', mb: { xs: 3, md: 5 } }}>
              <Typography
                id="faqs-content-heading"
                component="h2"
                variant="h2"
                sx={{
                  mb: 1.5,
                  fontWeight: 700,
                  fontSize: { xs: '1.35rem', sm: '1.75rem', md: '2rem' },
                  px: 1,
                  background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${PAGE_PRIMARY} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Frequently asked questions
              </Typography>
              <Divider sx={{ mt: 2, mx: 'auto', width: 60, borderWidth: 2, borderColor: PAGE_PRIMARY }} />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2.5, sm: 3 } }}>
              {loading
                ? Array.from({ length: 4 }).map((_, idx) => (
                    <Paper
                      key={`skeleton-${idx}`}
                      elevation={0}
                      sx={{
                        p: { xs: 2, sm: 2.5, md: 3 },
                        borderRadius: '7px',
                        border: '1px solid',
                        borderColor: alpha(theme.palette.grey[300], 0.6),
                        bgcolor: 'background.paper',
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: 'flex-start',
                        gap: 2,
                      }}
                    >
                      <Skeleton variant="rounded" width={52} height={52} sx={{ flexShrink: 0, borderRadius: '7px' }} />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Skeleton variant="text" width="60%" height={24} sx={{ mb: 1, borderRadius: '7px' }} />
                        <Skeleton variant="text" width="100%" height={20} sx={{ borderRadius: '7px' }} />
                        <Skeleton variant="text" width="90%" height={20} sx={{ borderRadius: '7px' }} />
                      </Box>
                    </Paper>
                  ))
                : pages.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 6 }}>
                      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                        No FAQs to show yet. Content will appear here once added in the admin.
                      </Typography>
                    </Box>
                  ) : (
                    pages.map((faq, index) => (
                      <Paper
                        key={faq.id ?? index}
                        elevation={0}
                        sx={{
                          ...keyframes,
                          p: { xs: 2, sm: 2.5, md: 3 },
                          borderRadius: '7px',
                          border: '1px solid',
                          borderColor: alpha(theme.palette.grey[300], 0.6),
                          bgcolor: 'background.paper',
                          boxShadow: '0 4px 24px rgba(15, 23, 42, 0.08)',
                          animation: 'scaleIn 0.5s ease-out forwards',
                          opacity: 0,
                          animationFillMode: 'forwards',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          flexDirection: { xs: 'column', sm: 'row' },
                          alignItems: { xs: 'stretch', sm: 'flex-start' },
                          gap: { xs: 2, sm: 2 },
                          textAlign: { xs: 'center', sm: 'left' },
                          '&:hover': {
                            borderColor: alpha(PAGE_PRIMARY, 0.25),
                            boxShadow: '0 8px 32px rgba(15, 23, 42, 0.1)',
                          },
                        }}
                        style={{ animationDelay: `${0.1 + index * 0.04}s` }}
                      >
                        <Box
                          sx={{
                            width: { xs: 48, sm: 52 },
                            height: { xs: 48, sm: 52 },
                            borderRadius: '7px',
                            bgcolor: alpha(PAGE_PRIMARY, 0.08),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            alignSelf: { xs: 'center', sm: 'flex-start' },
                          }}
                        >
                          {getSectionIcon(faq)}
                        </Box>
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 700,
                              color: PAGE_PRIMARY,
                              mb: { xs: 1, sm: 1.5 },
                              fontSize: { xs: '1rem', sm: '1.125rem' },
                            }}
                          >
                            {faq.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: 'text.secondary',
                              lineHeight: 1.75,
                              fontSize: { xs: '0.9375rem', sm: '0.875rem' },
                              wordBreak: 'break-word',
                              whiteSpace: 'pre-wrap',
                            }}
                          >
                            {faq.description}
                          </Typography>
                        </Box>
                      </Paper>
                    ))
                  )}
            </Box>

            <Box sx={{ textAlign: 'center', mt: { xs: 3, md: 4 }, px: { xs: 1, sm: 0 } }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, fontSize: { xs: '0.9375rem', sm: '0.875rem' } }}>
                Can’t find your answer?
              </Typography>
              <Button
                component={Link}
                to="/contact-us"
                variant="contained"
                size="medium"
                startIcon={<ContactMailOutlinedIcon />}
                sx={{
                  px: 3,
                  py: 1.25,
                  fontSize: '0.9375rem',
                  fontWeight: 700,
                  borderRadius: '7px',
                  textTransform: 'none',
                  bgcolor: PAGE_PRIMARY,
                  boxShadow: `0 4px 14px ${alpha(PAGE_PRIMARY, 0.35)}`,
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: PAGE_PRIMARY_DARK,
                    transform: 'translateY(-2px)',
                    boxShadow: `0 6px 20px ${alpha(PAGE_PRIMARY, 0.4)}`,
                  },
                }}
              >
                Contact us
              </Button>
            </Box>
          </Container>
        </Box>
      </Box>

      <Footer />
    </Box>
  )
}

export default FAQs
