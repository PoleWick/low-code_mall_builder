import { useState, useEffect } from 'react'
import {
  Layout, Button, Card, Typography, Row, Col, Empty,
  Dropdown, Spin, Popconfirm, Avatar, Modal, Form, Input, Tag,
} from 'antd'
import {
  PlusOutlined, LogoutOutlined, UserOutlined,
  DeleteOutlined, MoreOutlined, ArrowRightOutlined,
  ShopOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { projectsApi, authApi } from '@/apis'
import useUserStore from '@/stores/useUserStore'
import useMessage from '@/hooks/useMessage'
import type { Project } from '@/types'
import styles from './Dashboard.module.css'

const { Header, Content } = Layout
const { Title, Text } = Typography

const Dashboard = () => {
  const navigate = useNavigate()
  const { user, logout } = useUserStore()
  const message = useMessage()

  const [projects, setProjects] = useState<Project[]>([])
  const [loading,  setLoading]  = useState(false)
  const [creating, setCreating] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [form] = Form.useForm()

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const list = await projectsApi.getList()
      setProjects(list)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProjects() }, [])

  const handleCreate = async () => {
    const values = await form.validateFields()
    setCreating(true)
    try {
      const project = await projectsApi.create(values)
      message.success('\u9879\u76EE\u521B\u5EFA\u6210\u529F')
      setModalOpen(false)
      form.resetFields()
      navigate(`/projects/${project.id}`)
    } catch {
      message.error('\u521B\u5EFA\u5931\u8D25')
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await projectsApi.remove(id)
      message.success('\u5DF2\u5220\u9664')
      fetchProjects()
    } catch {
      message.error('\u5220\u9664\u5931\u8D25')
    }
  }

  const handleLogout = async () => {
    try { await authApi.logout() } finally {
      logout()
      navigate('/login')
    }
  }

  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>
        <div className={styles.headerLeft}>
          <ShopOutlined style={{ fontSize: 22, color: '#ff4d4f', marginRight: 10 }} />
          <Title level={4} style={{ margin: 0, color: '#ff4d4f' }}>{'\u53EF\u89C6\u5316\u5546\u57CE\u6280\u5EFA\u5E73\u53F0'}</Title>
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
            <Title level={4} style={{ margin: 0 }}>{'\u6211\u7684\u9879\u76EE'}</Title>
            <Text type="secondary">{projects.length} {'\u4E2A\u9879\u76EE'}</Text>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
            {'\u65B0\u5EFA\u9879\u76EE'}
          </Button>
        </div>

        <Spin spinning={loading}>
          {projects.length === 0 && !loading ? (
            <Empty description={'\u8FD8\u6CA1\u6709\u9879\u76EE\uFF0C\u521B\u5EFA\u4E00\u4E2A\u5F00\u59CB\u5427'}>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
                {'\u65B0\u5EFA\u9879\u76EE'}
              </Button>
            </Empty>
          ) : (
            <Row gutter={[16, 16]}>
              {projects.map((proj) => (
                <Col key={proj.id} xs={24} sm={12} md={8} lg={6}>
                  <Card
                    className={styles.pageCard}
                    hoverable
                    onClick={() => navigate(`/projects/${proj.id}`)}
                    cover={
                      <div className={styles.projectCover}>
                        <ShopOutlined className={styles.projectIcon} />
                      </div>
                    }
                    actions={[
                      <Button
                        key="enter"
                        type="text"
                        icon={<ArrowRightOutlined />}
                        onClick={(e) => { e.stopPropagation(); navigate(`/projects/${proj.id}`) }}
                      >
                        {'\u8FDB\u5165'}
                      </Button>,
                      <Dropdown
                        key="more"
                        menu={{ items: [{
                          key: 'delete',
                          label: (
                            <Popconfirm
                              title={'\u786E\u8BA4\u5220\u9664\u8BE5\u9879\u76EE\uFF1F\u9879\u76EE\u4E0B\u6240\u6709\u9875\u9762\u5C06\u4E00\u5E76\u5220\u9664'}
                              onConfirm={(e) => { e?.stopPropagation(); handleDelete(proj.id) }}
                              okText={'\u5220\u9664'} okButtonProps={{ danger: true }}
                            >
                              <span style={{ color: '#ff4d4f' }} onClick={(e) => e.stopPropagation()}>
                                <DeleteOutlined /> {'\u5220\u9664\u9879\u76EE'}
                              </span>
                            </Popconfirm>
                          ),
                        }]}}
                        trigger={['click']}
                      >
                        <MoreOutlined onClick={(e) => e.stopPropagation()} />
                      </Dropdown>,
                    ]}
                  >
                    <Card.Meta
                      title={proj.name}
                      description={
                        <div>
                          <Tag color="blue">{proj.page_count ?? 0} {'\u4E2A\u9875\u9762'}</Tag>
                          <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 4 }}>
                            {new Date(proj.updated_at).toLocaleDateString()}
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

      {/* 新建项目弹窗 */}
      <Modal
        title={'\u65B0\u5EFA\u9879\u76EE'}
        open={modalOpen}
        onOk={handleCreate}
        onCancel={() => { setModalOpen(false); form.resetFields() }}
        confirmLoading={creating}
        okText={'\u521B\u5EFA'}
        cancelText={'\u53D6\u6D88'}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="name"
            label={'\u9879\u76EE\u540D\u79F0'}
            rules={[{ required: true, message: '\u8BF7\u8F93\u5165\u9879\u76EE\u540D\u79F0' }]}
          >
            <Input placeholder={'\u4F8B\uff1A\u5C0F\u521A\u5949\u675F\u5982\u5C71\u62A4\u8BDA'} maxLength={50} />
          </Form.Item>
          <Form.Item name="description" label={'\u63CF\u8FF0\uff08\u53EF\u9009\uff09'}>
            <Input.TextArea placeholder={'\u5546\u57CE\u7B80\u4ECB...'} maxLength={200} rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  )
}

export default Dashboard
