import React, { useState } from 'react'
import { useCartStore } from '../../store/cartStore'
import { OWNER_PICKS } from '../../data/mockData'

export default function OwnerPicksTab() {
  const { addItem } = useCartStore()
  const [added, setAdded] = useState({})

  const handleAdd = (book) => {
    addItem({
      id: book.id,
      title: book.book,
      author: book.author,
      price: book.price,
      emoji: book.emoji,
      source: `${book.ownerId}번 점주 · ${book.ownerNick}`,
      sourceType: 'owner',
    })
    setAdded(p => ({ ...p, [book.id]: true }))
    setTimeout(() => setAdded(p => ({ ...p, [book.id]: false })), 1500)
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '1.8rem', paddingBottom: '1rem', borderBottom: '1px solid #e2dbd0' }}>
        <div>
          <h2 style={{ fontFamily: 'Noto Serif KR, serif', fontSize: '1.4rem' }}>0.1평 점주 이번 주 추천</h2>
          <p style={{ fontSize: '0.8rem', color: '#7a6f68', marginTop: 4, fontWeight: 300 }}>100명의 작은 점주가 각자 1권씩 — 매주 업데이트</p>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '1.2rem',
      }}>
        {OWNER_PICKS.map(book => (
          <div key={book.id} style={{
            background: 'white',
            border: '1px solid #e2dbd0',
            borderRadius: 6,
            overflow: 'hidden',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
          >
            <div style={{ height: 130, background: '#ede8e0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', position: 'relative' }}>
              {book.emoji}
              <span style={{ position: 'absolute', top: 8, left: 8, background: '#1a1612', color: '#f7f3ed', fontSize: '0.65rem', padding: '3px 7px', borderRadius: 3 }}>
                {book.tag}
              </span>
            </div>
            <div style={{ padding: '0.8rem' }}>
              <div style={{ fontSize: '0.72rem', color: '#c4562a', fontWeight: 500, marginBottom: 3 }}>
                {book.ownerId}번 점주 · {book.ownerNick}
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 500, lineHeight: 1.4, marginBottom: 3 }}>{book.book}</div>
              <div style={{ fontSize: '0.72rem', color: '#7a6f68' }}>{book.author}</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: 6 }}>₩{book.price.toLocaleString()}</div>
              <button
                onClick={() => handleAdd(book)}
                style={{
                  background: added[book.id] ? '#4a6741' : '#1a1612',
                  color: '#f7f3ed', border: 'none', width: '100%',
                  padding: 7, fontSize: '0.75rem', fontFamily: 'Noto Sans KR, sans-serif',
                  cursor: 'pointer', marginTop: 8, borderRadius: 3, transition: 'background 0.2s',
                }}
              >
                {added[book.id] ? '✓ 담김' : '장바구니 담기'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
