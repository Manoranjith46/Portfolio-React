import './App.css'
import Navbar from './Navbar.jsx'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <>
        <Navbar />
        <div id="home_imgs">
            <div id="Home">
                <h1 class="Home1">Hello,I am <span class="name">Manoranith D</span></h1>
                <h3 class="Home2">I am a <span class="role">Engineering Student</span> </h3>
                <div class="Home3">
                    <div class="cv">
                        <a href=""><button>Download CV</button></a>
                        <Link to="/contact"><button>Contact Me</button></Link>
                    </div>
                    <div class="btn">
                        <a class="link" target="_blank" href="https://www.linkedin.com/in/manoranjith-d-52061528b">
                            <img src="src/assets/Icons/Linkedin.png" alt="LinkedIn" />
                        </a>
                        <a class="link" target="_blank" href="https://github.com/Manoranjith46">
                            <img src="src/assets/Icons/Github.png" alt="GitHub" />
                        </a>
                        <a class="link" target="_blank" href="https://wa.me/qr/LL7R2KKKQEIXJ1">
                            <img src="src/assets/Icons/Whatsapp.png" alt="WhatsApp" />
                        </a>
                        <a class="link" target="_blank" href="https://www.instagram.com/manoranjith_d">
                            <img src="src/assets/Icons/Instagram.png" alt="Instagram" />
                        </a>
                    </div>
                </div>
            </div>
            <div class="home-img">
                <div class="img-box">
                    <div class="img-item">
                        <img src="src/assets/E-Commerce.png" alt="" srcset=""/>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default Home 