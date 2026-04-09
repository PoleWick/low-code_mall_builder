import * as projectModel from '../models/projectModel.js'
import * as pageModel    from '../models/pageModel.js'
import { success, error } from '../utils/response.js'

/** 三个默认页面的初始配置 */
const makeDefaultConfig = (title) => ({
  pageSettings: { backgroundColor: '#f5f5f5', title, maxWidth: 375 },
  components: [],
})

/** 默认 NavBar 配置（pageType 引用，preview 运行时解析为实际 pageId） */
const DEFAULT_NAVBAR = {
  activeColor: '#ff4d4f',
  items: [
    { icon: '\uD83D\uDED2', label: '\u70B9\u9910', pageType: 'mall' },
    { icon: '\uD83D\uDCCB', label: '\u8BA2\u5355', pageType: 'orders' },
  ],
}

// GET /api/projects
export const getList = async (req, res, next) => {
  try {
    const list = await projectModel.findByUserId(req.user.id)
    success(res, list)
  } catch (err) { next(err) }
}

// GET /api/projects/:id  （含页面列表）
export const getDetail = async (req, res, next) => {
  try {
    const project = await projectModel.findById(Number(req.params.id), req.user.id)
    if (!project) return error(res, '\u9879\u76EE\u4E0D\u5B58\u5728', 404)
    const pages = await pageModel.findByProjectId(project.id, req.user.id)
    success(res, { ...project, pages })
  } catch (err) { next(err) }
}

// POST /api/projects  创建项目，自动生成三个默认页面
export const create = async (req, res, next) => {
  try {
    const { name = '\u6211\u7684\u5546\u57CE', description } = req.body
    const projectId = await projectModel.create({ userId: req.user.id, name, description })

    const defaults = [
      { title: '\u5546\u54C1\u9875', pageType: 'mall',     config: makeDefaultConfig('\u5546\u54C1\u9875') },
      { title: '\u652F\u4ED8\u9875', pageType: 'checkout', config: makeDefaultConfig('\u652F\u4ED8\u9875') },
      { title: '\u8BA2\u5355\u9875', pageType: 'orders',   config: makeDefaultConfig('\u8BA2\u5355\u9875') },
    ]
    for (const d of defaults) {
      await pageModel.create({
        userId: req.user.id, projectId,
        title: d.title, config: d.config,
        pageType: d.pageType, isDefault: 1,
      })
    }

    // 写入默认 NavBar（含 pageType 引用，preview 动态解析）
    await projectModel.update(projectId, req.user.id, { navbarConfig: DEFAULT_NAVBAR })

    const project = await projectModel.findById(projectId, req.user.id)
    const pages   = await pageModel.findByProjectId(projectId, req.user.id)
    success(res, { ...project, pages }, '\u9879\u76EE\u521B\u5EFA\u6210\u529F')
  } catch (err) { next(err) }
}

// PUT /api/projects/:id
export const update = async (req, res, next) => {
  try {
    const { name, description, navbarConfig } = req.body
    const id = Number(req.params.id)
    const exists = await projectModel.findById(id, req.user.id)
    if (!exists) return error(res, '\u9879\u76EE\u4E0D\u5B58\u5728\u6216\u65E0\u6743\u9650', 404)
    await projectModel.update(id, req.user.id, { name, description, navbarConfig })
    const project = await projectModel.findById(id, req.user.id)
    const pages   = await pageModel.findByProjectId(id, req.user.id)
    success(res, { ...project, pages })
  } catch (err) { next(err) }
}

// DELETE /api/projects/:id
export const remove = async (req, res, next) => {
  try {
    const affected = await projectModel.remove(Number(req.params.id), req.user.id)
    if (!affected) return error(res, '\u9879\u76EE\u4E0D\u5B58\u5728\u6216\u65E0\u6743\u9650', 404)
    success(res, null, '\u5220\u9664\u6210\u529F')
  } catch (err) { next(err) }
}

// POST /api/projects/:id/pages  在项目内新建页面（自动含 NavBar）
export const createPage = async (req, res, next) => {
  try {
    const projectId = Number(req.params.id)
    const project   = await projectModel.findById(projectId, req.user.id)
    if (!project) return error(res, '\u9879\u76EE\u4E0D\u5B58\u5728\u6216\u65E0\u6743\u9650', 404)

    const { title = '\u672A\u547D\u540D\u9875\u9762' } = req.body
    const pageId = await pageModel.create({
      userId: req.user.id, projectId,
      title,
      config: makeDefaultConfig(title),
      pageType: 'custom', isDefault: 0,
    })
    const page = await pageModel.findById(pageId)
    success(res, page, '\u9875\u9762\u521B\u5EFA\u6210\u529F')
  } catch (err) { next(err) }
}
