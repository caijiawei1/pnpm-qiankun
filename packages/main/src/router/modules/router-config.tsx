import { RouteObject } from 'react-router-dom'
import lazyLoad from '../utils/lazyLoad'
import { lazy } from 'react'

const devOpsRouter: { [key: string]: RouteObject }[] = [
  {
    login: {
      element: lazyLoad(lazy(() => import('@/pages/login'))),
    },
  },
]

export default devOpsRouter
