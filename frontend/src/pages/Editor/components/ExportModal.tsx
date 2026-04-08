import { useState } from 'react'
import { Modal, QRCode, Typography, Space, Button, Divider, Tag, Tooltip, message as staticMessage } from 'antd'
import { CopyOutlined, CheckOutlined, LinkOutlined, ExportOutlined } from '@ant-design/icons'
import styles from './ExportModal.module.css'

interface ExportModalProps {
  open: boolean
  pageId: number
  pageTitle: string
  onClose: () => void
}

const { Text, Paragraph } = Typography

const ExportModal = ({ open, pageId, pageTitle, onClose }: ExportModalProps) => {
  const previewUrl = `${window.location.origin}/preview/${pageId}`
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(previewUrl)
      setCopied(true)
      staticMessage.success('链接已复制')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      staticMessage.error('复制失败，请手动复制')
    }
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={
        <Space>
          <ExportOutlined />
          <span>分享页面</span>
        </Space>
      }
      width={420}
      centered
    >
      <div className={styles.container}>
        {/* 页面信息 */}
        <div className={styles.pageInfo}>
          <Text strong className={styles.pageTitle}>{pageTitle || '未命名页面'}</Text>
          <Tag color="success" className={styles.statusTag}>已发布</Tag>
        </div>

        {/* 二维码 */}
        <div className={styles.qrWrapper}>
          <QRCode
            value={previewUrl}
            size={200}
            color="#262626"
            bgColor="#ffffff"
            bordered={false}
          />
          <Text type="secondary" className={styles.qrHint}>扫描二维码访问商城页面</Text>
        </div>

        <Divider style={{ margin: '16px 0' }} />

        {/* 链接区域 */}
        <div className={styles.linkSection}>
          <Text type="secondary" className={styles.linkLabel}>
            <LinkOutlined /> 访问链接
          </Text>
          <div className={styles.linkRow}>
            <Paragraph
              className={styles.linkText}
              ellipsis={{ rows: 1, tooltip: previewUrl }}
            >
              {previewUrl}
            </Paragraph>
            <Tooltip title={copied ? '已复制' : '复制链接'}>
              <Button
                type="text"
                size="small"
                icon={copied ? <CheckOutlined style={{ color: '#52c41a' }} /> : <CopyOutlined />}
                onClick={handleCopy}
                className={styles.copyBtn}
              />
            </Tooltip>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className={styles.actions}>
          <Button
            type="primary"
            block
            icon={<ExportOutlined />}
            onClick={() => window.open(previewUrl, '_blank')}
          >
            在新窗口打开
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default ExportModal
