import './App.css'
import Navbar from './Navbar.jsx'

const projects = [
  {
    title: 'E-Commerce Website',
    image: 'src/assets/E-Commerce.png',
    context: 'A fully functional e-commerce platform with product catalog, shopping cart, and secure checkout system.',
    process: 'Built with modern web technologies including React for the frontend, integrated payment processing, and responsive design for mobile and desktop users.',
    link : 'https://indigo-roxane-97.tiiny.site/'
  },
  {
    title: 'Instagram-App(cloned)',
    image: 'src/assets/Insta.jpg',
    context: 'A social media application that replicates Instagram\'s core features including photo sharing, user profiles, and feed functionality.',
    process: 'Developed using React and modern web development practices, focusing on responsive design and smooth user interactions similar to the original Instagram experience.',
    link : 'https://github.com/Manoranjith46/Instagram-App.git'
  }
]

function Projects() {
  return (
    <section className="projects-section">
      <Navbar />
      <h2 className="projects-title">Featured Projects</h2>
      <div className="projects-grid">
        {projects.map((proj, idx) => (
          <div className="project-card" key={idx}>
            <img src={proj.image} alt={proj.title} className="project-img" />
            <h3>{proj.title}</h3>
            <p className="project-context">{proj.context}</p>
            <p className="project-process">{proj.process}</p>
            <a target="_blank" href={proj.link}><button>View Project</button></a>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Projects 