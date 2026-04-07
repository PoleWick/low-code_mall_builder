import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import auth from '../middlewares/auth.js'
import { success, error } from '../utils/response.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const router = Router()

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../../uploads'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/
    const valid = allowed.test(file.mimetype) && allowed.test(path.extname(file.originalname).toLowerCase())
    valid ? cb(null, true) : cb(new Error('只允许上传图片文件'))
  },
})

router.post('/image', auth, (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) return error(res, err.message, 400)
    if (!req.file) return error(res, '请选择文件', 400)
    const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
    success(res, { url })
    next
  })
})

export default router
