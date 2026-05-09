/**
 * 演示数据注入脚本 —— 小威烧烤店（project 13, pages 11-13）
 * 运行：node scripts/seed-demo.js
 */
import pool from '../src/config/db.js'

const MALL_PAGE_ID     = 11
const CHECKOUT_PAGE_ID = 12
const ORDERS_PAGE_ID   = 13

/* ─────────────────────────── 商品页 config ─────────────────────────── */
const mallConfig = {
  pageSettings: {
    backgroundColor: '#f5f5f5',
    title: '小威烧烤店',
    maxWidth: 375,
  },
  components: [
    {
      id: 'tpl-banner',
      type: 'Banner',
      order: 0,
      props: {
        slides: [
          { imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=750&h=400&fit=crop', linkUrl: '' },
          { imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=750&h=400&fit=crop', linkUrl: '' },
          { imageUrl: 'https://images.unsplash.com/photo-1558030006-450675393462?w=750&h=400&fit=crop', linkUrl: '' },
        ],
        height: 180,
        autoplay: true,
        autoplayInterval: 3000,
        borderRadius: 0,
      },
    },
    {
      id: 'tpl-menulist',
      type: 'MenuList',
      order: 1,
      props: {
        activeColor: '#ff4d4f',
        height: 480,
        categories: [
          {
            id: 1,
            label: '烤串',
            items: [
              { name: '羊肉串（10支）', price: 28.0, originalPrice: 35.0, image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=300&h=300&fit=crop', badge: '热销', description: '新鲜羊肉，当日现穿' },
              { name: '牛肉串（5支）',  price: 38.0, originalPrice: 45.0, image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=300&h=300&fit=crop', badge: '新品', description: '精选牛腩，外焦里嫩' },
              { name: '鸡心串（8支）',  price: 16.0, image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300&h=300&fit=crop', description: '入味十足，越嚼越香' },
            ],
          },
          {
            id: 2,
            label: '烤肉',
            items: [
              { name: '五花肉卷（8片）', price: 42.0, originalPrice: 50.0, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=300&h=300&fit=crop', description: '薄切五花，炭火慢烤' },
              { name: '鸡翅中（6只）',   price: 32.0, originalPrice: 40.0, image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=300&h=300&fit=crop', badge: '推荐', description: '腌制12小时，皮脆肉嫩' },
            ],
          },
          {
            id: 3,
            label: '小食',
            items: [
              { name: '烤玉米',   price: 8.0,  image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=300&h=300&fit=crop', description: '甜玉米刷酱，香甜可口' },
              { name: '烤茄子',   price: 12.0, image: 'https://images.unsplash.com/photo-1615361200141-f45040f367be?w=300&h=300&fit=crop', description: '蒜蓉剁椒，下饭神器' },
              { name: '蔬菜拼盘', price: 18.0, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=300&fit=crop', description: '时令蔬菜，健康搭配' },
            ],
          },
          {
            id: 4,
            label: '特价',
            items: [
              { name: '烤鱿鱼', price: 25.0, originalPrice: 30.0, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=300&h=300&fit=crop', badge: '特价', description: '整只鱿鱼，鲜嫩弹牙' },
            ],
          },
        ],
      },
    },
    {
      id: 'tpl-cartentry',
      type: 'CartEntry',
      order: 3,
      props: {
        checkoutUrl: `/preview/${CHECKOUT_PAGE_ID}`,
        buttonColor: '#ff4d4f',
      },
    },
    {
      id: 'tpl-navbar',
      type: 'NavBar',
      order: 4,
      props: {
        activeColor: '#ff4d4f',
        items: [
          { icon: 'HomeOutlined',          label: '首页', pageUrl: `/preview/${MALL_PAGE_ID}` },
          { icon: 'UnorderedListOutlined', label: '订单', pageUrl: `/preview/${ORDERS_PAGE_ID}` },
        ],
      },
    },
  ],
}

/* ─────────────────────────── 支付页 config ─────────────────────────── */
const checkoutConfig = {
  pageSettings: {
    backgroundColor: '#f5f5f5',
    title: '确认订单',
    maxWidth: 375,
  },
  components: [
    {
      id: 'tpl-topbar',
      type: 'TopBar',
      order: 0,
      props: {
        title: '确认订单',
        backPageUrl: `/preview/${MALL_PAGE_ID}`,
      },
    },
    {
      id: 'tpl-orderconfirm',
      type: 'OrderConfirm',
      order: 1,
      props: {},
    },
  ],
}

/* ─────────────────────────── 订单页 config ─────────────────────────── */
const ordersConfig = {
  pageSettings: {
    backgroundColor: '#f5f5f5',
    title: '我的订单',
    maxWidth: 375,
  },
  components: [
    {
      id: 'tpl-topbar-orders',
      type: 'TopBar',
      order: 0,
      props: {
        title: '我的订单',
        backPageUrl: `/preview/${MALL_PAGE_ID}`,
      },
    },
    {
      id: 'tpl-orders-list',
      type: 'OrderList',
      order: 1,
      props: {},
    },
    {
      id: 'tpl-navbar-orders',
      type: 'NavBar',
      order: 2,
      props: {
        activeColor: '#ff4d4f',
        items: [
          { icon: 'HomeOutlined',          label: '首页', pageUrl: `/preview/${MALL_PAGE_ID}` },
          { icon: 'UnorderedListOutlined', label: '订单', pageUrl: `/preview/${ORDERS_PAGE_ID}` },
        ],
      },
    },
  ],
}

/* ─────────────────────────── 执行更新 ─────────────────────────── */
async function run() {
  const updates = [
    { id: MALL_PAGE_ID,     label: '商品页', config: mallConfig },
    { id: CHECKOUT_PAGE_ID, label: '支付页', config: checkoutConfig },
    { id: ORDERS_PAGE_ID,   label: '订单页', config: ordersConfig },
  ]

  for (const { id, label, config } of updates) {
    await pool.query('UPDATE pages SET config = ? WHERE id = ?', [JSON.stringify(config), id])
    console.log(`✅  已更新 page ${id}（${label}）`)
  }

  console.log('\n演示数据注入完成！请访问 /preview/11 查看效果。')
  process.exit(0)
}

run().catch(e => { console.error(e); process.exit(1) })
