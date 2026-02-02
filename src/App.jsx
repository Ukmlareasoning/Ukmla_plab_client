// git pipeliene test
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from './theme'
import Home from './User/Home'
import Courses from './User/Courses'
import OtherServices from './User/OtherServices'
import AboutUs from './User/AboutUs'
import ContactUs from './User/ContactUs'
import SignIn from './User/SignIn'
import './App.css'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/other-services" element={<OtherServices />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/sign-in" element={<SignIn />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
