import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { App, Spin } from 'antd'
import { setMessageApi } from '@/utils/messageBridge'
import useUserStore from '@/stores/useUserStore'
import { authApi } from '@/apis'
import router from '@/router'

const AppRoot = () => {
  const { message } = App.useApp()
  const { setUser, setInitializing, initializing } = useUserStore()

  useEffect(() => {
    setMessageApi(message)
  }, [message])

  // 应用启动时用现有 Cookie 静默恢复会话
  useEffect(() => {
    authApi.getProfile()
      .then((user) => setUser(user))
      .catch(() => { /* Cookie 不存在或已过期，保持未登录 */ })
      .finally(() => setInitializing(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (initializing) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    )
  }

  return <RouterProvider router={router} />
}

export default AppRoot
