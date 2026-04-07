import type { ISchema } from '@formily/json-schema'
import styles from './ImageBlock.module.css'

interface ImageBlockProps {
  imageUrl?: string
  linkUrl?: string
  height?: number
  objectFit?: 'cover' | 'contain' | 'fill'
}

const ImageBlock = ({ imageUrl, linkUrl, height = 150, objectFit = 'cover' }: ImageBlockProps) => {
  const content = (
    <div className={styles.wrapper} style={{ height }}>
      {imageUrl
        ? <img src={imageUrl} alt="" className={styles.img} style={{ objectFit }} />
        : <span className={styles.placeholder}>点击配置图片</span>
      }
    </div>
  )
  return linkUrl ? <a href={linkUrl} className={styles.link}>{content}</a> : content
}

export const imageBlockSchema: ISchema = {
  type: 'object',
  properties: {
    imageUrl:  { type: 'string', title: '图片地址', 'x-decorator': 'FormItem', 'x-component': 'Input', 'x-component-props': { placeholder: 'https://...' } },
    linkUrl:   { type: 'string', title: '跳转链接', 'x-decorator': 'FormItem', 'x-component': 'Input', 'x-component-props': { placeholder: 'https://...' } },
    height:    { type: 'number', title: '高度(px)', 'x-decorator': 'FormItem', 'x-component': 'NumberPicker', 'x-component-props': { min: 50, max: 500 } },
    objectFit: { type: 'string', title: '填充方式', 'x-decorator': 'FormItem', 'x-component': 'Select', enum: [{ label: '覆盖(cover)', value: 'cover' }, { label: '包含(contain)', value: 'contain' }, { label: '拉伸(fill)', value: 'fill' }] },
  },
}

export const imageBlockDefaultProps: ImageBlockProps = {
  imageUrl: '',
  linkUrl: '',
  height: 150,
  objectFit: 'cover',
}

export default ImageBlock
