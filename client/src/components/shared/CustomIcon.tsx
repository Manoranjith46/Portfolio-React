import { useEffect, useRef } from 'react'

interface CustomIconProps {
  name: string
  className?: string
}

const CustomIcon = ({ name, className = '' }: CustomIconProps) => {
  const iconRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (iconRef.current) {
      const request = new XMLHttpRequest()
      request.open('GET', `/assets/icons/${name}.svg`)
      request.setRequestHeader('Content-Type', 'image/svg+xml')
      request.addEventListener('load', (event) => {
        const target = event.target as XMLHttpRequest
        if (target.status === 200 && iconRef.current) {
          const response = target.responseText
          iconRef.current.innerHTML = response
        }
      })
      request.send()
    }
  }, [name])

  return <i ref={iconRef} data-custom-icon={name} className={className}></i>
}

export default CustomIcon
