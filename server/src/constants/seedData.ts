import type {
  PortfolioProfileDoc,
  SkillDoc,
  EducationDoc,
  ProjectDoc,
  ServiceDoc,
  SiteSettingsDoc,
} from '../types/firestore.js'

export const SEED_PROFILE: PortfolioProfileDoc = {
  name: 'Manoranjith Dhanapal',
  title: 'Mern Stack Developer',
  subtitle: "Hi 👋, I'm Manoranjith Dhanapal",
  description:
    "I specialize in building modern, responsive, and user-friendly web interfaces. With a passion for clean code and seamless user experiences, I turn ideas into digital solutions that not only look great but also perform flawlessly. Let's work together to bring your vision to life!",
  yearsOfExperience: 1,
  completedProjects: 3,
  avatarUrl: '/assets/me(Casual).png',
  heroImageUrl: '/assets/me(Blazer).png',
  email: 'manoranjithd46@gmail.com',
  phone: '+91 90251 99507',
  location: 'Omalur,Salem,TamilNadu-636011',
  footerDescription:
    "Crafting responsive, high-performance websites 🌐 with clean code 💻 and a user-focused approach 👥. Let's build something amazing together 🚀.",
  socialLinks: {
    github: 'https://github.com/Manoranjith46',
    linkedin: 'https://www.linkedin.com/in/manoranjith-d/',
    whatsapp: 'https://wa.me/919025199507',
  },
}

export const SEED_SKILLS: SkillDoc[] = [
  { name: 'Typescript', category: 'frontend', icon: 'typescript.png', iconType: 'png', displayOrder: 0 },
  { name: 'ReactJs', category: 'frontend', icon: 'react', iconType: 'svg', displayOrder: 1 },
  { name: 'NextJs', category: 'frontend', icon: 'nextjs.png', iconType: 'png', displayOrder: 2 },
  { name: 'Flutter', category: 'mobile', icon: 'flutter', iconType: 'svg', displayOrder: 3 },
  { name: 'NodeJs', category: 'backend', icon: 'nodejs', iconType: 'svg', displayOrder: 4 },
  { name: 'ExpressJs', category: 'backend', icon: 'express', iconType: 'svg', displayOrder: 5 },
  { name: 'Bootstrap', category: 'frontend', icon: 'bootstrap', iconType: 'svg', displayOrder: 6 },
  { name: 'MongoDB', category: 'database', icon: 'mongodb.png', iconType: 'png', displayOrder: 7 },
  { name: 'Postgrsql', category: 'database', icon: 'postgresql.png', iconType: 'png', displayOrder: 8 },
  { name: 'Figma', category: 'design', icon: 'figma.png', iconType: 'png', displayOrder: 9 },
  { name: 'Firebase', category: 'backend', icon: 'firebase.png', iconType: 'png', displayOrder: 10 },
  { name: 'GoogleCloud', category: 'cloud', icon: 'google-cloud.png', iconType: 'png', displayOrder: 11 },
  { name: 'Python', category: 'language', icon: 'python.png', iconType: 'png', displayOrder: 12 },
  { name: 'Java', category: 'language', icon: 'java.png', iconType: 'png', displayOrder: 13 },
]

export const SEED_PROJECTS: ProjectDoc[] = [
  {
    title: 'Create the Ultimate Animated Portfolio',
    description:
      'This project serves as a central hub for my professional identity. Rather than using a template, I built this from the ground up to ensure maximum performance, SEO optimization, and a seamless user experience across all devices. The site features a clean, modern UI designed to highlight my project work and technical skills without unnecessary friction.',
    image: '/assets/project1.jpg',
    link: 'https://manoranjithd.vercel.app/',
    displayOrder: 0,
    hidden: false,
    pinned: false,
    featured: true,
  },
  {
    title: 'Animated Video Conferencing App',
    description:
      'Create a cutting-edge, animated video conferencing web app using ReactJS and ZegoCloud. This project combines real-time communication with sleek design, delivering a smooth, interactive user experience for virtual meetings.',
    image: '/assets/project3.png',
    link: 'https://km-pg.vercel.app/login',
    displayOrder: 1,
    hidden: false,
    pinned: false,
    featured: false,
  },
  {
    title: 'Build and deployed a MERN Stack Web App',
    description:
      'ResidentHub is a comprehensive PG/Hostel management system that bridges the gap between property owners and residents. It provides a powerful Admin Portal for managing day-to-day operations and a sleek Resident Portal for tenants to interact with their hostel digitally — from toggling meals to paying rent.',
    image: '/assets/project2.png',
    link: 'https://real--estate--ai.vercel.app/',
    displayOrder: 2,
    hidden: false,
    pinned: false,
    featured: true,
  },
]

export const SEED_EDUCATION: EducationDoc[] = [
  {
    title: 'Secondary School Leaving Certificate - SSLC',
    institute: 'G.R.Matric.Hr.Sec.School',
    percent: '100%',
    gradeType: 'Percentage',
    yearOfPassing: '2020 - 2021',
    displayOrder: 0,
  },
  {
    title: 'Higher Secondary Certificate - HSC',
    institute: 'G.R.Matric.Hr.Sec.School',
    percent: '72%',
    gradeType: 'Percentage',
    yearOfPassing: '2022 - 2023',
    displayOrder: 1,
  },
  {
    title: 'B.E(Computer Science and Engineering)',
    institute: 'K.S.R.College Of Engineering',
    percent: '7.1',
    gradeType: 'CGPA',
    yearOfPassing: '2023 - 2027',
    displayOrder: 2,
  },
]

export const SEED_SERVICES: ServiceDoc[] = [
  {
    name: 'Responsive Web Design',
    description:
      'Crafting visually appealing and fully responsive websites that adapt seamlessly to any device, ensuring an excellent user experience on desktops, tablets, and smartphones.',
    icon: 'Smartphone',
    displayOrder: 0,
  },
  {
    name: 'Custom Web Development',
    description:
      'Building dynamic, interactive web applications tailored to your specific needs, using modern frontend technologies to create scalable and maintainable solutions.',
    icon: 'Code',
    displayOrder: 1,
  },
  {
    name: 'UI/UX Optimization',
    description:
      'Enhancing user engagement with intuitive and aesthetically pleasing interfaces, prioritizing performance, accessibility, and smooth navigation for optimal user satisfaction.',
    icon: 'PencilRuler',
    displayOrder: 2,
  },
]

export const SEED_SETTINGS: SiteSettingsDoc = {
  seo: {
    pageTitle: 'Manoranjith Dhanapal — MERN Stack Developer',
    metaDescription:
      'Portfolio of Manoranjith Dhanapal — MERN Stack Developer building modern, responsive web applications.',
    canonicalUrl: 'https://manoranjithd.vercel.app',
  },
  socialLinks: SEED_PROFILE.socialLinks,
  contact: {
    email: SEED_PROFILE.email!,
    phone: SEED_PROFILE.phone!,
    location: SEED_PROFILE.location!,
    enableContactForm: true,
  },
  featureFlags: {
    showBlog: false,
    showCertifications: false,
    showAnalytics: true,
    enableContactForm: true,
    showResumeDownload: false,
    showTestimonials: false,
    maintenanceMode: false,
  },
  theme: {
    primaryColor: '#5100ff',
    accentColor: '#3300ff',
    fontFamily: 'Sora',
    borderRadius: '0.8rem',
    animationSpeed: '400ms',
    mode: 'dark',
  },
  analyticsEnabled: true,
}

export const DEFAULT_ADMIN_EMAIL = 'manoranjithd46@gmail.com'
export const DEFAULT_ADMIN_PASSWORD = 'admin123'
export const DEFAULT_ADMIN_NAME = 'Manoranjith Dhanapal'
