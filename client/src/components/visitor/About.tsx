import { useEffect, type MouseEvent } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CustomIcon from '@/components/shared/CustomIcon'
import { useProfile, useSkills } from '@/api/portfolio'

gsap.registerPlugin(ScrollTrigger)

const About = () => {
  const { data: profile } = useProfile()
  const { data: skills } = useSkills()
  useEffect(() => {
    // Highlight.js initialization
    if (window.hljs) {
      window.hljs.highlightAll()
    }

    // GSAP animations
    const tl = gsap.timeline({
      delay: 0.5,
      scrollTrigger: {
        trigger: '#about',
        start: '20% bottom',
        end: 'bottom top',
      },
    })
    tl.from('#about .box', { opacity: 0, y: 30, stagger: 0.5, immediateRender: false })

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
    <section id="about">
      <div className="container grid">
        <div className="box self__start">
          <div className="spotlight"></div>
          <div className="cluster">
            <div className="flex user">
              <div className="profile">
                <img src={profile.heroImageUrl ?? '/assets/me(Blazer).png'} alt="" />
              </div>
              <div className="details">
                <h4>{profile.name}</h4>
                <p className="text__muted">{profile.title}</p>
              </div>
            </div>
            <h2 className="sub__title">
              <span className="primary">Passionate</span> Developer and Lifelong
              Learner
            </h2>
            <p className="description">
              I adapt to different time zones to make sure communication is
              smooth, no matter where you're located.
            </p>
          </div>
          <CustomIcon name="window" className="kit window" />
        </div>

        <div className="col-2 box">
          <div className="spotlight"></div>
          <div className="flex row cluster">
            <div className="code__block">
              <div className="flex__center dot__container">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
              <pre>
                <code>
{`const developer ={
    firstName: "Manoranjith",
    lastName: "Dhanapal",
    hobby:repeat = () =>{
        //eat();
        //sleep();
        //code();
        //repeat();
    }
}`}
                </code>
              </pre>
            </div>
            <div className="my__drive">
              <h2 className="sub__title">
                What <span className="primary">Drives Me</span>
              </h2>
              <p className="description">
                I'm passionate about the intersection of design 🎨 and
                development 💻. I believe the best digital experiences are built
                with a deep understanding of the user 👤 and a commitment to
                innovation 🌟. Whether working on a simple landing page or a
                complex web app, I bring precision 🎯, creativity ✨, and a
                user-first mindset to every project.
              </p>
            </div>
          </div>
          <CustomIcon name="grid-wire-frame" className="kit grid__wireframe" />
        </div>

        <div className="col-2 box">
          <div className="cluster">
            <div className="column">
              <h2 className="sub__title">
                My <span className="primary">Tech Stack</span>
              </h2>
              <p className="description">Always Evolving My Tech Stack</p>
            </div>
            <div className="column stacks__container">
              {skills.map((skill) => (
                <div key={skill.name} className="flex__center btn stack">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                    {skill.iconType === 'svg' && skill.icon ? (
                      <CustomIcon name={skill.icon.replace('.svg', '')} />
                    ) : skill.icon ? (
                      <img src={`assets/icons/${skill.icon}`} alt="" />
                    ) : null}
                    {' '}{skill.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <CustomIcon name="grid" className="kit grid__box" />
          <CustomIcon name="card-ui" className="kit card__ui" />
        </div>

        <div className="box flex__center last__box">
          <div className="cluster">
            <h2 className="text__white sub__title">
              I'm Committed to Collaboration and Clear Communication
            </h2>
            <div className="flex__center btn__wrapper">
              <a href="#contact" className="btn" onClick={handleContactClick}>Let Collaborate</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
