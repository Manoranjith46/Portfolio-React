# 🌐 Personal Portfolio Website

A modern, high-performance personal portfolio built with **React** to showcase my professional journey, full-stack development projects, and UI/UX design capabilities. This application serves as a digital resume, featuring a clean interface and seamless user experience.

## ✨ Features

* **Interactive Project Showcase:** Dynamic grid layout displaying technical projects with GitHub and Live Demo links.
* **Responsive Design:** Mobile-first approach ensuring perfect rendering across desktops, tablets, and mobile devices.
* **Contact Integration:** Functional contact form powered by **EmailJS** for direct communication.
* **Smooth Navigation:** Intuitive routing and smooth scrolling for a polished user experience.
* **Modern UI/UX:** Clean typography, subtle animations, and professional color palette.
* **Resume Access:** Dedicated section for visitors to view or download my professional resume.

## 🛠️ Tech Stack

* **Frontend Framework:** React 19.x
* **Build Tool:** Vite
* **Styling:** CSS Modules / Modern CSS
* **Routing:** React Router DOM
* **Email Service:** EmailJS
* **Hosting/Deployment:** Vercel
* **Version Control:** Git & GitHub

## 🚀 Installation

Follow these steps to set up the project locally on your machine.

### Prerequisites

* **Node.js** (v16 or higher)
* **npm** or **yarn** package manager

### Setup Instructions

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Manoranjith46/Portfolio-React.git
    cd Portfolio-React
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env` file in the root directory to store your EmailJS credentials:
    ```env
    VITE_EMAILJS_SERVICE_ID=your_service_id
    VITE_EMAILJS_TEMPLATE_ID=your_template_id
    VITE_EMAILJS_PUBLIC_KEY=your_public_key
    ```

4.  **Start the development server**
    ```bash
    npm run dev
    ```
    The app will open in your browser at `http://localhost:5173`.

## 📖 Usage

* **Home:** Overview of professional background and key skills.
* **Projects:** Browse through project cards. Click "View Code" for repositories or "Live Demo" to see them in action.
* **Contact:** Fill out the form with your Name, Email, and Message to get in touch directly.
* **About:** Detailed timeline of education, certifications, and technical proficiencies.

## 📁 Folder Structure

```text
portfolio/
├── public/
│   └── favicon.ico            # Site favicon
├── src/
│   ├── assets/                # Images, icons, and static files
│   ├── components/            # Reusable UI components
│   │   ├── Navbar.jsx         # Navigation bar
│   │   ├── Footer.jsx         # Site footer
│   │   ├── ProjectCard.jsx    # Component for individual projects
│   │   └── ContactForm.jsx    # EmailJS integrated form
│   ├── pages/                 # Main page views (Home, About, Projects)
│   ├── styles/                # Global and component-specific styles
│   ├── App.jsx                # Main application component
│   └── main.jsx               # Application entry point
├── .env                       # Environment variables (gitignored)
├── index.html                 # HTML template
├── vite.config.js             # Vite configuration
└── package.json               # Project dependencies and scripts

```

## 🔧 Available Scripts

* `npm run dev` - Start the local development server.
* `npm run build` - Build the app for production.
* `npm run preview` - Preview the production build locally.
* `npm run lint` - Run ESLint to ensure code quality.

## 🎨 Design Features

* **Glassmorphism:** Subtle glass effects on cards and navigation elements.
* **Transitions:** Smooth fade-in and slide-up animations on scroll.
* **Typography:** Professional font pairing for high readability.
* **Adaptive Layout:** Flexbox and Grid systems used for a fluid layout that adapts to any screen size.

## 🤝 Contributing

Contributions to improve this portfolio are welcome! Here is how you can help:

1. **Fork** the repository.
2. Create a **feature branch** (`git checkout -b feature/AmazingFeature`).
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`).
4. **Push** to the branch (`git push origin feature/AmazingFeature`).
5. Open a **Pull Request**.

## 📄 License

This project is licensed under the **MIT License** - see the `LICENSE` file for details.

## 👨‍💻 Author

**Manoranjith.D**

* **Portfolio:** [https://portfolio-five-khaki-34.vercel.app/](https://portfolio-five-khaki-34.vercel.app/)
* **GitHub:** https://github.com/manoranjith46
* **LinkedIn:** [linkedin.com/in/manoranjith-d](https://linkedin.com/in/manoranjith-d)

## 📞 Contact

For collaboration, freelance opportunities, or just to say hi:

* **Email:** manoranjithd46@gmail.com
* **LinkedIn:** Connect via LinkedIn profile.
* Submit a message via the **Contact Form** on the website.

*Thanks for visiting! 🚀*