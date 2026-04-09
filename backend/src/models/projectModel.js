import pool from '../config/db.js'

const parseNavbar = (row) => {
  if (!row) return null
  return {
    ...row,
    navbar_config: row.navbar_config ? JSON.parse(row.navbar_config) : null,
  }
}

export const findByUserId = async (userId) => {
  const [rows] = await pool.query(
    `SELECT p.id, p.name, p.description, p.navbar_config, p.created_at, p.updated_at,
            COUNT(pg.id) AS page_count
     FROM projects p
     LEFT JOIN pages pg ON pg.project_id = p.id
     WHERE p.user_id = ?
     GROUP BY p.id
     ORDER BY p.updated_at DESC`,
    [userId]
  )
  return rows.map(r => ({
    ...r,
    navbar_config: r.navbar_config ? JSON.parse(r.navbar_config) : null,
  }))
}

export const findById = async (id, userId = null) => {
  const sql = userId
    ? 'SELECT * FROM projects WHERE id = ? AND user_id = ?'
    : 'SELECT * FROM projects WHERE id = ?'
  const [rows] = await pool.query(sql, userId ? [id, userId] : [id])
  return parseNavbar(rows[0])
}

export const create = async ({ userId, name, description }) => {
  const [result] = await pool.query(
    'INSERT INTO projects (user_id, name, description) VALUES (?, ?, ?)',
    [userId, name, description || null]
  )
  return result.insertId
}

export const update = async (id, userId, { name, description, navbarConfig }) => {
  const fields = [], values = []
  if (name         !== undefined) { fields.push('name = ?');         values.push(name) }
  if (description  !== undefined) { fields.push('description = ?');  values.push(description) }
  if (navbarConfig !== undefined) { fields.push('navbar_config = ?'); values.push(JSON.stringify(navbarConfig)) }
  if (!fields.length) return 0
  values.push(id, userId)
  const [result] = await pool.query(
    `UPDATE projects SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`, values
  )
  return result.affectedRows
}

export const remove = async (id, userId) => {
  const [result] = await pool.query(
    'DELETE FROM projects WHERE id = ? AND user_id = ?', [id, userId]
  )
  return result.affectedRows
}
