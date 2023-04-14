import React from 'react'
import Micro from '@/micro'
import { ConfigProvider } from 'antd'
import { BrowserRouter } from 'react-router-dom'
import Router from './router'
import Layout from './Layout'

export default () => {
  return (
    <ConfigProvider>
      <BrowserRouter>
        {/* 注册子应用 */}
        <Micro />
        <Router />
        <Layout />
      </BrowserRouter>
    </ConfigProvider>
  )
}
