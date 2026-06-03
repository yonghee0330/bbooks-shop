import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'

export default function Header() {
  const navigate = useNavigate()
  const { getCount, toggleCart } = useCartStore()
  const count = getCount()

  return (
    <header style={{
      background: '#1a1612',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 60,
      }}>
        <div
          onClick={() => navigate('/')}
          style={{
            fontFamily: 'Noto Serif KR, serif',
            fontSize: '1.3rem',
            color: '#f7f3ed',
            letterSpacing: '0.08em',
            cursor: 'pointer',
          }}
        >
          b<span style={{ color: '#e8a87c' }}>books</span> · 큐레이션샵
        </div>

        <button
          onClick={toggleCart}
          style={{
            background: '#c4562a',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            padding: '7px 16px',
            fontSize: '0.85rem',
            fontFamily: 'Noto Sans KR, sans-serif',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          🛒 장바구니
          <span style={{
            background: '#e8a87c',
            color: '#1a1612',
            borderRadius: '50%',
            width: 20,
            height: 20,
            fontSize: '0.7rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {count}
          </span>
        </button>
      </div>
    </header>
  )
}
