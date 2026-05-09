import { useEffect } from 'react'
import { persistPaymentKeys } from '@/constants/paymentStorage'

/**
 * 支付返回后统一状态同步：在 mount / pageshow / visibilitychange(visible) 时消费一次性标记。
 */
const usePostPaymentSync = (onSync: () => void) => {
  useEffect(() => {
    const syncPostPaymentState = () => {
      if (!persistPaymentKeys.consumePostPaymentSync()) return
      onSync()
    }

    syncPostPaymentState()

    const onPageShow = () => syncPostPaymentState()
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') syncPostPaymentState()
    }
    window.addEventListener('pageshow', onPageShow)
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => {
      window.removeEventListener('pageshow', onPageShow)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [onSync])
}

export default usePostPaymentSync
