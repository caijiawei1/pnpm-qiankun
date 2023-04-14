import { Layout, Menu } from 'antd'
import { compact, first, head, isEmpty, map } from 'lodash'
import React from 'react'
import styles from './index.module.scss'
import usePaths from '@/hooks/usePaths'
import { useNavigate } from 'react-router-dom'

const { Header, Content } = Layout

// eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/ban-ts-comment
// @ts-ignore
export const getLastChild = (data: any) => {
  if (!isEmpty(data?.children)) {
    return getLastChild(head(data?.children))
  }
  return data
}

const router: any = [
  { label: 'react', key: 'react', paths: 'react' },
  { label: 'vue', key: 'vue', paths: 'vue' },
]

const HeaderMenu = () => {
  const paths = usePaths()
  const navigate = useNavigate()

  return (
    <Menu
      mode="horizontal"
      className={styles.menu}
      selectedKeys={compact([first(paths)])}
      onClick={(menu) => {
        navigate(menu.key)
      }}
    >
      {map(router, (item: any) => {
        return (
          <Menu.Item
            data-paths={getLastChild(item)?.paths}
            key={item.paths}
            className={styles.menuItem}
          >
            <span>{item?.label}</span>
          </Menu.Item>
        )
      })}
    </Menu>
  )
}

const Container = () => {
  return <Content className={styles.container}></Content>
}

const IHeader = () => {
  return (
    <Header className={styles.header}>
      <HeaderMenu />
    </Header>
  )
}

export default () => {
  return (
    <Layout className={styles.layout}>
      <IHeader />
      <Container />
    </Layout>
  )
}
