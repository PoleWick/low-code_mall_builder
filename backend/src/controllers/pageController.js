import * as pageService from '../services/pageService.js'
import { success } from '../utils/response.js'

export const getList = async (req, res, next) => {
  try {
    const { page, pageSize, keyword } = req.query
    const data = await pageService.getList(req.user.id, {
      page: Number(page) || 1,
      pageSize: Number(pageSize) || 12,
      keyword: keyword || '',
    })
    success(res, data)
  } catch (err) {
    next(err)
  }
}

export const getDetail = async (req, res, next) => {
  try {
    const data = await pageService.getDetail(Number(req.params.id), req.user?.id)
    success(res, data)
  } catch (err) {
    next(err)
  }
}

export const create = async (req, res, next) => {
  try {
    const data = await pageService.create(req.user.id, req.body)
    success(res, data, '创建成功')
  } catch (err) {
    next(err)
  }
}

export const update = async (req, res, next) => {
  try {
    const data = await pageService.update(Number(req.params.id), req.user.id, req.body)
    success(res, data, '保存成功')
  } catch (err) {
    next(err)
  }
}

export const remove = async (req, res, next) => {
  try {
    await pageService.remove(Number(req.params.id), req.user.id)
    success(res, null, '删除成功')
  } catch (err) {
    next(err)
  }
}

export const duplicate = async (req, res, next) => {
  try {
    const data = await pageService.duplicate(Number(req.params.id), req.user.id)
    success(res, data, '复制成功')
  } catch (err) {
    next(err)
  }
}

export const exportPage = async (req, res, next) => {
  try {
    const config = await pageService.exportPage(Number(req.params.id), req.user.id)
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Content-Disposition', `attachment; filename="page-${req.params.id}.json"`)
    res.send(JSON.stringify(config, null, 2))
  } catch (err) {
    next(err)
  }
}
