import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

/**
 * ESM 中获取当前文件的 __filename 和 __dirname
 * 用法：const { __filename, __dirname } = getFileInfo(import.meta.url)
 */
export const getFileInfo = (metaUrl) => ({
  __filename: fileURLToPath(metaUrl),
  __dirname: dirname(fileURLToPath(metaUrl)),
})
