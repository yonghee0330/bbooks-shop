import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'

export default function CartSidebar() {
  const navigate = useNavigate()
  const { items, isOpen, closeCart, changeQty, removeItem, getSubtotal, getTotal } = useCartStore()
  const itemList = Object.values(items)
  const subtotal = getSubtotal()
  const total = getTotal()

  if (!isOpen) return null

  const goOrder = () => {
    closeCart()
    navigate('/order')
  }

  return (
    <>
      {/* 오버레이 */}
      <div
        onClick={closeCart}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 200,
        }}
      />

      {/* 사이드바 */}
      <div style={{
        position: 'fixed', top: 0, right: 0,
        width: 380, height: '100vh',
        background: '#f7f3ed',
        zIndex: 201,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
      }}>
        {/* 헤더 */}
        <div style={{
          background: '#1a1612',
          padding: '1.2rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span style={{ fontFamily: 'Noto Serif KR, serif', color: '#f7f3ed', fontSize: '1rem' }}>
            🛒 장바구니
          </span>
          <button onClick={closeCart} style={{
            background: 'none', border: 'none',
            color: '#e2dbd0', fontSize: '1.3rem', cursor: 'pointer',
          }}>✕</button>
        </div>

        {/* 아이템 목록 */}
        <div style={{ flex: 1, padding: '1.5rem' }}>
          {itemList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#7a6f68', fontSize: '0.88rem' }}>
              아직 담긴 책이 없어요<br />마음에 드는 책을 골라보세요 :)
            </div>
          ) : (
            itemList.map(item => (
              <div key={item.id} style={{
                display: 'flex', gap: 10, padding: '12px 0',
                borderBottom: '1px solid #e2dbd0', alignItems: 'flex-start',
              }}>
                <div style={{
                  width: 40, height: 54,
                  background: '#ede8e0', borderRadius: 3,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.2rem', flexShrink: 0,
                }}>
                  {item.emoji || '📚'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.83rem', fontWeight: 500, marginBottom: 2 }}>{item.title}</div>
                  <div style={{ fontSize: '0.72rem', color: '#7a6f68', marginBottom: 4 }}>{item.source}</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#c4562a' }}>
                    ₩{(item.price * item.qty).toLocaleString()}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                    <button onClick={() => changeQty(item.id, -1)} style={qtyBtnStyle}>−</button>
                    <span style={{ fontSize: '0.82rem', fontWeight: 500, minWidth: 16, textAlign: 'center' }}>{item.qty}</span>
                    <button onClick={() => changeQty(item.id, 1)} style={qtyBtnStyle}>+</button>
                    <button onClick={() => removeItem(item.id)} style={{
                      background: 'none', border: 'none',
                      color: '#7a6f68', cursor: 'pointer', fontSize: '0.75rem', marginLeft: 4,
                    }}>삭제</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 푸터 */}
        <div style={{ background: 'white', padding: '1.2rem 1.5rem', borderTop: '1px solid #e2dbd0' }}>
          <div style={{ marginBottom: '1rem' }}>
            <div style={rowStyle}><span>소계</span><span>₩{subtotal.toLocaleString()}</span></div>
            <div style={rowStyle}><span>배송비</span><span>₩3,000</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1rem', padding: '8px 0 0', borderTop: '1px solid #e2dbd0', marginTop: 4 }}>
              <span>총 결제금액</span>
              <span>₩{total.toLocaleString()}</span>
            </div>
          </div>
          <button
            onClick={goOrder}
            style={{
              background: '#c4562a', color: 'white', border: 'none',
              borderRadius: 5, width: '100%', padding: 13,
              fontFamily: 'Noto Serif KR, serif', fontSize: '0.95rem',
              fontWeight: 600, cursor: 'pointer', letterSpacing: '0.04em',
            }}
          >
            주문하기 →
          </button>
        </div>
      </div>
    </>
  )
}

const qtyBtnStyle = {
  background: '#ede8e0', border: '1px solid #e2dbd0',
  borderRadius: 3, width: 22, height: 22,
  cursor: 'pointer', fontSize: '0.85rem',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
}

const rowStyle = {
  display: 'flex', justifyContent: 'space-between',
  fontSize: '0.82rem', color: '#7a6f68', padding: '3px 0',
}
