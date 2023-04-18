import { lazy } from 'react'
import { Outlet, RouteObject } from 'react-router-dom'
import lazyLoad from '../utils/lazyLoad'

// 登录模块
const loginRouter: Array<RouteObject> = [
  {
    element: <Outlet />,
    children: [
      {
        path: '/login',
        element: lazyLoad(lazy(() => import('@/pages/login'))),
      },
    ],
  },
]

export default loginRouter
