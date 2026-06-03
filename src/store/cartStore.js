import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ─── Cart Store ─────────────────────────────────────────────────
// 장바구니 전역 상태 (Zustand + localStorage persist)
// item shape: { id, title, author, price, emoji, source, sourceType, qty }
// sourceType: 'owner' | 'bbooks' | 'pro' | 'search'

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: {},          // { [id]: item }
      isOpen: false,

      // 담기 (이미 있으면 수량 +1)
      addItem: (item) => set((state) => {
        const existing = state.items[item.id]
        return {
          items: {
            ...state.items,
            [item.id]: existing
              ? { ...existing, qty: existing.qty + 1 }
              : { ...item, qty: 1 },
          },
        }
      }),

      // 수량 변경
      changeQty: (id, delta) => set((state) => {
        const item = state.items[id]
        if (!item) return state
        const newQty = item.qty + delta
        if (newQty <= 0) {
          const next = { ...state.items }
          delete next[id]
          return { items: next }
        }
        return { items: { ...state.items, [id]: { ...item, qty: newQty } } }
      }),

      // 삭제
      removeItem: (id) => set((state) => {
        const next = { ...state.items }
        delete next[id]
        return { items: next }
      }),

      // 전체 비우기
      clearCart: () => set({ items: {} }),

      // 사이드바 토글
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      // 계산 헬퍼
      getCount: () => Object.values(get().items).reduce((s, i) => s + i.qty, 0),
      getSubtotal: () => Object.values(get().items).reduce((s, i) => s + i.price * i.qty, 0),
      getTotal: () => get().getSubtotal() + 3000,  // 배송비 3,000원 고정 (추후 조건부로 변경)
    }),
    {
      name: 'bbooks-cart',  // localStorage key
    }
  )
)
