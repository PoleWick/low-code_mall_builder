import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface CartItem {
  key: string          // name__price 唯一标识
  name: string
  price: number
  originalPrice?: number
  image: string
  quantity: number
}

interface CartState {
  items: CartItem[]
  add:      (product: Omit<CartItem, 'key' | 'quantity'>) => void
  decrease: (key: string) => void
  clear:    () => void
}

export const makeCartKey = (name: string, price: number) =>
  `${name}__${price}`

const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      add: (product) =>
        set((state) => {
          // 防御性清洗，避免 Immer/Formily proxy 透传 undefined
          const safeProduct = {
            name:          String(product.name || ''),
            price:         Number(product.price) || 0,
            originalPrice: product.originalPrice != null ? Number(product.originalPrice) : undefined,
            image:         String(product.image || ''),
          }
          const key = makeCartKey(safeProduct.name, safeProduct.price)
          const hit = state.items.find((i) => i.key === key)
          return {
            items: hit
              ? state.items.map((i) =>
                  i.key === key ? { ...i, quantity: i.quantity + 1 } : i
                )
              : [...state.items, { ...safeProduct, key, quantity: 1 }],
          }
        }),

      decrease: (key) =>
        set((state) => {
          const hit = state.items.find((i) => i.key === key)
          if (!hit) return state
          return {
            items:
              hit.quantity <= 1
                ? state.items.filter((i) => i.key !== key)
                : state.items.map((i) =>
                    i.key === key ? { ...i, quantity: i.quantity - 1 } : i
                  ),
          }
        }),

      clear: () => set({ items: [] }),
    }),
    {
      name: 'mall-cart',                              // sessionStorage key
      storage: createJSONStorage(() => sessionStorage), // 关闭标签页自动清空
    }
  )
)

export default useCartStore
