import { useEffect, type MouseEvent } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Smartphone, Code, PencilRuler, ArrowRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const Services = () => {
  useEffect(() => {
    const tl = gsap.timeline({
      delay: 0.5,
      scrollTrigger: {
        trigger: '#services',
        start: '20% bottom',
        end: 'bottom top',
      },
    })
    tl.from(
      [
        '#services .section__header .sub__title',
        '#services .section__header .description',
      ],
      { opacity: 0, y: 30, stagger: 0.5, immediateRender: false }
    )
    .from('#services .service', { opacity: 0, y: 30, stagger: 0.5, immediateRender: false })

    return () => {
      tl.kill()
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  const handleContactClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const element = document.querySelector('#contact')
    if (element) element.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="services" className="bg__secondary">
      <div className="container">
        <div className="section__header">
          <h2 className="sub__title">My <span className="primary">Services</span></h2>
          <p className="description">
            As a MERN developer, I create modern, responsive, and
            user-friendly websites that are both visually appealing and
            efficient.
          </p>
        </div>

        <div className="services">
          <div className="service">
            <div className="flex__center circle">
              <div className="spotlight"></div>
              <div className="icon__container">
                <Smartphone />
              </div>
            </div>
            <h3 className="name">Responsive Web Design</h3>
            <p className="text__muted description">
              Crafting visually appealing and fully responsive websites that
              adapt seamlessly to any device, ensuring an excellent user
              experience on desktops, tablets, and smartphones.
            </p>
            <div className="flex__center">
              <a href="#contact" className="btn" onClick={handleContactClick}>
                Let Talk <ArrowRight />
              </a>
            </div>
          </div>

          <div className="service">
            <div className="flex__center circle">
              <div className="spotlight"></div>
              <div className="icon__container">
                <Code />
              </div>
            </div>
            <h3 className="name">Custom Web Development</h3>
            <p className="text__muted description">
              Building dynamic, interactive web applications tailored to your
              specific needs, using modern frontend technologies to create
              scalable and maintainable solutions.
            </p>
            <div className="flex__center">
              <a href="#contact" className="btn" onClick={handleContactClick}>
                Let Talk <ArrowRight />
              </a>
            </div>
          </div>

          <div className="service">
            <div className="flex__center circle">
              <div className="spotlight"></div>
              <div className="icon__container">
                <PencilRuler />
              </div>
            </div>
            <h3 className="name">UI/UX Optimization</h3>
            <p className="text__muted description">
              Enhancing user engagement with intuitive and aesthetically
              pleasing interfaces, prioritizing performance, accessibility, and
              smooth navigation for optimal user satisfaction.
            </p>
            <div className="flex__center">
              <a href="#contact" className="btn" onClick={handleContactClick}>
                Let Talk <ArrowRight />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Services
