import type { MessageInstance } from 'antd/es/message/interface'

/**
 * 在非组件代码（如 axios 拦截器）中使用 antd message
 * 通过 setMessageApi 注入实例，避免直接使用静态方法
 */
let messageApi: MessageInstance | null = null

export const setMessageApi = (api: MessageInstance) => {
  messageApi = api
}

export const globalMessage: MessageInstance = new Proxy({} as MessageInstance, {
  get(_, key) {
    if (messageApi) return messageApi[key as keyof MessageInstance]
    // 降级到控制台，避免空指针
    if (key === 'error') return (msg: string) => console.error('[message]', msg)
    if (key === 'success') return (msg: string) => console.log('[message]', msg)
    if (key === 'warning') return (msg: string) => console.warn('[message]', msg)
    return () => {}
  },
})
