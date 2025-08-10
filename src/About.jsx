import './App.css'
import Navbar from './Navbar.jsx'

function About() {
  return (
    <section className="about-section">
      <Navbar />
      <h1 className="about-title">About Me</h1>
      <div className="timeline">
          <div className="timeline-content">
            <div className="about-section-block">
              <h3>Career Goals</h3>
              <p className="about-align">
                As a passionate aspiring full-stack developer,I am dedicated to building efficient and scalable web applications that address real-world challenges and create meaningful value for users and businesses. My approach blends technical expertise with creativity, continuous learning, and hands-on experience. I thrive in collaborative environments, enjoy exploring emerging technologies, and am committed to transforming innovative ideas into impactful digital solutions.
              </p>
            </div>
            <div className="about-section-block">
              <h3>Technical Focus</h3>
              <p>Strong interest in full-stack development and Generative AI</p>
              <p>Solid foundation in programming, data structures, and algorithms</p>
            </div>
            <div className="about-section-block">
              <h3>Internship Experience</h3>
              <div><strong>AI & ML Intern</strong> at United IT and Cadd</div>
              <div><strong>Cloud Computing (AWS) Intern</strong> at Thiran360AI</div>
            </div>
            <div className="about-section-block">
              <h3>Skills & Technologies</h3>
              <p>HTML, CSS, JavaScript, React, Node.js</p>
              <p>Exploring GenAI applications for enhanced user experience</p>
            </div>
          </div>
        </div>
    </section>
  )
}

export default About 