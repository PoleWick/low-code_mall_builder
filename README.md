# 低代码可视化商城搭建平台

基于 React + Node.js 的低代码驱动可视化商城快速搭建平台，支持拖拽编辑、实时预览、配置导出，让非专业开发者也能快速搭建个性化商城页面。

## 项目结构

```
毕设全栈项目/
├── frontend/                # React 前端应用（Vite 构建）
│   ├── src/
│   │   ├── components/      # 公共组件
│   │   │   ├── mall/        # 商城业务组件（可拖拽）
│   │   │   └── editor/      # 编辑器专用组件
│   │   ├── pages/           # 路由页面
│   │   │   ├── Login/
│   │   │   ├── Register/
│   │   │   ├── Dashboard/   # 页面管理
│   │   │   ├── Editor/      # 核心编辑器
│   │   │   └── Preview/     # 页面预览
│   │   ├── stores/          # Zustand 状态管理
│   │   ├── hooks/           # 自定义 Hooks
│   │   ├── utils/           # 工具函数（request、export等）
│   │   ├── constants/       # 常量（DnD类型、组件注册表）
│   │   └── router/          # 路由配置
│   └── package.json
│
├── backend/                 # Node.js + Express 服务端
│   ├── src/
│   │   ├── routes/          # 路由定义
│   │   ├── controllers/     # 请求处理
│   │   ├── services/        # 业务逻辑
│   │   ├── models/          # 数据库操作
│   │   ├── middlewares/     # 中间件（auth、validate、error）
│   │   ├── utils/           # 工具（response、jwt）
│   │   └── config/          # 配置（db、app）
│   ├── sql/                 # 数据库建表脚本
│   └── package.json
│
├── docs/                    # 设计文档
│   ├── architecture.md      # 系统架构设计
│   ├── api.md               # API 接口文档
│   └── components.md        # 商城组件规格说明
│
└── assets/                  # 原始资料（开题报告等）
```

## 技术栈

### 前端
| 库 | 版本 | 用途 |
|----|------|------|
| React | ^19 | 核心框架 |
| Vite | ^8 | 构建工具 |
| React Router DOM | ^7 | 客户端路由 |
| Zustand + Immer | ^5 / ^11 | 全局状态管理 |
| Ant Design | ^6 | UI 组件库 |
| react-dnd | ^16 | 拖拽核心库 |
| react-dnd-html5-backend | ^16 | HTML5 拖拽后端 |
| @formily/react + @formily/antd | ^2 | 动态表单/属性配置面板 |
| Axios | ^1 | HTTP 请求 |

### 后端
| 库 | 版本 | 用途 |
|----|------|------|
| Express | ^5 | Web 框架 |
| mysql2 | ^3 | MySQL 数据库驱动 |
| jsonwebtoken | ^9 | JWT 认证 |
| bcryptjs | ^3 | 密码哈希 |
| Joi | ^18 | 请求参数校验 |
| cors | ^2 | 跨域处理 |
| morgan | ^1 | 请求日志 |
| dotenv | ^17 | 环境变量管理 |

## 核心功能

### 1. 可视化拖拽编辑器
- 左侧组件面板：所有可用商城组件
- 中间画布：支持拖拽放置、排序、删除
- 右侧属性面板：基于 Formily 的动态配置表单
- 顶部工具栏：预览、保存、导出

### 2. 商城核心组件
| 组件 | 功能 |
|------|------|
| Banner | 横幅/轮播图，支持图片链接配置 |
| ProductList | 商品列表，支持列数、商品数据配置 |
| CategoryNav | 分类导航，支持自定义分类和图标 |
| CartEntry | 购物车入口悬浮按钮 |
| SearchBar | 搜索框，支持占位文字配置 |
| Divider | 分割线，支持样式配置 |
| RichText | 富文本块 |
| ImageBlock | 单图片展示块 |

### 3. 用户与页面管理
- 注册/登录（JWT Token 认证）
- 我的页面列表（支持分页、搜索）
- 页面增删改查
- 支持导出为 JSON 配置文件

## 开发计划

| 阶段 | 内容 | 状态 |
|------|------|------|
| 第一阶段 | 项目初始化、数据库设计、基础框架搭建 | 待开始 |
| 第二阶段 | 用户认证模块（登录/注册）前后端联调 | 待开始 |
| 第三阶段 | 拖拽编辑器核心功能开发 | 待开始 |
| 第四阶段 | 商城组件库开发（8个组件） | 待开始 |
| 第五阶段 | 属性配置面板（Formily集成） | 待开始 |
| 第六阶段 | 页面管理、预览与导出功能 | 待开始 |
| 第七阶段 | 联调测试、UI完善、打包部署 | 待开始 |

## 快速启动

```bash
# 后端
cd backend
npm install
cp .env.example .env  # 配置数据库连接
npm run dev

# 前端
cd frontend
npm install
npm run dev
```

## 环境要求
- Node.js >= 18
- MySQL >= 8.0
- npm >= 9
