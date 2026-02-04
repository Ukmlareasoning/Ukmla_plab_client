import { alpha } from '@mui/material/styles'
import {
  Box,
  Button,
  Grid,
  Typography,
  Paper,
  Container,
  Chip,
  Divider,
  useTheme,
} from '@mui/material'
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import SecurityIcon from '@mui/icons-material/Security'
import CookieIcon from '@mui/icons-material/Cookie'
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined'
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined'
import ContactMailOutlinedIcon from '@mui/icons-material/ContactMailOutlined'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

const HERO_IMAGE_URL = 'https://images.pexels.com/photos/6129507/pexels-photo-6129507.jpeg?auto=compress&cs=tinysrgb&w=1200'

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

const sections = [
  {
    icon: <ArticleOutlinedIcon sx={{ fontSize: 28, color: 'primary.main' }} />,
    title: 'Introduction',
    content: 'UKMLA Reasoning Tutor (“we”, “us”, “our”) is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your information when you use our platform for UKMLA and PLAB 1 preparation.',
  },
  {
    icon: <StorageOutlinedIcon sx={{ fontSize: 28, color: 'primary.main' }} />,
    title: 'Data we collect',
    content: 'We may collect: account and profile information (name, email, password); usage data (sessions, progress, answers); device and log data (IP, browser, timestamps); and communications you send to us (support, feedback).',
  },
  {
    icon: <SettingsOutlinedIcon sx={{ fontSize: 28, color: 'primary.main' }} />,
    title: 'How we use your data',
    content: 'We use your data to provide and improve our AI tutor service, personalize your study experience, send important updates, respond to support requests, analyse usage to improve content, and comply with legal obligations.',
  },
  {
    icon: <CookieIcon sx={{ fontSize: 28, color: 'primary.main' }} />,
    title: 'Cookies and similar technologies',
    content: 'We use cookies and similar technologies to keep you signed in, remember preferences, and understand how you use the platform. You can manage cookie settings in your browser.',
  },
  {
    icon: <GavelOutlinedIcon sx={{ fontSize: 28, color: 'success.main' }} />,
    title: 'Your rights',
    content: 'Depending on your location, you may have the right to access, correct, or delete your data; object to or restrict processing; and data portability. Contact us to exercise these rights. You may also have the right to lodge a complaint with a supervisory authority.',
  },
  {
    icon: <ContactMailOutlinedIcon sx={{ fontSize: 28, color: 'primary.main' }} />,
    title: 'Contact',
    content: 'For privacy-related questions or requests, contact us at support@ukmla-tutor.com or via the Contact Us page. We will respond within a reasonable time.',
  },
]

function PrivacyPolicy() {
  const theme = useTheme()

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
          aria-label="Privacy Policy Hero"
          sx={{
            ...keyframes,
            width: '100%',
            minHeight: { xs: 280, md: 320 },
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
                    p: { xs: 2, sm: 2.5, md: 3.5 },
                    borderRadius: { xs: 2, sm: 3 },
                    bgcolor: alpha(theme.palette.background.paper, 0.96),
                    backdropFilter: 'blur(14px)',
                    WebkitBackdropFilter: 'blur(14px)',
                    border: '1px solid',
                    borderColor: alpha(theme.palette.primary.main, 0.12),
                    boxShadow: '0 20px 60px rgba(15, 23, 42, 0.15)',
                    animation: 'fadeInUp 0.7s ease-out forwards',
                    opacity: 0,
                    animationFillMode: 'forwards',
                  }}
                  style={{ animationDelay: '0.15s' }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <PrivacyTipIcon sx={{ color: 'primary.main', fontSize: 22 }} />
                    <Typography
                      variant="overline"
                      sx={{
                        color: 'primary.main',
                        fontWeight: 700,
                        letterSpacing: 1.2,
                        fontSize: '0.75rem',
                      }}
                    >
                      Legal
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
                    Privacy Policy
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 2,
                      color: 'text.secondary',
                      lineHeight: 1.6,
                      fontSize: { xs: '0.9rem', md: '1rem' },
                    }}
                  >
                    How we collect, use, and protect your information when you use our platform.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      icon={<SecurityIcon sx={{ fontSize: 18 }} />}
                      label="Your data is secure"
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
                      label="Transparent"
                      size="small"
                      sx={{
                        bgcolor: alpha(theme.palette.success.main, 0.1),
                        color: 'success.main',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        height: 28,
                        '& .MuiChip-icon': { color: 'success.main' },
                      }}
                    />
                    <Chip
                      icon={<CookieIcon sx={{ fontSize: 18 }} />}
                      label="Cookie policy"
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

        {/* Policy sections */}
        <Box
          component="section"
          aria-labelledby="policy-content-heading"
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
          <Container maxWidth="md" sx={{ px: { xs: 1.5, sm: 3, md: 4 } }}>
            <Box sx={{ textAlign: 'center', mb: { xs: 3, md: 5 } }}>
              <Typography
                id="policy-content-heading"
                component="h2"
                variant="h2"
                sx={{
                  mb: 1.5,
                  fontWeight: 700,
                  fontSize: { xs: '1.35rem', sm: '1.75rem', md: '2rem' },
                  px: 1,
                  background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.main} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Policy at a glance
              </Typography>
              <Divider sx={{ mt: 2, mx: 'auto', width: 60, borderWidth: 2, borderColor: 'primary.main' }} />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2.5, sm: 3 } }}>
              {sections.map((section, index) => (
                <Paper
                  key={index}
                  elevation={0}
                  sx={{
                    ...keyframes,
                    p: { xs: 2, sm: 2.5, md: 3 },
                    borderRadius: { xs: 2, sm: 3 },
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
                      borderColor: alpha(theme.palette.primary.main, 0.25),
                      boxShadow: '0 8px 32px rgba(15, 23, 42, 0.1)',
                    },
                  }}
                  style={{ animationDelay: `${0.1 + index * 0.06}s` }}
                >
                  <Box
                    sx={{
                      width: { xs: 48, sm: 52 },
                      height: { xs: 48, sm: 52 },
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      alignSelf: { xs: 'center', sm: 'flex-start' },
                    }}
                  >
                    {section.icon}
                  </Box>
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: 'primary.main',
                        mb: { xs: 1, sm: 1.5 },
                        fontSize: { xs: '1rem', sm: '1.125rem' },
                      }}
                    >
                      {section.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        lineHeight: 1.75,
                        fontSize: { xs: '0.9375rem', sm: '0.875rem' },
                        wordBreak: 'break-word',
                      }}
                    >
                      {section.content}
                    </Typography>
                  </Box>
                </Paper>
              ))}
            </Box>

            <Box sx={{ textAlign: 'center', mt: { xs: 3, md: 4 }, px: { xs: 1, sm: 0 } }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, fontSize: { xs: '0.9375rem', sm: '0.875rem' } }}>
                Questions about your privacy?
              </Typography>
              <Button
                component={Link}
                to="/contact-us"
                variant="contained"
                color="primary"
                size="medium"
                startIcon={<ContactMailOutlinedIcon />}
                sx={{
                  px: 3,
                  py: 1.25,
                  fontSize: '0.9375rem',
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

export default PrivacyPolicy
