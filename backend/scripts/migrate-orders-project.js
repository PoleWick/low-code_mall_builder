/**
 * orders 表增加 project_id（商家店铺维度），与 pages.project_id 对齐，便于列表与权限扩展。
 * 运行：node scripts/migrate-orders-project.js
 */
import pool from '../src/config/db.js'

const addIfMissing = async (table, col, def) => {
  const [rows] = await pool.execute(
    `SELECT COUNT(*) AS cnt FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    [table, col]
  )
  if (rows[0].cnt > 0) {
    console.log(`  skip: ${table}.${col} already exists`)
    return false
  }
  await pool.execute(`ALTER TABLE ${table} ADD COLUMN ${def}`)
  console.log(`  added: ${table}.${col}`)
  return true
}

const indexExists = async (table, indexName) => {
  const [rows] = await pool.execute(
    `SELECT COUNT(*) AS cnt FROM information_schema.STATISTICS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND INDEX_NAME = ?`,
    [table, indexName]
  )
  return rows[0].cnt > 0
}

await addIfMissing(
  'orders',
  'project_id',
  "project_id INT DEFAULT NULL COMMENT '商城项目ID，顾客订单归属店铺'",
)

if (!(await indexExists('orders', 'idx_orders_project_id'))) {
  await pool.execute('ALTER TABLE orders ADD INDEX idx_orders_project_id (project_id)')
  console.log('  added: orders.idx_orders_project_id')
} else {
  console.log('  skip: idx_orders_project_id already exists')
}

const [hdr] = await pool.execute(`
  UPDATE orders o
  INNER JOIN pages p ON o.page_id = p.id
  SET o.project_id = p.project_id
  WHERE o.project_id IS NULL AND o.page_id IS NOT NULL
`)
console.log(`  backfill project_id rows: ${hdr.affectedRows ?? 0}`)

console.log('migration done')
process.exit(0)
