import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useExperience } from '@/api/portfolio'
import '@/css/experience.css'

gsap.registerPlugin(ScrollTrigger)

const Experience = () => {
  const { data: experiences } = useExperience()

  useEffect(() => {
    const tl = gsap.timeline({
      delay: 0.5,
      scrollTrigger: {
        trigger: '#experience',
        start: '20% bottom',
        end: 'bottom top',
      },
    })
    tl.from('#experience .edu', { opacity: 0, y: 30, stagger: 0.3, immediateRender: false })

    return () => {
      tl.kill()
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  return (
    <section id="experience">
      <div className="section__header">
        <h2 className="sub__title">
          <span className="primary">Work Experience</span>
        </h2>
      </div>
      <div className="edus">
        {(experiences ?? []).length === 0 ? (
          <div className="empty-state">
            <p className="text__muted">Experience details coming soon.</p>
          </div>
        ) : (
          (experiences ?? []).map((exp, index) => (
            <div key={exp.id ?? index} className="edu">
              <div className="flex user">
                <div className="details">
                  <h2 className="name">{exp.role}</h2>
                  <h4 className="name">{exp.company}</h4>
                  <div className="flex row">
                    <p className="text__muted position">
                      {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                    </p>
                  </div>
                </div>
              </div>
              <p className="text__muted content">{exp.description}</p>
            </div>
          ))
        )}
      </div>
    </section>
  )
}

export default Experience
