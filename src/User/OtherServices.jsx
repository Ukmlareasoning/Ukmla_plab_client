import { alpha } from '@mui/material/styles'
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Grid,
  Paper,
  useTheme,
} from '@mui/material'
import PsychologyIcon from '@mui/icons-material/Psychology'
import AssignmentIcon from '@mui/icons-material/Assignment'
import TimelineIcon from '@mui/icons-material/Timeline'
import GavelIcon from '@mui/icons-material/Gavel'
import BarChartIcon from '@mui/icons-material/BarChart'
import GroupsIcon from '@mui/icons-material/Groups'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import WidgetsIcon from '@mui/icons-material/Widgets'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import StarIcon from '@mui/icons-material/Star'
import Header from '../components/Header'
import Footer from '../components/Footer'

const HERO_IMAGE_URL = 'https://images.pexels.com/photos/6129507/pexels-photo-6129507.jpeg?auto=compress&cs=tinysrgb&w=1200'

const keyframes = {
  '@keyframes fadeInUp': {
    '0%': { opacity: 0, transform: 'translateY(28px)' },
    '100%': { opacity: 1, transform: 'translateY(0)' },
  },
}

const services = [
  {
    icon: <PsychologyIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    title: 'AI Reasoning Practice',
    description: 'Daily examiner-style sessions with instant feedback. Strengthen clinical reasoning and avoid common traps.',
    tag: 'Core',
    cta: 'Start practice',
  },
  {
    icon: <AssignmentIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    title: 'Mock Exams & Timed Practice',
    description: 'Full-length UKMLA and PLAB 1 format mocks with detailed breakdowns. Build exam-day confidence.',
    tag: 'Premium',
    cta: 'View mocks',
  },
  {
    icon: <TimelineIcon sx={{ fontSize: 40, color: 'success.main' }} />,
    title: 'Personalised Study Plans',
    description: 'Adaptive roadmaps based on your weak areas and exam date. Focus your time where it matters.',
    tag: 'Included',
    cta: 'Get plan',
  },
  {
    icon: <GavelIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    title: 'Ethics & GMC Workshops',
    description: 'Live and on-demand sessions on consent, capacity, confidentiality, and Good Medical Practice.',
    tag: 'UK-focused',
    cta: 'Browse workshops',
  },
  {
    icon: <BarChartIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    title: 'Question Bank & Analytics',
    description: 'Track progress by topic and reasoning type. See where you improve and where to focus next.',
    tag: 'Analytics',
    cta: 'View dashboard',
  },
  {
    icon: <GroupsIcon sx={{ fontSize: 40, color: 'success.main' }} />,
    title: 'Institutional & Group Licensing',
    description: 'For medical schools and training programmes. Bulk access, reporting, and tailored content.',
    tag: 'Enterprise',
    cta: 'Contact us',
  },
]

function OtherServices() {
  const theme = useTheme()

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
        {/* Hero — same pattern as Courses, Pricing */}
        <Box
          component="section"
          aria-label="Services Hero"
          sx={{
            ...keyframes,
            width: '100%',
            minHeight: { xs: 300, md: 340 },
            py: { xs: 3, md: 4 },
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            backgroundImage: `url(${HERO_IMAGE_URL})`,
            backgroundSize: 'cover',
            backgroundPosition: 'right center',
            backgroundRepeat: 'no-repeat',
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(to right, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.paper, 0.5)} 50%, ${alpha(theme.palette.background.paper, 0.15)} 100%)`,
              zIndex: 1,
            },
          }}
        >
          <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
            <Grid container>
              <Grid item xs={12} md={8} lg={7}>
                <Paper
                  elevation={8}
                  sx={{
                    p: { xs: 2.5, sm: 3, md: 3.5 },
                    borderRadius: 3,
                    bgcolor: alpha(theme.palette.background.paper, 0.96),
                    backdropFilter: 'blur(14px)',
                    WebkitBackdropFilter: 'blur(14px)',
                    border: '1px solid',
                    borderColor: alpha(theme.palette.primary.main, 0.12),
                    boxShadow: `0 20px 60px rgba(15, 23, 42, 0.15), 0 0 0 1px ${alpha(theme.palette.primary.main, 0.06)}`,
                    animation: 'fadeInUp 0.7s ease-out forwards',
                    opacity: 0,
                    animationFillMode: 'forwards',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                      opacity: 0.5,
                    },
                  }}
                  style={{ animationDelay: '0.15s' }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <WidgetsIcon sx={{ color: 'primary.main', fontSize: 22 }} />
                    <Typography
                      variant="overline"
                      sx={{
                        color: 'primary.main',
                        fontWeight: 700,
                        letterSpacing: 1.2,
                        fontSize: '0.75rem',
                      }}
                    >
                      What we offer
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5, flexWrap: 'wrap' }}>
                    <Typography
                      component="h1"
                      variant="h1"
                      sx={{
                        fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem', lg: '2.75rem' },
                        color: 'text.primary',
                        fontWeight: 700,
                        lineHeight: 1.2,
                        letterSpacing: '-0.02em',
                      }}
                    >
                      Services
                    </Typography>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        border: '1px solid',
                        borderColor: alpha(theme.palette.primary.main, 0.2),
                      }}
                    >
                      <VerifiedUserIcon sx={{ color: 'primary.main', fontSize: 26 }} />
                    </Box>
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 2,
                      color: 'text.secondary',
                      lineHeight: 1.6,
                      fontSize: { xs: '0.9rem', md: '1rem' },
                    }}
                  >
                    From daily reasoning practice to mock exams and institutional licensing — everything you need for UKMLA and PLAB 1 success.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      icon={<PsychologyIcon sx={{ fontSize: 18 }} />}
                      label="Reasoning-first"
                      size="small"
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: 'primary.main',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        height: 28,
                        '& .MuiChip-icon': { color: 'primary.main' },
                      }}
                    />
                    <Chip
                      icon={<VerifiedUserIcon sx={{ fontSize: 18 }} />}
                      label="GMC-aligned"
                      size="small"
                      sx={{
                        bgcolor: alpha(theme.palette.success.main, 0.12),
                        color: 'success.main',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        height: 28,
                        '& .MuiChip-icon': { color: 'success.main' },
                      }}
                    />
                    <Chip
                      icon={<LocalHospitalIcon sx={{ fontSize: 18 }} />}
                      label="Patient-safe"
                      size="small"
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: 'primary.main',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        height: 28,
                        '& .MuiChip-icon': { color: 'primary.main' },
                      }}
                    />
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Services grid — theme-aligned, 2 per row */}
        <Box
          component="section"
          aria-labelledby="services-heading"
          sx={{
            py: { xs: 6, md: 8 },
            px: { xs: 2, sm: 3, md: 4 },
            background: `linear-gradient(180deg, ${theme.palette.background.default} 0%, ${alpha(theme.palette.primary.main, 0.02)} 50%, ${theme.palette.background.default} 100%)`,
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '1px',
              background: `linear-gradient(90deg, transparent 0%, ${alpha(theme.palette.primary.main, 0.25)} 50%, transparent 100%)`,
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
                  borderRadius: '50%',
                  mb: 2,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)}, ${alpha(theme.palette.primary.light, 0.08)})`,
                  border: '2px solid',
                  borderColor: alpha(theme.palette.primary.main, 0.25),
                  boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.2)}`,
                }}
              >
                <LightbulbIcon sx={{ fontSize: 32, color: 'primary.main' }} />
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
                  background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.main} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                What we offer
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.75, mb: 2 }}>
                <StarIcon sx={{ fontSize: 18, color: 'primary.main', opacity: 0.9 }} />
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.9375rem' }}>
                  Tools and support aligned with UK exam standards
                </Typography>
              </Box>
              <Box
                sx={{
                  width: 64,
                  height: 5,
                  borderRadius: 2.5,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                  mx: 'auto',
                  boxShadow: `0 2px 12px ${alpha(theme.palette.primary.main, 0.35)}`,
                }}
              />
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                gap: { xs: 3, sm: 4 },
              }}
            >
              {services.map((service, index) => (
                <Box key={service.title}>
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
                      borderRadius: 3,
                      bgcolor: 'background.paper',
                      boxShadow: '0 4px 24px rgba(15, 23, 42, 0.08)',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: 4,
                        background: `linear-gradient(180deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
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
                        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                        opacity: 0,
                        transition: 'opacity 0.35s',
                      },
                      '&:hover': {
                        borderColor: alpha(theme.palette.primary.main, 0.4),
                        boxShadow: `0 16px 40px ${alpha(theme.palette.primary.main, 0.14)}, 0 0 0 1px ${alpha(theme.palette.primary.main, 0.08)}`,
                        transform: 'translateY(-6px)',
                        '&::before': { opacity: 1 },
                        '&::after': { opacity: 1 },
                        '& .service-card-icon-wrap': {
                          transform: 'scale(1.08)',
                          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.18)}, ${alpha(theme.palette.primary.light, 0.1)})`,
                          borderColor: alpha(theme.palette.primary.main, 0.35),
                          boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.2)}`,
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
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 2,
                          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.12)}, ${alpha(theme.palette.primary.light, 0.06)})`,
                          border: '2px solid',
                          borderColor: alpha(theme.palette.primary.main, 0.2),
                          transition: 'all 0.35s ease',
                        }}
                      >
                        {service.icon}
                      </Box>
                      <Chip
                        icon={<StarIcon sx={{ fontSize: 14 }} />}
                        label={service.tag}
                        size="small"
                        sx={{
                          alignSelf: 'flex-start',
                          mb: 1.5,
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          height: 26,
                          borderRadius: 1.5,
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: 'primary.main',
                          border: '1px solid',
                          borderColor: alpha(theme.palette.primary.main, 0.25),
                          '& .MuiChip-icon': { color: 'primary.main' },
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
                        variant="outlined"
                        color="primary"
                        size="medium"
                        endIcon={<ArrowForwardIcon sx={{ fontSize: 20, color: 'primary.main' }} />}
                        sx={{
                          alignSelf: 'flex-start',
                          fontWeight: 700,
                          fontSize: '0.9375rem',
                          textTransform: 'none',
                          borderWidth: 2,
                          py: 1,
                          px: 2,
                          borderRadius: 2,
                          boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.12)}`,
                          '&:hover': {
                            borderWidth: 2,
                            bgcolor: alpha(theme.palette.primary.main, 0.08),
                            boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.2)}`,
                          },
                        }}
                      >
                        {service.cta}
                      </Button>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Box>
          </Container>
        </Box>
      </Box>

      <Footer />
    </Box>
  )
}

export default OtherServices
