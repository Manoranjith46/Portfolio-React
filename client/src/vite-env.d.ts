/// <reference types="vite/client" />

interface OdometerOptions {
  el: HTMLElement
  value: number
}

declare class Odometer {
  constructor(options: OdometerOptions)
}

interface HljsStatic {
  highlightAll: () => void
}

declare global {
  interface Window {
    Odometer?: typeof Odometer
    hljs?: HljsStatic
  }
}

export {}
