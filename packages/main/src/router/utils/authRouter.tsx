import { useLocation, matchRoutes, Navigate } from 'react-router-dom'
import locache from './locache'
import { concat } from 'lodash-es'
import { rootRouter } from '..'
import { observer } from '@/store'

export const getPaths = (path?: any) => {
  return path?.startsWith('/') ? path?.replace('/', '') : path
}

/**
 * @description 路由守卫组件
 * */
export const AuthRouter = observer((props: { children: JSX.Element }) => {
  const { pathname } = useLocation()
  if (pathname === '/login') return props.children
  const matchRoute = matchRoutes(
    concat(routerStore.routerModules, rootRouter),
    pathname,
  )
  // * 如果访问的地址没有在路由表中重定向到403页面
  if (!matchRoute)
    return <Navigate to={`${routerStore.defaultPaths || '/403'}`} />
  // * 访问权限后续迁移到发送请求的拦截器中进行判断 *
  // * 判断当前路由是否需要访问权限(不需要权限直接放行)
  if (!locache.get('sign_private_key') || !locache.get('userRouter'))
    return <Navigate to="/login" replace />
  // * 权限正常， 正常访问页面 (目前未实现错误token的判断)
  return props.children
})

export default AuthRouter
