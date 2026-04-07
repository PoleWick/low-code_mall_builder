import type { ISchema } from '@formily/json-schema'
import styles from './RichText.module.css'

interface RichTextProps {
  content?: string
  padding?: number
}

const RichText = ({ content = '<p>点击编辑文本内容</p>', padding = 12 }: RichTextProps) => (
  <div
    className={styles.content}
    style={{ padding }}
    dangerouslySetInnerHTML={{ __html: content }}
  />
)

export const richTextSchema: ISchema = {
  type: 'object',
  properties: {
    content: {
      type: 'string', title: '内容(支持HTML)',
      'x-decorator': 'FormItem', 'x-component': 'Input.TextArea',
      'x-component-props': { rows: 5, placeholder: '<p>文本内容</p>' },
    },
    padding: {
      type: 'number', title: '内边距(px)',
      'x-decorator': 'FormItem', 'x-component': 'NumberPicker',
      'x-component-props': { min: 0, max: 40 },
    },
  },
}

export const richTextDefaultProps: RichTextProps = {
  content: '<p>点击编辑文本内容</p>',
  padding: 12,
}

export default RichText
