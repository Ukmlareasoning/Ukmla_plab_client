// git pipeliene test
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from './theme'
import Home from './User/Home'
import Courses from './User/Courses'
import Scenarios from './User/Scenarios'
import AITutor from './User/AITutor'
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
import AdminWebinars from './Admin/AdminWebinars'
import AdminAddWebinar from './Admin/AdminAddWebinar'
import AdminNotesType from './Admin/AdminNotesType'
import AdminNotes from './Admin/AdminNotes'
import AdminAddNote from './Admin/AdminAddNote'
import AdminScenariosTopicFocus from './Admin/AdminScenariosTopicFocus'
import AdminScenarios from './Admin/AdminScenarios'
import AdminAddScenario from './Admin/AdminAddScenario'
import AdminScenariosLectures from './Admin/AdminScenariosLectures'
import AdminScenariosLectureQuestions from './Admin/AdminScenariosLectureQuestions'
import AdminScenariosQuestionBank from './Admin/AdminScenariosQuestionBank'
import AdminContacts from './Admin/AdminContacts'
import AdminSubscriptions from './Admin/AdminSubscriptions'
import AdminServices from './Admin/AdminServices'
import AdminAddService from './Admin/AdminAddService'
import AdminStaticPages from './Admin/AdminStaticPages'
import AdminAddStaticPage from './Admin/AdminAddStaticPage'
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
import Webinars from './User/Webinars'
import Notes from './User/Notes'
import NoteDetails from './User/NoteDetails'
import UserDashboard from './User/UserDashboard'
import UserDashboardPage from './User/UserDashboardPage'
import UserMocksExamsPage from './User/UserMocksExamsPage'
import UserMocksHistoryPage from './User/UserMocksHistoryPage'
import UserPlaceholderPage from './User/UserPlaceholderPage'
import UserScenariosPage from './User/UserScenariosPage'
import UserScenariosHistoryPage from './User/UserScenariosHistoryPage'
import UserCourseDetails from './User/UserCourseDetails'
import UserScenarioDetails from './User/UserScenarioDetails'
import UserProgressPage from './User/UserProgressPage'
import UserMistakesPage from './User/UserMistakesPage'
import UserWebinarPage from './User/UserWebinarPage'
import Settings from './User/Settings'
import CoursePractice from './User/CoursePractice'
import CoursePracticeDetails from './User/CoursePracticeDetails'
import ScenarioPractice from './User/ScenarioPractice'
import ScenarioPracticeDetails from './User/ScenarioPracticeDetails'
import './App.css'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/scenarios/practice/details" element={<ScenarioPracticeDetails />} />
          <Route path="/scenarios/practice" element={<ScenarioPractice />} />
          <Route path="/scenarios" element={<Scenarios />} />
          <Route path="/ai-tutor" element={<AITutor />} />
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
          <Route path="/webinars" element={<Webinars />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/notes/:id" element={<NoteDetails />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/user-dashboard/course-details" element={<UserCourseDetails />} />
          <Route path="/user-dashboard/course-practice" element={<CoursePractice />} />
          <Route path="/user-dashboard/course-practice/details" element={<CoursePracticeDetails />} />
          <Route path="/user-dashboard/mocks-exams" element={<UserMocksExamsPage />} />
          <Route path="/user-dashboard/history" element={<UserMocksHistoryPage />} />
          <Route path="/user-dashboard/scenarios" element={<UserScenariosPage />} />
          <Route path="/user-dashboard/scenario-practice" element={<ScenarioPractice />} />
          <Route path="/user-dashboard/scenario-practice/details" element={<ScenarioPracticeDetails />} />
          <Route path="/user-dashboard/scenarios-history" element={<UserScenariosHistoryPage />} />
          <Route path="/user-dashboard/scenario-details" element={<UserScenarioDetails />} />
          <Route path="/user-dashboard/progress" element={<UserProgressPage />} />
          <Route path="/user-dashboard/mistakes" element={<UserMistakesPage />} />
          <Route path="/user-dashboard/notes" element={<UserPlaceholderPage />} />
          <Route path="/user-dashboard/webinar" element={<UserWebinarPage />} />
          <Route path="/user-dashboard/community" element={<UserPlaceholderPage />} />
          <Route path="/user-dashboard" element={<UserDashboardPage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/admin">
            <Route index element={<AdminLogin />} />
            <Route path="*" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="users/view/:id" element={<AdminUserDetails />} />
              <Route path="users/add" element={<AdminAddUser />} />
              <Route path="accounting" element={<AdminAccounting />} />
              <Route path="webinars" element={<AdminWebinars />} />
              <Route path="webinars/add" element={<AdminAddWebinar />} />
              <Route path="notes/type" element={<AdminNotesType />} />
              <Route path="notes/notes" element={<AdminNotes />} />
              <Route path="notes/add" element={<AdminAddNote />} />
              <Route path="scenarios/topic-focus" element={<AdminScenariosTopicFocus />} />
              <Route path="scenarios/scenarios" element={<AdminScenarios />} />
              <Route path="scenarios/add" element={<AdminAddScenario />} />
              <Route path="scenarios/lectures" element={<AdminScenariosLectures />} />
              <Route path="scenarios/lectures/questions" element={<AdminScenariosLectureQuestions />} />
              <Route path="scenarios/question-bank" element={<AdminScenariosQuestionBank />} />
              <Route path="scenarios/question-bank/add" element={<AdminAddQuestion />} />
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
              <Route path="static-pages" element={<AdminStaticPages />} />
              <Route path="static-pages/add" element={<AdminAddStaticPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
