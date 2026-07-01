import { type MouseEvent } from 'react'
import CustomIcon from '@/components/shared/CustomIcon'
import { useProfile } from '@/api/portfolio'
import { FOOTER_DESCRIPTION } from '@/constants/fallbackData'

const Footer = () => {
  const { data: profile } = useProfile()

  const handleNavClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const element = document.querySelector(href)
    if (element) element.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer id="footer">
      <div className="spotlight"></div>
      <div className="container">
        <div className="grid">
          <div className="col-2 column">
            <div className="logo">
              <CustomIcon name="logo" />
            </div>
            <p className="text__muted description">{FOOTER_DESCRIPTION}</p>
            <div className="flex social__handles">
              {profile.socialLinks.github && (
                <a href={profile.socialLinks.github} target="_blank" rel="noreferrer" className="icon__container handle">
                  <CustomIcon name="github" />
                </a>
              )}
              {profile.socialLinks.linkedin && (
                <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer" className="icon__container handle">
                  <CustomIcon name="linkedin" />
                </a>
              )}
              {profile.socialLinks.whatsapp && (
                <a href={profile.socialLinks.whatsapp} target="_blank" rel="noreferrer" className="icon__container handle">
                  <CustomIcon name="whatsapp" />
                </a>
              )}
            </div>
          </div>
          <div className="column">
            <h3 className="group__name">Hot Links</h3>
            <div className="routes__container">
              <a href="#header" className="route__item" onClick={(e) => handleNavClick(e, '#header')}>Home</a>
              <a href="#about" className="route__item" onClick={(e) => handleNavClick(e, '#about')}>About</a>
              <a href="#services" className="route__item" onClick={(e) => handleNavClick(e, '#services')}>Services</a>
              <a href="#projects" className="route__item" onClick={(e) => handleNavClick(e, '#projects')}>Projects</a>
              <a href="#education" className="route__item" onClick={(e) => handleNavClick(e, '#education')}>Education Qualifications</a>
              <a href="#experience" className="route__item" onClick={(e) => handleNavClick(e, '#experience')}>Experience</a>
              <a href="#contact" className="route__item" onClick={(e) => handleNavClick(e, '#contact')}>Contact</a>
            </div>
          </div>
          <div className="column">
            <h3 className="group__name">Others</h3>
            <div className="routes__container">
              <a href="#" className="route__item">Privacy Policy</a>
              <a href="#" className="route__item">Terms and Condition</a>
              <a href="#" className="route__item">Cookie Policy</a>
            </div>
          </div>
        </div>
        <div className="copyright">
          <h3>Copyright &copy; 2026. All rights reserved.</h3>
        </div>
      </div>
    </footer>
  )
}

export default Footer
