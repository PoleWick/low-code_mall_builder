import { Router } from 'express'
import Joi from 'joi'
import * as authController from '../controllers/authController.js'
import auth from '../middlewares/auth.js'
import validate from '../middlewares/validate.js'

const router = Router()

const registerSchema = Joi.object({
  username: Joi.string().min(2).max(20).required().messages({
    'string.min': '用户名至少2位',
    'string.max': '用户名最多20位',
    'any.required': '用户名不能为空',
  }),
  email: Joi.string().email().required().messages({
    'string.email': '邮箱格式不正确',
    'any.required': '邮箱不能为空',
  }),
  password: Joi.string().min(6).max(30).required().messages({
    'string.min': '密码至少6位',
    'any.required': '密码不能为空',
  }),
})

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})

router.post('/register', validate(registerSchema), authController.register)
router.post('/login', validate(loginSchema), authController.login)
router.post('/logout', authController.logout)
router.get('/profile', auth, authController.getProfile)

export default router
