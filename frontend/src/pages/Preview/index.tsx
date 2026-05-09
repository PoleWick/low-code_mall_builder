import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Spin, Result, Button } from 'antd'
import { pagesApi } from '@/apis'
import { COMPONENT_REGISTRY } from '@/constants/componentRegistry'
import PageLayoutContext from '@/contexts/PageLayoutContext'
import usePostPaymentSync from '@/hooks/usePostPaymentSync'
import usePreviewFrame from '@/hooks/usePreviewFrame'
import useCartStore from '@/stores/useCartStore'
import type { Page, ComponentType } from '@/types'
import styles from './Preview.module.css'

const NAVBAR_HEIGHT = 56

const Preview = () => {
  const { id } = useParams<{ id: string }>()
  const [page,    setPage]    = useState<Page | null>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(false)
  const [localIp, setLocalIp] = useState<string>('localhost')
  const [isMobileViewport, setIsMobileViewport] = useState(() => window.innerWidth <= 768)
  const ipFetched = useRef(false)
  const innerRef = useRef<HTMLDivElement | null>(null)
  const clearCart = useCartStore((s) => s.clear)

  useEffect(() => {
    if (!id) { setError(true); setLoading(false); return }
    pagesApi.getDetail(Number(id))
      .then((data) => setPage(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [id])

  // 获取本机局域网 IP，用于生成可被手机扫描的二维码
  useEffect(() => {
    if (ipFetched.current) return
    ipFetched.current = true
    fetch('/api/local-ip')
      .then((r) => r.json())
      .then((data) => { if (data.ip) setLocalIp(data.ip) })
      .catch(() => { /* 静默失败，保持 localhost */ })
  }, [])

  usePostPaymentSync(() => clearCart())
  const { frameLeft, frameWidth } = usePreviewFrame(innerRef, [page])

  // 方案A：移动端预览容器全宽；桌面端保留 maxWidth 手机框效果
  useEffect(() => {
    const onResize = () => setIsMobileViewport(window.innerWidth <= 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  if (loading) return (
    <div className={styles.loading}><Spin size="large" /></div>
  )

  if (error || !page) return (
    <Result
      status="404"
      title={'\u9875\u9762\u4E0D\u5B58\u5728'}
      extra={<Button onClick={() => window.close()}>{'\u5173\u95ED'}</Button>}
    />
  )

  const { pageSettings, components } = page.config
  const sorted = [...components].sort((a, b) => a.order - b.order)

  const hasNavBar    = sorted.some((c) => c.type === 'NavBar')
  const navbarHeight = hasNavBar ? NAVBAR_HEIGHT : 0

  // 用真实局域网 IP 替换 localhost，手机才能扫码访问
  const previewUrl = window.location.href
    .replace(/localhost/, localIp)
    .replace(/127\.0\.0\.1/, localIp)
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(previewUrl)}`

  return (
    <PageLayoutContext.Provider value={{ navbarHeight, frameLeft, frameWidth }}>
      <div className={styles.outer} style={{ backgroundColor: pageSettings.backgroundColor || '#f5f5f5' }}>
        {/* 左侧二维码卡片（仅桌面端显示） */}
        <div className={styles.qrCard}>
          <img src={qrSrc} alt="预览二维码" className={styles.qrImg} />
          <p className={styles.qrTip}>手机扫码预览</p>
          <p className={styles.qrSub}>请确保手机与电脑在同一 Wi-Fi 下</p>
        </div>

        <div
          id="preview-container"
          ref={innerRef}
          className={styles.inner}
          style={{ maxWidth: isMobileViewport ? '100vw' : (pageSettings.maxWidth || 375) }}
        >
          <div className={styles.innerContent}>
            {sorted.map((comp) => {
              const registry = COMPONENT_REGISTRY[comp.type as ComponentType]
              if (!registry) return null
              const Component = registry.component
              // MenuList 负责自己的 flex:1；其余组件套一层 shrink:0 防止被压缩
              const isFlex = comp.type === 'MenuList'
              return isFlex
                ? <Component key={comp.id} {...comp.props} />
                : <div key={comp.id} style={{ flexShrink: 0 }}><Component {...comp.props} /></div>
            })}
          </div>
        </div>
      </div>
    </PageLayoutContext.Provider>
  )
}

export default Preview
