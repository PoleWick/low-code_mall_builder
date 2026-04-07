import * as pageModel from '../models/pageModel.js'

const DEFAULT_CONFIG = {
  pageSettings: { backgroundColor: '#f5f5f5', title: '我的商城', maxWidth: 375 },
  components: [],
}

export const getList = async (userId, query) => pageModel.findByUserId(userId, query)

export const getDetail = async (id, userId = null) => {
  const page = await pageModel.findById(id, userId)
  if (!page) throw Object.assign(new Error('页面不存在'), { statusCode: 404 })
  return page
}

export const create = async (userId, { title = '未命名页面', config } = {}) => {
  const id = await pageModel.create({ userId, title, config: config || DEFAULT_CONFIG })
  return pageModel.findById(id)
}

export const update = async (id, userId, body) => {
  const exists = await pageModel.findById(id, userId)
  if (!exists) throw Object.assign(new Error('页面不存在或无权限'), { statusCode: 404 })
  const affected = await pageModel.update(id, userId, body)
  if (affected === 0) throw Object.assign(new Error('更新失败'), { statusCode: 500 })
  return pageModel.findById(id)
}

export const remove = async (id, userId) => {
  const affected = await pageModel.remove(id, userId)
  if (affected === 0) throw Object.assign(new Error('页面不存在或无权限'), { statusCode: 404 })
}

export const duplicate = async (id, userId) => {
  const newId = await pageModel.duplicate(id, userId)
  if (!newId) throw Object.assign(new Error('页面不存在或无权限'), { statusCode: 404 })
  return pageModel.findById(newId)
}

export const exportPage = async (id, userId) => {
  const page = await pageModel.findById(id, userId)
  if (!page) throw Object.assign(new Error('页面不存在或无权限'), { statusCode: 404 })
  return page.config
}
