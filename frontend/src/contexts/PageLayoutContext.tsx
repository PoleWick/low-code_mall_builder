import { createContext, useContext } from 'react'

interface PageLayoutContextValue {
  /** 底部 NavBar 占据的高度（px），无 NavBar 时为 0 */
  navbarHeight: number
  /** 预览容器在视口中的左侧偏移（px） */
  frameLeft: number
  /** 预览容器宽度（px） */
  frameWidth: number
}

const PageLayoutContext = createContext<PageLayoutContextValue>({
  navbarHeight: 0,
  frameLeft: 0,
  frameWidth: 0,
})

export const usePageLayout = () => useContext(PageLayoutContext)

export default PageLayoutContext
