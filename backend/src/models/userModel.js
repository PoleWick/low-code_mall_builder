import pool from '../config/db.js'

export const findByEmail = async (email) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email])
  return rows[0] || null
}

export const findByUsername = async (username) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username])
  return rows[0] || null
}

export const findById = async (id) => {
  const [rows] = await pool.query(
    'SELECT id, username, email, avatar, created_at FROM users WHERE id = ?',
    [id]
  )
  return rows[0] || null
}

export const create = async ({ username, email, password }) => {
  const [result] = await pool.query(
    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
    [username, email, password]
  )
  return result.insertId
}
