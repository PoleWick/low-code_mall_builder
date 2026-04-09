import { useState, useMemo } from 'react'
import { Button, Divider, Result, Spin } from 'antd'
import type { ISchema } from '@formily/json-schema'
import useCartStore from '@/stores/useCartStore'
import { ordersApi } from '@/apis/orders'
import styles from './OrderConfirm.module.css'

interface OrderConfirmProps {
  title?:       string
  buttonColor?: string
  buttonText?:  string
  /** 编辑器注入，禁用真实提交 */
  __editorMode?: boolean
}

interface OrderSuccess {
  orderId:      number
  pickupNumber: string
  totalPrice:   number
}

const MOCK_ITEMS = [
  { key: 'demo__12.9', name: '\u793a\u4f8b\u5546\u54c1 A', price: 12.9, image: '', quantity: 2 },
  { key: 'demo__8.9',  name: '\u793a\u4f8b\u5546\u54c1 B', price:  8.9, image: '', quantity: 1 },
]

const OrderConfirm = ({
  title        = '\u786e\u8ba4\u8ba2\u5355',
  buttonColor  = '#ff4d4f',
  buttonText   = '\u63d0\u4ea4\u8ba2\u5355',
  __editorMode = false,
}: OrderConfirmProps) => {
  const { items: cartItems, clear } = useCartStore()
  const [loading, setLoading]   = useState(false)
  const [success, setSuccess]   = useState<OrderSuccess | null>(null)

  // 编辑器用 mock 数据，预览页用真实购物车
  const items = __editorMode ? MOCK_ITEMS : cartItems

  const totalPrice = useMemo(
    () => items.reduce((s, i) => s + (Number(i.price) || 0) * (i.quantity || 0), 0),
    [items]
  )

  // 从预览页 URL 提取 page_id
  const pageId = useMemo(() => {
    const m = window.location.pathname.match(/\/preview\/(\d+)/)
    return m ? Number(m[1]) : undefined
  }, [])

  const handleSubmit = async () => {
    if (__editorMode) return
    if (!items.length) return
    setLoading(true)
    try {
      const res = await ordersApi.create({ items, totalPrice, pageId })
      clear()
      setSuccess(res)
    } catch {
      // 错误由 axios 拦截器统一提示
    } finally {
      setLoading(false)
    }
  }

  /* ===== 下单成功页 ===== */
  if (success) {
    return (
      <div className={styles.wrapper}>
        <Result
          status="success"
          title={
            <div className={styles.pickupWrap}>
              <span className={styles.pickupLabel}>{'取餐号'}</span>
              <span className={styles.pickupNum}>{success.pickupNumber}</span>
            </div>
          }
          subTitle={`订单 #${success.orderId} · 合计 ¥${success.totalPrice.toFixed(1)}`}
          extra={[
            <Button
              key="home"
              onClick={() => window.history.back()}
            >
              {'返回点餐'}
            </Button>,
          ]}
        />
      </div>
    )
  }

  /* ===== 空购物车 ===== */
  if (!__editorMode && items.length === 0) {
    return (
      <div className={styles.wrapper}>
        <Result
          status="warning"
          title={'\u8d2d\u7269\u8f66\u662f\u7a7a\u7684'}
          subTitle={'\u8bf7\u5148\u6dfb\u52a0\u5546\u54c1\u518d\u6765\u7ed3\u7b97'}
          extra={
            <Button onClick={() => window.history.back()}>
              {'\u8fd4\u56de\u70b9\u9910'}
            </Button>
          }
        />
      </div>
    )
  }

  /* ===== 订单明细 ===== */
  return (
    <div className={styles.wrapper}>
      {title && <h2 className={styles.title}>{title}</h2>}

      <div className={styles.itemList}>
        {items.map((item) => (
          <div key={item.key} className={styles.itemRow}>
            <div className={styles.itemImg}>
              {item.image
                ? <img src={item.image} alt={item.name} className={styles.itemImgEl} />
                : <div className={styles.itemImgPlaceholder} />
              }
            </div>
            <div className={styles.itemInfo}>
              <span className={styles.itemName}>{item.name}</span>
              <span className={styles.itemPrice}>&yen;{(Number(item.price) || 0).toFixed(1)}</span>
            </div>
            <span className={styles.itemQty}>&times;{item.quantity}</span>
            <span className={styles.itemSubtotal}>
              &yen;{((Number(item.price) || 0) * item.quantity).toFixed(1)}
            </span>
          </div>
        ))}
      </div>

      <Divider style={{ margin: '12px 0' }} />

      <div className={styles.totalRow}>
        <span className={styles.totalLabel}>{'合计'}</span>
        <span className={styles.totalPrice}>&yen;{totalPrice.toFixed(1)}</span>
      </div>

      <div className={styles.submitWrap}>
        <Button
          type="primary"
          size="large"
          block
          loading={loading}
          disabled={__editorMode}
          style={{ background: buttonColor, borderColor: buttonColor, height: 48, borderRadius: 24, fontSize: 16, fontWeight: 600 }}
          onClick={handleSubmit}
          icon={loading ? <Spin size="small" /> : undefined}
        >
          {__editorMode ? `${buttonText}（编辑器预览）` : buttonText}
        </Button>
      </div>
    </div>
  )
}

export const orderConfirmSchema: ISchema = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      title: '\u6807\u9898',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': { placeholder: '\u786e\u8ba4\u8ba2\u5355' },
    },
    buttonText: {
      type: 'string',
      title: '\u6309\u9215\u6587\u5b57',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': { placeholder: '\u63d0\u4ea4\u8ba2\u5355' },
    },
    buttonColor: {
      type: 'string',
      title: '\u6309\u9215\u989c\u8272',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': { placeholder: '#ff4d4f' },
    },
  },
}

export const orderConfirmDefaultProps: OrderConfirmProps = {
  title:       '\u786e\u8ba4\u8ba2\u5355',
  buttonColor: '#ff4d4f',
  buttonText:  '\u63d0\u4ea4\u8ba2\u5355',
}

export default OrderConfirm
