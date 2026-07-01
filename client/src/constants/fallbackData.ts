import type { PortfolioProfile, Skill, Education, Experience } from '@/types/portfolio'
import type { Project } from '@/types/project'

export const FALLBACK_PROFILE: PortfolioProfile = {
  name: 'Manoranjith Dhanapal',
  title: 'Mern Stack Developer',
  subtitle: "Hi 👋, I'm Manoranjith Dhanapal",
  description:
    'I specialize in building modern, responsive, and user-friendly web interfaces. With a passion for clean code and seamless user experiences, I turn ideas into digital solutions that not only look great but also perform flawlessly. Let\'s work together to bring your vision to life!',
  yearsOfExperience: 1,
  completedProjects: 3,
  avatarUrl: '/assets/me(Casual).png',
  heroImageUrl: '/assets/me(Blazer).png',
  email: 'manoranjithd46@gmail.com',
  phone: '+91 90251 99507',
  location: 'Omalur,Salem,TamilNadu-636011',
  socialLinks: {
    github: 'https://github.com/Manoranjith46',
    linkedin: 'https://www.linkedin.com/in/manoranjith-d/',
    whatsapp: 'https://wa.me/919025199507',
  },
}

export const FALLBACK_SKILLS: Skill[] = [
  { name: 'Typescript', category: 'frontend', icon: 'typescript.png', iconType: 'png' },
  { name: 'ReactJs', category: 'frontend', icon: 'react', iconType: 'svg' },
  { name: 'NextJs', category: 'frontend', icon: 'nextjs.png', iconType: 'png' },
  { name: 'Flutter', category: 'mobile', icon: 'flutter', iconType: 'svg' },
  { name: 'NodeJs', category: 'backend', icon: 'nodejs', iconType: 'svg' },
  { name: 'ExpressJs', category: 'backend', icon: 'express', iconType: 'svg' },
  { name: 'Bootstrap', category: 'frontend', icon: 'bootstrap', iconType: 'svg' },
  { name: 'MongoDB', category: 'database', icon: 'mongodb.png', iconType: 'png' },
  { name: 'Postgrsql', category: 'database', icon: 'postgresql.png', iconType: 'png' },
  { name: 'Figma', category: 'design', icon: 'figma.png', iconType: 'png' },
  { name: 'Firebase', category: 'backend', icon: 'firebase.png', iconType: 'png' },
  { name: 'GoogleCloud', category: 'cloud', icon: 'google-cloud.png', iconType: 'png' },
  { name: 'Python', category: 'language', icon: 'python.png', iconType: 'png' },
  { name: 'Java', category: 'language', icon: 'java.png', iconType: 'png' },
]

export const FALLBACK_PROJECTS: Project[] = [
  {
    id: 1,
    image: '/assets/project1.jpg',
    title: 'Create the Ultimate Animated Portfolio',
    description:
      'This project serves as a central hub for my professional identity. Rather than using a template, I built this from the ground up to ensure maximum performance, SEO optimization, and a seamless user experience across all devices. The site features a clean, modern UI designed to highlight my project work and technical skills without unnecessary friction.',
    link: 'https://manoranjithd.vercel.app/',
  },
  {
    id: 2,
    image: '/assets/project3.png',
    title: '',
    description:
      'Create a cutting-edge, animated video conferencing web app using ReactJS and ZegoCloud. This project combines real-time communication with sleek design, delivering a smooth, interactive user experience for virtual meetings.',
    link: 'https://km-pg.vercel.app/login',
  },
  {
    id: 3,
    image: '/assets/project2.png',
    title: 'Build and deployed a MERN Stack Web App',
    description:
      'ResidentHub is a comprehensive PG/Hostel management system that bridges the gap between property owners and residents. It provides a powerful Admin Portal for managing day-to-day operations and a sleek Resident Portal for tenants to interact with their hostel digitally — from toggling meals to paying rent.',
    link: 'https://real--estate--ai.vercel.app/',
  },
]

export const FALLBACK_EDUCATION: Education[] = [
  {
    id: '1',
    title: 'Secondary School Leaving Certificate - SSLC',
    institute: 'G.R.Matric.Hr.Sec.School',
    percent: '100%',
    gradeType: 'Percentage',
    yearOfPassing: '2020 - 2021',
  },
  {
    id: '2',
    title: 'Higher Secondary Certificate - HSC',
    institute: 'G.R.Matric.Hr.Sec.School',
    percent: '72%',
    gradeType: 'Percentage',
    yearOfPassing: '2022 - 2023',
  },
  {
    id: '3',
    title: 'B.E(Computer Science and Engineering)',
    institute: 'K.S.R.College Of Engineering',
    percent: '7.1',
    gradeType: 'CGPA',
    yearOfPassing: '2023 - 2027',
  },
]

export const FALLBACK_EXPERIENCE: Experience[] = []

export const FALLBACK_SERVICES = [
  {
    name: 'Responsive Web Design',
    description:
      'Crafting visually appealing and fully responsive websites that adapt seamlessly to any device, ensuring an excellent user experience on desktops, tablets, and smartphones.',
    icon: 'Smartphone',
  },
  {
    name: 'Custom Web Development',
    description:
      'Building dynamic, interactive web applications tailored to your specific needs, using modern frontend technologies to create scalable and maintainable solutions.',
    icon: 'Code',
  },
  {
    name: 'UI/UX Optimization',
    description:
      'Enhancing user engagement with intuitive and aesthetically pleasing interfaces, prioritizing performance, accessibility, and smooth navigation for optimal user satisfaction.',
    icon: 'PencilRuler',
  },
]

export const FOOTER_DESCRIPTION =
  "Crafting responsive, high-performance websites 🌐 with clean code 💻 and a user-focused approach 👥. Let's build something amazing together 🚀."
