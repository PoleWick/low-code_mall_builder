// ===== 用户相关 =====
export interface User {
  id: number
  username: string
  email: string
  avatar?: string
  created_at: string
}

// ===== 商城组件相关 =====
export type ComponentType =
  | 'Banner'
  | 'ProductList'
  | 'CategoryNav'
  | 'CartEntry'
  | 'SearchBar'
  | 'Divider'
  | 'RichText'
  | 'ImageBlock'

export interface MallComponent {
  id: string
  type: ComponentType
  order: number
  props: Record<string, unknown>
}

export interface PageSettings {
  backgroundColor: string
  title: string
  maxWidth: number
}

export interface PageConfig {
  pageSettings: PageSettings
  components: MallComponent[]
}

// ===== 页面相关 =====
export interface Page {
  id: number
  user_id: number
  title: string
  cover?: string
  config: PageConfig
  status: 1 | 2  // 1:草稿 2:已发布
  created_at: string
  updated_at: string
}

export interface PageListItem {
  id: number
  title: string
  cover?: string
  status: 1 | 2
  created_at: string
  updated_at: string
}

// ===== API 响应 =====
export interface ApiResponse<T = null> {
  code: number
  message: string
  data: T
}

export interface PaginatedData<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

// ===== 编辑器相关 =====
export interface DragItem {
  type: 'NEW_COMPONENT' | 'CANVAS_COMPONENT'
  componentType?: ComponentType
  id?: string
  index?: number
}
