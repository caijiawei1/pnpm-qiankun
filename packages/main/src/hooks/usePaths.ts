import { useCreation } from 'ahooks'
import { reduce, compact, split, trim, concat, last } from 'lodash-es'
import { useLocation } from 'react-router-dom'

const usePaths = () => {
  const { pathname } = useLocation()
  return useCreation(
    () =>
      reduce(
        compact(split(trim(pathname, '/'), '/')),
        (cur: string[], next: string) => {
          return concat(cur, [`${last(cur) || ''}/${next}`])
        },
        [],
      ),
    [pathname],
  )
}

export default usePaths
