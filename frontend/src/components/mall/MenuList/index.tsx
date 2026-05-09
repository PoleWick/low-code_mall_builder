import { useState } from 'react'
import type { ISchema } from '@formily/json-schema'
import useCartStore, { makeCartKey } from '@/stores/useCartStore'
import styles from './MenuList.module.css'

// ── 类型定义 ─────────────────────────────────────────────────────────────────
interface MenuItem {
  name:           string
  price:          number
  originalPrice?: number
  image?:         string
  badge?:         string
  description?:   string
}

interface MenuCategory {
  id:     number
  label:  string
  items?: MenuItem[]
}

interface MenuListProps {
  categories?:    MenuCategory[]
  activeColor?:   string
  height?:        number
  __editorMode?:  boolean
}

// ── 默认数据 ──────────────────────────────────────────────────────────────────
const DEFAULT_CATEGORIES: MenuCategory[] = [
  {
    id: 1,
    label: '推荐',
    items: [
      { name: '示例商品 A', price: 12.9, originalPrice: 15.0, image: '', badge: '热销', description: '招牌爆款，不容错过' },
      { name: '示例商品 B', price: 8.9,  originalPrice: 10.0, image: '', badge: '新品' },
    ],
  },
  {
    id: 2,
    label: '特价',
    items: [
      { name: '示例商品 C', price: 19.9, image: '' },
    ],
  },
]

// ── 组件 ──────────────────────────────────────────────────────────────────────
const MenuList = ({
  categories   = DEFAULT_CATEGORIES,
  activeColor  = '#ff4d4f',
  height       = 480,
  __editorMode = false,
}: MenuListProps) => {
  const safeCats = Array.isArray(categories) && categories.length > 0
    ? categories
    : DEFAULT_CATEGORIES

  const [activeCatId, setActiveCatId] = useState<number>(safeCats[0]?.id ?? 1)
  const activeCategory = safeCats.find((c) => c.id === activeCatId) ?? safeCats[0]
  const activeItems    = Array.isArray(activeCategory?.items) ? activeCategory.items : []

  const { items: cartItems, add, decrease } = useCartStore()
  const getQty = (item: MenuItem) =>
    cartItems.find((ci) => ci.key === makeCartKey(item.name, item.price))?.quantity ?? 0
  const changeQty = (item: MenuItem, delta: number) => {
    if (__editorMode) return
    if (delta > 0) {
      add({ name: item.name, price: item.price, originalPrice: item.originalPrice, image: item.image ?? '' })
    } else {
      decrease(makeCartKey(item.name, item.price))
    }
  }

  /** 预览时弹性填满剩余空间；编辑器内用固定 height 保持可预览性 */
  const wrapperStyle = __editorMode
    ? { height }
    : { flex: 1, minHeight: 0 }

  return (
    <div className={styles.wrapper} style={wrapperStyle}>
      {/* ── 左侧分类栏 ── */}
      <aside className={styles.sidebar}>
        {safeCats.map((cat) => {
          const isActive = cat.id === activeCatId
          return (
            <div
              key={cat.id}
              className={`${styles.catItem} ${isActive ? styles.catItemActive : ''}`}
              style={isActive ? { borderLeftColor: activeColor, color: activeColor } : undefined}
              onClick={() => !__editorMode && setActiveCatId(cat.id)}
            >
              {cat.label}
            </div>
          )
        })}
      </aside>

      {/* ── 右侧商品列表 ── */}
      <main className={styles.content}>
        <div className={styles.catTitle}>{activeCategory?.label}</div>
        {activeItems.length === 0 ? (
          <div className={styles.empty}>暂无商品</div>
        ) : (
          activeItems.map((item, i) => {
            const qty = getQty(item)
            return (
              <div key={i} className={styles.item}>
                {/* 图片 */}
                <div className={styles.imgBox}>
                  {item.image
                    ? <img src={item.image} alt={item.name} className={styles.img} />
                    : <div className={styles.imgPlaceholder} />
                  }
                  {item.badge && (
                    <span className={styles.badge} style={{ background: activeColor }}>
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* 信息 */}
                <div className={styles.info}>
                  <div className={styles.name}>{item.name || '未命名商品'}</div>
                  {item.description && (
                    <div className={styles.desc}>{item.description}</div>
                  )}
                  <div className={styles.priceRow}>
                    <span className={styles.price} style={{ color: activeColor }}>
                      ¥{(Number(item.price) || 0).toFixed(1)}
                    </span>
                    {item.originalPrice != null && Number(item.originalPrice) > Number(item.price) && (
                      <span className={styles.originalPrice}>
                        ¥{Number(item.originalPrice).toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>

                {/* 数量控件 */}
                <div className={styles.qtyControls}>
                  {qty > 0 && (
                    <>
                      <button
                        className={styles.qtyCircle}
                        style={{ borderColor: activeColor, color: activeColor }}
                        onClick={() => changeQty(item, -1)}
                        aria-label="减少数量"
                      >
                        &minus;
                      </button>
                      <span className={styles.qtyNum}>{qty}</span>
                    </>
                  )}
                  <button
                    className={`${styles.qtyCircle} ${styles.qtyCircleAdd}`}
                    style={{ background: activeColor, borderColor: activeColor }}
                    onClick={() => changeQty(item, +1)}
                    aria-label="增加数量"
                  >
                    &#43;
                  </button>
                </div>
              </div>
            )
          })
        )}
      </main>
    </div>
  )
}

// ── Formily Schema ────────────────────────────────────────────────────────────
/** 商品子项 schema（在 categories.items 里复用） */
const menuItemSchema = {
  type: 'object',
  'x-component': 'ArrayItems.Item',
  'x-component-props': {
    style: { flexDirection: 'column', alignItems: 'stretch', gap: 0 },
  },
  properties: {
    image: {
      type: 'string',
      title: '商品图片',
      'x-decorator': 'FormItem',
      'x-component': 'ImageUploader',
    },
    name: {
      type: 'string',
      title: '名称',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': { placeholder: '请输入商品名称' },
    },
    description: {
      type: 'string',
      title: '描述',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': { placeholder: '可选，一句话介绍' },
    },
    price: {
      type: 'number',
      title: '现价(¥)',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': { min: 0, precision: 1, placeholder: '0.0' },
    },
    originalPrice: {
      type: 'number',
      title: '划线原价',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': { min: 0, precision: 1, placeholder: '不填则不显示' },
    },
    badge: {
      type: 'string',
      title: '徽章',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': { placeholder: '热销 / 新品 / 推荐…' },
    },
    remove: {
      type: 'void',
      'x-component': 'ArrayItems.Remove',
    },
  },
}

export const menuListSchema: ISchema = {
  type: 'object',
  properties: {
    activeColor: {
      type: 'string',
      title: '主题色',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': { placeholder: '#ff4d4f' },
    },
    height: {
      type: 'number',
      title: '组件高度(px)',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': { min: 200, max: 1000, placeholder: '480' },
    },
    categories: {
      type: 'array',
      title: '分类列表',
      'x-decorator': 'FormItem',
      'x-component': 'ArrayItems',
      items: {
        type: 'object',
        'x-component': 'ArrayItems.Item',
        'x-component-props': {
          style: { flexDirection: 'column', alignItems: 'stretch', gap: 0 },
        },
        properties: {
          label: {
            type: 'string',
            title: '分类名',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': { placeholder: '如：推荐、特价' },
          },
          items: {
            type: 'array',
            title: '商品',
            'x-decorator': 'FormItem',
            'x-component': 'ArrayItems',
            items: menuItemSchema,
            properties: {
              add: {
                type: 'void',
                title: '添加商品',
                'x-component': 'ArrayItems.Addition',
              },
            },
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
          title: '添加分类',
          'x-component': 'ArrayItems.Addition',
        },
      },
    },
  },
}

export const menuListDefaultProps: MenuListProps = {
  categories:  DEFAULT_CATEGORIES,
  activeColor: '#ff4d4f',
  height:      480,
}

export default MenuList
