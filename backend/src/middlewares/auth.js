import { verifyToken } from '../utils/jwt.js'
import { error } from '../utils/response.js'

const auth = (req, res, next) => {
  // 优先从 HttpOnly Cookie 取 token，兼容 Apifox/Postman 等工具的 Bearer Header
  let token = req.cookies?.token
  if (!token) {
    const authHeader = req.headers.authorization
    if (authHeader?.startsWith('Bearer ')) token = authHeader.slice(7)
  }

  if (!token) return error(res, '未登录，请先登录', 401)

  try {
    req.user = verifyToken(token)
    next()
  } catch {
    return error(res, 'Token 已失效，请重新登录', 401)
  }
}

export default auth
