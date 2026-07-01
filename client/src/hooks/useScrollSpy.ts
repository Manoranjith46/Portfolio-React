import { useEffect, useRef } from 'react'

export function useScrollSpy(navbarSelector = '#navbar') {
  const navbarRef = useRef<HTMLElement>(null)
  const routesRef = useRef<(HTMLAnchorElement | null)[]>([])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        navbarRef.current?.classList.add('drop')
      } else {
        navbarRef.current?.classList.remove('drop')
      }

      const sections = document.querySelectorAll('section')
      sections.forEach((section) => {
        const top = window.scrollY
        const offset = section.offsetTop - 100
        const height = section.offsetHeight
        const id = section.getAttribute('id')

        if (id && top >= offset && top < offset + height) {
          routesRef.current.forEach((route) => {
            route?.classList.remove('active')
          })
          const activeRoute = document.querySelector(
            `${navbarSelector} .nav__routes a[href*="${id}"]`,
          )
          activeRoute?.classList.add('active')
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [navbarSelector])

  return { navbarRef, routesRef }
}
