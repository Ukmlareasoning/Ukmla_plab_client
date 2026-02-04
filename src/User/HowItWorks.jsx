import { alpha } from '@mui/material/styles'
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Paper,
  Grid,
  Chip,
  useTheme,
} from '@mui/material'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import AssessmentIcon from '@mui/icons-material/Assessment'
import PsychologyIcon from '@mui/icons-material/Psychology'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TimelineIcon from '@mui/icons-material/Timeline'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import Header from '../components/Header'
import Footer from '../components/Footer'

const HERO_IMAGE_URL = 'https://images.pexels.com/photos/6129507/pexels-photo-6129507.jpeg?auto=compress&cs=tinysrgb&w=1200'

const keyframes = {
  '@keyframes fadeInUp': {
    '0%': { opacity: 0, transform: 'translateY(28px)' },
    '100%': { opacity: 1, transform: 'translateY(0)' },
  },
}

const steps = [
  { label: 'Select Exam & Time to Exam', description: 'Choose UKMLA or PLAB 1 and set your exam date to personalize your study timeline.' },
  { label: 'Assess Confidence & Weak Areas', description: 'Complete an initial assessment to identify knowledge gaps and confidence levels across topics.' },
  { label: 'Daily Focused Reasoning Sessions', description: 'Engage in AI-curated study sessions targeting your specific weak areas with clinical reasoning challenges.' },
  { label: 'Examiner-Style Challenge & Feedback', description: 'Receive detailed explanations revealing examiner intent, common traps, and reasoning patterns.' },
  { label: 'Adaptive Learning & Progress Tracking', description: 'Monitor your improvement with analytics showing reasoning strengths and areas needing targeted work.' },
]

const stepIcons = [
  <CalendarMonthIcon sx={{ fontSize: 28, color: 'inherit' }} />,
  <AssessmentIcon sx={{ fontSize: 28, color: 'inherit' }} />,
  <PsychologyIcon sx={{ fontSize: 28, color: 'inherit' }} />,
  <LightbulbIcon sx={{ fontSize: 28, color: 'inherit' }} />,
  <TrendingUpIcon sx={{ fontSize: 28, color: 'inherit' }} />,
]

function HowItWorks() {
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
        {/* Hero — same pattern as Courses, OtherServices */}
        <Box
          component="section"
          aria-label="How It Works Hero"
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
                    <TimelineIcon sx={{ color: 'primary.main', fontSize: 22 }} />
                    <Typography
                      variant="overline"
                      sx={{
                        color: 'primary.main',
                        fontWeight: 700,
                        letterSpacing: 1.2,
                        fontSize: '0.75rem',
                      }}
                    >
                      Your journey
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
                      How It Works
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
                      <PsychologyIcon sx={{ color: 'primary.main', fontSize: 26 }} />
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
                    A structured, reassuring approach to mastering clinical reasoning — from setting your exam date to tracking your progress.
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

        {/* How The AI Tutor Works — timeline (from Home) */}
        <Box
          component="section"
          aria-labelledby="how-it-works-heading"
          sx={{
            py: { xs: 7, md: 10 },
            background: `linear-gradient(180deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.03)} 50%, ${theme.palette.background.paper} 100%)`,
            width: '100%',
            overflowX: 'hidden',
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
          <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
            <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 7 }, maxWidth: 560, mx: 'auto' }}>
              <Typography
                id="how-it-works-heading"
                component="h2"
                variant="h2"
                sx={{
                  mb: 1.5,
                  fontWeight: 700,
                  fontSize: { xs: '1.35rem', sm: '2rem', md: '2.5rem' },
                  lineHeight: 1.2,
                  letterSpacing: '-0.02em',
                  background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.main} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                How The AI Tutor Works
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  fontSize: { xs: '0.9375rem', md: '1.05rem' },
                  lineHeight: 1.55,
                  mb: 2,
                }}
              >
                A structured, reassuring approach to mastering clinical reasoning
              </Typography>
              <Box
                sx={{
                  width: 60,
                  height: 4,
                  borderRadius: 2,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                  mx: 'auto',
                }}
              />
            </Box>

            {/* Timeline with step cards — 1 per row on mobile, vertical timeline on sm+ */}
            <Box
              sx={{
                position: 'relative',
                pl: { xs: 0, sm: 5 },
                display: 'block',
                '&::before': {
                  content: '""',
                  display: { xs: 'none', sm: 'block' },
                  position: 'absolute',
                  left: 19,
                  top: 24,
                  bottom: 24,
                  width: 2,
                  borderRadius: 1,
                  background: `linear-gradient(180deg, ${theme.palette.primary.main}, ${theme.palette.primary.light}, ${alpha(theme.palette.primary.main, 0.4)})`,
                },
              }}
            >
              {steps.map((step, index) => (
                <Box
                  key={step.label}
                  sx={{
                    position: 'relative',
                    mb: { xs: 3, sm: 4 },
                    '&:last-of-type': { mb: 0 },
                  }}
                >
                  <Box
                    sx={{
                      position: { xs: 'relative', sm: 'absolute' },
                      left: { sm: 0 },
                      top: { xs: 0, sm: 20 },
                      transform: { sm: 'translateX(-50%)' },
                      width: { xs: 40, sm: 40 },
                      height: { xs: 40, sm: 40 },
                      borderRadius: '50%',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                      color: theme.palette.primary.contrastText,
                      fontWeight: 700,
                      fontSize: { xs: '1rem', sm: '1rem' },
                      boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}`,
                      zIndex: 1,
                      mb: { xs: 1.5, sm: 0 },
                    }}
                  >
                    {index + 1}
                  </Box>

                  <Card
                    elevation={0}
                    sx={{
                      ml: { xs: 0, sm: 4 },
                      border: '1px solid',
                      borderColor: alpha(theme.palette.grey[300], 0.6),
                      borderRadius: { xs: 3, sm: 3 },
                      bgcolor: 'background.paper',
                      boxShadow: { xs: '0 4px 20px rgba(15, 23, 42, 0.08)', sm: '0 2px 16px rgba(15, 23, 42, 0.06)' },
                      overflow: 'hidden',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: 4,
                        background: `linear-gradient(180deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                        opacity: 0,
                        transition: 'opacity 0.3s',
                      },
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                        boxShadow: '0 12px 32px rgba(13, 148, 136, 0.12)',
                        transform: 'translateX(4px)',
                        '&::before': { opacity: 1 },
                        '& .step-icon-wrap': {
                          transform: 'scale(1.08)',
                          bgcolor: alpha(theme.palette.primary.main, 0.12),
                        },
                      },
                    }}
                  >
                    <CardContent
                      sx={{
                        p: { xs: 3, md: 4 },
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        alignItems: { xs: 'flex-start', md: 'flex-start' },
                        gap: { xs: 2, md: 2 },
                      }}
                    >
                      <Box
                        className="step-icon-wrap"
                        sx={{
                          width: { xs: 52, md: 56 },
                          height: { xs: 52, md: 56 },
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          bgcolor: alpha(theme.palette.primary.main, 0.08),
                          color: theme.palette.primary.main,
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {stepIcons[index]}
                      </Box>

                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            mb: 1,
                            fontSize: { xs: '1.0625rem', md: '1.2rem' },
                            lineHeight: 1.3,
                            color: 'text.primary',
                          }}
                        >
                          {step.label}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            color: 'text.secondary',
                            lineHeight: 1.6,
                            fontSize: { xs: '0.9375rem', md: '1rem' },
                          }}
                        >
                          {step.description}
                        </Typography>
                      </Box>
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

export default HowItWorks
