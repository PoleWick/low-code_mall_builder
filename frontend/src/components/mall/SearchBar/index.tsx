import type { ISchema } from '@formily/json-schema'
import styles from './SearchBar.module.css'

interface SearchBarProps {
  placeholder?: string
  backgroundColor?: string
  borderRadius?: number
  showSearchIcon?: boolean
}

const SearchBar = ({
  placeholder = '搜索商品',
  backgroundColor = '#f5f5f5',
  borderRadius = 20,
  showSearchIcon = true,
}: SearchBarProps) => (
  <div className={styles.outer}>
    <div className={styles.inner} style={{ background: backgroundColor, borderRadius, padding: '8px 14px' }}>
      {showSearchIcon && (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
      )}
      <span className={styles.text}>{placeholder}</span>
    </div>
  </div>
)

export const searchBarSchema: ISchema = {
  type: 'object',
  properties: {
    placeholder: {
      type: 'string', title: '占位文字',
      'x-decorator': 'FormItem', 'x-component': 'Input',
    },
    backgroundColor: {
      type: 'string', title: '背景颜色',
      'x-decorator': 'FormItem', 'x-component': 'Input',
    },
    borderRadius: {
      type: 'number', title: '圆角(px)',
      'x-decorator': 'FormItem', 'x-component': 'NumberPicker',
      'x-component-props': { min: 0, max: 30 },
    },
    showSearchIcon: {
      type: 'boolean', title: '显示搜索图标',
      'x-decorator': 'FormItem', 'x-component': 'Switch',
    },
  },
}

export const searchBarDefaultProps: SearchBarProps = {
  placeholder: '搜索商品',
  backgroundColor: '#f5f5f5',
  borderRadius: 20,
  showSearchIcon: true,
}

export default SearchBar
