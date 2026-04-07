# 系统架构设计

## 整体架构

```
┌─────────────────────────────────────────────┐
│                  浏览器端                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  登录/   │  │  编辑器  │  │  页面    │  │
│  │  注册    │  │  页面    │  │  管理    │  │
│  └──────────┘  └──────────┘  └──────────┘  │
│         React + Zustand + React-DnD          │
└─────────────────┬───────────────────────────┘
                  │ HTTP / REST API
                  │ Axios + JWT Token
┌─────────────────▼───────────────────────────┐
│              Node.js + Express               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  auth    │  │  pages   │  │  upload  │  │
│  │  路由    │  │  路由    │  │  路由    │  │
│  └──────────┘  └──────────┘  └──────────┘  │
│  JWT 中间件 | Joi 校验 | 错误处理中间件      │
└─────────────────┬───────────────────────────┘
                  │ mysql2 连接池
┌─────────────────▼───────────────────────────┐
│                  MySQL 8.0                   │
│  ┌──────────────┐  ┌──────────────────────┐ │
│  │    users     │  │        pages         │ │
│  └──────────────┘  └──────────────────────┘ │
└─────────────────────────────────────────────┘
```

## 前端编辑器架构

```
Editor 页面
├── EditorLayout（三栏布局）
│   ├── ComponentPanel（左侧：组件面板）
│   │   └── ComponentItem（可拖拽，useDrag）
│   │
│   ├── EditorCanvas（中间：画布）
│   │   ├── DropZone（接收拖拽，useDrop）
│   │   └── CanvasItem（已放置组件，可排序）
│   │       └── [实际商城组件渲染]
│   │
│   └── PropsPanel（右侧：属性配置）
│       └── FormilyForm（动态 Schema 表单）
│
└── EditorToolbar（顶部工具栏：预览/保存/导出）
```

## 状态管理设计（Zustand）

```js
// useEditorStore - 编辑器核心状态
{
  components: [],           // 画布上的组件列表
  selectedId: null,         // 当前选中组件 ID
  pageSettings: {},         // 页面全局设置
  isDirty: false,           // 是否有未保存修改

  // Actions
  addComponent(type, props),
  removeComponent(id),
  updateComponent(id, props),
  moveComponent(fromIndex, toIndex),
  selectComponent(id),
  setPageSettings(settings),
  loadConfig(config),        // 从服务端加载
  exportConfig(),            // 导出为 JSON
}

// useUserStore - 用户认证状态
{
  user: null,
  token: null,
  login(user, token),
  logout(),
}
```

## 商城组件注册机制

```js
// constants/componentRegistry.js
export const COMPONENT_REGISTRY = {
  Banner: {
    label: '横幅/轮播图',
    icon: 'PictureOutlined',
    component: BannerComponent,    // 渲染组件
    schema: bannerSchema,          // Formily 配置 Schema
    defaultProps: { imageUrl: '', height: 200 },
  },
  ProductList: { ... },
  CategoryNav: { ... },
  // ...
};
```

## 拖拽交互流程

```
1. 用户从左侧面板拖拽组件
   ComponentItem.useDrag → type: 'NEW_COMPONENT', item: { type }

2. 拖到画布放置区
   DropZone.useDrop → 接收 type: 'NEW_COMPONENT'
   → 调用 store.addComponent(type, defaultProps)

3. 画布内排序
   CanvasItem.useDrag → type: 'CANVAS_COMPONENT', item: { id, index }
   CanvasItem.useDrop → hover 时调用 store.moveComponent(fromIndex, toIndex)

4. 点击组件 → 右侧显示对应 Formily Schema 表单
   → 修改即时更新 store → 画布实时重渲染
```

## JWT 认证流程

```
登录 → 后端返回 token
  → 前端存入 localStorage + Zustand
  → Axios 拦截器自动附加 Authorization Header
  → 后端 auth 中间件验证 token
  → 解码 user 信息挂载到 req.user
  → Token 过期 → 401 → 前端拦截跳转登录页
```

## 页面导出方案

### 方案一：导出 JSON 配置
- 将 `store.exportConfig()` 结果下载为 `.json` 文件
- 可用于二次导入编辑

### 方案二：导出 HTML 代码包（可选增强）
- 服务端接收 JSON 配置
- 使用模板引擎渲染为独立 HTML
- 返回 zip 压缩包下载
