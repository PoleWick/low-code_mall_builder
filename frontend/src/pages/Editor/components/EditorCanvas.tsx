import { useDrop } from 'react-dnd'
import { Empty } from 'antd'
import { DND_TYPES } from '@/constants/dndTypes'
import { COMPONENT_REGISTRY } from '@/constants/componentRegistry'
import useEditorStore from '@/stores/useEditorStore'
import type { ComponentType } from '@/types'
import CanvasItem from './CanvasItem'
import styles from './EditorCanvas.module.css'

interface DropItem {
  componentType?: ComponentType
}

const EditorCanvas = () => {
  const { components, pageSettings, addComponent, selectComponent } = useEditorStore()
  const sorted = [...components].sort((a, b) => a.order - b.order)

  const [{ isOver, canDrop }, dropRef] = useDrop<DropItem, void, { isOver: boolean; canDrop: boolean }>(() => ({
    accept: DND_TYPES.NEW_COMPONENT,
    drop: (item, monitor) => {
      if (monitor.didDrop()) return
      if (item.componentType) {
        const registry = COMPONENT_REGISTRY[item.componentType]
        if (registry) addComponent(item.componentType, { ...registry.defaultProps })
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  }))

  const isActive = isOver && canDrop
  const outlineColor = isActive ? '#ff4d4f' : canDrop ? '#ffa39e' : 'transparent'
  const outlineStyle = isActive || canDrop ? '2px dashed' : '2px solid'

  return (
    <div
      ref={dropRef as unknown as React.RefObject<HTMLDivElement>}
      className={styles.canvas}
      onClick={() => selectComponent(null)}
      style={{
        width: pageSettings.maxWidth || 375,
        background: pageSettings.backgroundColor || '#fff',
        outline: `${outlineStyle} ${outlineColor}`,
      }}
    >
      {isActive && (
        <div className={styles.dropOverlay}>
          <span className={styles.dropHint}>松开以添加组件</span>
        </div>
      )}

      {sorted.length === 0 ? (
        <div className={styles.emptyState}>
          <Empty description="从左侧拖拽组件到此处" />
        </div>
      ) : (
        sorted.map((comp, index) => (
          <CanvasItem key={comp.id} component={comp} index={index} />
        ))
      )}
    </div>
  )
}

export default EditorCanvas
