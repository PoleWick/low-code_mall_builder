import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Spin, Result, Button } from 'antd'
import { pagesApi } from '@/apis'
import { COMPONENT_REGISTRY } from '@/constants/componentRegistry'
import NavBar from '@/components/mall/NavBar'
import type { Page, ComponentType, NavBarItem, PageListItem } from '@/types'
import styles from './Preview.module.css'

/** 将项目 navbar_config.items（pageType 引用）解析为实际 pageId */
const resolveNavItems = (items: NavBarItem[], pages: PageListItem[]) =>
  items.map((item) => {
    let pageId: number | undefined
    if (item.pageType === 'custom' && item.customPageId) {
      pageId = item.customPageId
    } else if (item.pageType) {
      pageId = pages.find((p) => p.page_type === item.pageType)?.id
    }
    return { icon: item.icon, label: item.label, pageId }
  })

const Preview = () => {
  const { id } = useParams<{ id: string }>()
  const [page,    setPage]    = useState<Page | null>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(false)

  useEffect(() => {
    if (!id) { setError(true); setLoading(false); return }
    pagesApi.getDetail(Number(id))
      .then((data) => setPage(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [id])

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

  const { config, project } = page
  const { pageSettings, components } = config
  const sorted = [...components].sort((a, b) => a.order - b.order)

  const navbarConfig     = project?.navbar_config
  const resolvedNavItems = (navbarConfig && project?.pages)
    ? resolveNavItems(navbarConfig.items, project.pages)
    : null

  return (
    <div className={styles.outer} style={{ backgroundColor: pageSettings.backgroundColor || '#f5f5f5' }}>
      <div className={styles.inner} style={{ maxWidth: pageSettings.maxWidth || 375 }}>
        {sorted.map((comp) => {
          const registry = COMPONENT_REGISTRY[comp.type as ComponentType]
          if (!registry) return null
          const Component = registry.component
          return <Component key={comp.id} {...comp.props} />
        })}

        {/* 项目级底部导航（checkout 支付页不显示） */}
        {resolvedNavItems && page.page_type !== 'checkout' && (
          <NavBar
            items={resolvedNavItems}
            activeColor={navbarConfig?.activeColor}
          />
        )}
      </div>
    </div>
  )
}

export default Preview
