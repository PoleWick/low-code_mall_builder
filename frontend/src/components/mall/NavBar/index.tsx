import { useMemo } from 'react'
import type { ISchema } from '@formily/json-schema'
import styles from './NavBar.module.css'

export interface NavItem {
  icon:   string   // emoji 或单字符图标
  label:  string
  pageId?: number  // 跳转目标页面 ID
}

interface NavBarProps {
  items?:       NavItem[]
  activeColor?: string
  /** 编辑器画布注入，禁用 sticky 定位 */
  __editorMode?: boolean
}

const DEFAULT_ITEMS: NavItem[] = [
  { icon: '\uD83C\uDFE0', label: '\u9996\u9875' },
  { icon: '\uD83C\uDF7D\uFE0F', label: '\u70B9\u9910' },
  { icon: '\uD83D\uDCCB', label: '\u8BA2\u5355' },
  { icon: '\uD83D\uDC64', label: '\u6211\u7684' },
]

const NavBar = ({
  items        = DEFAULT_ITEMS,
  activeColor  = '#ff4d4f',
  __editorMode = false,
}: NavBarProps) => {
  const safeItems = Array.isArray(items) && items.length > 0 ? items : DEFAULT_ITEMS

  // 从当前 URL 解析出活跃页面 ID（/preview/:id）
  const activePageId = useMemo(() => {
    const match = window.location.pathname.match(/\/preview\/(\d+)/)
    return match ? Number(match[1]) : null
  }, [])

  const handleClick = (item: NavItem) => {
    if (!item.pageId) return
    window.location.href = `/preview/${item.pageId}`
  }

  return (
    <nav
      className={styles.bar}
      style={__editorMode ? { position: 'relative', zIndex: 1 } : undefined}
    >
      {safeItems.map((item, i) => {
        const isActive = item.pageId != null && item.pageId === activePageId
        return (
          <button
            key={i}
            className={styles.tab}
            onClick={() => handleClick(item)}
            style={{ color: isActive ? activeColor : undefined }}
          >
            <span className={styles.icon}>{item.icon || '\u25A1'}</span>
            <span
              className={styles.label}
              style={isActive ? { color: activeColor } : undefined}
            >
              {item.label || `Tab ${i + 1}`}
            </span>
            {isActive && (
              <span className={styles.dot} style={{ background: activeColor }} />
            )}
          </button>
        )
      })}
    </nav>
  )
}

export const navBarSchema: ISchema = {
  type: 'object',
  properties: {
    activeColor: {
      type: 'string',
      title: '\u6FC0\u6D3B\u989C\u8272',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': { placeholder: '#ff4d4f' },
    },
    items: {
      type: 'array',
      title: 'Tab \u5217\u8868',
      'x-decorator': 'FormItem',
      'x-component': 'ArrayItems',
      items: {
        type: 'object',
        'x-component': 'ArrayItems.Item',
        'x-component-props': {
          style: { flexDirection: 'column', alignItems: 'stretch', gap: 0 },
        },
        properties: {
          icon: {
            type: 'string',
            title: '\u56FE\u6807(\u8868\u60C5\u7B26)',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': { placeholder: '\uD83C\uDFE0  \uD83D\uDECD\uFE0F  \uD83D\uDCCB  \uD83D\uDC64' },
          },
          label: {
            type: 'string',
            title: '\u6807\u7B7E',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': { placeholder: '\u9996\u9875' },
          },
          pageId: {
            type: 'number',
            title: '\u8DF3\u8F6C\u9875\u9762 ID',
            'x-decorator': 'FormItem',
            'x-component': 'NumberPicker',
            'x-component-props': { min: 1, precision: 0, placeholder: '\u9875\u9762 ID' },
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
          title: '\u6DFB\u52A0 Tab',
          'x-component': 'ArrayItems.Addition',
        },
      },
    },
  },
}

export const navBarDefaultProps: NavBarProps = {
  items: DEFAULT_ITEMS,
  activeColor: '#ff4d4f',
}

export default NavBar
