import { useEffect, useState } from 'react'
import { alpha } from '@mui/material/styles'
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  useTheme,
  Paper,
  Skeleton,
} from '@mui/material'
import PsychologyIcon from '@mui/icons-material/Psychology'
import AssignmentIcon from '@mui/icons-material/Assignment'
import TimelineIcon from '@mui/icons-material/Timeline'
import GavelIcon from '@mui/icons-material/Gavel'
import BarChartIcon from '@mui/icons-material/BarChart'
import GroupsIcon from '@mui/icons-material/Groups'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import StarIcon from '@mui/icons-material/Star'
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded'
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded'
import QuizRoundedIcon from '@mui/icons-material/QuizRounded'
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded'
import SupportRoundedIcon from '@mui/icons-material/SupportRounded'
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded'
import ScienceRoundedIcon from '@mui/icons-material/ScienceRounded'
import BiotechRoundedIcon from '@mui/icons-material/BiotechRounded'
import FitnessCenterRoundedIcon from '@mui/icons-material/FitnessCenterRounded'
import SelfImprovementRoundedIcon from '@mui/icons-material/SelfImprovementRounded'
import LibraryBooksRoundedIcon from '@mui/icons-material/LibraryBooksRounded'
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded'
import SpeedRoundedIcon from '@mui/icons-material/SpeedRounded'
import TouchAppRoundedIcon from '@mui/icons-material/TouchAppRounded'
import RecordVoiceOverRoundedIcon from '@mui/icons-material/RecordVoiceOverRounded'
import TranslateRoundedIcon from '@mui/icons-material/TranslateRounded'
import CodeRoundedIcon from '@mui/icons-material/CodeRounded'
import CalculateRoundedIcon from '@mui/icons-material/CalculateRounded'
import MedicalServicesRoundedIcon from '@mui/icons-material/MedicalServicesRounded'
import VaccinesRoundedIcon from '@mui/icons-material/VaccinesRounded'
import MonitorHeartRoundedIcon from '@mui/icons-material/MonitorHeartRounded'
import PrecisionManufacturingRoundedIcon from '@mui/icons-material/PrecisionManufacturingRounded'
import PsychologyAltRoundedIcon from '@mui/icons-material/PsychologyAltRounded'
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded'
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded'
import DashboardCustomizeRoundedIcon from '@mui/icons-material/DashboardCustomizeRounded'
import ExtensionRoundedIcon from '@mui/icons-material/ExtensionRounded'
import Header from '../components/Header'
import Footer from '../components/Footer'
import heroImg from '../assets/hero-img.png'
import apiClient from '../server'

const PAGE_PRIMARY = '#384D84'
const HERO_BG = '#1e3a5f'
const PAGE_PRIMARY_DARK = '#2a3a64'
const PAGE_PRIMARY_LIGHT = '#4a5f9a'

const keyframes = {
  '@keyframes fadeInUp': {
    '0%': { opacity: 0, transform: 'translateY(28px)' },
    '100%': { opacity: 1, transform: 'translateY(0)' },
  },
}

const SERVICE_ICONS = {
  psychology: PsychologyIcon,
  psychologyAlt: PsychologyAltRoundedIcon,
  assignment: AssignmentIcon,
  timeline: TimelineIcon,
  gavel: GavelIcon,
  barChart: BarChartIcon,
  analytics: AnalyticsRoundedIcon,
  groups: GroupsIcon,
  localHospital: LocalHospitalIcon,
  medicalServices: MedicalServicesRoundedIcon,
  vaccines: VaccinesRoundedIcon,
  monitorHeart: MonitorHeartRoundedIcon,
  school: SchoolRoundedIcon,
  menuBook: MenuBookRoundedIcon,
  libraryBooks: LibraryBooksRoundedIcon,
  quiz: QuizRoundedIcon,
  support: SupportRoundedIcon,
  campaign: CampaignRoundedIcon,
  science: ScienceRoundedIcon,
  biotech: BiotechRoundedIcon,
  fitnessCenter: FitnessCenterRoundedIcon,
  selfImprovement: SelfImprovementRoundedIcon,
  star: StarIcon,
  emojiEvents: EmojiEventsRoundedIcon,
  speed: SpeedRoundedIcon,
  touchApp: TouchAppRoundedIcon,
  recordVoiceOver: RecordVoiceOverRoundedIcon,
  translate: TranslateRoundedIcon,
  code: CodeRoundedIcon,
  calculate: CalculateRoundedIcon,
  lightbulb: LightbulbIcon,
  precisionManufacturing: PrecisionManufacturingRoundedIcon,
  autoAwesome: AutoAwesomeRoundedIcon,
  workspacePremium: WorkspacePremiumRoundedIcon,
  category: CategoryRoundedIcon,
  dashboardCustomize: DashboardCustomizeRoundedIcon,
  extension: ExtensionRoundedIcon,
}

function OtherServices() {
  const theme = useTheme()
  const [services, setServices] = useState([])
  const [listLoading, setListLoading] = useState(false)
  const [listError, setListError] = useState('')

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [])

  useEffect(() => {
    let cancelled = false
    setListLoading(true)
    setListError('')
    const params = new URLSearchParams()
    params.set('page', '1')
    params.set('per_page', '100')
    apiClient(`/services?${params.toString()}`, 'GET')
      .then(({ ok, data }) => {
        if (cancelled) return
        if (!ok || !data?.success) {
          setListError(data?.message || 'Unable to load services.')
          return
        }
        const list = data.data?.services || []
        const active = list.filter((s) => s.status === 'Active' && !s.is_deleted)
        setServices(active)
      })
      .catch(() => {
        if (!cancelled) setListError('Unable to reach server. Please try again.')
      })
      .finally(() => {
        if (!cancelled) setListLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        overflowX: 'hidden',
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header />

      <Box sx={{ flex: 1, width: '100%', maxWidth: 1400, mx: 'auto' }}>
        {/* Hero section — same style as Help Center: dark blue bg, title, subtitle, badges, hero-img.png */}
        <Box
          component="section"
          aria-label="Services Hero"
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
              Services
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
              From daily reasoning practice to mock exams and institutional licensing — everything you need for UKMLA.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                icon={<PsychologyIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.9)' }} />}
                label="Reasoning-first"
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
                icon={<VerifiedUserIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.9)' }} />}
                label="GMC-aligned"
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
                icon={<LocalHospitalIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.9)' }} />}
                label="Patient-safe"
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

        {/* Services grid — theme-aligned, 2 per row */}
        <Box
          component="section"
          aria-labelledby="services-heading"
          sx={{
            py: { xs: 6, md: 8 },
            px: { xs: 2, sm: 3, md: 4 },
            background: `linear-gradient(180deg, ${theme.palette.background.default} 0%, ${alpha(PAGE_PRIMARY, 0.02)} 50%, ${theme.palette.background.default} 100%)`,
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '1px',
              background: `linear-gradient(90deg, transparent 0%, ${alpha(PAGE_PRIMARY, 0.25)} 50%, transparent 100%)`,
            },
          }}
        >
          <Container maxWidth="lg" sx={{ px: { xs: 0, sm: 2 } }}>
            <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 }, maxWidth: 600, mx: 'auto' }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 64,
                  height: 64,
                  borderRadius: '7px',
                  mb: 2,
                  background: `linear-gradient(135deg, ${alpha(PAGE_PRIMARY, 0.15)}, ${alpha(PAGE_PRIMARY_LIGHT, 0.08)})`,
                  border: '2px solid',
                  borderColor: alpha(PAGE_PRIMARY, 0.25),
                  boxShadow: `0 8px 24px ${alpha(PAGE_PRIMARY, 0.2)}`,
                }}
              >
                <LightbulbIcon sx={{ fontSize: 32, color: PAGE_PRIMARY }} />
              </Box>
              <Typography
                id="services-heading"
                component="h2"
                variant="h4"
                sx={{
                  mb: 1,
                  fontWeight: 700,
                  fontSize: { xs: '1.5rem', md: '2rem' },
                  letterSpacing: '-0.02em',
                  background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${PAGE_PRIMARY} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                What we offer
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.75, mb: 2 }}>
                <StarIcon sx={{ fontSize: 18, color: PAGE_PRIMARY, opacity: 0.9 }} />
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.9375rem' }}>
                  Tools and support aligned with UK exam standards
                </Typography>
              </Box>
              <Box
                sx={{
                  width: 64,
                  height: 5,
                  borderRadius: '7px',
                  background: `linear-gradient(90deg, ${PAGE_PRIMARY}, ${PAGE_PRIMARY_LIGHT})`,
                  mx: 'auto',
                  boxShadow: `0 2px 12px ${alpha(PAGE_PRIMARY, 0.35)}`,
                }}
              />
            </Box>

            {listError && (
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  mb: 3,
                  borderRadius: '7px',
                  border: '1px solid',
                  borderColor: theme.palette.error.main,
                  bgcolor: alpha(theme.palette.error.main, 0.08),
                }}
              >
                <Typography variant="body2" sx={{ color: 'error.main', fontWeight: 600 }}>
                  {listError}
                </Typography>
              </Paper>
            )}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                gap: { xs: 3, sm: 4 },
              }}
            >
              {listLoading
                ? Array.from({ length: 6 }).map((_, idx) => (
                    <Paper
                      key={idx}
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: '7px',
                        border: '1px solid',
                        borderColor: alpha(theme.palette.grey[300], 0.5),
                      }}
                    >
                      <Skeleton variant="rounded" width={64} height={64} sx={{ borderRadius: '7px', mb: 2 }} />
                      <Skeleton variant="rounded" width={80} height={26} sx={{ borderRadius: '7px', mb: 1.5 }} />
                      <Skeleton variant="text" width="90%" height={32} sx={{ mb: 1 }} />
                      <Skeleton variant="text" width="100%" height={60} sx={{ mb: 2 }} />
                      <Skeleton variant="rounded" width={140} height={42} sx={{ borderRadius: '7px' }} />
                    </Paper>
                  ))
                : services.map((service) => {
                    const IconComponent = SERVICE_ICONS[service.icon_key]
                    return (
                      <Box key={service.id}>
                        <Card
                          elevation={0}
                          sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative',
                            overflow: 'hidden',
                            transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                            border: '1px solid',
                            borderColor: alpha(theme.palette.grey[300], 0.6),
                            borderRadius: '7px',
                            bgcolor: 'background.paper',
                            boxShadow: '0 4px 24px rgba(15, 23, 42, 0.08)',
                            '&::before': {
                              content: '""',
                              position: 'absolute',
                              left: 0,
                              top: 0,
                              bottom: 0,
                              width: 4,
                              background: `linear-gradient(180deg, ${PAGE_PRIMARY}, ${PAGE_PRIMARY_LIGHT})`,
                              opacity: 0,
                              transition: 'opacity 0.35s',
                            },
                            '&::after': {
                              content: '""',
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              height: 3,
                              background: `linear-gradient(90deg, ${PAGE_PRIMARY}, ${PAGE_PRIMARY_LIGHT})`,
                              opacity: 0,
                              transition: 'opacity 0.35s',
                            },
                            '&:hover': {
                              borderColor: alpha(PAGE_PRIMARY, 0.4),
                              boxShadow: `0 16px 40px ${alpha(PAGE_PRIMARY, 0.14)}, 0 0 0 1px ${alpha(PAGE_PRIMARY, 0.08)}`,
                              transform: 'translateY(-6px)',
                              '&::before': { opacity: 1 },
                              '&::after': { opacity: 1 },
                              '& .service-card-icon-wrap': {
                                transform: 'scale(1.08)',
                                background: `linear-gradient(135deg, ${alpha(PAGE_PRIMARY, 0.18)}, ${alpha(PAGE_PRIMARY_LIGHT, 0.1)})`,
                                borderColor: alpha(PAGE_PRIMARY, 0.35),
                                boxShadow: `0 8px 20px ${alpha(PAGE_PRIMARY, 0.2)}`,
                              },
                            },
                          }}
                        >
                          <CardContent sx={{ p: { xs: 2.5, md: 3 }, flex: 1, display: 'flex', flexDirection: 'column', pl: { xs: 3, md: 3.5 } }}>
                            <Box
                              className="service-card-icon-wrap"
                              sx={{
                                width: 64,
                                height: 64,
                                borderRadius: '7px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mb: 2,
                                background: `linear-gradient(135deg, ${alpha(PAGE_PRIMARY, 0.12)}, ${alpha(PAGE_PRIMARY_LIGHT, 0.06)})`,
                                border: '2px solid',
                                borderColor: alpha(PAGE_PRIMARY, 0.2),
                                transition: 'all 0.35s ease',
                              }}
                            >
                              {IconComponent ? <IconComponent sx={{ fontSize: 40, color: PAGE_PRIMARY }} /> : <LightbulbIcon sx={{ fontSize: 40, color: PAGE_PRIMARY }} />}
                            </Box>
                            <Chip
                              icon={<StarIcon sx={{ fontSize: 14 }} />}
                              label={service.badge || 'Service'}
                              size="small"
                              sx={{
                                alignSelf: 'flex-start',
                                mb: 1.5,
                                fontWeight: 700,
                                fontSize: '0.75rem',
                                height: 26,
                                borderRadius: '7px',
                                bgcolor: alpha(PAGE_PRIMARY, 0.1),
                                color: PAGE_PRIMARY,
                                border: '1px solid',
                                borderColor: alpha(PAGE_PRIMARY, 0.25),
                                '& .MuiChip-icon': { color: PAGE_PRIMARY },
                              }}
                            />
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 700,
                                mb: 1,
                                fontSize: '1.2rem',
                                color: 'text.primary',
                                lineHeight: 1.35,
                                letterSpacing: '-0.01em',
                              }}
                            >
                              {service.title}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: 'text.secondary',
                                lineHeight: 1.65,
                                mb: 2,
                                flex: 1,
                                fontSize: '0.9375rem',
                              }}
                            >
                              {service.description}
                            </Typography>
                            <Button
                              disabled
                              variant="outlined"
                              size="medium"
                              endIcon={<ArrowForwardIcon sx={{ fontSize: 20 }} />}
                              sx={{
                                alignSelf: 'flex-start',
                                fontWeight: 700,
                                fontSize: '0.9375rem',
                                textTransform: 'none',
                                borderWidth: 2,
                                py: 1,
                                px: 2,
                                borderRadius: '7px',
                                borderColor: alpha(theme.palette.grey[400], 0.6),
                                color: 'text.secondary',
                                cursor: 'not-allowed',
                                '&.Mui-disabled': {
                                  borderColor: alpha(theme.palette.grey[400], 0.5),
                                  color: 'text.secondary',
                                  opacity: 0.8,
                                },
                              }}
                            >
                              Coming soon
                            </Button>
                          </CardContent>
                        </Card>
                      </Box>
                    )
                  })}
            </Box>
          </Container>
        </Box>
      </Box>

      <Footer />
    </Box>
  )
}

export default OtherServices
