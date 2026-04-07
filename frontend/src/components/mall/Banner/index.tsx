import type { ISchema } from '@formily/json-schema'
import styles from './Banner.module.css'

interface BannerProps {
  imageUrl?: string
  linkUrl?: string
  height?: number
  borderRadius?: number
}

const Banner = ({ imageUrl, height = 200, linkUrl, borderRadius = 0 }: BannerProps) => {
  const content = (
    <div className={styles.wrapper} style={{ height, borderRadius }}>
      {imageUrl
        ? <img src={imageUrl} alt="banner" className={styles.img} />
        : <div className={styles.placeholder}>点击配置图片</div>
      }
    </div>
  )
  return linkUrl ? <a href={linkUrl} className={styles.link}>{content}</a> : content
}

export const bannerSchema: ISchema = {
  type: 'object',
  properties: {
    imageUrl:     { type: 'string', title: '图片地址', 'x-decorator': 'FormItem', 'x-component': 'Input', 'x-component-props': { placeholder: 'https://...' } },
    linkUrl:      { type: 'string', title: '跳转链接', 'x-decorator': 'FormItem', 'x-component': 'Input', 'x-component-props': { placeholder: 'https://...' } },
    height:       { type: 'number', title: '高度(px)', 'x-decorator': 'FormItem', 'x-component': 'NumberPicker', 'x-component-props': { min: 50, max: 600 } },
    borderRadius: { type: 'number', title: '圆角(px)', 'x-decorator': 'FormItem', 'x-component': 'NumberPicker', 'x-component-props': { min: 0, max: 50 } },
  },
}

export const bannerDefaultProps: BannerProps = {
  imageUrl: '',
  linkUrl: '',
  height: 200,
  borderRadius: 0,
}

export default Banner
