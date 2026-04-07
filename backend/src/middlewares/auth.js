import { verifyToken } from '../utils/jwt.js'
import { error } from '../utils/response.js'

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return error(res, '未登录，请先登录', 401)
  }
  const token = authHeader.slice(7)
  try {
    const decoded = verifyToken(token)
    req.user = decoded
    next()
  } catch {
    return error(res, 'Token 已失效，请重新登录', 401)
  }
}

export default auth
