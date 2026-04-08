import axios, { type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { globalMessage as message } from '@/utils/messageBridge'
import type { ApiResponse } from '@/types'

const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
  withCredentials: true, // 携带 HttpOnly Cookie，由浏览器自动管理
})

// 请求拦截器：无需手动注入 Token，Cookie 由浏览器自动附加
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => config,
  (error) => Promise.reject(error)
)

// 响应拦截器：统一错误处理
request.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { code, message: msg, data } = response.data
    if (code === 200) return data as unknown as AxiosResponse
    message.error(msg || '请求失败')
    return Promise.reject(new Error(msg))
  },
  (error) => {
    if (error.response?.status === 401) {
      // 只有当用户之前已登录（store 里有 user）才强制跳转，
      // 避免启动时 getProfile 未登录返回 401 造成无限刷新
      import('@/stores/useUserStore').then(({ default: useUserStore }) => {
        const { user, logout } = useUserStore.getState()
        if (user) {
          logout()
          window.location.href = '/login'
        }
      })
      return Promise.reject(error)
    }
    message.error(error.response?.data?.message || '网络错误，请稍后重试')
    return Promise.reject(error)
  }
)

export default request
