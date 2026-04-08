import { useState } from 'react'
import type { ISchema } from '@formily/json-schema'
import styles from './ProductList.module.css'

interface Product {
  id?: number
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
  { name: '\u793a\u4f8b\u5546\u54c1 A', price: 99.9,  image: '', badge: '\u70ed\u9500' },
  { name: '\u793a\u4f8b\u5546\u54c1 B', price: 199.0, image: '' },
]

const MAX_COLUMNS = 4

const ProductList = ({ title = '\u70ed\u9500\u5546\u54c1', columns = 2, showPrice = true, products }: ProductListProps) => {
  const safeProducts = Array.isArray(products) && products.length > 0 ? products : DEFAULT_PRODUCTS
  const safeColumns  = Math.min(Math.max(columns ?? 2, 1), MAX_COLUMNS)
  const colWidth     = `calc(${100 / safeColumns}% - ${((safeColumns - 1) * 8) / safeColumns}px)`

  // 各商品数量，key 为 index
  const [quantities, setQuantities] = useState<Record<number, number>>({})

  const getQty   = (i: number) => quantities[i] ?? 1
  const changeQty = (i: number, delta: number) => {
    setQuantities((prev) => {
      const next = Math.max(1, (prev[i] ?? 1) + delta)
      return { ...prev, [i]: next }
    })
  }

  return (
    <div className={styles.wrapper}>
      {title && <div className={styles.title}>{title}</div>}
      <div className={styles.grid}>
        {safeProducts.map((p, i) => (
          <div key={i} className={styles.card} style={{ width: colWidth }}>
            {/* 商品图片 */}
            <div className={styles.imgBox}>
              {p.image
                ? <img src={p.image} alt={p.name} className={styles.img} />
                : <span className={styles.noImg}>{'暂无图片'}</span>
              }
              {p.badge && <span className={styles.badge}>{p.badge}</span>}
            </div>

            {/* 商品信息 */}
            <div className={styles.info}>
              <div className={styles.name}>{p.name || '\u672a\u547d\u540d\u5546\u54c1'}</div>
              {showPrice && (
                <div className={styles.price}>
                  &yen;{(Number(p.price) || 0).toFixed(2)}
                </div>
              )}

              {/* 数量选择 */}
              <div className={styles.qtyRow}>
                <button
                  className={styles.qtyBtn}
                  onClick={() => changeQty(i, -1)}
                  disabled={getQty(i) <= 1}
                  aria-label="\u51cf\u5c11\u6570\u91cf"
                >
                  −
                </button>
                <span className={styles.qtyNum}>{getQty(i)}</span>
                <button
                  className={styles.qtyBtn}
                  onClick={() => changeQty(i, +1)}
                  aria-label="\u589e\u52a0\u6570\u91cf"
                >
                  ＋
                </button>
              </div>

              {/* 加入购物车（联动预留） */}
              <button className={styles.addCartBtn}>
                {'加入购物车'}
              </button>
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
    title: {
      type: 'string',
      title: '\u6807\u9898',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    columns: {
      type: 'number',
      title: '\u6bcf\u884c\u5217\u6570',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': { min: 1, max: MAX_COLUMNS, placeholder: `\u6700\u591a ${MAX_COLUMNS} \u5217` },
    },
    showPrice: {
      type: 'boolean',
      title: '\u663e\u793a\u4ef7\u683c',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
    },
    products: {
      type: 'array',
      title: '\u5546\u54c1\u5217\u8868',
      'x-decorator': 'FormItem',
      'x-component': 'ArrayItems',
      items: {
        type: 'object',
        'x-component': 'ArrayItems.Item',
        properties: {
          image: {
            type: 'string',
            title: '\u5546\u54c1\u56fe\u7247',
            'x-decorator': 'FormItem',
            'x-component': 'ImageUploader',
          },
          name: {
            type: 'string',
            title: '\u5546\u54c1\u540d\u79f0',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': { placeholder: '\u8bf7\u8f93\u5165\u5546\u54c1\u540d\u79f0' },
          },
          price: {
            type: 'number',
            title: '\u4ef7\u683c(\u00a5)',
            'x-decorator': 'FormItem',
            'x-component': 'NumberPicker',
            'x-component-props': { min: 0, precision: 2, placeholder: '0.00' },
          },
          badge: {
            type: 'string',
            title: '\u6807\u7b7e',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': { placeholder: '\u70ed\u9500 / \u65b0\u54c1 / \u6298\u6263...' },
          },
          remove: {
            type: 'void',
            'x-component': 'ArrayItems.Remove',
          },
        },
      },
      properties: {
        add: {
          type: 'void',
          title: '\u6dfb\u52a0\u5546\u54c1',
          'x-component': 'ArrayItems.Addition',
        },
      },
    },
  },
}

export const productListDefaultProps: ProductListProps = {
  title: '\u70ed\u9500\u5546\u54c1',
  columns: 2,
  showPrice: true,
  products: DEFAULT_PRODUCTS,
}

export default ProductList
