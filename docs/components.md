# 商城组件规格说明

每个商城组件需实现以下内容：
1. **渲染组件** - 在画布和预览中展示的 React 组件
2. **Formily Schema** - 右侧属性面板的配置表单
3. **默认属性** - 拖入时的初始值

---

## Banner（横幅/轮播图）

**默认属性：**
```json
{
  "imageUrl": "https://via.placeholder.com/375x200",
  "linkUrl": "",
  "height": 200,
  "borderRadius": 0
}
```

**Formily Schema：**
```js
{
  imageUrl: { type: 'string', title: '图片地址', 'x-component': 'Input' },
  linkUrl:  { type: 'string', title: '跳转链接', 'x-component': 'Input' },
  height:   { type: 'number', title: '高度(px)', 'x-component': 'NumberPicker', minimum: 50, maximum: 600 },
  borderRadius: { type: 'number', title: '圆角', 'x-component': 'NumberPicker' }
}
```

---

## ProductList（商品列表）

**默认属性：**
```json
{
  "title": "热销商品",
  "columns": 2,
  "showPrice": true,
  "showBadge": false,
  "products": [
    { "id": 1, "name": "示例商品", "price": 99.9, "image": "https://via.placeholder.com/150", "badge": "" }
  ]
}
```

---

## CategoryNav（分类导航）

**默认属性：**
```json
{
  "categories": [
    { "id": 1, "label": "分类一", "icon": "https://via.placeholder.com/40", "linkUrl": "" },
    { "id": 2, "label": "分类二", "icon": "https://via.placeholder.com/40", "linkUrl": "" }
  ],
  "columns": 4,
  "showLabel": true
}
```

---

## CartEntry（购物车入口）

**默认属性：**
```json
{
  "position": "bottom-right",
  "backgroundColor": "#ff4d4f",
  "iconColor": "#ffffff",
  "size": 56
}
```

---

## SearchBar（搜索框）

**默认属性：**
```json
{
  "placeholder": "搜索商品",
  "backgroundColor": "#f5f5f5",
  "borderRadius": 20,
  "showSearchIcon": true
}
```

---

## Divider（分割线）

**默认属性：**
```json
{
  "height": 8,
  "backgroundColor": "#f5f5f5",
  "marginTop": 0,
  "marginBottom": 0
}
```

---

## RichText（富文本）

**默认属性：**
```json
{
  "content": "<p>请输入文本内容</p>",
  "padding": 12
}
```

---

## ImageBlock（图片块）

**默认属性：**
```json
{
  "imageUrl": "https://via.placeholder.com/375x150",
  "linkUrl": "",
  "width": "100%",
  "height": 150,
  "objectFit": "cover"
}
```

---

## 组件开发模板

```jsx
// frontend/src/components/mall/Banner/index.jsx
import styles from './Banner.module.css';

const Banner = ({ imageUrl, height, linkUrl, borderRadius }) => {
  const content = (
    <div className={styles.banner} style={{ height, borderRadius }}>
      <img src={imageUrl} alt="banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
  );
  return linkUrl ? <a href={linkUrl}>{content}</a> : content;
};

export default Banner;

// 配套 Schema
export const bannerSchema = {
  type: 'object',
  properties: {
    imageUrl: { type: 'string', title: '图片地址', 'x-component': 'Input', 'x-decorator': 'FormItem' },
    // ...
  }
};

// 默认属性
export const bannerDefaultProps = {
  imageUrl: 'https://via.placeholder.com/375x200',
  height: 200,
  linkUrl: '',
  borderRadius: 0,
};
```
