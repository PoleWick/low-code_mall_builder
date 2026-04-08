import request from '@/utils/request'
import type { User } from '@/types'

export interface RegisterParams {
  username: string
  email: string
  password: string
}

export interface LoginParams {
  email: string
  password: string
}

export interface LoginResult {
  user: User // Token 由后端写入 HttpOnly Cookie，前端不再接收
}

export const authApi = {
  register: (params: RegisterParams) =>
    request.post<never, { id: number; username: string; email: string }>(
      '/auth/register',
      params
    ),

  login: (params: LoginParams) =>
    request.post<never, LoginResult>('/auth/login', params),

  logout: () =>
    request.post<never, null>('/auth/logout'),

  getProfile: () =>
    request.get<never, User>('/auth/profile'),
}
