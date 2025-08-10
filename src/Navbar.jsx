import { Link } from 'react-router-dom'
import './App.css'

function Navbar() {
  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/qualifications">Qualifications</Link></li>
        <li><Link to="/projects">Projects</Link></li>
        <li><Link to="/tech-knows">Tech Knows</Link></li>
        <li><Link to="/contact">Contact</Link></li>
      </ul>
    </nav>
  )
}

export default Navbar 