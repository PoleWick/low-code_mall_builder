import { Router } from 'express'
import * as projectController from '../controllers/projectController.js'
import auth from '../middlewares/auth.js'

const router = Router()
router.use(auth)

router.get('/',            projectController.getList)
router.post('/',           projectController.create)
router.get('/:id',         projectController.getDetail)
router.put('/:id',         projectController.update)
router.delete('/:id',      projectController.remove)
router.post('/:id/pages',  projectController.createPage)

export default router
