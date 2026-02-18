import { alpha } from '@mui/material/styles'
import { Box, Grid, Typography, Link, TextField, Button } from '@mui/material'
import WidgetsRoundedIcon from '@mui/icons-material/WidgetsRounded'
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded'
import GavelRoundedIcon from '@mui/icons-material/GavelRounded'
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded'
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded'
import LockRoundedIcon from '@mui/icons-material/LockRounded'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined'
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded'
import PrivacyTipOutlinedIcon from '@mui/icons-material/PrivacyTipOutlined'
import CookieOutlinedIcon from '@mui/icons-material/CookieOutlined'
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded'
import ContactMailOutlinedIcon from '@mui/icons-material/ContactMailOutlined'
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined'
import { Link as RouterLink } from 'react-router-dom'

// Match Header color scheme (deep royal blue, gold accents)
const FOOTER_BG = '#1e3a5f'
const FOOTER_BG_GRADIENT = 'linear-gradient(180deg, #243b55 0%, #1e3a5f 50%, #182d47 100%)'
const FOOTER_ACCENT = '#D4AF37'
const FOOTER_BTN_BG = '#c9a227'
const FOOTER_BTN_HOVER = '#b38600'
const FOOTER_TEXT = '#ffffff'
const FOOTER_TEXT_MUTED = 'rgba(255,255,255,0.75)'
const FOOTER_BORDER = 'rgba(255,255,255,0.12)'

const footerLinks = {
  platform: [
    { label: 'About Us', href: '/about-us', Icon: InfoOutlinedIcon },
    { label: 'How It Works', href: '/how-it-works', Icon: TimelineOutlinedIcon },
    { label: 'Pricing', href: '/pricing', Icon: AttachMoneyRoundedIcon },
  ],
  resources: [
    { label: 'Webinars', href: '/webinars', Icon: MenuBookRoundedIcon },
    { label: 'Notes', href: '/notes', Icon: DescriptionOutlinedIcon },
    { label: 'Scenarios', href: '/scenarios', Icon: SchoolRoundedIcon },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy-policy', Icon: PrivacyTipOutlinedIcon },
    { label: 'Terms of Service', href: '/terms-of-service', Icon: DescriptionOutlinedIcon },
    { label: 'Cookie Policy', href: '/cookie-policy', Icon: CookieOutlinedIcon },
  ],
  support: [
    { label: 'Help Center', href: '/help-center', Icon: HelpOutlineRoundedIcon },
    { label: 'Contact Us', href: '/contact-us', Icon: ContactMailOutlinedIcon },
    { label: 'FAQs', href: '/faqs', Icon: QuestionAnswerOutlinedIcon },
  ],
}

const columns = [
  { title: 'Platform', Icon: WidgetsRoundedIcon, links: footerLinks.platform },
  { title: 'Services', Icon: MenuBookRoundedIcon, links: footerLinks.resources },
  { title: 'Legal', Icon: GavelRoundedIcon, links: footerLinks.legal },
  { title: 'Support', Icon: HelpOutlineRoundedIcon, links: footerLinks.support },
]

const isInternalRoute = (href) => href.startsWith('/') && href.length > 1

const linkSx = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 1,
  color: FOOTER_TEXT_MUTED,
  fontSize: '0.9375rem',
  textDecoration: 'none',
  underline: 'none',
  py: 0.5,
  px: 1,
  borderRadius: '7px',
  transition: 'all 0.25s ease',
  '&:hover': {
    color: FOOTER_TEXT,
    bgcolor: 'rgba(255,255,255,0.08)',
    textDecoration: 'none',
    transform: 'translateX(4px)',
    '& .footer-link-icon': {
      color: FOOTER_ACCENT,
    },
  },
}

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        width: '100vw',
        maxWidth: '100vw',
        minWidth: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
        boxSizing: 'border-box',
        background: FOOTER_BG_GRADIENT,
        bgcolor: FOOTER_BG,
        color: FOOTER_TEXT,
        pt: 0,
        pb: 4,
        mt: 0,
      }}
    >
      <Box
        component="div"
        sx={{
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
          px: { xs: 2, sm: 3, md: 4, lg: 6 },
          mx: 'auto',
        }}
      >
        {/* Subscribe for updates — user-friendly, clear CTA */}
        <Box
          sx={{
            py: { xs: 4, md: 5 },
            borderBottom: '1px solid',
            borderColor: FOOTER_BORDER,
            mb: 6,
          }}
        >
          <Box
            sx={{
              maxWidth: 520,
              mx: 'auto',
              textAlign: 'center',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, color: FOOTER_TEXT, fontSize: '1.25rem', mb: 0.5 }}>
              Stay in the loop
            </Typography>
            <Typography variant="body2" sx={{ color: FOOTER_TEXT_MUTED, lineHeight: 1.5, mb: 3 }}>
              Get tips and UKMLA & PLAB 1 prep updates — no spam, unsubscribe anytime.
            </Typography>
            <Box
              component="form"
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 1.5,
                alignItems: 'stretch',
                justifyContent: 'center',
                maxWidth: 400,
                mx: 'auto',
              }}
            >
              <TextField
                size="medium"
                placeholder="you@email.com"
                type="email"
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#fff',
                    borderRadius: '7px',
                    border: 'none',
                    color: 'text.primary',
                    fontSize: '1rem',
                    '& fieldset': { border: '2px solid', borderColor: FOOTER_BORDER },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.25)' },
                    '&.Mui-focused fieldset': { borderColor: FOOTER_ACCENT, borderWidth: 2 },
                    '& input': { textAlign: 'center' },
                    '& input::placeholder': { color: 'rgba(0,0,0,0.5)', opacity: 1 },
                  },
                }}
              />
              <Button
                variant="contained"
                size="large"
                sx={{
                  minWidth: { xs: '100%', sm: 140 },
                  borderRadius: '7px',
                  py: 1.5,
                  px: 3,
                  fontWeight: 700,
                  fontSize: '1rem',
                  color: 'rgba(26,26,26,0.92)',
                  bgcolor: FOOTER_BTN_BG,
                  boxShadow: `0 4px 14px ${alpha(FOOTER_BTN_BG, 0.4)}`,
                  '&:hover': {
                    bgcolor: FOOTER_BTN_HOVER,
                    color: '#1a1a1a',
                    boxShadow: `0 6px 20px ${alpha(FOOTER_BTN_BG, 0.5)}`,
                  },
                }}
              >
                Subscribe
              </Button>
            </Box>
          </Box>
        </Box>

        <Grid
          container
          spacing={{ xs: 4, sm: 6, md: 8, lg: 10 }}
          justifyContent="center"
          sx={{ mb: 5, width: '100%' }}
        >
          {columns.map((col) => {
            const ColIcon = col.Icon
            return (
              <Grid item xs={12} sm={6} md={3} key={col.title}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <ColIcon sx={{ color: FOOTER_ACCENT, fontSize: 22 }} />
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, color: FOOTER_TEXT, fontSize: '1rem', letterSpacing: '0.02em' }}
                  >
                    {col.title}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  {col.links.map((link) => {
                    const LinkIcon = link.Icon
                    return isInternalRoute(link.href) ? (
                      <Link
                        key={link.label}
                        component={RouterLink}
                        to={link.href}
                        underline="none"
                        sx={linkSx}
                      >
                        <LinkIcon className="footer-link-icon" sx={{ color: FOOTER_TEXT_MUTED, fontSize: 18, transition: 'color 0.25s' }} />
                        {link.label}
                      </Link>
                    ) : (
                      <Link key={link.label} href={link.href} underline="none" sx={linkSx}>
                        <LinkIcon className="footer-link-icon" sx={{ color: FOOTER_TEXT_MUTED, fontSize: 18, transition: 'color 0.25s' }} />
                        {link.label}
                      </Link>
                    )
                  })}
                </Box>
              </Grid>
            )
          })}
        </Grid>

        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            py: 3,
            mb: 2,
            borderRadius: '7px',
            bgcolor: 'rgba(255,255,255,0.06)',
            border: '1px solid',
            borderColor: FOOTER_BORDER,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LockRoundedIcon sx={{ color: FOOTER_TEXT_MUTED, fontSize: 20 }} />
            <Typography variant="body2" sx={{ color: FOOTER_TEXT_MUTED }}>
              Secure payments
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CreditCardRoundedIcon sx={{ color: FOOTER_TEXT_MUTED, fontSize: 20 }} />
            <Typography variant="body2" sx={{ color: FOOTER_TEXT_MUTED }}>
              We accept cards
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: FOOTER_TEXT_MUTED, fontStyle: 'italic' }}>
            Card payments powered by Stripe
          </Typography>
        </Box>

        <Box
          sx={{
            borderTop: '1px solid',
            borderColor: FOOTER_BORDER,
            pt: 3,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: FOOTER_TEXT_MUTED, fontSize: '0.875rem' }}>
            © 2026 UKMLA Reasoning Tutor. All rights reserved.
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: FOOTER_TEXT_MUTED, textAlign: { xs: 'center', sm: 'right' }, fontSize: '0.875rem' }}
          >
            Designed for international & UK medical graduates
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default Footer
