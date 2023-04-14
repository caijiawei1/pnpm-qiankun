import App from './App'
import { apps } from './micro/micro.config.json'
import { createRoot } from 'react-dom/client'

window.__MICRO_APP__NAME__ = 'main'
window.__MICRO_APPS__ = apps

async function main() {
  const dom = document.getElementById('root') as HTMLElement
  if (dom) {
    const root = createRoot(dom)
    root.render(<App />)
  }
}

main()
