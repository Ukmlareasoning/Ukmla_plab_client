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
import GavelIcon from '@mui/icons-material/Gavel'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import DescriptionIcon from '@mui/icons-material/Description'
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined'
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined'
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined'
import CopyrightOutlinedIcon from '@mui/icons-material/CopyrightOutlined'
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined'
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined'
import ContactMailOutlinedIcon from '@mui/icons-material/ContactMailOutlined'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import heroImage from '../assets/hero.jpg'

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
    content: 'These Terms of Service (“Terms”) govern your use of UKMLA Reasoning Tutor and related services. By accessing or using our platform, you agree to these Terms. If you do not agree, please do not use our services.',
  },
  {
    icon: <CheckCircleOutlinedIcon sx={{ fontSize: 28, color: 'primary.main' }} />,
    title: 'Acceptance',
    content: 'By creating an account, subscribing, or using our AI tutor, study materials, or any feature of the platform, you confirm that you have read, understood, and agree to be bound by these Terms and our Privacy Policy.',
  },
  {
    icon: <BuildOutlinedIcon sx={{ fontSize: 28, color: 'primary.main' }} />,
    title: 'Use of the service',
    content: 'You may use UKMLA Reasoning Tutor only for lawful purposes and in accordance with these Terms. You must not misuse the platform, attempt to gain unauthorized access, share accounts, or use automated tools to scrape or overload our systems. Content is for personal study in connection with UKMLA or PLAB 1 preparation.',
  },
  {
    icon: <PersonOutlinedIcon sx={{ fontSize: 28, color: 'primary.main' }} />,
    title: 'Account',
    content: 'You are responsible for keeping your account credentials secure and for all activity under your account. You must provide accurate information when registering. We may suspend or terminate accounts that violate these Terms or for other reasonable cause.',
  },
  {
    icon: <PaymentOutlinedIcon sx={{ fontSize: 28, color: 'success.main' }} />,
    title: 'Payment and subscriptions',
    content: 'Paid plans are billed according to the plan you choose. Fees are non-refundable except where required by law or as stated in our refund policy. We may change pricing with notice; continued use after changes constitutes acceptance.',
  },
  {
    icon: <CopyrightOutlinedIcon sx={{ fontSize: 28, color: 'primary.main' }} />,
    title: 'Intellectual property',
    content: 'All content, materials, and software on the platform are owned by us or our licensors. You may not copy, modify, distribute, or create derivative works from our content except for personal study use as permitted by the service.',
  },
  {
    icon: <BlockOutlinedIcon sx={{ fontSize: 28, color: 'primary.main' }} />,
    title: 'Termination',
    content: 'We may suspend or terminate your access at any time for breach of these Terms or for other operational or legal reasons. You may close your account at any time. Provisions that by their nature should survive will remain in effect after termination.',
  },
  {
    icon: <WarningAmberOutlinedIcon sx={{ fontSize: 28, color: 'success.main' }} />,
    title: 'Limitation of liability',
    content: 'To the fullest extent permitted by law, our liability is limited. We do not guarantee exam outcomes. The service is provided “as is.” We are not liable for indirect, incidental, or consequential damages. Nothing in these Terms excludes liability that cannot be excluded by law.',
  },
  {
    icon: <ContactMailOutlinedIcon sx={{ fontSize: 28, color: 'primary.main' }} />,
    title: 'Contact',
    content: 'For questions about these Terms of Service, contact us at support@ukmla-tutor.com or via the Contact Us page. We will respond within a reasonable time.',
  },
]

function TermsOfService() {
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
          aria-label="Terms of Service Hero"
          sx={{
            ...keyframes,
            width: '100%',
            minHeight: { xs: 280, md: 320 },
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
                    p: { xs: 2, sm: 2.5, md: 3.5 },
                    borderRadius: { xs: 2, sm: 3 },
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
                      borderRadius: { xs: 2, sm: 3 },
                      background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.1)} 0%, transparent 100%)`,
                      pointerEvents: 'none',
                      zIndex: 0,
                    },
                  }}
                  style={{ animationDelay: '0.15s' }}
                >
                  <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <GavelIcon sx={{ color: 'text.primary', fontSize: 22 }} />
                    <Typography
                      variant="overline"
                      sx={{
                        color: 'text.primary',
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
                    Terms of Service
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
                    The rules and guidelines that apply when you use our platform and services.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      icon={<DescriptionIcon sx={{ fontSize: 18 }} />}
                      label="Agreement"
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
                      icon={<VerifiedUserIcon sx={{ fontSize: 18 }} />}
                      label="Binding"
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
                      icon={<GavelIcon sx={{ fontSize: 18 }} />}
                      label="Legal"
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

        {/* Terms sections */}
        <Box
          component="section"
          aria-labelledby="terms-content-heading"
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
                id="terms-content-heading"
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
                Terms at a glance
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
                  style={{ animationDelay: `${0.1 + index * 0.05}s` }}
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
                Questions about these terms?
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

export default TermsOfService
