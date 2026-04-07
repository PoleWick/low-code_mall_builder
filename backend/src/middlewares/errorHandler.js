const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message)
  const code = err.statusCode || 500
  res.status(code).json({
    code,
    message: code === 500 ? '服务器内部错误' : err.message,
    data: null,
  })
}

export default errorHandler
