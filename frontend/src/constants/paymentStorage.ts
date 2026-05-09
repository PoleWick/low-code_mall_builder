/** 支付流程跨页键名（localStorage + sessionStorage 双写，兼容 iOS 外链跳转后 sessionStorage 被清空） */
export const SK_CHECKOUT_PAGE_ID = 'checkout_page_id'
export const SK_PENDING_ORDER_ID = 'pending_order_id'
export const SK_POST_PAYMENT_SYNC = 'post_payment_sync'

export const persistPaymentKeys = {
  checkoutPageId: (id: number) => {
    const s = String(id)
    sessionStorage.setItem(SK_CHECKOUT_PAGE_ID, s)
    localStorage.setItem(SK_CHECKOUT_PAGE_ID, s)
  },
  pendingOrderId: (orderId: number) => {
    const s = String(orderId)
    sessionStorage.setItem(SK_PENDING_ORDER_ID, s)
    localStorage.setItem(SK_PENDING_ORDER_ID, s)
  },
  clearCheckoutPageId: () => {
    sessionStorage.removeItem(SK_CHECKOUT_PAGE_ID)
    localStorage.removeItem(SK_CHECKOUT_PAGE_ID)
  },
  clearPendingOrderId: () => {
    sessionStorage.removeItem(SK_PENDING_ORDER_ID)
    localStorage.removeItem(SK_PENDING_ORDER_ID)
  },
  markPostPaymentSync: () => {
    sessionStorage.setItem(SK_POST_PAYMENT_SYNC, '1')
    localStorage.setItem(SK_POST_PAYMENT_SYNC, '1')
  },
  consumePostPaymentSync: () => {
    const hit = (localStorage.getItem(SK_POST_PAYMENT_SYNC) || sessionStorage.getItem(SK_POST_PAYMENT_SYNC)) === '1'
    sessionStorage.removeItem(SK_POST_PAYMENT_SYNC)
    localStorage.removeItem(SK_POST_PAYMENT_SYNC)
    return hit
  },
  readCheckoutPageId: () =>
    Number(localStorage.getItem(SK_CHECKOUT_PAGE_ID) || sessionStorage.getItem(SK_CHECKOUT_PAGE_ID) || '0'),
  readPendingOrderId: () =>
    Number(localStorage.getItem(SK_PENDING_ORDER_ID) || sessionStorage.getItem(SK_PENDING_ORDER_ID) || '0') || null,
}
