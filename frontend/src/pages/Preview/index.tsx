import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Spin, Result, Button } from 'antd'
import { pagesApi } from '@/apis'
import { COMPONENT_REGISTRY } from '@/constants/componentRegistry'
import type { PageConfig, ComponentType } from '@/types'
import styles from './Preview.module.css'

const Preview = () => {
  const { id } = useParams<{ id: string }>()
  const [config, setConfig] = useState<PageConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!id) { setError(true); setLoading(false); return }
    pagesApi.getDetail(Number(id))
      .then((data) => setConfig(data.config))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className={styles.loading}>
      <Spin size="large" />
    </div>
  )

  if (error || !config) return (
    <Result status="404" title="页面不存在" extra={<Button onClick={() => window.close()}>关闭</Button>} />
  )

  const { pageSettings, components } = config
  const sorted = [...components].sort((a, b) => a.order - b.order)

  return (
    <div className={styles.outer} style={{ backgroundColor: pageSettings.backgroundColor || '#f5f5f5' }}>
      <div className={styles.inner} style={{ maxWidth: pageSettings.maxWidth || 375 }}>
        {sorted.map((comp) => {
          const registry = COMPONENT_REGISTRY[comp.type as ComponentType]
          if (!registry) return null
          const Component = registry.component
          return <Component key={comp.id} {...comp.props} />
        })}
      </div>
    </div>
  )
}

export default Preview
