import React, { useState } from 'react'
import { useCartStore } from '../../store/cartStore'
import { BBOOKS_PICKS } from '../../data/mockData'

export default function BbooksPicksTab() {
  const { addItem } = useCartStore()
  const [added, setAdded] = useState({})

  const handleAdd = (book) => {
    addItem({ id: book.id, title: book.book, author: book.author, price: book.price, emoji: book.emoji, source: '비북스', sourceType: 'bbooks' })
    setAdded(p => ({ ...p, [book.id]: true }))
    setTimeout(() => setAdded(p => ({ ...p, [book.id]: false })), 1500)
  }

  return (
    <div>
      <div style={{ marginBottom: '1.8rem', paddingBottom: '1rem', borderBottom: '1px solid #e2dbd0' }}>
        <h2 style={{ fontFamily: 'Noto Serif KR, serif', fontSize: '1.4rem' }}>비북스 큐레이션</h2>
        <p style={{ fontSize: '0.8rem', color: '#7a6f68', marginTop: 4, fontWeight: 300 }}>비북스 팀이 직접 고른 이달의 책</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {BBOOKS_PICKS.map(book => (
          <CuratedCard key={book.id} book={book} color="#3a6b8a" curatorName="비북스" added={added[book.id]} onAdd={() => handleAdd(book)} />
        ))}
      </div>
    </div>
  )
}

export function CuratedCard({ book, color, curatorName, added, onAdd }) {
  return (
    <div style={{ background: 'white', border: '1px solid #e2dbd0', borderRadius: 8, overflow: 'hidden' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.1)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
    >
      <div style={{ padding: '0.8rem 1rem', background: color + '15', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: color + '25', color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>
          {curatorName[0]}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.68rem', color, opacity: 0.7, letterSpacing: '0.06em' }}>CURATOR</div>
          <div style={{ fontSize: '0.8rem', fontWeight: 500, color }}>{curatorName}</div>
        </div>
        <span style={{ background: color + '20', color, fontSize: '0.68rem', padding: '2px 7px', borderRadius: 3, fontWeight: 500 }}>{book.tag}</span>
      </div>
      <div style={{ padding: '0 1rem 1rem' }}>
        <div style={{ height: 160, background: '#ede8e0', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', margin: '0.8rem 0' }}>
          {book.emoji}
        </div>
        <div style={{ fontSize: '0.95rem', fontWeight: 600, lineHeight: 1.4, marginBottom: 3 }}>{book.book}</div>
        <div style={{ fontSize: '0.75rem', color: '#7a6f68', marginBottom: 8 }}>{book.author}</div>
        <div style={{ fontSize: '0.78rem', color: '#3d3530', fontStyle: 'italic', lineHeight: 1.6, borderLeft: '2px solid #e2dbd0', paddingLeft: 10, marginBottom: 12 }}>
          "{book.comment}"
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>₩{book.price.toLocaleString()}</span>
          <button onClick={onAdd} style={{
            background: added ? '#4a6741' : color,
            color: 'white', border: 'none', padding: '6px 14px',
            borderRadius: 4, fontSize: '0.78rem', fontFamily: 'Noto Sans KR, sans-serif',
            cursor: 'pointer', transition: 'background 0.2s',
          }}>
            {added ? '✓ 담김' : '담기'}
          </button>
        </div>
      </div>
    </div>
  )
}
