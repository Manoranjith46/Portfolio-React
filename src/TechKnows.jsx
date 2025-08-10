import './App.css'
import Navbar from './Navbar.jsx'

const skills = [
  { 
    name: 'JavaScript',
    icon: '🟨' 
  },
  { 
    name: 'React', 
    icon: '⚛️' 
  },
  { 
    name: 'HTML5', 
    icon: '🟧' 
  },
  { 
    name: 'CSS3', 
    icon: '🟦' 
  },
  { 
    name: 'Node.js', 
    icon: '🟩' 
  },
  { 
    name: 'Python', 
    icon: '🐍' 
  },
  { 
    name: 'Git', 
    icon: '🔧' 
  }
]

function TechKnows() {
  return (
    <section className="skills-section">
      <Navbar />
      <h2 className="skills-title">Tech Knows</h2>
      <p className="skills-desc">Here are some of the tools and technologies I love to use:</p>
      <div className="skills-grid">
        {skills.map((skill, idx) => (
          <div className="skill-card" key={idx}>
            <span className="skill-icon" role="img" aria-label={skill.name}>{skill.icon}</span>
            <span className="skill-name">{skill.name}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default TechKnows 