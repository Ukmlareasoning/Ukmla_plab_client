import { alpha } from '@mui/material/styles'
import { Box, Grid, Typography, Link, TextField, Button, useTheme } from '@mui/material'
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

const footerLinks = {
  platform: [
    { label: 'About Us', href: '/about-us', Icon: InfoOutlinedIcon },
    { label: 'How It Works', href: '#', Icon: TimelineOutlinedIcon },
    { label: 'Pricing', href: '#', Icon: AttachMoneyRoundedIcon },
  ],
  resources: [
    { label: 'UKMLA Blueprint', href: '#', Icon: MenuBookRoundedIcon },
    { label: 'GMC Guidelines', href: '#', Icon: DescriptionOutlinedIcon },
    { label: 'Study Tips', href: '#', Icon: SchoolRoundedIcon },
  ],
  legal: [
    { label: 'Privacy Policy', href: '#', Icon: PrivacyTipOutlinedIcon },
    { label: 'Terms of Service', href: '#', Icon: DescriptionOutlinedIcon },
    { label: 'Cookie Policy', href: '#', Icon: CookieOutlinedIcon },
  ],
  support: [
    { label: 'Help Center', href: '#', Icon: HelpOutlineRoundedIcon },
    { label: 'Contact Us', href: '/contact-us', Icon: ContactMailOutlinedIcon },
    { label: 'FAQs', href: '#', Icon: QuestionAnswerOutlinedIcon },
  ],
}

const columns = [
  { title: 'Platform', Icon: WidgetsRoundedIcon, links: footerLinks.platform },
  { title: 'Resources', Icon: MenuBookRoundedIcon, links: footerLinks.resources },
  { title: 'Legal', Icon: GavelRoundedIcon, links: footerLinks.legal },
  { title: 'Support', Icon: HelpOutlineRoundedIcon, links: footerLinks.support },
]

const isInternalRoute = (href) => href.startsWith('/') && href.length > 1

const linkSx = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 1,
  color: 'grey.400',
  fontSize: '0.9375rem',
  textDecoration: 'none',
  underline: 'none',
  py: 0.5,
  px: 1,
  borderRadius: 1,
  transition: 'all 0.25s ease',
  '&:hover': {
    color: 'white',
    bgcolor: 'rgba(255,255,255,0.06)',
    textDecoration: 'none',
    transform: 'translateX(4px)',
    '& .footer-link-icon': {
      color: 'primary.main',
    },
  },
}

function Footer() {
  const theme = useTheme()

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
        bgcolor: 'footer.main',
        color: 'white',
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
            borderColor: 'grey.800',
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
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'white', fontSize: '1.25rem', mb: 0.5 }}>
              Stay in the loop
            </Typography>
            <Typography variant="body2" sx={{ color: 'grey.400', lineHeight: 1.5, mb: 3 }}>
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
                    borderRadius: 2.5,
                    border: 'none',
                    color: 'text.primary',
                    fontSize: '1rem',
                    '& fieldset': { border: '2px solid', borderColor: 'grey.300' },
                    '&:hover fieldset': { borderColor: 'grey.400' },
                    '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: 2 },
                    '& input': { textAlign: 'center' },
                    '& input::placeholder': { color: 'grey.500', opacity: 1 },
                  },
                }}
              />
              <Button
                variant="contained"
                color="primary"
                size="large"
                sx={{
                  minWidth: { xs: '100%', sm: 140 },
                  borderRadius: 2.5,
                  py: 1.5,
                  px: 3,
                  fontWeight: 700,
                  fontSize: '1rem',
                  boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}`,
                  '&:hover': {
                    boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.5)}`,
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
                  <ColIcon sx={{ color: 'primary.main', fontSize: 22 }} />
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, color: 'white', fontSize: '1rem', letterSpacing: '0.02em' }}
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
                        <LinkIcon className="footer-link-icon" sx={{ color: 'grey.500', fontSize: 18, transition: 'color 0.25s' }} />
                        {link.label}
                      </Link>
                    ) : (
                      <Link key={link.label} href={link.href} underline="none" sx={linkSx}>
                        <LinkIcon className="footer-link-icon" sx={{ color: 'grey.500', fontSize: 18, transition: 'color 0.25s' }} />
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
            borderRadius: 1,
            bgcolor: 'rgba(255,255,255,0.03)',
            border: '1px solid',
            borderColor: 'grey.800',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LockRoundedIcon sx={{ color: 'grey.500', fontSize: 20 }} />
            <Typography variant="body2" sx={{ color: 'grey.400' }}>
              Secure payments
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CreditCardRoundedIcon sx={{ color: 'grey.500', fontSize: 20 }} />
            <Typography variant="body2" sx={{ color: 'grey.400' }}>
              We accept cards
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: 'grey.500', fontStyle: 'italic' }}>
            Card payments powered by Stripe
          </Typography>
        </Box>

        <Box
          sx={{
            borderTop: '1px solid',
            borderColor: 'grey.800',
            pt: 3,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: 'grey.500', fontSize: '0.875rem' }}>
            © 2026 UKMLA Reasoning Tutor. All rights reserved.
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: 'grey.500', textAlign: { xs: 'center', sm: 'right' }, fontSize: '0.875rem' }}
          >
            Designed for international & UK medical graduates
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default Footer
