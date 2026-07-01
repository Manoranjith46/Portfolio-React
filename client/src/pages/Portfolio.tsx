import Navbar from '@/components/visitor/Navbar'
import Header from '@/components/visitor/Header'
import About from '@/components/visitor/About'
import Services from '@/components/visitor/Services'
import Projects from '@/components/visitor/Projects'
import Education from '@/components/visitor/Education'
import Experience from '@/components/visitor/Experience'
import Contact from '@/components/visitor/Contact'
import Footer from '@/components/visitor/Footer'
import LoginModal from '@/components/admin/LoginModal'
import EditModeBar from '@/components/admin/EditModeBar'
import { useAnalytics } from '@/hooks/useAnalytics'
import '@/css/index.css'
import '@/css/main.css'
import '@/css/experience.css'
import '@/css/login.css'
import '@/css/admin.css'

const Portfolio = () => {
  useAnalytics()

  return (
    <>
      <Navbar />
      <Header />
      <About />
      <Services />
      <Projects />
      <Education />
      <Experience />
      <Contact />
      <Footer />
      <LoginModal />
      <EditModeBar />
    </>
  )
}

export default Portfolio
