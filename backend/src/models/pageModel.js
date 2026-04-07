import pool from '../config/db.js'

export const findByUserId = async (userId, { page = 1, pageSize = 10, keyword = '' } = {}) => {
  const offset = (page - 1) * pageSize
  const like = `%${keyword}%`

  const [rows] = await pool.query(
    `SELECT id, title, cover, status, created_at, updated_at
     FROM pages WHERE user_id = ? AND title LIKE ?
     ORDER BY updated_at DESC LIMIT ? OFFSET ?`,
    [userId, like, pageSize, offset]
  )
  const [[{ total }]] = await pool.query(
    'SELECT COUNT(*) as total FROM pages WHERE user_id = ? AND title LIKE ?',
    [userId, like]
  )
  return { list: rows, total }
}

export const findById = async (id, userId = null) => {
  const sql = userId
    ? 'SELECT * FROM pages WHERE id = ? AND user_id = ?'
    : 'SELECT * FROM pages WHERE id = ?'
  const params = userId ? [id, userId] : [id]
  const [rows] = await pool.query(sql, params)
  if (!rows[0]) return null
  const row = rows[0]
  return { ...row, config: JSON.parse(row.config) }
}

export const create = async ({ userId, title, config }) => {
  const [result] = await pool.query(
    'INSERT INTO pages (user_id, title, config) VALUES (?, ?, ?)',
    [userId, title, JSON.stringify(config)]
  )
  return result.insertId
}

export const update = async (id, userId, { title, config, cover, status }) => {
  const fields = []
  const values = []
  if (title !== undefined) { fields.push('title = ?'); values.push(title) }
  if (config !== undefined) { fields.push('config = ?'); values.push(JSON.stringify(config)) }
  if (cover !== undefined) { fields.push('cover = ?'); values.push(cover) }
  if (status !== undefined) { fields.push('status = ?'); values.push(status) }
  if (fields.length === 0) return 0

  values.push(id, userId)
  const [result] = await pool.query(
    `UPDATE pages SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`,
    values
  )
  return result.affectedRows
}

export const remove = async (id, userId) => {
  const [result] = await pool.query(
    'DELETE FROM pages WHERE id = ? AND user_id = ?',
    [id, userId]
  )
  return result.affectedRows
}

export const duplicate = async (id, userId) => {
  const page = await findById(id, userId)
  if (!page) return null
  const [result] = await pool.query(
    'INSERT INTO pages (user_id, title, config) VALUES (?, ?, ?)',
    [userId, `${page.title} - 副本`, JSON.stringify(page.config)]
  )
  return result.insertId
}
