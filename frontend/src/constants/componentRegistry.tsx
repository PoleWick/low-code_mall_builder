import type { ComponentType } from '@/types'
import type { FC } from 'react'
import type { ISchema } from '@formily/json-schema'

import Banner, { bannerSchema, bannerDefaultProps } from '@/components/mall/Banner'
import ProductList, { productListSchema, productListDefaultProps } from '@/components/mall/ProductList'
import CategoryNav, { categoryNavSchema, categoryNavDefaultProps } from '@/components/mall/CategoryNav'
import CartEntry, { cartEntrySchema, cartEntryDefaultProps } from '@/components/mall/CartEntry'
import NavBar, { navBarSchema, navBarDefaultProps } from '@/components/mall/NavBar'
import OrderConfirm, { orderConfirmSchema, orderConfirmDefaultProps } from '@/components/mall/OrderConfirm'
import SearchBar, { searchBarSchema, searchBarDefaultProps } from '@/components/mall/SearchBar'
import Divider, { dividerSchema, dividerDefaultProps } from '@/components/mall/Divider'
import RichText, { richTextSchema, richTextDefaultProps } from '@/components/mall/RichText'
import ImageBlock, { imageBlockSchema, imageBlockDefaultProps } from '@/components/mall/ImageBlock'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyProps = Record<string, any>

export interface ComponentConfig {
  label: string
  icon: string
  component: FC<AnyProps>
  schema: ISchema
  defaultProps: AnyProps
}

export const COMPONENT_REGISTRY: Record<ComponentType, ComponentConfig> = {
  Banner: {
    label: '横幅/轮播图',
    icon: 'PictureOutlined',
    component: Banner as FC<AnyProps>,
    schema: bannerSchema,
    defaultProps: bannerDefaultProps,
  },
  ProductList: {
    label: '商品列表',
    icon: 'AppstoreOutlined',
    component: ProductList as FC<AnyProps>,
    schema: productListSchema,
    defaultProps: productListDefaultProps,
  },
  CategoryNav: {
    label: '分类导航',
    icon: 'UnorderedListOutlined',
    component: CategoryNav as FC<AnyProps>,
    schema: categoryNavSchema,
    defaultProps: categoryNavDefaultProps,
  },
  CartEntry: {
    label: '购物车入口',
    icon: 'ShoppingCartOutlined',
    component: CartEntry as FC<AnyProps>,
    schema: cartEntrySchema,
    defaultProps: cartEntryDefaultProps,
  },
  NavBar: {
    label: '底部导航栏',
    icon: 'AppstoreOutlined',
    component: NavBar as FC<AnyProps>,
    schema: navBarSchema,
    defaultProps: navBarDefaultProps,
  },
  OrderConfirm: {
    label: '订单确认',
    icon: 'CheckCircleOutlined',
    component: OrderConfirm as FC<AnyProps>,
    schema: orderConfirmSchema,
    defaultProps: orderConfirmDefaultProps,
  },
  SearchBar: {
    label: '搜索框',
    icon: 'SearchOutlined',
    component: SearchBar as FC<AnyProps>,
    schema: searchBarSchema,
    defaultProps: searchBarDefaultProps,
  },
  Divider: {
    label: '分割线',
    icon: 'MinusOutlined',
    component: Divider as FC<AnyProps>,
    schema: dividerSchema,
    defaultProps: dividerDefaultProps,
  },
  RichText: {
    label: '富文本',
    icon: 'FontSizeOutlined',
    component: RichText as FC<AnyProps>,
    schema: richTextSchema,
    defaultProps: richTextDefaultProps,
  },
  ImageBlock: {
    label: '图片块',
    icon: 'FileImageOutlined',
    component: ImageBlock as FC<AnyProps>,
    schema: imageBlockSchema,
    defaultProps: imageBlockDefaultProps,
  },
}

export const COMPONENT_LIST = Object.entries(COMPONENT_REGISTRY).map(([type, config]) => ({
  type: type as ComponentType,
  ...config,
}))
