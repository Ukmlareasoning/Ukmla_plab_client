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
  TextField,
  useTheme,
} from '@mui/material'
import ContactMailIcon from '@mui/icons-material/ContactMail'
import EmailIcon from '@mui/icons-material/Email'
import ScheduleIcon from '@mui/icons-material/Schedule'
import SupportAgentIcon from '@mui/icons-material/SupportAgent'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import SendIcon from '@mui/icons-material/Send'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import Header from '../components/Header'
import Footer from '../components/Footer'
import heroImg from '../assets/hero-img.png'

const PAGE_PRIMARY = '#384D84'
const HERO_BG = '#1e3a5f'
const PAGE_PRIMARY_DARK = '#2a3a64'
const PAGE_PRIMARY_LIGHT = '#4a5f9a'

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
}

const contactInfo = [
  {
    icon: <EmailIcon sx={{ fontSize: 32, color: PAGE_PRIMARY }} />,
    title: 'Email',
    value: 'support@ukmla-tutor.com',
    description: 'We typically respond within 24 hours',
  },
  {
    icon: <ScheduleIcon sx={{ fontSize: 32, color: PAGE_PRIMARY }} />,
    title: 'Support Hours',
    value: 'Mon–Fri, 9am–6pm GMT',
    description: 'Extended hours for Premium members',
  },
  {
    icon: <SupportAgentIcon sx={{ fontSize: 32, color: PAGE_PRIMARY }} />,
    title: 'Live Chat',
    value: 'In-app when signed in',
    description: 'Quick answers for account & technical issues',
  },
  {
    icon: <LocationOnIcon sx={{ fontSize: 32, color: PAGE_PRIMARY }} />,
    title: 'Address',
    value: 'London, United Kingdom',
    description: 'Head office — reach out for visits or post',
  },
]

const inputSx = () => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '7px',
    bgcolor: 'background.paper',
    transition: 'all 0.2s ease',
    '&:hover': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: alpha(PAGE_PRIMARY, 0.5),
      },
    },
    '&.Mui-focused': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderWidth: 2,
        borderColor: PAGE_PRIMARY,
      },
    },
  },
})

function ContactUs() {
  const theme = useTheme()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    // Placeholder: wire to your backend or email service
  }

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
              Contact Us
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
              Have a question, feedback, or need support? We're here to help — reach out and we'll get back to you soon.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                icon={<VerifiedUserIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.9)' }} />}
                label="24h response"
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
                icon={<SupportAgentIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.9)' }} />}
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
              <Chip
                icon={<EmailIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.9)' }} />}
                label="Secure"
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

        {/* Contact form + info */}
        <Box
          component="section"
          aria-labelledby="contact-heading"
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
          <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
            <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 5 }, maxWidth: 560, mx: 'auto' }}>
              <Typography
                id="contact-heading"
                component="h2"
                variant="h2"
                sx={{
                  mb: 1.5,
                  fontWeight: 700,
                  fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
                  background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${PAGE_PRIMARY} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Send a Message
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: { xs: '0.9375rem', md: '1rem' }, lineHeight: 1.55 }}>
                Fill out the form below and we’ll get back to you as soon as we can
              </Typography>
              <Divider sx={{ mt: 2, mx: 'auto', width: 60, borderWidth: 2, borderColor: PAGE_PRIMARY }} />
            </Box>

            {/* Flex layout: form left, contact cards right — same row on sm+ */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 3,
                alignItems: 'stretch',
              }}
            >
              {/* Form — left */}
              <Box
                sx={{
                  flex: { xs: '0 0 auto', sm: '7 1 0%' },
                  minWidth: 0,
                }}
              >
                <Paper
                  elevation={0}
                  component="form"
                  onSubmit={handleSubmit}
                  sx={{
                    ...keyframes,
                    p: { xs: 2.5, md: 3.5 },
                    borderRadius: '7px',
                    border: '1px solid',
                    borderColor: alpha(theme.palette.grey[300], 0.6),
                    bgcolor: 'background.paper',
                    boxShadow: '0 4px 24px rgba(15, 23, 42, 0.08)',
                    animation: 'scaleIn 0.6s ease-out forwards',
                    opacity: 0,
                    animationFillMode: 'forwards',
                    transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      boxShadow: '0 8px 32px rgba(15, 23, 42, 0.1)',
                    },
                  }}
                  style={{ animationDelay: '0.2s' }}
                >
                  <Box sx={{ '& .MuiTextField-root': { mb: 2 } }}>
                    <TextField
                      fullWidth
                      required
                      name="name"
                      label="Your name"
                      variant="outlined"
                      size="medium"
                      sx={inputSx()}
                      placeholder="e.g. Dr Jane Smith"
                    />
                    <TextField
                      fullWidth
                      required
                      name="email"
                      type="email"
                      label="Email address"
                      variant="outlined"
                      size="medium"
                      sx={inputSx()}
                      placeholder="you@example.com"
                    />
                    <TextField
                      fullWidth
                      name="subject"
                      label="Subject"
                      variant="outlined"
                      size="medium"
                      sx={inputSx()}
                      placeholder="e.g. Billing, Technical support, Feedback"
                    />
                    <TextField
                      fullWidth
                      required
                      name="message"
                      label="Message"
                      variant="outlined"
                      multiline
                      rows={5}
                      sx={inputSx()}
                      placeholder="Tell us how we can help..."
                    />
                  </Box>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    startIcon={<SendIcon />}
                    fullWidth
                    sx={{
                      py: 1.5,
                      fontSize: '1rem',
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
                    Send message
                  </Button>
                </Paper>
              </Box>

              {/* Email, Support Hours, Live Chat — right (beside form on sm+ screens) */}
              <Box
                sx={{
                  flex: { xs: '0 0 auto', sm: '5 1 0%' },
                  minWidth: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                  {contactInfo.map((item, index) => (
                    <Card
                      key={index}
                      elevation={0}
                      sx={{
                        ...keyframes,
                        borderRadius: '7px',
                        border: '1px solid',
                        borderColor: alpha(theme.palette.grey[300], 0.6),
                        bgcolor: 'background.paper',
                        boxShadow: '0 4px 24px rgba(15, 23, 42, 0.08)',
                        overflow: 'hidden',
                        animation: 'fadeInUp 0.5s ease-out forwards',
                        opacity: 0,
                        animationFillMode: 'forwards',
                        transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: 3,
                          background: `linear-gradient(90deg, ${PAGE_PRIMARY}, ${PAGE_PRIMARY_LIGHT})`,
                          opacity: 0,
                          transition: 'opacity 0.3s',
                        },
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: `0 12px 32px ${alpha(PAGE_PRIMARY, 0.1)}`,
                          borderColor: alpha(PAGE_PRIMARY, 0.3),
                          '&::before': { opacity: 1 },
                        },
                      }}
                      style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                    >
                      <CardContent sx={{ p: { xs: 2, md: 2.5 }, display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <Box
                          sx={{
                            width: 52,
                            height: 52,
                            borderRadius: '7px',
                            bgcolor: alpha(PAGE_PRIMARY, 0.08),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          {item.icon}
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" sx={{ color: PAGE_PRIMARY, fontWeight: 700, mb: 0.5, fontSize: '0.875rem' }}>
                            {item.title}
                          </Typography>
                          <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 600, fontSize: '0.95rem' }}>
                            {item.value}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5, fontSize: '0.8125rem' }}>
                            {item.description}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Reassurance strip */}
        <Box
          component="section"
          aria-label="Response time"
          sx={{
            ...keyframes,
            py: { xs: 4, md: 5 },
            background: `linear-gradient(135deg, ${alpha(PAGE_PRIMARY, 0.06)} 0%, ${alpha(PAGE_PRIMARY, 0.04)} 100%)`,
            borderTop: '1px solid',
            borderColor: alpha(PAGE_PRIMARY, 0.1),
          }}
        >
          <Container maxWidth="md" sx={{ textAlign: 'center', px: { xs: 2, sm: 3 } }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, md: 3 },
                borderRadius: '7px',
                border: '1px solid',
                borderColor: alpha(PAGE_PRIMARY, 0.12),
                bgcolor: alpha(theme.palette.background.paper, 0.9),
                backdropFilter: 'blur(10px)',
                animation: 'fadeInUp 0.5s ease-out forwards',
                opacity: 0,
                animationFillMode: 'forwards',
              }}
              style={{ animationDelay: '0.1s' }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
                <VerifiedUserIcon sx={{ color: PAGE_PRIMARY, fontSize: 22 }} />
                <Typography variant="subtitle1" sx={{ color: PAGE_PRIMARY, fontWeight: 700 }}>
                  We’re here to help
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 420, mx: 'auto' }}>
                Most messages get a reply within 24 hours. For urgent account or technical issues, sign in and use in-app live chat for faster support.
              </Typography>
            </Paper>
          </Container>
        </Box>
      </Box>

      <Footer />
    </Box>
  )
}

export default ContactUs
