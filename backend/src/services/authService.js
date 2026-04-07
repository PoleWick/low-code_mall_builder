import bcrypt from 'bcryptjs'
import * as userModel from '../models/userModel.js'
import { signToken } from '../utils/jwt.js'

export const register = async ({ username, email, password }) => {
  const existEmail = await userModel.findByEmail(email)
  if (existEmail) throw Object.assign(new Error('该邮箱已被注册'), { statusCode: 400 })

  const existName = await userModel.findByUsername(username)
  if (existName) throw Object.assign(new Error('该用户名已被使用'), { statusCode: 400 })

  const hashed = await bcrypt.hash(password, 10)
  const id = await userModel.create({ username, email, password: hashed })
  return { id, username, email }
}

export const login = async ({ email, password }) => {
  const user = await userModel.findByEmail(email)
  if (!user) throw Object.assign(new Error('邮箱或密码错误'), { statusCode: 400 })

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) throw Object.assign(new Error('邮箱或密码错误'), { statusCode: 400 })

  const token = signToken({ id: user.id, username: user.username, email: user.email })
  const { password: _, ...safeUser } = user
  return { token, user: safeUser }
}

export const getProfile = async (userId) => {
  const user = await userModel.findById(userId)
  if (!user) throw Object.assign(new Error('用户不存在'), { statusCode: 404 })
  return user
}
