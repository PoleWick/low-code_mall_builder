import { Modal, Form, Input, InputNumber, Row, Col } from 'antd'
import { useEffect } from 'react'
import useEditorStore from '@/stores/useEditorStore'

interface Props {
  open: boolean
  onClose: () => void
}

const PageSettingsPanel = ({ open, onClose }: Props) => {
  const { pageSettings, setPageSettings } = useEditorStore()
  const [form] = Form.useForm()

  useEffect(() => {
    if (open) form.setFieldsValue(pageSettings)
  }, [open, pageSettings, form])

  const handleOk = () => {
    form.validateFields().then((values) => {
      setPageSettings(values)
      onClose()
    })
  }

  return (
    <Modal
      title="页面全局设置"
      open={open}
      onOk={handleOk}
      onCancel={onClose}
      okText="确定"
      cancelText="取消"
      width={420}
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        <Form.Item label="页面标题" name="title">
          <Input placeholder="我的商城" />
        </Form.Item>
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item label="背景颜色" name="backgroundColor">
              <Input placeholder="#f5f5f5" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="画布宽度(px)" name="maxWidth">
              <InputNumber min={320} max={750} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default PageSettingsPanel
