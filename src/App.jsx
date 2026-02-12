import { useEffect, useState, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Sun, Moon, Menu, X, Smartphone, Code, PencilRuler, ArrowRight, SquareArrowOutUpRight, AtSign, Phone, MapPin } from 'lucide-react'
import emailjs from '@emailjs/browser'
import './css/index.css'
import './css/main.css'

gsap.registerPlugin(ScrollTrigger)

// Custom Icon Component
const CustomIcon = ({ name, className = '' }) => {
  const iconRef = useRef(null)

  useEffect(() => {
    if (iconRef.current) {
      const request = new XMLHttpRequest()
      request.open('GET', `/assets/icons/${name}.svg`)
      request.setRequestHeader('Content-Type', 'image/svg+xml')
      request.addEventListener('load', (event) => {
        if (event.target.status === 200) {
          const response = event.target.responseText
          iconRef.current.innerHTML = response
        }
      })
      request.send()
    }
  }, [name])

  return <i ref={iconRef} data-custom-icon={name} className={className}></i>
}

// Navbar Component
const Navbar = () => {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('theme')
    if (!stored) return window.matchMedia('(prefers-color-scheme:dark)').matches
    try {
      return JSON.parse(stored)
    } catch {
      return stored === 'dark'
    }
  })
  const [sidebarVisible, setSidebarVisible] = useState(false)
  const navbarRef = useRef(null)
  const routesRef = useRef([])

  useEffect(() => {
    // Set initial theme
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
    localStorage.setItem('theme', JSON.stringify(isDark))
  }, [isDark])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        navbarRef.current?.classList.add('drop')
      } else {
        navbarRef.current?.classList.remove('drop')
      }

      const sections = document.querySelectorAll('section')
      sections.forEach((section) => {
        const top = window.scrollY
        const offset = section.offsetTop - 100
        const height = section.offsetHeight
        const id = section.getAttribute('id')

        if (top >= offset && top < offset + height) {
          routesRef.current.forEach((route) => {
            route.classList.remove('active')
            const activeRoute = document.querySelector(`#navbar .nav__routes a[href*="${id}"]`)
            if (activeRoute) activeRoute.classList.add('active')
          })
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleThemeToggle = () => {
    setIsDark(!isDark)
  }

  const handleNavClick = (e, href) => {
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
          <a href="#header" className="route active" onClick={(e) => handleNavClick(e, '#header')} ref={el => routesRef.current[0] = el}>Home</a>
          <a href="#about" className="route" onClick={(e) => handleNavClick(e, '#about')} ref={el => routesRef.current[1] = el}>About</a>
          <a href="#services" className="route" onClick={(e) => handleNavClick(e, '#services')} ref={el => routesRef.current[2] = el}>Services</a>
          <a href="#projects" className="route" onClick={(e) => handleNavClick(e, '#projects')} ref={el => routesRef.current[3] = el}>Projects</a>
          <a href="#education" className="route" onClick={(e) => handleNavClick(e, '#education')} ref={el => routesRef.current[4] = el}>Educational Qualification</a>
          <a href="#contact" className="route" onClick={(e) => handleNavClick(e, '#contact')} ref={el => routesRef.current[5] = el}>Contact</a>
        </div>
        <div className="flex__center">
          <label className="theme__toggle">
            <input type="checkbox" checked={isDark} onChange={handleThemeToggle} />
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
            <a href="#contact" className="navitem" onClick={(e) => handleNavClick(e, '#contact')}>Contact</a>
          </div>
        </div>
      </aside>
    </>
  )
}

// Header Component
const Header = () => {
  const experienceRef = useRef(null)
  const projectRef = useRef(null)
  const awardsRef = useRef(null)
  const clientsRef = useRef(null)

  useEffect(() => {
    // Odometer animation - matching original behavior
    const timer = setTimeout(() => {
      if (experienceRef.current) {
        experienceRef.current.innerHTML = '1'
        if (window.Odometer) {
          new window.Odometer({
            el: experienceRef.current,
            value: 1,
          })
        }
      }
      if (projectRef.current) {
        projectRef.current.innerHTML = '3'
        if (window.Odometer) {
          new window.Odometer({
            el: projectRef.current,
            value: 3,
          })
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
  }, [])

  const handleContactClick = (e) => {
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
            <img src="/assets/me(Casual).png" alt="" />
          </div>
          <div className="user__info">
            <h2 className="sub__title">Hi 👋, I'm Manoranjith Dhanapal</h2>
            <h1 className="title">Mern Stack Developer</h1>
            <p className="description">
              I specialize in building modern, responsive, and user-friendly web
              interfaces. With a passion for clean code and seamless user
              experiences, I turn ideas into digital solutions that not only
              look great but also perform flawlessly. Let's work together to
              bring your vision to life!
            </p>
            <div className="flex buttons">
              <div className="flex social__handles">
                <a href="https://github.com/Manoranjith46" target="_blank" className="icon__container handle">
                  <CustomIcon name="github" />
                </a>
                <a href="https://www.linkedin.com/in/manoranjith-d/" target="_blank" className="icon__container handle">
                  <CustomIcon name="linkedin" />
                </a>
                <a href="https://wa.me/919025199507" target="_blank" className="icon__container handle">
                  <CustomIcon name="whatsapp" />
                </a>
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

// About Component
const About = () => {
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

  const handleContactClick = (e) => {
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
                <img src="/assets/me(Blazer).png" alt="" />
              </div>
              <div className="details">
                <h4>Manoranjith Dhanapal</h4>
                <p className="text__muted">Mern Stack Developer</p>
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
              <div className="flex__center btn stack">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <CustomIcon name="javascript" /> Javascript
                </span>
              </div>
              <div className="flex__center btn stack">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <CustomIcon name="react" /> ReactJs
                </span>
              </div>
              <div className="flex__center btn stack">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <CustomIcon name="flutter" /> Flutter
                </span>
              </div>
              <div className="flex__center btn stack">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <CustomIcon name="nodejs" /> NodeJs
                </span>
              </div>
              <div className="flex__center btn stack">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <CustomIcon name="express" /> ExpressJs
                </span>
              </div>
              <div className="flex__center btn stack">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <CustomIcon name="bootstrap" /> Bootstrap
                </span>
              </div>
              <div className="flex__center btn stack">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <img src="assets/icons/mongodb.png" alt="" /> MongoDB
                </span>
              </div>

{/* To Add Future Skills */}

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

// Services Component
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

  const handleContactClick = (e) => {
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

// Projects Component
const Projects = () => {
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
    .from('#projects .project', { opacity: 0, y: 30, stagger: 0.5, immediateRender: false })

    return () => {
      tl.kill()
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  const projects = [
    {
      id: 1,
      image: '/assets/project1.jpg',
      title: 'Create the Ultimate Animated Portfolio',
      description: 'This project serves as a central hub for my professional identity. Rather than using a template, I built this from the ground up to ensure maximum performance, SEO optimization, and a seamless user experience across all devices. The site features a clean, modern UI designed to highlight my project work and technical skills without unnecessary friction.',
    }
    // {
    //   id: 2,
    //   image: '/assets/project2.png',
    //   title: 'Designer portfolio with reactjs',
    //   description: 'A sleek and modern designer portfolio built with Next.js, showcasing responsive design, fast performance, and seamless navigation. Perfect for creative professionals looking to display their work in style',
    // }
    // {
    //   id: 3,
    //   image: '/assets/project3.png',
    //   title: 'Build Modern Animated Video Conferencing Web App With ReactJs And ZegoCloud',
    //   description: 'Create a cutting-edge, animated video conferencing web app using ReactJS and ZegoCloud. This project combines real-time communication with sleek design, delivering a smooth, interactive user experience for virtual meetings.',
    // },
    // {
    //   id: 4,
    //   image: '/assets/project4.png',
    //   title: 'Modern solar website',
    //   description: 'Develop a modern solar energy website designed for clean, sustainable solutions. Featuring a sleek interface, responsive design, and user-friendly navigation, this site highlights the power and efficiency of solar technology.',
    // },
  ]

  return (
    <section id="projects">
      <div className="container">
        <div className="section__header">
          <h2 className="sub__title">My Recent Projects</h2>
          <p className="description">
            Explore my latest work, blending creativity and code for functional,
            responsive websites with clean design and seamless user experiences.
          </p>
        </div>
        <div className="projects">
          {projects.map((project) => (
            <div key={project.id} className="project">
              <a href="#" target="_blank" className="picture">
                <img src={project.image} alt={project.title} />
              </a>
              <div className="flex details">
                <h3 className="line__clamp__1">{project.title}</h3>
                <p className="text__muted description line__clamp__4">{project.description}</p>
                <div className="flex bottom">
                  <a href="#" target="_blank" className="flex__center btn">
                    <SquareArrowOutUpRight /> View Demo
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


// Educational Component
const Education = () => {
  const Qualifications = [
    {
      id: 1,
      title: "Secondary School Leaving Certificate - SSLC",
      institute: "G.R.Matric.Hr.Sec.School",
      percent: "100%",
      YOP: "2020 - 2021"
    },{
      id: 2,
      title: "Higher Secondary Certificate - HSC",
      institute: "G.R.Matric.Hr.Sec.School",
      percent: "72%",
      YOP: "2022 - 2023"
    },
    {
      id: 3,
      title: "B.E(Computer Science and Engineering)",
      institute: "K.S.R.College Of Engineering",
      percent: "7.1",
      YOP: "2023 - 2027"
    }
  ]

  return (
    <section id="education">
      <div className="section__header">
        <h2 className="sub__title">
          <span className="primary">Educational Qualifications</span>
        </h2>
      </div>
      <div className="edus">
        {Qualifications.map((Qualification) => (
          <div key={Qualification.id} className="edu">
            <div className="flex user">
              <div className="details">
                <h2 className="name">{Qualification.title}</h2>
                <h4 className="name">{Qualification.institute}</h4>
                <div className="flex row">
                  <p className="text__muted position">{Qualification.id==3?"CGPA":"Percentage"} : {Qualification.percent}</p>
                  <p className="primary company">Year Of Pasing : {Qualification.YOP}</p>
                </div>
              </div>
            </div>
            <p className="text__muted content">{Qualification.college}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

// Contact Component
const Contact = () => {
  useEffect(() => {
    const tl = gsap.timeline({
      delay: 0.5,
      scrollTrigger: {
        trigger: '#contact',
        start: '20% bottom',
        end: 'bottom top',
      },
    })
    tl.from('#contact .box', { opacity: 0, y: 30, stagger: 0.5, immediateRender: false })
      .from('#contact .contact__form', { opacity: 0, x: 30, immediateRender: false })

    return () => {
      tl.kill()
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const form = e.target
    const firstname = form.firstname.value.trim()
    const lastname = form.lastname.value.trim()
    const email = form.email.value.trim()
    const phone = form.phone.value.trim()
    const message = form.message.value.trim()

    // Validation
    if (!firstname || !lastname || !email || !phone || !message) {
      alert('All fields are required.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Please enter a valid email address.')
      return
    }

    if (!/^\d{10,}$/.test(phone.replace(/\D/g, ''))) {
      alert('Please enter a valid phone number (at least 10 digits).')
      return
    }

    // Send email using EmailJS
    emailjs.send(
      'mailto_mano', // Replace with your EmailJS service ID
      'mailto_mano_template', // Replace with your EmailJS template ID
      {
        name: `${firstname} ${lastname}`,
        from_email: email,
        time: new Date().toLocaleString(),
        mobile: phone,
        message: message,
        to_name: 'Manoranjith',
      },
      'vGYFhAtmaUDVyTYGY' // Replace with your EmailJS public key
    )
    .then(() => {
      alert('Message sent successfully!')
      form.reset()
    }, (error) => {
      alert('Failed to send message. Please try again.')
      console.error('EmailJS error:', error)
    })
  }

  return (
    <section id="contact">
      <div className="container">
        <div className="left__column">
          <div className="box">
            <div className="cluster">
              <h2 className="sub__title">
                Let's <span className="primary">create something</span> amazing
                together!
              </h2>
              <p className="description">
                Feel free to reach out for projects, collaborations, or web
                development inquiries via the form or email!
              </p>
            </div>
            <CustomIcon name="list-option-ui" className="list__ui" />
          </div>
          <div className="box">
            <div className="cluster">
              <div className="flex option">
                <div className="icon__container">
                  <AtSign />
                </div>
                <div className="details">
                  <h3 className="name">Email</h3>
                  <p className="text__muted value">manoranjithd46@gmail.com</p>
                </div>
              </div>
              <div className="flex option">
                <div className="icon__container">
                  <Phone />
                </div>
                <div className="details">
                  <h3 className="name">Phone</h3>
                  <p className="text__muted value">+91 90251 99507</p>
                </div>
              </div>
              <div className="flex option">
                <div className="icon__container">
                  <MapPin />
                </div>
                <div className="details">
                  <h3 className="name">Address</h3>
                  <p className="text__muted value">Omalur,Salem,TamilNadu-636011</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <form className="contact__form" onSubmit={handleSubmit}>
          <div className="spotlight"></div>
          <h2 className="sub__title">
            Let's work <span className="primary">together!</span>
          </h2>
          <div className="row">
            <input
              type="text"
              placeholder="First name"
              name="firstname"
              className="control"
            />
            <input
              type="text"
              placeholder="Last name"
              name="lastname"
              className="control"
            />
          </div>
          <div className="row">
            <input
              type="email"
              placeholder="Email address"
              name="email"
              className="control"
            />
            <input
              type="tel"
              placeholder="Phone number"
              name="phone"
              className="control"
            />
          </div>
          <textarea
            name="message"
            placeholder="Message"
            className="control"
          ></textarea>
          <button type="submit" className="btn btn__primary submit__btn">
            Send Now
          </button>
        </form>
      </div>
    </section>
  )
}

// Footer Component
const Footer = () => {
  const handleNavClick = (e, href) => {
    e.preventDefault()
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
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
            <p className="text__muted description">
              Crafting responsive, high-performance websites 🌐 with clean code
              💻 and a user-focused approach 👥. Let's build something amazing
              together 🚀.
            </p>
            <div className="flex social__handles">
              <a href="https://github.com/Manoranjith46" target="_blank" className="icon__container handle">
                <CustomIcon name="github" />
              </a>
              <a href="https://www.linkedin.com/in/manoranjith-d/" target="_blank" className="icon__container handle">
                <CustomIcon name="linkedin" />
              </a>
              <a href="https://wa.me/919025199507" target="_blank" className="icon__container handle">
                <CustomIcon name="whatsapp" />
              </a>
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
          {/* <p className="text__muted">
            Build by Aslicecode Team
          </p> */}
        </div>
      </div>
    </footer>
  )
}

// Main App Component
function App() {
  useEffect(() => {
    // Prevent color flashing - set theme before render
    const storageKey = 'theme'
    const mql = window.matchMedia('(prefers-color-scheme:dark)')
    const storedTheme = localStorage.getItem(storageKey)
    const darkMode = storedTheme ? JSON.parse(storedTheme) : mql.matches
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
  }, [])

  return (
    <>
      <Navbar />
      <Header />
      <About />
      <Services />
      <Projects />
      <Education />
      <Contact />
      <Footer />
    </>
  )
}

export default App
