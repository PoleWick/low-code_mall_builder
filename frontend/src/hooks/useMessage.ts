import { App } from 'antd'

/**
 * 统一用 App.useApp() 获取 message 实例，避免静态调用的上下文警告
 */
const useMessage = () => App.useApp().message

export default useMessage
