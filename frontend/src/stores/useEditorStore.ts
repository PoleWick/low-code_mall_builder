import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { v4 as uuidv4 } from 'uuid'
import type { MallComponent, ComponentType, PageConfig, PageSettings } from '@/types'

interface EditorState {
  // 数据
  pageId: number | null
  pageTitle: string
  components: MallComponent[]
  pageSettings: PageSettings
  selectedId: string | null
  isDirty: boolean

  // Actions
  setPageId: (id: number | null) => void
  setPageTitle: (title: string) => void
  addComponent: (type: ComponentType, props: Record<string, unknown>) => void
  removeComponent: (id: string) => void
  updateComponentProps: (id: string, props: Record<string, unknown>) => void
  moveComponent: (fromIndex: number, toIndex: number) => void
  selectComponent: (id: string | null) => void
  setPageSettings: (settings: Partial<PageSettings>) => void
  loadConfig: (config: PageConfig, pageId: number, title: string) => void
  exportConfig: () => PageConfig
  resetEditor: () => void
}

const DEFAULT_PAGE_SETTINGS: PageSettings = {
  backgroundColor: '#f5f5f5',
  title: '我的商城',
  maxWidth: 375,
}

const useEditorStore = create<EditorState>()(
  immer((set, get) => ({
    pageId: null,
    pageTitle: '未命名页面',
    components: [],
    pageSettings: { ...DEFAULT_PAGE_SETTINGS },
    selectedId: null,
    isDirty: false,

    setPageId: (id) => set((state) => { state.pageId = id }),

    setPageTitle: (title) => set((state) => {
      state.pageTitle = title
      state.isDirty = true
    }),

    addComponent: (type, props) => set((state) => {
      const newComponent: MallComponent = {
        id: uuidv4(),
        type,
        order: state.components.length,
        props,
      }
      state.components.push(newComponent)
      state.selectedId = newComponent.id
      state.isDirty = true
    }),

    removeComponent: (id) => set((state) => {
      const idx = state.components.findIndex((c) => c.id === id)
      if (idx !== -1) {
        state.components.splice(idx, 1)
        state.components.forEach((c, i) => { c.order = i })
      }
      if (state.selectedId === id) state.selectedId = null
      state.isDirty = true
    }),

    updateComponentProps: (id, props) => set((state) => {
      const comp = state.components.find((c) => c.id === id)
      if (comp) {
        comp.props = { ...comp.props, ...props }
        state.isDirty = true
      }
    }),

    moveComponent: (fromIndex, toIndex) => set((state) => {
      const [removed] = state.components.splice(fromIndex, 1)
      state.components.splice(toIndex, 0, removed)
      state.components.forEach((c, i) => { c.order = i })
      state.isDirty = true
    }),

    selectComponent: (id) => set((state) => { state.selectedId = id }),

    setPageSettings: (settings) => set((state) => {
      state.pageSettings = { ...state.pageSettings, ...settings }
      state.isDirty = true
    }),

    loadConfig: (config, pageId, title) => set((state) => {
      state.pageId = pageId
      state.pageTitle = title
      state.components = config.components
      state.pageSettings = { ...DEFAULT_PAGE_SETTINGS, ...config.pageSettings }
      state.selectedId = null
      state.isDirty = false
    }),

    exportConfig: () => {
      const { components, pageSettings } = get()
      return { components, pageSettings }
    },

    resetEditor: () => set((state) => {
      state.pageId = null
      state.pageTitle = '未命名页面'
      state.components = []
      state.pageSettings = { ...DEFAULT_PAGE_SETTINGS }
      state.selectedId = null
      state.isDirty = false
    }),
  }))
)

export default useEditorStore
