import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Layout, Button, Space, Typography, Input, Spin, Tooltip, App } from 'antd'
import useMessage from '@/hooks/useMessage'
import {
  SaveOutlined, EyeOutlined, ExportOutlined,
  ArrowLeftOutlined, SettingOutlined,
} from '@ant-design/icons'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import useEditorStore from '@/stores/useEditorStore'
import { pagesApi } from '@/apis'
import ComponentPanel from './components/ComponentPanel'
import EditorCanvas from './components/EditorCanvas'
import PropsPanel from './components/PropsPanel'
import PageSettingsPanel from './components/PageSettingsPanel'
import ExportModal from './components/ExportModal'
import styles from './Editor.module.css'

const { Header, Sider, Content } = Layout
const { Text } = Typography

const RIGHT_WIDTH_KEY = 'editor_right_width'
const RIGHT_MIN = 220
const RIGHT_MAX = 560

const Editor = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)

  // 右侧面板宽度（持久化到 localStorage）
  const [rightWidth, setRightWidth] = useState(
    () => Number(localStorage.getItem(RIGHT_WIDTH_KEY)) || 280
  )
  const rightRef = useRef<HTMLDivElement>(null)

  const startResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    const startX  = e.clientX
    const startW  = rightRef.current?.offsetWidth ?? rightWidth

    const onMove = (ev: MouseEvent) => {
      const w = Math.min(RIGHT_MAX, Math.max(RIGHT_MIN, startW + startX - ev.clientX))
      setRightWidth(w)
    }
    const onUp = (ev: MouseEvent) => {
      const w = Math.min(RIGHT_MAX, Math.max(RIGHT_MIN, startW + startX - ev.clientX))
      localStorage.setItem(RIGHT_WIDTH_KEY, String(w))
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [rightWidth])
  const message = useMessage()
  const { modal } = App.useApp()

  const {
    pageTitle, isDirty, pageId,
    setPageTitle, loadConfig, exportConfig, resetEditor,
  } = useEditorStore()

  // 加载已有页面
  useEffect(() => {
    if (!id) {
      resetEditor()
      return
    }
    setLoading(true)
    pagesApi.getDetail(Number(id))
      .then((data) => { loadConfig(data.config, data.id, data.title) })
      .catch(() => { message.error('加载页面失败'); navigate('/dashboard') })
      .finally(() => setLoading(false))
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  // 离开前提示未保存
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) { e.preventDefault(); e.returnValue = '' }
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [isDirty])

  const handleSave = async () => {
    setSaving(true)
    try {
      const config = exportConfig()
      if (pageId) {
        await pagesApi.update(pageId, { title: pageTitle, config })
      } else {
        const res = await pagesApi.create({ title: pageTitle, config })
        navigate(`/editor/${res.id}`, { replace: true })
      }
      message.success('保存成功')
      useEditorStore.setState({ isDirty: false })
    } catch {
      message.error('保存失败')
    } finally {
      setSaving(false)
    }
  }

  const handleExport = () => {
    if (!pageId) {
      modal.confirm({
        title: '请先保存页面',
        content: '需要保存页面后才能生成分享链接，是否立即保存？',
        okText: '立即保存',
        cancelText: '取消',
        onOk: handleSave,
      })
      return
    }
    setExportOpen(true)
  }

  const handleBack = () => {
    if (!isDirty) {
      navigate('/dashboard')
      return
    }
    modal.confirm({
      title: '有未保存的修改',
      content: '当前页面有未保存的内容，直接离开将丢失修改。',
      okText: '直接离开',
      okButtonProps: { danger: true },
      cancelText: '继续编辑',
      onOk: () => navigate('/dashboard'),
    })
  }

  if (loading) return (
    <div className={styles.loadingScreen}>
      <Space direction="vertical" align="center" size={12}>
        <Spin size="large" />
        <Text type="secondary">加载页面中...</Text>
      </Space>
    </div>
  )

  return (
    <DndProvider backend={HTML5Backend}>
      <Layout className={styles.editorLayout}>
        {/* 顶部工具栏 */}
        <Header className={styles.editorHeader}>
          <div className={styles.headerLeft}>
            <Tooltip title="返回页面管理">
              <Button icon={<ArrowLeftOutlined />} type="text" onClick={handleBack} />
            </Tooltip>
            <Tooltip title="点击修改页面名称" placement="bottom" mouseEnterDelay={0.8}>
              <Input
                value={pageTitle}
                onChange={(e) => setPageTitle(e.target.value)}
                className={styles.titleInput}
                variant="borderless"
                placeholder="未命名页面"
              />
            </Tooltip>
            {isDirty && (
              <Text type="secondary" className={styles.unsavedHint}>● 未保存</Text>
            )}
          </div>
          <Space>
            <Tooltip title="页面全局设置">
              <Button icon={<SettingOutlined />} onClick={() => setSettingsOpen(true)} />
            </Tooltip>
            <Button
              icon={<EyeOutlined />}
              onClick={() => pageId && window.open(`/preview/${pageId}`, '_blank')}
              disabled={!pageId}
            >
              预览
            </Button>
            <Button icon={<ExportOutlined />} onClick={handleExport}>导出</Button>
            <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={handleSave}>
              保存
            </Button>
          </Space>
        </Header>

        <Layout>
          {/* 左侧：组件面板 */}
          <Sider width={200} className={styles.leftSider} theme="light">
            <ComponentPanel />
          </Sider>

          {/* 中间：画布 */}
          <Content className={styles.canvasArea}>
            <EditorCanvas />
          </Content>

          {/* 右侧：属性配置（可拖拽调宽） */}
          <div
            ref={rightRef}
            className={styles.rightSider}
            style={{ width: rightWidth, minWidth: rightWidth }}
          >
            <div className={styles.resizeHandle} onMouseDown={startResize} />
            <PropsPanel />
          </div>
        </Layout>
      </Layout>

      {/* 页面全局设置弹窗 */}
      <PageSettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />

      {/* 导出/分享弹窗 */}
      {pageId && (
        <ExportModal
          open={exportOpen}
          pageId={pageId}
          pageTitle={pageTitle}
          onClose={() => setExportOpen(false)}
        />
      )}
    </DndProvider>
  )
}

export default Editor
