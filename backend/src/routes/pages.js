import { Router } from 'express'
import * as pageController from '../controllers/pageController.js'
import auth from '../middlewares/auth.js'

const router = Router()

router.use(auth)

router.get('/', pageController.getList)
router.post('/', pageController.create)
router.get('/:id', pageController.getDetail)
router.put('/:id', pageController.update)
router.delete('/:id', pageController.remove)
router.post('/:id/duplicate', pageController.duplicate)
router.get('/:id/export', pageController.exportPage)

export default router
