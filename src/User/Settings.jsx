import { Box, Typography } from '@mui/material'
import Header from '../components/Header'
import Footer from '../components/Footer'

function Settings() {
  return (
    <>
      <Header />
      <Box sx={{ py: 4, px: 2, textAlign: 'center', minHeight: '60vh' }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
          This is Settings page
        </Typography>
      </Box>
      <Footer />
    </>
  )
}

export default Settings
