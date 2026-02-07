import { useEffect } from 'react'
import { alpha } from '@mui/material/styles'
import {
  Box,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  Paper,
  Container,
  Chip,
  Divider,
  useTheme,
} from '@mui/material'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import PsychologyIcon from '@mui/icons-material/Psychology'
import SchoolIcon from '@mui/icons-material/School'
import AutoGraphIcon from '@mui/icons-material/AutoGraph'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import GroupsIcon from '@mui/icons-material/Groups'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import ScienceIcon from '@mui/icons-material/Science'
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import heroImage from '../assets/hero.jpg'

const keyframes = {
  '@keyframes fadeInUp': {
    '0%': { opacity: 0, transform: 'translateY(28px)' },
    '100%': { opacity: 1, transform: 'translateY(0)' },
  },
  '@keyframes fadeIn': {
    '0%': { opacity: 0 },
    '100%': { opacity: 1 },
  },
  '@keyframes scaleIn': {
    '0%': { opacity: 0, transform: 'scale(0.92)' },
    '100%': { opacity: 1, transform: 'scale(1)' },
  },
  '@keyframes shimmer': {
    '0%': { backgroundPosition: '-200% 0' },
    '100%': { backgroundPosition: '200% 0' },
  },
  '@keyframes float': {
    '0%, 100%': { transform: 'translateY(0)' },
    '50%': { transform: 'translateY(-8px)' },
  },
  '@keyframes glowPulse': {
    '0%, 100%': { boxShadow: '0 0 20px rgba(13, 148, 136, 0.2)' },
    '50%': { boxShadow: '0 0 32px rgba(13, 148, 136, 0.35)' },
  },
}

const values = [
  {
    icon: <PsychologyIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    title: 'Clinical Reasoning First',
    description: 'We build tools that train the way UK examiners think — step-by-step, evidence-based, and patient-safe.',
  },
  {
    icon: <ScienceIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    title: 'Evidence-Based Learning',
    description: 'Every scenario and feedback is aligned with guidelines, GMC standards, and real exam patterns.',
  },
  {
    icon: <EmojiObjectsIcon sx={{ fontSize: 40, color: 'success.main' }} />,
    title: 'AI That Teaches, Not Just Tests',
    description: 'Our AI explains examiner intent, common traps, and reasoning patterns so you learn to think, not just remember.',
  },
  {
    icon: <GroupsIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    title: 'Built for Tomorrow’s Doctors',
    description: 'We support UKMLA and PLAB 1 candidates with adaptive, personalized preparation for high-stakes exams.',
  },
]

const stats = [
  { value: '10K+', label: 'Sessions Delivered' },
  { value: '98%', label: 'Satisfaction' },
  { value: '24/7', label: 'AI Tutor Access' },
  { value: 'GMC', label: 'Aligned Content' },
]

function AboutUs() {
  const theme = useTheme()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
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
        {/* Hero */}
        <Box
          component="section"
          aria-label="About Us Hero"
          sx={{
            ...keyframes,
            width: '100%',
            minHeight: { xs: 320, md: 360 },
            py: { xs: 3, md: 4 },
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'right center',
            backgroundRepeat: 'no-repeat',
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(to right, ${alpha(theme.palette.background.paper, 0.1)} 0%, ${alpha(theme.palette.background.paper, 0.05)} 45%, transparent 100%)`,
              zIndex: 1,
            },
          }}
        >
          <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
            <Grid container>
              <Grid item xs={12} md={8} lg={7}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 2.5, md: 3.5 },
                    borderRadius: 3,
                    bgcolor: alpha(theme.palette.background.paper, 0.15),
                    backdropFilter: 'blur(30px) saturate(200%)',
                    WebkitBackdropFilter: 'blur(30px) saturate(200%)',
                    border: '1px solid',
                    borderColor: alpha(theme.palette.primary.main, 0.25),
                    boxShadow: '0 8px 32px rgba(15, 23, 42, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
                    animation: 'fadeInUp 0.7s ease-out forwards',
                    opacity: 0,
                    animationFillMode: 'forwards',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      inset: 0,
                      borderRadius: 3,
                      background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.1)} 0%, transparent 100%)`,
                      pointerEvents: 'none',
                      zIndex: 0,
                    },
                  }}
                  style={{ animationDelay: '0.15s' }}
                >
                  <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <VerifiedUserIcon sx={{ color: 'text.primary', fontSize: 22 }} />
                    <Typography
                      variant="overline"
                      sx={{
                        color: 'text.primary',
                        fontWeight: 700,
                        letterSpacing: 1.2,
                        fontSize: '0.75rem',
                      }}
                    >
                      Who We Are
                    </Typography>
                  </Box>
                  <Typography
                    component="h1"
                    variant="h1"
                    sx={{
                      fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem', lg: '2.75rem' },
                      mb: 1.5,
                      color: 'text.primary',
                      fontWeight: 700,
                      lineHeight: 1.2,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    About Us
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 2,
                      color: 'text.primary',
                      lineHeight: 1.6,
                      fontSize: { xs: '0.9rem', md: '1rem' },
                    }}
                  >
                    We’re building the future of clinical reasoning preparation — AI-powered, examiner-aligned, and designed for UKMLA.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      icon={<AutoGraphIcon sx={{ fontSize: 18 }} />}
                      label="AI-Powered"
                      size="small"
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: 'text.primary',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        height: 28,
                        '& .MuiChip-icon': { color: 'text.primary' },
                      }}
                    />
                    <Chip
                      icon={<SchoolIcon sx={{ fontSize: 18 }} />}
                      label="Examiner-Aligned"
                      size="small"
                      sx={{
                        bgcolor: alpha(theme.palette.success.main, 0.1),
                        color: 'text.primary',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        height: 28,
                        '& .MuiChip-icon': { color: 'text.primary' },
                      }}
                    />
                    <Chip
                      icon={<LightbulbIcon sx={{ fontSize: 18 }} />}
                      label="Reasoning-First"
                      size="small"
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: 'text.primary',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        height: 28,
                        '& .MuiChip-icon': { color: 'text.primary' },
                      }}
                    />
                  </Box>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Mission & Vision */}
        <Box
          component="section"
          aria-labelledby="mission-vision-heading"
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
              background: `linear-gradient(90deg, transparent 0%, ${alpha(theme.palette.primary.main, 0.2)} 50%, transparent 100%)`,
            },
          }}
        >
          <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
            <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 5 }, maxWidth: 560, mx: 'auto' }}>
              <Typography
                id="mission-vision-heading"
                component="h2"
                variant="h2"
                sx={{
                  mb: 1.5,
                  fontWeight: 700,
                  fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
                  background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.main} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Mission & Vision
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: { xs: '0.9375rem', md: '1rem' }, lineHeight: 1.55 }}>
                Why we exist and where we’re headed
              </Typography>
              <Divider sx={{ mt: 2, mx: 'auto', width: 60, borderWidth: 2, borderColor: 'primary.main' }} />
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: alpha(theme.palette.grey[300], 0.6),
                    bgcolor: 'background.paper',
                    boxShadow: '0 4px 24px rgba(15, 23, 42, 0.08)',
                    overflow: 'hidden',
                    animation: 'scaleIn 0.6s ease-out forwards',
                    opacity: 0,
                    animationFillMode: 'forwards',
                    transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                    },
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 40px rgba(13, 148, 136, 0.12)',
                      borderColor: alpha(theme.palette.primary.main, 0.3),
                    },
                  }}
                  style={{ animationDelay: '0.2s' }}
                >
                  <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                      }}
                    >
                      <LightbulbIcon sx={{ color: 'primary.main', fontSize: 30 }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 1.5, fontSize: '1.125rem' }}>
                      Our Mission
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.65 }}>
                      To empower every UKMLA and PLAB 1 candidate with AI-driven clinical reasoning training that mirrors how examiners think — so you pass with confidence and practise safely.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: alpha(theme.palette.grey[300], 0.6),
                    bgcolor: 'background.paper',
                    boxShadow: '0 4px 24px rgba(15, 23, 42, 0.08)',
                    overflow: 'hidden',
                    animation: 'scaleIn 0.6s ease-out forwards',
                    opacity: 0,
                    animationFillMode: 'forwards',
                    transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      background: `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.success.light})`,
                    },
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 40px rgba(16, 185, 129, 0.12)',
                      borderColor: alpha(theme.palette.success.main, 0.3),
                    },
                  }}
                  style={{ animationDelay: '0.35s' }}
                >
                  <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.success.main, 0.08),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                      }}
                    >
                      <TrendingUpIcon sx={{ color: 'success.main', fontSize: 30 }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 1.5, fontSize: '1.125rem' }}>
                      Our Vision
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.65 }}>
                      A world where every doctor-in-training has access to examiner-quality feedback and adaptive reasoning practice — so standards stay high and patients stay safe.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Core Values */}
        <Box
          component="section"
          aria-labelledby="values-heading"
          sx={{
            ...keyframes,
            py: { xs: 7, md: 10 },
            background: `linear-gradient(180deg, ${theme.palette.background.default} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '1px',
              background: `linear-gradient(90deg, transparent 0%, ${alpha(theme.palette.primary.main, 0.2)} 50%, transparent 100%)`,
            },
          }}
        >
          <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
            <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 }, maxWidth: 600, mx: 'auto' }}>
              <Typography
                id="values-heading"
                component="h2"
                variant="h2"
                sx={{
                  mb: 1.5,
                  fontWeight: 700,
                  fontSize: { xs: '1.875rem', sm: '2.25rem', md: '2.5rem' },
                  background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.main} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                What We Stand For
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: { xs: '0.9375rem', md: '1.05rem' }, lineHeight: 1.55 }}>
                Values that guide every feature we build
              </Typography>
              <Box sx={{ width: 60, height: 4, borderRadius: 2, background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`, mx: 'auto', mt: 2 }} />
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                gap: { xs: 2, sm: 3, md: 3.5 },
              }}
            >
              {values.map((item, index) => (
                <Card
                  key={index}
                  elevation={0}
                  sx={{
                    ...keyframes,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: alpha(theme.palette.grey[300], 0.5),
                    bgcolor: 'background.paper',
                    boxShadow: '0 2px 12px rgba(15, 23, 42, 0.06)',
                    animation: `fadeInUp 0.5s ease-out forwards`,
                    opacity: 0,
                    animationFillMode: 'forwards',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 3,
                      background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                      opacity: 0,
                      transition: 'opacity 0.3s',
                    },
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      boxShadow: '0 12px 32px rgba(13, 148, 136, 0.12)',
                      transform: 'translateY(-6px)',
                      '&::before': { opacity: 1 },
                      '& .value-icon-box': { transform: 'scale(1.08)' },
                    },
                  }}
                  style={{ animationDelay: `${0.15 + index * 0.1}s` }}
                >
                  <CardContent sx={{ p: { xs: 2, md: 3 }, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box
                      className="value-icon-box"
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        bgcolor: alpha(theme.palette.primary.main, 0.06),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                        transition: 'transform 0.3s ease',
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 1, fontSize: '1rem' }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6, flex: 1 }}>
                      {item.description}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Container>
        </Box>

        {/* Stats */}
        <Box
          component="section"
          aria-label="Stats"
          sx={{
            ...keyframes,
            py: { xs: 5, md: 7 },
            bgcolor: 'grey.50',
            position: 'relative',
          }}
        >
          <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 3,
                maxWidth: 800,
                mx: 'auto',
              }}
            >
              {stats.map((stat, index) => (
                <Paper
                  key={index}
                  elevation={0}
                  sx={{
                    ...keyframes,
                    p: 3,
                    borderRadius: 3,
                    textAlign: 'center',
                    border: '1px solid',
                    borderColor: alpha(theme.palette.primary.main, 0.15),
                    bgcolor: alpha(theme.palette.background.paper, 0.8),
                    backdropFilter: 'blur(8px)',
                    animation: 'scaleIn 0.5s ease-out forwards',
                    opacity: 0,
                    animationFillMode: 'forwards',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: alpha(theme.palette.primary.main, 0.35),
                      boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.1)}`,
                      transform: 'scale(1.02)',
                    },
                  }}
                  style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 800,
                      color: 'primary.main',
                      fontSize: { xs: '2rem', sm: '2.5rem' },
                      lineHeight: 1.2,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, mt: 0.5, fontSize: '0.875rem' }}>
                    {stat.label}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Container>
        </Box>

        {/* CTA */}
        <Box
          component="section"
          aria-label="Call to action"
          sx={{
            ...keyframes,
            py: { xs: 6, md: 8 },
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.06)} 0%, ${alpha(theme.palette.success.main, 0.04)} 100%)`,
            borderTop: '1px solid',
            borderColor: alpha(theme.palette.primary.main, 0.1),
          }}
        >
          <Container maxWidth="md" sx={{ textAlign: 'center', px: { xs: 2, sm: 3 } }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 3,
                border: '1px solid',
                borderColor: alpha(theme.palette.primary.main, 0.15),
                bgcolor: alpha(theme.palette.background.paper, 0.9),
                backdropFilter: 'blur(10px)',
                animation: 'fadeInUp 0.6s ease-out forwards',
                opacity: 0,
                animationFillMode: 'forwards',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  boxShadow: '0 16px 48px rgba(13, 148, 136, 0.12)',
                },
              }}
              style={{ animationDelay: '0.1s' }}
            >
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', mb: 1.5, fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
                Ready to train like an examiner?
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2.5, maxWidth: 420, mx: 'auto' }}>
                Join thousands of candidates using our AI tutor to build clinical reasoning and ethics skills for UKMLA & PLAB 1.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                component={Link}
                to="/"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  px: 3,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 700,
                  borderRadius: 2,
                  textTransform: 'none',
                  boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.35)}`,
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                  },
                }}
              >
                Start Free Trial
              </Button>
            </Paper>
          </Container>
        </Box>
      </Box>

      <Footer />
    </Box>
  )
}

export default AboutUs
