import request from '@/utils/request'
import type { CartItem } from '@/stores/useCartStore'

export interface CreateOrderParams {
  items:      CartItem[]
  totalPrice: number
  pageId?:    number
}

export interface OrderResult {
  orderId:      number
  pickupNumber: string
  totalPrice:   number
  items:        CartItem[]
}

export const ordersApi = {
  create: (params: CreateOrderParams) =>
    request.post<never, OrderResult>('/orders', params),

  getById: (id: number) =>
    request.get<never, OrderResult>(`/orders/${id}`),
}
