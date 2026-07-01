import { useEffect, useRef, type MouseEvent } from 'react'
import { gsap } from 'gsap'
import CustomIcon from '@/components/shared/CustomIcon'
import { useProfile } from '@/api/portfolio'

const Header = () => {
  const { data: profile } = useProfile()
  const experienceRef = useRef<HTMLDivElement>(null)
  const projectRef = useRef<HTMLDivElement>(null)
  const yearsExp = profile.yearsOfExperience ?? 1
  const projectsCount = profile.completedProjects ?? 3

  useEffect(() => {
    const timer = setTimeout(() => {
      if (experienceRef.current) {
        experienceRef.current.innerHTML = String(yearsExp)
        if (window.Odometer) {
          new window.Odometer({ el: experienceRef.current, value: yearsExp })
        }
      }
      if (projectRef.current) {
        projectRef.current.innerHTML = String(projectsCount)
        if (window.Odometer) {
          new window.Odometer({ el: projectRef.current, value: projectsCount })
        }
      }
    }, 500)

    // Ensure header content is visible first
    const headerElements = document.querySelectorAll('#header .user__info, #header .me, #header .points, #header .point')
    headerElements.forEach(el => {
      if (el) {
        gsap.set(el, { opacity: 1, visibility: 'visible' })
      }
    })

    // GSAP animations - use immediateRender: false to prevent initial opacity 0
    const tl = gsap.timeline({ delay: 0.5 })
    tl.from('#header .points', { opacity: 0, y: -30, immediateRender: false })
      .from('#header .me', { opacity: 0, scale: 0.7, immediateRender: false })
      .from(['#header .user__info .sub__title', '#header .user__info .description'], { opacity: 0, y: 20, immediateRender: false })
      .from('#header .user__info .title', { opacity: 0, x: -30, immediateRender: false })
      .from('#header .user__info .buttons', { opacity: 0, x: -30, immediateRender: false })
      .from('#header .point', { opacity: 0, x: -30, stagger: 0.5, immediateRender: false })

    return () => {
      clearTimeout(timer)
      tl.kill()
    }
  }, [yearsExp, projectsCount])

  const handleContactClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const element = document.querySelector('#contact')
    if (element) element.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="header" className="bg__secondary">
      <div className="spotlight"></div>
      <div className="container">
        <div className="grid">
          <div className="me">
            <img src={profile.avatarUrl ?? '/assets/me(Casual).png'} alt="" />
          </div>
          <div className="user__info">
            <h2 className="sub__title">{profile.subtitle ?? `Hi 👋, I'm ${profile.name}`}</h2>
            <h1 className="title">{profile.title}</h1>
            <p className="description">{profile.description}</p>
            <div className="flex buttons">
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
              <a href="#contact" className="btn btn__primary" onClick={handleContactClick}>Contact Me</a>
            </div>
          </div>
          <br />

          <div className="points">
            <div className="spotlight"></div>
            <div className="point">
              <div className="flex">
                <div className="odometer sub__title" ref={experienceRef}></div>
                <h3 className="sub__title">+</h3>
              </div>
              <p className="text__muted">Years Of Experience</p>
            </div>
            <div className="point">
              <div className="flex">
                <div className="odometer sub__title" ref={projectRef}></div>
                <h3 className="sub__title">+</h3>
              </div>
              <p className="text__muted">Completed projects</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Header
