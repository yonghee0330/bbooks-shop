import React, { useState, useEffect } from 'react'
import { useCartStore } from '../../store/cartStore'
import { OWNER_PICKS } from '../../data/mockData'
import { getOwnerPicks } from '../../utils/supabase.js'

function getCurrentWeek() {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 1)
  const week = Math.ceil(((now - start) / 86400000 + start.getDay() + 1) / 7)
  return `${now.getFullYear()}-W${String(week).padStart(2, '0')}`
}

export default function OwnerPicksTab() {
  const { addItem } = useCartStore()
  const [added, setAdded] = useState({})
  const [picks, setPicks] = useState([])
  const [loading, setLoading] = useState(true)
  const week = getCurrentWeek()

  useEffect(() => {
    getOwnerPicks(week).then(data => {
      setPicks(data.length > 0 ? data : OWNER_PICKS)
      setLoading(false)
    })
  }, [])

  const handleAdd = (book) => {
    const title = book.book_title || book.book
    const ownerName = book.owners
      ? `${book.owners.number}번 점주 · ${book.owners.nickname}`
      : `${book.ownerId}번 점주 · ${book.ownerNick}`
    addItem({
      id: book.id,
      title,
      author: book.author,
      price: book.price,
      emoji: book.emoji || '📚',
      source: ownerName,
      sourceType: 'owner',
    })
    setAdded(p => ({ ...p, [book.id]: true }))
    setTimeout(() => setAdded(p => ({ ...p, [book.id]: false })), 1500)
  }

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center', color: '#7a6f68' }}>불러오는 중...</div>

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '1.8rem', paddingBottom: '1rem', borderBottom: '1px solid #e2dbd0' }}>
        <div>
          <h2 style={{ fontFamily: 'Noto Serif KR, serif', fontSize: '1.4rem' }}>0.1평 점주 이번 주 추천</h2>
          <p style={{ fontSize: '0.8rem', color: '#7a6f68', marginTop: 4, fontWeight: 300 }}>
            {picks === OWNER_PICKS ? '샘플 데이터 · ' : ''}{week} · 매주 업데이트
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.2rem' }}>
        {picks.map(book => {
          const title = book.book_title || book.book
          const ownerName = book.owners
            ? `${book.owners.number}번 점주 · ${book.owners.nickname}`
            : `${book.ownerId}번 점주 · ${book.ownerNick}`
          return (
            <div key={book.id}
              style={{ background: 'white', border: '1px solid #e2dbd0', borderRadius: 6, overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
            >
              <div style={{ height: 130, background: '#ede8e0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', position: 'relative' }}>
                {book.cover_url
                  ? <img src={book.cover_url} alt={title} style={{ height: '100%', width: '100%', objectFit: 'cover' }} />
                  : (book.emoji || '📚')
                }
                <span style={{ position: 'absolute', top: 8, left: 8, background: '#1a1612', color: '#f7f3ed', fontSize: '0.65rem', padding: '3px 7px', borderRadius: 3 }}>
                  {book.tag || '추천'}
                </span>
              </div>
              <div style={{ padding: '0.8rem' }}>
                <div style={{ fontSize: '0.72rem', color: '#c4562a', fontWeight: 500, marginBottom: 3 }}>{ownerName}</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 500, lineHe