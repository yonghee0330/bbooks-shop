import React, { useState } from 'react'
import { useCartStore } from '../../store/cartStore'
import { PRO_PICKS, CURATORS } from '../../data/mockData'
import { CuratedCard } from './BbooksPicksTab'

export default function ProPicksTab() {
  const { addItem } = useCartStore()
  const [added, setAdded] = useState({})

  const handleAdd = (book) => {
    const curator = CURATORS.find(c => c.id === book.curatorId)
    addItem({ id: book.id, title: book.book, author: book.author, price: book.price, emoji: book.emoji, source: curator?.name || '큐레이터', sourceType: 'pro' })
    setAdded(p => ({ ...p, [book.id]: true }))
    setTimeout(() => setAdded(p => ({ ...p, [book.id]: false })), 1500)
  }

  return (
    <div>
      <div style={{ marginBottom: '1.8rem', paddingBottom: '1rem', borderBottom: '1px solid #e2dbd0' }}>
        <h2 style={{ fontFamily: 'Noto Serif KR, serif', fontSize: '1.4rem' }}>전문 큐레이터 픽</h2>
        <p style={{ fontSize: '0.8rem', color: '#7a6f68', marginTop: 4, fontWeight: 300 }}>헤엄치는뜰 · 에밀의 깊이 있는 독서 제안</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {PRO_PICKS.map(book => {
          const curator = CURATORS.find(c => c.id === book.curatorId)
          return (
            <CuratedCard
              key={book.id}
              book={book}
              color={curator?.color || '#4a6741'}
              curatorName={curator?.name || '큐레이터'}
              added={added[book.id]}
              onAdd={() => handleAdd(book)}
            />
          )
        })}
      </div>
    </div>
  )
}
