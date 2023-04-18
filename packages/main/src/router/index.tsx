import { Navigate, RouteObject, useLocation, useRoutes } from 'react-router-dom'
import { keys, isEmpty, forEach } from 'lodash-es'

// * 动态导入router
const modules: any = import.meta.glob('./modules/*.tsx', { eager: true })
const defaultModules: any = import.meta.glob('./default_modules/*.tsx', {
  eager: true,
})

export const routerMap: { [key: string]: RouteObject } = {}
export const defaultRouterMap: { [key: string]: RouteObject } = {}
// * 将所有路由存放到数组里
export const routerArray: RouteObject[] = []
export const routerTree: RouteObject[] & any = []
Object.keys(modules).forEach((item) => {
  forEach(modules[item]['default'], (vo) => {
    forEach(vo, (v, k) => {
      routerMap[k] = v
      routerTree.push({
        ...routerMap[k],
        key: k,
        id: k,
        title: k,
        value: k,
        path: k,
      })
    })
  })
})

const loop = (data?: any) => {
  forEach(data, (vo) => {
    if (!isEmpty(vo.children)) loop(vo.children)
    if (vo.path) {
      defaultRouterMap[vo.path] = vo
      const keys = vo.path.split('/')
      const key = keys?.slice?.(1, keys.length)?.join?.('-')
      defaultRouterMap[key] = vo
      routerTree.push({
        ...defaultRouterMap[key],
        key,
        id: key,
        title: key,
        value: key,
      })
    }
  })
}

Object.keys(defaultModules).forEach((item) => {
  loop([...defaultModules[item]['default']])
  routerArray.push(...defaultModules[item]['default'])
})

console.log(routerArray)

export const defaultRouterMapKeys = keys(defaultRouterMap)

export const rootRouter: RouteObject[] = [
  ...routerArray,
  {
    path: '*',
    element: <Navigate to="/404" />,
  },
]

const Router = () => {
  const { pathname } = useLocation()

  console.log(pathname)

  const ele = useRoutes(rootRouter)

  return ele
}

export default Router
