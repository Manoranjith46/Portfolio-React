import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SquareArrowOutUpRight } from 'lucide-react'
import { useProjects } from '@/api/projects'

gsap.registerPlugin(ScrollTrigger)

const Projects = () => {
  const { data: projects } = useProjects()
  const projectsContainerRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const scrollTlRef = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    const tl = gsap.timeline({
      delay: 0.5,
      scrollTrigger: {
        trigger: '#projects',
        start: '20% bottom',
        end: 'bottom top',
      },
    })
    tl.from(
      [
        '#projects .section__header .sub__title',
        '#projects .section__header .description',
      ],
      { opacity: 0, y: 30, stagger: 0.5, immediateRender: false }
    )

    return () => {
      tl.kill()
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  useEffect(() => {
    const container = projectsContainerRef.current
    if (!container) return

    // Delay animation start until after page load
    const timer = setTimeout(() => {
      // Set up infinite scroll animation
      const totalWidth = container.scrollWidth / 2 // Half because we duplicated

      // Create continuous scroll animation
      const scrollTl = gsap.timeline({ repeat: -1 })
      scrollTl.to(
        container,
        {
          x: -totalWidth,
          duration: 20,
          ease: 'linear',
        }
      )
      .set(container, { x: 0 }, '+=0.1') // Reset position seamlessly

      scrollTlRef.current = scrollTl
    }, 1000) // Start animation after 1 second

    return () => {
      clearTimeout(timer)
      if (scrollTlRef.current) {
        scrollTlRef.current.kill()
      }
    }
  }, [projects.length])

  const duplicatedProjects = [...projects, ...projects]

  return (
    <section id="projects" ref={sectionRef}>
      <div className="container">
        <div className="section__header">
          <h2 className="sub__title">My Recent Projects</h2>
          <p className="description">
            Explore my latest work, blending creativity and code for functional,
            responsive websites with clean design and seamless user experiences.
          </p>
        </div>
        <div className="projects__wrapper">
          <div className="projects" ref={projectsContainerRef}>
            {duplicatedProjects.map((project, index) => (
              <div key={`${project.id}-${index}`} className="project">
                <a href="#" target="_blank" className="picture">
                  <img src={project.image} alt={project.title} />
                </a>
                <div className="flex details">
                  <h3 className="line__clamp__1">{project.title}</h3>
                  <p className="text__muted description line__clamp__4">{project.description}</p>
                  <div className="flex bottom">
                    <a href={project.link} target="_blank" className="flex__center btn">
                      <SquareArrowOutUpRight /> View Demo
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Projects
