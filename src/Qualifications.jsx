import './App.css';
import Navbar from './Navbar.jsx'
import { useState } from 'react';

function Qualifications() {
  const [activeTab, setActiveTab] = useState('education');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <section className="qualifications-section">
      <br />
      <Navbar />
      <h2 className="qualifications-title">Educational Qualifications</h2>
      <div className="qualifications-tabs">
        <button 
          className={`qual-tab1 ${activeTab === 'education' ? 'active' : ''}`}
          onClick={() => handleTabClick('education')}
        >
          <span role="img" aria-label="education">🎓</span> Education
        </button>
        <button 
          className={`qual-tab2 ${activeTab === 'co-curricular' ? 'active' : ''}`}
          onClick={() => handleTabClick('co-curricular')}
        >
          <span role="img" aria-label="certifications">🏅</span> Co-Curricular Activities
        </button>
      </div>
      
      {activeTab === 'education' && (
        <div className="qualifications-timeline-vertical">
          <div className="qual-timeline-item left">
            <div className="qual-content">
              <h3>Secondary School Leaving Certificate (SSLC)</h3>
              <div className="qual-details">
                <span className="qual-icon" role="img" aria-label="school">🏫</span> G.R.Matric.Hr.Sec.School
              </div>
              <div className="qual-details">
                <span className="qual-icon" role="img" aria-label="score">📊</span> Pass
              </div>
              <div className="qual-details">
                <span className="qual-icon" role="img" aria-label="calendar">📅</span> 2020 - 2021
              </div>
            </div>
          </div>
          <div className="qual-timeline-dot-vertical" />
          <div className="qual-timeline-item right">
            <div className="qual-content">
              <h3>Higher Secondary School Certificate (HSC)</h3>
              <div className="qual-details">
                <span className="qual-icon" role="img" aria-label="school">🏫</span> G.R.Matric.Hr.Sec.School
              </div>
              <div className="qual-details">
                <span className="qual-icon" role="img" aria-label="score">📊</span> 72.23%
              </div>
              <div className="qual-details">
                <span className="qual-icon" role="img" aria-label="calendar">📅</span> 2018 - 2019
              </div>
            </div>
          </div>
          <div className="qual-timeline-dot-vertical" />
          <div className="qual-timeline-item left">
            <div className="qual-content">
              <h3>B.E., Computer Science and Engineering</h3>
              <div className="qual-details">
                <span className="qual-icon" role="img" aria-label="school">🏫</span> K.S.R. College of Engineering
              </div>
              <div className="qual-details">
                <span className="qual-icon" role="img" aria-label="score">📊</span> 7.26 CGPA(upto 5th sem)
              </div>
              <div className="qual-details">
                <span className="qual-icon" role="img" aria-label="calendar">📅</span> 2019 - 2023
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'co-curricular' && (
        <div className="qualifications-timeline-vertical">
          <div className="qual-timeline-item left">
            <div className="qual-content">
              <h3>Technical Symposium</h3>
              <div className="qual-details">
                <span className="qual-icon" role="img" aria-label="event">🎪</span> Paper Presentation
              </div>
              <div className="qual-details">
                <span className="qual-icon" role="img" aria-label="award">🏆</span> Participated
              </div>
              <div className="qual-details">
                <span className="qual-icon" role="img" aria-label="calendar">📅</span> 2023
              </div>
            </div>
          </div>
          <div className="qual-timeline-dot-vertical" />
          <div className="qual-timeline-item right">
            <div className="qual-content">
              <h3>Coding Competition</h3>
              <div className="qual-details">
                <span className="qual-icon" role="img" aria-label="event">💻</span> Hackathon Challenge
              </div>
              <div className="qual-details">
                <span className="qual-icon" role="img" aria-label="award">🏆</span> Reached lvl-2
              </div>
              <div className="qual-details">
                <span className="qual-icon" role="img" aria-label="calendar">📅</span> 2024
              </div>
            </div>
          </div>
          <div className="qual-timeline-dot-vertical" />
          <div className="qual-timeline-item left">
            <div className="qual-content">
              <h3>Workshop Participation</h3>
              <div className="qual-details">
                <span className="qual-icon" role="img" aria-label="event">🔧</span> Web Development Bootcamp
              </div>
              <div className="qual-details">
                <span className="qual-icon" role="img" aria-label="award">📜</span> Certificate of Completion
              </div>
              <div className="qual-details">
                <span className="qual-icon" role="img" aria-label="calendar">📅</span> 2023
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Qualifications; 