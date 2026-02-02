import { Box, Container, Typography } from '@mui/material'
import Header from '../components/Header'
import Footer from '../components/Footer'

function ContactUs() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Box component="main" sx={{ flex: 1, py: 8, px: 2 }}>
        <Container maxWidth="md">
          <Typography variant="h4" component="h1" sx={{ textAlign: 'center', color: 'text.primary' }}>
            This is Contact Us page.
          </Typography>
        </Container>
      </Box>
      <Footer />
    </Box>
  )
}

export default ContactUs
