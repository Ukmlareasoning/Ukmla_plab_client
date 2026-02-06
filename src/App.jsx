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
import AdminUserDetails from './Admin/AdminUserDetails'
import AdminAccounting from './Admin/AdminAccounting'
import AdminContacts from './Admin/AdminContacts'
import AdminSubscriptions from './Admin/AdminSubscriptions'
import AdminServices from './Admin/AdminServices'
import AdminAddService from './Admin/AdminAddService'
import AdminCoursesExamType from './Admin/AdminCoursesExamType'
import AdminCoursesDifficultyLevel from './Admin/AdminCoursesDifficultyLevel'
import AdminCoursesTopicFocus from './Admin/AdminCoursesTopicFocus'
import AdminCoursesCourses from './Admin/AdminCoursesCourses'
import AdminCoursesQuestionBank from './Admin/AdminCoursesQuestionBank'
import AdminAddQuestion from './Admin/AdminAddQuestion'
import AdminCoursesLectures from './Admin/AdminCoursesLectures'
import AdminCoursesLectureQuestions from './Admin/AdminCoursesLectureQuestions'
import AdminAddCourse from './Admin/AdminAddCourse'
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
              <Route path="users/view/:id" element={<AdminUserDetails />} />
              <Route path="users/add" element={<AdminAddUser />} />
              <Route path="accounting" element={<AdminAccounting />} />
              <Route path="contacts" element={<AdminContacts />} />
              <Route path="subscriptions" element={<AdminSubscriptions />} />
              <Route path="courses/exam-type" element={<AdminCoursesExamType />} />
              <Route path="courses/difficulty-level" element={<AdminCoursesDifficultyLevel />} />
              <Route path="courses/topic-focus" element={<AdminCoursesTopicFocus />} />
              <Route path="courses/courses" element={<AdminCoursesCourses />} />
              <Route path="courses/add" element={<AdminAddCourse />} />
              <Route path="courses/question-bank" element={<AdminCoursesQuestionBank />} />
              <Route path="courses/question-bank/add" element={<AdminAddQuestion />} />
              <Route path="courses/lectures" element={<AdminCoursesLectures />} />
              <Route path="courses/lectures/questions" element={<AdminCoursesLectureQuestions />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="services/add" element={<AdminAddService />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
