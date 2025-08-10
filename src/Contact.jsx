import './App.css'
import Navbar from './Navbar'

function Contact() {
  return (
    <section className="contact-section">
      <Navbar />
      <h2 className="contact-title">Send Me a Postcard!</h2>
      <p className="contact-desc"><strong>Have an idea, collaboration, or just want to say hello?</strong></p>
      <h4>Drop a message below and let’s connect!</h4>
      <form className="postcard-form">
        <div className="postcard">
          <textarea className="postcard-message" placeholder="Write your message here..." required></textarea>
          <input className="postcard-from" type="text" placeholder="Your Name (stamp)" required />
          <button className="postcard-send" type="submit">Send ✉️</button>
        </div>
      </form>
    </section>
  )
}

export default Contact;