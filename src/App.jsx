import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './Home'
import About from './About'
import Projects from './Projects'
import TechKnows from './TechKnows'
import Contact from './Contact'
import Qualifications from './Qualifications'
import './App.css'

function App() {
  return (
    <Router>
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/qualifications" element={<Qualifications />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/tech-knows" element={<TechKnows />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
