import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import compression from 'compression'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

import authRoutes from './routes/auth.js'
import pageRoutes from './routes/pages.js'
import uploadRoutes from './routes/upload.js'
import errorHandler from './middlewares/errorHandler.js'
import { testConnection } from './config/db.js'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3001

// 中间件
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173', credentials: true }))
app.use(cookieParser())
app.use(compression())
app.use(morgan('dev'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// 静态文件（上传图片）
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// 路由
app.use('/api/auth', authRoutes)
app.use('/api/pages', pageRoutes)
app.use('/api/upload', uploadRoutes)

// 健康检查
app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }))

// 全局错误处理
app.use(errorHandler)

// 启动
testConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 服务端启动：http://localhost:${PORT}`)
  })
})

export default app
