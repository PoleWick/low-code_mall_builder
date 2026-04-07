export const success = (res, data = null, message = 'success') => {
  res.json({ code: 200, message, data })
}

export const error = (res, message = '请求失败', code = 400, data = null) => {
  res.status(code < 500 ? code : 500).json({ code, message, data })
}
