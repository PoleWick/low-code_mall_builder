import type { ISchema } from '@formily/json-schema'
import styles from './CartEntry.module.css'

interface CartEntryProps {
  position?: 'bottom-right' | 'bottom-left'
  backgroundColor?: string
  iconColor?: string
  size?: number
}

const CartEntry = ({
  position = 'bottom-right',
  backgroundColor = '#ff4d4f',
  iconColor = '#fff',
  size = 56,
}: CartEntryProps) => {
  const posStyle = position === 'bottom-right'
    ? { right: 16, bottom: 16 }
    : { left: 16, bottom: 16 }

  return (
    <div
      className={styles.btn}
      style={{ ...posStyle, width: size, height: size, backgroundColor }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"
          stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}

export const cartEntrySchema: ISchema = {
  type: 'object',
  properties: {
    position: {
      type: 'string', title: '位置',
      'x-decorator': 'FormItem', 'x-component': 'Select',
      enum: [
        { label: '右下角', value: 'bottom-right' },
        { label: '左下角', value: 'bottom-left' },
      ],
    },
    backgroundColor: {
      type: 'string', title: '背景颜色',
      'x-decorator': 'FormItem', 'x-component': 'Input',
      'x-component-props': { placeholder: '#ff4d4f' },
    },
    size: {
      type: 'number', title: '按鈕大小(px)',
      'x-decorator': 'FormItem', 'x-component': 'NumberPicker',
      'x-component-props': { min: 40, max: 80 },
    },
  },
}

export const cartEntryDefaultProps: CartEntryProps = {
  position: 'bottom-right',
  backgroundColor: '#ff4d4f',
  iconColor: '#ffffff',
  size: 56,
}

export default CartEntry
