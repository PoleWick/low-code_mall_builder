import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { App } from 'antd'
import { setMessageApi } from '@/utils/messageBridge'
import router from '@/router'

/**
 * 在 App 上下文内注入 message 实例，供非组件代码（axios 拦截器等）使用
 */
const AppRoot = () => {
  const { message } = App.useApp()

  useEffect(() => {
    setMessageApi(message)
  }, [message])

  return <RouterProvider router={router} />
}

export default AppRoot
