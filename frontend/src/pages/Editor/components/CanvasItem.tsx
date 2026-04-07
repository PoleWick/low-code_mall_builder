import { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { Tooltip } from 'antd'
import { DeleteOutlined, HolderOutlined } from '@ant-design/icons'
import { DND_TYPES } from '@/constants/dndTypes'
import { COMPONENT_REGISTRY } from '@/constants/componentRegistry'
import useEditorStore from '@/stores/useEditorStore'
import type { MallComponent } from '@/types'
import styles from './CanvasItem.module.css'

interface Props {
  component: MallComponent
  index: number
}

interface DragItem {
  id: string
  index: number
}

const CanvasItem = ({ component, index }: Props) => {
  const ref = useRef<HTMLDivElement>(null)
  const { selectedId, selectComponent, removeComponent, moveComponent } = useEditorStore()
  const isSelected = selectedId === component.id

  const [{ isDragging }, dragRef] = useDrag<DragItem, void, { isDragging: boolean }>(() => ({
    type: DND_TYPES.CANVAS_COMPONENT,
    item: { id: component.id, index },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }))

  const [, dropRef] = useDrop<DragItem>(() => ({
    accept: DND_TYPES.CANVAS_COMPONENT,
    hover: (item) => {
      if (item.index !== index) {
        moveComponent(item.index, index)
        item.index = index
      }
    },
  }))

  dragRef(dropRef(ref))

  const registry = COMPONENT_REGISTRY[component.type]
  if (!registry) return null
  const Component = registry.component
  // Immer proxy → 普通对象；structuredClone 无法克隆 Immer draft proxy，改用 JSON 往返序列化
  const safeProps = JSON.parse(JSON.stringify(component.props)) as Record<string, unknown>

  return (
    <div
      ref={ref}
      className={styles.wrapper}
      onClick={(e) => { e.stopPropagation(); selectComponent(component.id) }}
      style={{
        opacity: isDragging ? 0.4 : 1,
        outline: isSelected ? '2px solid #ff4d4f' : '2px solid transparent',
      }}
    >
      <Component {...safeProps} />

      {isSelected && (
        <div className={styles.actionBar}>
          <Tooltip title="拖动排序">
            <span className={styles.actionBtn}><HolderOutlined /></span>
          </Tooltip>
          <Tooltip title="删除组件">
            <span
              className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
              onClick={(e) => { e.stopPropagation(); removeComponent(component.id) }}
            >
              <DeleteOutlined />
            </span>
          </Tooltip>
        </div>
      )}

      {isSelected && (
        <div className={styles.typeLabel}>{registry.label}</div>
      )}
    </div>
  )
}

export default CanvasItem
