import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider, App } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import AppRoot from '@/AppRoot'
import '@/styles/global.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider
      locale={zhCN}
      warning={{ strict: false }}
      theme={{
        token: {
          colorPrimary: '#ff4d4f',
          borderRadius: 6,
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        },
      }}
    >
      <App>
        <AppRoot />
      </App>
    </ConfigProvider>
  </StrictMode>
)
