// git pipeliene test
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from './theme'
import Home from './User/Home'
import Courses from './User/Courses'
import OtherServices from './User/OtherServices'
import AboutUs from './User/AboutUs'
import ContactUs from './User/ContactUs'
import PrivacyPolicy from './User/PrivacyPolicy'
import TermsOfService from './User/TermsOfService'
import CookiePolicy from './User/CookiePolicy'
import HelpCenter from './User/HelpCenter'
import FAQs from './User/FAQs'
import Pricing from './User/Pricing'
import SignIn from './User/SignIn'
import AdminLogin from './Admin/AdminLogin'
import AdminLayout from './Admin/AdminLayout'
import AdminDashboard from './Admin/AdminDashboard'
import AdminUsers from './Admin/AdminUsers'
import AdminAddUser from './Admin/AdminAddUser'
import AdminContacts from './Admin/AdminContacts'
import HowItWorks from './User/HowItWorks'
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
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/help-center" element={<HelpCenter />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/admin">
            <Route index element={<AdminLogin />} />
            <Route element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="users/add" element={<AdminAddUser />} />
              <Route path="contacts" element={<AdminContacts />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
