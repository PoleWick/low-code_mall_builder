import type { ISchema } from '@formily/json-schema'
import styles from './ProductList.module.css'

interface Product {
  id: number
  name: string
  price: number
  image: string
  badge?: string
}

interface ProductListProps {
  title?: string
  columns?: number
  showPrice?: boolean
  products?: Product[]
}

const DEFAULT_PRODUCTS: Product[] = [
  { id: 1, name: '示例商品 A', price: 99.9, image: '', badge: '热销' },
  { id: 2, name: '示例商品 B', price: 199.0, image: '' },
]

const ProductList = ({ title = '热销商品', columns = 2, showPrice = true, products }: ProductListProps) => {
  const safeProducts = Array.isArray(products) ? products : DEFAULT_PRODUCTS
  const colWidth = `calc(${100 / columns}% - 6px)`

  return (
    <div className={styles.wrapper}>
      {title && <div className={styles.title}>{title}</div>}
      <div className={styles.grid}>
        {safeProducts.map((p) => (
          <div key={p.id} className={styles.card} style={{ width: colWidth }}>
            <div className={styles.imgBox}>
              {p.image
                ? <img src={p.image} alt={p.name} className={styles.img} />
                : <span className={styles.noImg}>暂无图片</span>
              }
              {p.badge && <span className={styles.badge}>{p.badge}</span>}
            </div>
            <div className={styles.info}>
              <div className={styles.name}>{p.name}</div>
              {showPrice && <div className={styles.price}>¥{p.price.toFixed(2)}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export const productListSchema: ISchema = {
  type: 'object',
  properties: {
    title:     { type: 'string', title: '标题', 'x-decorator': 'FormItem', 'x-component': 'Input' },
    columns:   { type: 'number', title: '每行列数', 'x-decorator': 'FormItem', 'x-component': 'NumberPicker', 'x-component-props': { min: 1, max: 4 } },
    showPrice: { type: 'boolean', title: '显示价格', 'x-decorator': 'FormItem', 'x-component': 'Switch' },
  },
}

export const productListDefaultProps: ProductListProps = {
  title: '热销商品',
  columns: 2,
  showPrice: true,
  products: DEFAULT_PRODUCTS,
}

export default ProductList
