export const DND_TYPES = {
  NEW_COMPONENT: 'NEW_COMPONENT',     // 从组件面板拖入
  CANVAS_COMPONENT: 'CANVAS_COMPONENT', // 画布内排序
} as const

export type DndType = typeof DND_TYPES[keyof typeof DND_TYPES]
