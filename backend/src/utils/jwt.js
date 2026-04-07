import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'mall_builder_secret_2024'
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

export const signToken = (payload) => jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN })

export const verifyToken = (token) => jwt.verify(token, SECRET)
