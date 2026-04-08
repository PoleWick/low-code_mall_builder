import { Form, Input, Button, Card, Typography, Divider } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { authApi, type LoginParams } from '@/apis'
import useUserStore from '@/stores/useUserStore'
import useMessage from '@/hooks/useMessage'
import styles from './Login.module.css'

const { Title, Text } = Typography

const Login = () => {
  const navigate = useNavigate()
  const setUser = useUserStore((s) => s.setUser)
  const message = useMessage()
  const [loading, setLoading] = useState(false)

  const onFinish = async (values: LoginParams) => {
    setLoading(true)
    try {
      const res = await authApi.login(values)
      setUser(res.user)  // Token 已由后端写入 HttpOnly Cookie
      message.success('登录成功')
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <div className={styles.header}>
          <Title level={3} style={{ margin: 0, color: '#ff4d4f' }}>可视化商城搭建平台</Title>
          <Text type="secondary" style={{ marginTop: 8, display: 'block' }}>登录你的账号开始创作</Text>
        </div>
        <Form onFinish={onFinish} size="large" autoComplete="off">
          <Form.Item name="email" rules={[{ required: true, message: '请输入邮箱' }, { type: 'email', message: '邮箱格式不正确' }]}>
            <Input prefix={<UserOutlined />} placeholder="邮箱" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>登录</Button>
          </Form.Item>
        </Form>
        <Divider plain><Text type="secondary" style={{ fontSize: 12 }}>还没有账号？</Text></Divider>
        <Link to="/register">
          <Button block>免费注册</Button>
        </Link>
      </Card>
    </div>
  )
}

export default Login
