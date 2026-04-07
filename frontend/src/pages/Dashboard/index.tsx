import { useState, useEffect, useCallback } from 'react'
import {
  Layout, Button, Card, Typography, Row, Col, Empty, Input,
  Dropdown, Tag, Spin, Popconfirm, Avatar
} from 'antd'
import {
  PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined,
  CopyOutlined, EyeOutlined, MoreOutlined, LogoutOutlined, UserOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { pagesApi } from '@/apis'
import useUserStore from '@/stores/useUserStore'
import useMessage from '@/hooks/useMessage'
import type { PageListItem } from '@/types'
import styles from './Dashboard.module.css'

const { Header, Content } = Layout
const { Title, Text } = Typography
const { Search } = Input

const Dashboard = () => {
  const navigate = useNavigate()
  const { user, logout } = useUserStore()
  const message = useMessage()
  const [pages, setPages] = useState<PageListItem[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [page, setPage] = useState(1)

  const fetchPages = useCallback(async () => {
    setLoading(true)
    try {
      const res = await pagesApi.getList({ page, pageSize: 12, keyword })
      setPages(res.list)
      setTotal(res.total)
    } finally {
      setLoading(false)
    }
  }, [page, keyword])

  useEffect(() => { fetchPages() }, [fetchPages])

  const handleCreate = async () => {
    navigate('/editor')
  }

  const handleDelete = async (id: number) => {
    await pagesApi.remove(id)
    message.success('已删除')
    fetchPages()
  }

  const handleDuplicate = async (id: number) => {
    await pagesApi.duplicate(id)
    message.success('已复制')
    fetchPages()
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>
        <div className={styles.headerLeft}>
          <Title level={4} style={{ margin: 0, color: '#ff4d4f' }}>可视化商城搭建平台</Title>
        </div>
        <div className={styles.headerRight}>
          <Dropdown
            menu={{
              items: [
                { key: 'logout', label: '退出登录', icon: <LogoutOutlined />, onClick: handleLogout },
              ],
            }}
          >
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
            <Title level={4} style={{ margin: 0 }}>我的页面</Title>
            <Text type="secondary">{total} 个页面</Text>
          </div>
          <div className={styles.toolbarRight}>
            <Search
              placeholder="搜索页面名称"
              allowClear
              prefix={<SearchOutlined />}
              style={{ width: 220 }}
              onSearch={(v) => { setKeyword(v); setPage(1) }}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
              新建页面
            </Button>
          </div>
        </div>

        <Spin spinning={loading}>
          {pages.length === 0 && !loading ? (
            <Empty description="还没有页面，点击新建开始创作">
              <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>新建页面</Button>
            </Empty>
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
                          : <div className={styles.noCover}><Text type="secondary">暂无预览</Text></div>
                        }
                      </div>
                    }
                    actions={[
                      <EditOutlined key="edit" onClick={() => navigate(`/editor/${p.id}`)} />,
                      <EyeOutlined key="preview" onClick={() => window.open(`/preview/${p.id}`, '_blank')} />,
                      <Dropdown
                        key="more"
                        menu={{
                          items: [
                            { key: 'duplicate', label: '复制', icon: <CopyOutlined />, onClick: () => handleDuplicate(p.id) },
                            {
                              key: 'delete', label: (
                                <Popconfirm title="确认删除该页面？" onConfirm={() => handleDelete(p.id)} okText="删除" okButtonProps={{ danger: true }}>
                                  <span style={{ color: '#ff4d4f' }}><DeleteOutlined /> 删除</span>
                                </Popconfirm>
                              ),
                            },
                          ],
                        }}
                      >
                        <MoreOutlined />
                      </Dropdown>,
                    ]}
                  >
                    <Card.Meta
                      title={p.title}
                      description={
                        <div>
                          <Tag color={p.status === 2 ? 'success' : 'default'}>{p.status === 2 ? '已发布' : '草稿'}</Tag>
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
  )
}

export default Dashboard
