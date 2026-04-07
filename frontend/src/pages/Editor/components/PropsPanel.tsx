import { useEffect, useState } from 'react'
import { Typography, Empty } from 'antd'
import { createForm, onFieldValueChange } from '@formily/core'
import { FormProvider } from '@formily/react'
import { SchemaField } from './SchemaField'
import { Form } from '@formily/antd-v5'
import { COMPONENT_REGISTRY } from '@/constants/componentRegistry'
import useEditorStore from '@/stores/useEditorStore'
import styles from './PropsPanel.module.css'

const { Text } = Typography

const PropsPanel = () => {
  const { selectedId, components, updateComponentProps } = useEditorStore()
  const selected = components.find((c) => c.id === selectedId)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [form, setForm] = useState<any>(null)

  useEffect(() => {
    if (!selected) return
    const newForm = createForm({
      // Immer proxy → 普通对象，防止 Formily 内部 freeze 时触发 Proxy 只读保护
      initialValues: JSON.parse(JSON.stringify(selected.props)),
      effects() {
        onFieldValueChange('*', () => {
          // Formily values 是 Observable 对象，序列化后再写入 Immer store
          const values = JSON.parse(JSON.stringify(newForm.values))
          updateComponentProps(selected.id, values)
        })
      },
    })
    setForm(newForm)
  }, [selectedId]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!selected || !form) {
    return (
      <div className={styles.emptyState}>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <Text type="secondary">点击画布中的组件进行配置</Text>
          }
        />
      </div>
    )
  }

  const registry = COMPONENT_REGISTRY[selected.type]
  if (!registry) return null

  return (
    <div className={styles.panel}>
      <Text strong className={styles.panelTitle}>{registry.label} 属性</Text>
      <FormProvider form={form}>
        <Form form={form} labelCol={8} wrapperCol={16}>
          <SchemaField schema={registry.schema} />
        </Form>
      </FormProvider>
    </div>
  )
}

export default PropsPanel
