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
  token: string
  user: User
}

export const authApi = {
  register: (params: RegisterParams) =>
    request.post<never, { id: number; username: string; email: string }>(
      '/auth/register',
      params
    ),

  login: (params: LoginParams) =>
    request.post<never, LoginResult>('/auth/login', params),

  getProfile: () =>
    request.get<never, User>('/auth/profile'),
}
