import * as authService from '../services/authService.js'
import { success } from '../utils/response.js'

export const register = async (req, res, next) => {
  try {
    const data = await authService.register(req.body)
    success(res, data, '注册成功')
  } catch (err) {
    next(err)
  }
}

export const login = async (req, res, next) => {
  try {
    const data = await authService.login(req.body)
    success(res, data, '登录成功')
  } catch (err) {
    next(err)
  }
}

export const getProfile = async (req, res, next) => {
  try {
    const data = await authService.getProfile(req.user.id)
    success(res, data)
  } catch (err) {
    next(err)
  }
}
