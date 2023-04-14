import React from 'react'
import { useLocation, useRoutes } from 'react-router-dom'

export default () => {
  const { pathname } = useLocation()

  console.log(pathname, 'pathname')

  const element = useRoutes([
    {
      path: '/react',
      element: <div style={{ paddingTop: '64px' }}>react</div>,
    },
    {
      path: '/vue',
      element: <div style={{ paddingTop: '64px' }}>vue</div>,
    },
  ])

  return element
}
