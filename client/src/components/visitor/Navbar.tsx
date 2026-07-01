import { useState, type MouseEvent } from 'react'
import { Sun, Moon, Menu, X, Lock } from 'lucide-react'
import CustomIcon from '@/components/shared/CustomIcon'
import NotificationBell from '@/components/admin/NotificationBell'
import { useTheme } from '@/hooks/useTheme'
import { useScrollSpy } from '@/hooks/useScrollSpy'
import { useAuthStore } from '@/stores/authStore'

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme()
  const { navbarRef, routesRef } = useScrollSpy()
  const [sidebarVisible, setSidebarVisible] = useState(false)
  const { isAuthenticated, setLoginModalOpen } = useAuthStore()

  const handleNavClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setSidebarVisible(false)
    }
  }

  return (
    <>
      <nav id="navbar" className="flex__center" ref={navbarRef}>
        <div className="logo">
          <CustomIcon name="logo" />
        </div>
        <div className="flex nav__routes">
          <a href="#header" className="route active" onClick={(e) => handleNavClick(e, '#header')} ref={el => { routesRef.current[0] = el }}>Home</a>
          <a href="#about" className="route" onClick={(e) => handleNavClick(e, '#about')} ref={el => { routesRef.current[1] = el }}>About</a>
          <a href="#services" className="route" onClick={(e) => handleNavClick(e, '#services')} ref={el => { routesRef.current[2] = el }}>Services</a>
          <a href="#projects" className="route" onClick={(e) => handleNavClick(e, '#projects')} ref={el => { routesRef.current[3] = el }}>Projects</a>
          <a href="#education" className="route" onClick={(e) => handleNavClick(e, '#education')} ref={el => { routesRef.current[4] = el }}>Educational Qualification</a>
          <a href="#experience" className="route" onClick={(e) => handleNavClick(e, '#experience')} ref={el => { routesRef.current[5] = el }}>Experience</a>
          <a href="#contact" className="route" onClick={(e) => handleNavClick(e, '#contact')} ref={el => { routesRef.current[6] = el }}>Contact</a>
        </div>
        <div className="flex__center">
          <NotificationBell />
          {!isAuthenticated && (
            <button
              id="admin-login-btn"
              className="admin__login__btn"
              onClick={() => setLoginModalOpen(true)}
              aria-label="Admin login"
              title="Admin Login"
            >
              <Lock size={15} />
              <span>Admin</span>
            </button>
          )}
          <label className="theme__toggle">
            <input type="checkbox" checked={isDark} onChange={toggleTheme} />
            <div className="icon__container">
              <Sun className="sun" />
              <Moon className="moon" />
            </div>
          </label>
          <div className="icon__container menu__btn" onClick={() => setSidebarVisible(true)}>
            <Menu />
          </div>
        </div>
      </nav>

      <aside className={`sidebar ${sidebarVisible ? 'visible' : ''}`}>
        <div className="sidebar__wrapper">
          <div className="flex__center top">
            <div className="logo">
              <CustomIcon name="logo" />
            </div>
            <div className="icon__container" onClick={() => setSidebarVisible(false)}>
              <X />
            </div>
          </div>
          <div className="middle navlinks">
            <a href="#header" className="navitem" onClick={(e) => handleNavClick(e, '#header')}>Home</a>
            <a href="#about" className="navitem" onClick={(e) => handleNavClick(e, '#about')}>About</a>
            <a href="#services" className="navitem" onClick={(e) => handleNavClick(e, '#services')}>Services</a>
            <a href="#projects" className="navitem" onClick={(e) => handleNavClick(e, '#projects')}>Projects</a>
            <a href="#education" className="navitem" onClick={(e) => handleNavClick(e, '#education')}>Education Qualifications</a>
            <a href="#experience" className="navitem" onClick={(e) => handleNavClick(e, '#experience')}>Experience</a>
            <a href="#contact" className="navitem" onClick={(e) => handleNavClick(e, '#contact')}>Contact</a>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Navbar
