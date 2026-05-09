import { useCallback, useEffect, useState } from 'react'

interface PreviewFrame {
  frameLeft: number
  frameWidth: number
}

/**
 * 维护预览容器在视口中的 left/width，供 fixed 组件精确贴合。
 */
const usePreviewFrame = (target: React.RefObject<HTMLElement | null>, deps: unknown[] = []): PreviewFrame => {
  const [frameLeft, setFrameLeft] = useState(0)
  const [frameWidth, setFrameWidth] = useState(0)

  const updateFrameRect = useCallback(() => {
    const el = target.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    setFrameLeft(rect.left)
    setFrameWidth(rect.width)
  }, [target])

  useEffect(() => {
    updateFrameRect()
    const onResize = () => updateFrameRect()
    window.addEventListener('resize', onResize)
    const ro = new ResizeObserver(() => updateFrameRect())
    if (target.current) ro.observe(target.current)
    return () => {
      window.removeEventListener('resize', onResize)
      ro.disconnect()
    }
    // deps: 例如 page / maxWidth 变化后重测
  }, [updateFrameRect, ...deps]) // eslint-disable-line react-hooks/exhaustive-deps

  return { frameLeft, frameWidth }
}

export default usePreviewFrame
