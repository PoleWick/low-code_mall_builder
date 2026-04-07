# API 接口文档

所有接口统一前缀：`/api`
认证接口需要在 Header 中携带：`Authorization: Bearer <token>`

## 统一响应格式

```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

错误码约定：
- `200` 成功
- `400` 参数错误
- `401` 未认证/Token 失效
- `403` 权限不足
- `404` 资源不存在
- `500` 服务器错误

---

## 用户模块 `/api/auth`

### POST `/api/auth/register` 注册
**请求体：**
```json
{
  "username": "string, 2-20位",
  "email": "string, 合法邮箱",
  "password": "string, 6-20位"
}
```
**响应：**
```json
{
  "code": 200,
  "message": "注册成功",
  "data": { "id": 1, "username": "test", "email": "test@example.com" }
}
```

### POST `/api/auth/login` 登录
**请求体：**
```json
{
  "email": "string",
  "password": "string"
}
```
**响应：**
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGci...",
    "user": { "id": 1, "username": "test", "email": "test@example.com" }
  }
}
```

### GET `/api/auth/profile` 获取当前用户信息（需认证）
**响应：**
```json
{
  "code": 200,
  "data": { "id": 1, "username": "test", "email": "test@example.com", "created_at": "..." }
}
```

---

## 页面模块 `/api/pages`（均需认证）

### GET `/api/pages` 获取页面列表
**Query 参数：**
- `page` (number, 默认1)
- `pageSize` (number, 默认10)
- `keyword` (string, 可选，搜索标题)

**响应：**
```json
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": 1,
        "title": "我的商城",
        "cover": "https://...",
        "status": 1,
        "created_at": "2024-01-01",
        "updated_at": "2024-01-02"
      }
    ],
    "total": 25,
    "page": 1,
    "pageSize": 10
  }
}
```

### GET `/api/pages/:id` 获取页面详情
**响应：**
```json
{
  "code": 200,
  "data": {
    "id": 1,
    "title": "我的商城",
    "config": {
      "pageSettings": { "backgroundColor": "#fff" },
      "components": []
    },
    "status": 1
  }
}
```

### POST `/api/pages` 创建页面
**请求体：**
```json
{
  "title": "string",
  "config": { "pageSettings": {}, "components": [] }
}
```

### PUT `/api/pages/:id` 更新页面（保存编辑）
**请求体：**
```json
{
  "title": "string（可选）",
  "config": { ... },
  "cover": "string（可选）"
}
```

### DELETE `/api/pages/:id` 删除页面

### POST `/api/pages/:id/duplicate` 复制页面

### GET `/api/pages/:id/export` 导出页面配置（返回 JSON 文件）

---

## 文件上传 `/api/upload`（需认证）

### POST `/api/upload/image` 上传图片
**Content-Type:** `multipart/form-data`
**字段：** `file` (图片文件，限 5MB，jpg/png/gif/webp)

**响应：**
```json
{
  "code": 200,
  "data": { "url": "http://localhost:3001/uploads/xxx.jpg" }
}
```
