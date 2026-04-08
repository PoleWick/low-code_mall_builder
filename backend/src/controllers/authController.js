import * as authService from '../services/authService.js'
import { success } from '../utils/response.js'

// cookie 配置复用
const cookieOptions = () => ({
  httpOnly: true,                                        // JS 不可读，防 XSS
  sameSite: 'lax',                                       // 防 CSRF（宽松模式兼容跳转）
  secure: process.env.NODE_ENV === 'production',         // 生产环境仅 HTTPS
  maxAge: 7 * 24 * 60 * 60 * 1000,                      // 7 天，与 JWT 有效期对齐
})

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
    const { token, user } = await authService.login(req.body)
    // Token 写入 HttpOnly Cookie，不暴露给前端 JS
    res.cookie('token', token, cookieOptions())
    success(res, { user }, '登录成功')
  } catch (err) {
    next(err)
  }
}

export const logout = (req, res) => {
  res.clearCookie('token', cookieOptions())
  success(res, null, '已退出登录')
}

export const getProfile = async (req, res, next) => {
  try {
    const data = await authService.getProfile(req.user.id)
    success(res, data)
  } catch (err) {
    next(err)
  }
}
