import { useState, useEffect, useCallback } from 'react'
import {
  Layout, Button, Card, Typography, Row, Col, Empty, Breadcrumb,
  Dropdown, Tag, Spin, Popconfirm, Avatar, Tooltip,
} from 'antd'
import {
  PlusOutlined, LogoutOutlined, UserOutlined, EditOutlined,
  DeleteOutlined, CopyOutlined, EyeOutlined, MoreOutlined,
  LockOutlined, ShareAltOutlined, ArrowLeftOutlined,
} from '@ant-design/icons'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { projectsApi, pagesApi, authApi } from '@/apis'
import useUserStore from '@/stores/useUserStore'
import useMessage from '@/hooks/useMessage'
import type { Project, PageListItem } from '@/types'
import ExportModal from '@/pages/Editor/components/ExportModal'
import styles from './ProjectDetail.module.css'

const { Header, Content } = Layout
const { Title, Text } = Typography

const PAGE_TYPE_LABEL: Record<string, string> = {
  mall:     '\u5546\u54C1\u9875',
  checkout: '\u652F\u4ED8\u9875',
  orders:   '\u8BA2\u5355\u9875',
  custom:   '\u81EA\u5EFA\u9875',
}
const PAGE_TYPE_COLOR: Record<string, string> = {
  mall: 'red', checkout: 'orange', orders: 'blue', custom: 'default',
}

const ProjectDetail = () => {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const { user, logout } = useUserStore()
  const message = useMessage()

  const [project, setProject] = useState<Project | null>(null)
  const [pages,   setPages]   = useState<PageListItem[]>([])
  const [loading, setLoading] = useState(false)
  const [shareTarget, setShareTarget] = useState<PageListItem | null>(null)

  const fetchProject = useCallback(async () => {
    if (!projectId) return
    setLoading(true)
    try {
      const proj = await projectsApi.getDetail(Number(projectId))
      setProject(proj)
      setPages(proj.pages ?? [])
    } finally {
      setLoading(false)
    }
  }, [projectId])

  useEffect(() => { fetchProject() }, [fetchProject])

  const handleCreatePage = async () => {
    if (!projectId) return
    try {
      const page = await projectsApi.createPage(Number(projectId), { title: '\u672A\u547D\u540D\u9875\u9762' })
      message.success('\u9875\u9762\u5DF2\u521B\u5EFA')
      navigate(`/editor/${page.id}`)
    } catch {
      message.error('\u521B\u5EFA\u5931\u8D25')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await pagesApi.remove(id)
      message.success('\u5DF2\u5220\u9664')
      fetchProject()
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message
      message.error(msg || '\u5220\u9664\u5931\u8D25')
    }
  }

  const handleDuplicate = async (id: number) => {
    try {
      await pagesApi.duplicate(id)
      message.success('\u5DF2\u590D\u5236')
      fetchProject()
    } catch {
      message.error('\u590D\u5236\u5931\u8D25')
    }
  }

  const handleLogout = async () => {
    try { await authApi.logout() } finally { logout(); navigate('/login') }
  }

  return (
    <>
    <Layout className={styles.layout}>
      <Header className={styles.header}>
        <div className={styles.headerLeft}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/dashboard')}
            style={{ marginRight: 8 }}
          />
          <Breadcrumb items={[
            { title: <Link to="/dashboard">{'\u6211\u7684\u9879\u76EE'}</Link> },
            { title: project?.name ?? '...' },
          ]} />
        </div>
        <div className={styles.headerRight}>
          <Dropdown menu={{ items: [
            { key: 'logout', label: '\u9000\u51FA\u767B\u5F55', icon: <LogoutOutlined />, onClick: handleLogout },
          ]}}>
            <div className={styles.userInfo}>
              <Avatar icon={<UserOutlined />} size="small" />
              <Text style={{ marginLeft: 8 }}>{user?.username}</Text>
            </div>
          </Dropdown>
        </div>
      </Header>

      <Content className={styles.content}>
        <div className={styles.toolbar}>
          <div>
            <Title level={4} style={{ margin: 0 }}>{project?.name}</Title>
            <Text type="secondary">{pages.length} {'\u4E2A\u9875\u9762'}</Text>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreatePage}>
            {'\u65B0\u5EFA\u9875\u9762'}
          </Button>
        </div>

        <Spin spinning={loading}>
          {pages.length === 0 && !loading ? (
            <Empty description={'\u9879\u76EE\u4E0B\u8FD8\u6CA1\u6709\u9875\u9762'} />
          ) : (
            <Row gutter={[16, 16]}>
              {pages.map((p) => (
                <Col key={p.id} xs={24} sm={12} md={8} lg={6}>
                  <Card
                    className={styles.pageCard}
                    cover={
                      <div className={styles.pageCover}>
                        {p.cover
                          ? <img src={p.cover} alt={p.title} />
                          : <div className={styles.noCover}><Text type="secondary">{'\u6682\u65E0\u9884\u89C8'}</Text></div>
                        }
                      </div>
                    }
                    actions={[
                      <Tooltip key="edit" title={'\u7F16\u8F91'}>
                        <EditOutlined onClick={() => navigate(`/editor/${p.id}`)} />
                      </Tooltip>,
                      <Tooltip key="preview" title={'\u9884\u89C8'}>
                        <EyeOutlined onClick={() => window.open(`/preview/${p.id}`, '_blank')} />
                      </Tooltip>,
                      <Dropdown
                        key="more"
                        menu={{ items: [
                          { key: 'share', label: '\u5206\u4EAB', icon: <ShareAltOutlined />, onClick: () => setShareTarget(p) },
                          { key: 'duplicate', label: '\u590D\u5236', icon: <CopyOutlined />, onClick: () => handleDuplicate(p.id) },
                          ...(!p.is_default ? [{
                            key: 'delete',
                            label: (
                              <Popconfirm
                                title={'\u786E\u8BA4\u5220\u9664\u8BE5\u9875\u9762\uFF1F'}
                                onConfirm={() => handleDelete(p.id)}
                                okText={'\u5220\u9664'} okButtonProps={{ danger: true }}
                              >
                                <span style={{ color: '#ff4d4f' }}><DeleteOutlined /> {'\u5220\u9664'}</span>
                              </Popconfirm>
                            ),
                          }] : []),
                        ]}}
                      >
                        <MoreOutlined />
                      </Dropdown>,
                    ]}
                  >
                    <Card.Meta
                      title={
                        <div className={styles.cardTitle}>
                          {p.is_default && (
                            <Tooltip title={'\u6A21\u677F\u9875\u9762\uFF0C\u4E0D\u53EF\u5220\u9664'}>
                              <LockOutlined className={styles.lockIcon} />
                            </Tooltip>
                          )}
                          <span>{p.title}</span>
                        </div>
                      }
                      description={
                        <div>
                          <Tag color={PAGE_TYPE_COLOR[p.page_type]}>
                            {PAGE_TYPE_LABEL[p.page_type] ?? p.page_type}
                          </Tag>
                          <Tag color={p.status === 2 ? 'success' : 'default'}>
                            {p.status === 2 ? '\u5DF2\u53D1\u5E03' : '\u8349\u7A3F'}
                          </Tag>
                          <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 4 }}>
                            {new Date(p.updated_at).toLocaleDateString()}
                          </Text>
                        </div>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Spin>
      </Content>
    </Layout>

    {shareTarget && (
      <ExportModal
        open={!!shareTarget}
        pageId={shareTarget.id}
        pageTitle={shareTarget.title}
        onClose={() => setShareTarget(null)}
      />
    )}
    </>
  )
}

export default ProjectDetail
