import React, { useState } from 'react'
import { useCartStore } from '../../store/cartStore'
import { searchBooks } from '../../utils/aladinApi'

export default function SearchTab() {
  const { addItem } = useCartStore()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [added, setAdded] = useState({})

  const handleSearch = async () => {
    if (!query.trim()) return
    setLoading(true)
    try {
      const res = await searchBooks(query)
      setResults(res)
    } catch {
      alert('검색에 실패했어요')
    }
    setLoading(false)
  }

  const handleAdd = (book) => {
    addItem({ id: book.id, title: book.title, author: book.author, price: book.price || 0, emoji: '📚', source: '알라딘 검색', sourceType: 'search' })
    setAdded(p => ({ ...p, [book.id]: true }))
    setTimeout(() => setAdded(p => ({ ...p, [book.id]: false })), 1500)
  }

  return (
    <div>
      <div style={{ marginBottom: '1.8rem', paddingBottom: '1rem', borderBottom: '1px solid #e2dbd0' }}>
        <h2 style={{ fontFamily: 'Noto Serif KR, serif', fontSize: '1.4rem' }}>책 직접 검색</h2>
        <p style={{ fontSize: '0.8rem', color: '#7a6f68', marginTop: 4, fontWeight: 300 }}>알라딘 API 연동 — 보고 싶은 책을 검색해서 담으세요</p>
      </div>

      <div style={{ background: 'white', border: '1px solid #e2dbd0', borderRadius: 8, padding: '1.5rem' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: '1.2rem' }}>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="책 제목, 저자, ISBN을 입력하세요..."
            style={{
              flex: 1, border: '1px solid #e2dbd0', borderRadius: 4,
              padding: '10px 14px', fontFamily: 'Noto Sans KR, sans-serif',
              fontSize: '0.88rem', background: '#f7f3ed', outline: 'none',
            }}
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            style={{
              background: '#3a6b8a', color: 'white', border: 'none',
              borderRadius: 4, padding: '10px 20px',
              fontFamily: 'Noto Sans KR, sans-serif', fontSize: '0.85rem',
              cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? '검색 중...' : '검색'}
          </button>
        </div>

        <div style={{ fontSize: '0.75rem', color: '#7a6f68', background: '#f7f3ed', padding: '8px 12px', borderRadius: 4, borderLeft: '3px solid #3a6b8a' }}>
          📌 알라딘 API 키 연동 전까지는 목업 결과가 표시됩니다. <code>VITE_ALADIN_PROXY_URL</code> 설정 후 실제 검색 가능
        </div>

        <div style={{ marginTop: '1.2rem' }}>
          {results.map(book => (
            <div key={book.id} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: '1px solid #ede8e0', alignItems: 'center' }}>
              <div style={{ width: 48, height: 64, background: '#ede8e0', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
                {book.cover ? <img src={book.cover} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 3 }} /> : '📚'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 500, marginBottom: 2 }}>{book.title}</div>
                <div style={{ fontSize: '0.75rem', color: '#7a6f68' }}>{book.author} · {book.publisher}</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, marginTop: 4 }}>₩{book.price?.toLocaleString()}</div>
              </div>
              <button
                onClick={() => handleAdd(book)}
                style={{
                  background: added[book.id] ? '#4a6741' : '#c4562a',
                  color: 'white', border: 'none', padding: '6px 14px',
                  borderRadius: 4, fontSize: '0.78rem', fontFamily: 'Noto Sans KR, sans-serif',
                  cursor: 'pointer', flexShrink: 0, transition: 'background 0.2s',
                }}
              >
                {added[book.id] ? '✓ 담김' : '담기'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
