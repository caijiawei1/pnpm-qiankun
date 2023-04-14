import React from 'react'
import ReactDOM, { Root } from 'react-dom/client'

import {
  renderWithQiankun,
  qiankunWindow,
  QiankunProps,
} from 'vite-plugin-qiankun/dist/helper'

export interface MountProps {
  name?: string
  container?: any
  onGlobalStateChange?: any
  setGlobalState?: any
  context?: any
  next?: any
  useComponent?: any
  state?: any
}

export let app: Root | null = null

export function render(props: MountProps = {}) {
  const { container, next, state } = props
  if (next && !state?.load) return next?.([], props)

  const target: HTMLElement = container
    ? container.querySelector('#app')
    : document.querySelector('#app')
  app = ReactDOM.createRoot(target)

  app.render(<>12123</>)
}

export function storeTest(props: MountProps) {
  props.onGlobalStateChange &&
    props.onGlobalStateChange(
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      (value: any, prev: any) => {},
      true,
    )
  props.setGlobalState &&
    props.setGlobalState({
      ignore: props.name,
      user: {
        name: props.name,
      },
    })
}

renderWithQiankun({
  bootstrap() {
    // console.log('[react] react app bootstraped');
  },
  mount(props: MountProps) {
    render(props)
    storeTest(props)
  },
  update: function (_props: QiankunProps): void | Promise<void> {
    throw new Error('Function not implemented.')
  },
  unmount() {
    if (app) {
      app.unmount()
      app = null
    }
  },
})

if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render()
}
