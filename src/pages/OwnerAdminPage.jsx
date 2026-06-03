import React, { useState, useEffect } from 'react'
import styles from './OwnerAdminPage.module.css'
import { searchBooks } from '../utils/aladinApi'
import { supabase, submitOwnerPick } from '../utils/supabase'

// 현재 주차 계산
function getCurrentWeek() {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 1)
  const week = Math.ceil(((now - start) / 86400000 + start.getDay() + 1) / 7)
  return `${now.getFullYear()}-W${String(week).padStart(2, '0')}`
}

export default function OwnerAdminPage() {
  const [step, setStep] = useState('auth')
  const [ownerNum, setOwnerNum] = useState('')
  const [owner, setOwner] = useState(null)
  const [authError, setAuthError] = useState('')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [picked, setPicked] = useState(null)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const week = getCurrentWeek()

  // 점주 번호로 인증
  const handleAuth = async () => {
    if (!ownerNum) { setAuthError('점주 번호를 입력해주세요'); return }
    setLoading(true)
    const { data, error } = await supabase
      .from('owners')
      .select('*')
      .eq('number', parseInt(ownerNum))
      .single()
    setLoading(false)
    if (error || !data) {
      setAuthError('등록되지 않은 점주 번호예요. 비북스에 문의해주세요.')
      return
    }
    setOwner(data)
    setAuthError('')
    setStep('search')
  }

  const handleSearch = async () => {
    if (!query) return
    setLoading(true)
    try {
      const res = await searchBooks(query)
      setResults(res)
    } catch {
      alert('검색에 실패했어요')
    }
    setLoading(false)
  }

  const handlePick = (book) => {
    setPicked(book)
    setStep('confirm')
  }

  const handleSubmit = async () => {
    if (!comment) { alert('추천 코멘트를 남겨주세요!'); return }
    setLoading(true)
    try {
      await submitOwnerPick({
        owner_id:   owner.id,
        week:       week,
        isbn:       picked.isbn || '',
        book_title: picked.title,
        author:     picked.author,
        publisher:  picked.publisher || '',
        price:      picked.price || 0,
        cover_url:  picked.cover || '',
        comment:    comment,
        is_visible: true,
      })
      setStep('done')
    } catch (e) {
      alert('등록에 실패했어요: ' + e.message)
    }
    setLoading(false)
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.badge}>0.1평 점주</span>
          <h2>이번 주 추천 도서 등록</h2>
          <p>{week} · 매주 1인 1권</p>
        </div>

        {/* STEP 1: 인증 */}
        {step === 'auth' && (
          <div className={styles.form}>
            <div className={styles.formGroup}>
              <label>점주 번호</label>
              <input
                type="number"
                value={ownerNum}
                onChange={e => setOwnerNum(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAuth()}
                placeholder="예: 34"
              />
            </div>
            {authError && <p style={{ color: '#c4562a', fontSize: '0.82rem' }}>{authError}</p>}
            <button className={styles.primaryBtn} onClick={handleAuth} disabled={loading}>
              {loading ? '확인 중...' : '다음'}
            </button>
          </div>
        )}

        {/* STEP 2: 검색 */}
        {step === 'search' && (
          <div>
            <p className={styles.stepInfo}>안녕하세요, <strong>{owner.number}번 점주 {owner.nickname}</strong>님!</p>
            <div className={styles.searchBar}>
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="책 제목이나 저자 검색..."
              />
              <button onClick={handleSearch} disabled={loading}>
                {loading ? '검색 중...' : '검색'}
              </button>
            </div>
            <div className={styles.results}>
              {results.map(book => (
                <div key={book.id} className={styles.resultItem}>
                  <div className={styles.bookCover}>
                    {book.cover ? <img src={book.cover} alt={book.title} /> : '📚'}
                  </div>
                  <div className={styles.bookInfo}>
                    <div className={styles.bookTitle}>{book.title}</div>
                    <div className={styles.bookMeta}>{book.author} · {book.publisher}</div>
                    <div className={styles.bookPrice}>₩{book.price?.toLocaleString()}</div>
                  </div>
                  <button className={styles.selectBtn} onClick={() => handlePick(book)}>선택</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: 확인 */}
        {step === 'confirm' && picked && (
          <div>
            <div className={styles.pickedBook}>
              <div className={styles.bigCover}>
                {picked.cover ? <img src={picked.cover} alt={picked.title} /> : '📚'}
              </div>
              <div>
                <h3>{picked.title}</h3>
                <p>{picked.author}</p>
                <p>₩{picked.price?.toLocaleString()}</p>
              </div>
            </div>
            <div className={styles.formGroup}>
              <label>추천 코멘트 <span>(독자들에게 한 마디!)</span></label>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="왜 이 책을 추천하나요? 한두 문장이면 충분해요."
                rows={3}
              />
            </div>
            <div className={styles.btnRow}>
              <button className={styles.secondaryBtn} onClick={() => setStep('search')}>다시 검색</button>
              <button className={styles.primaryBtn} onClick={handleSubmit} disabled={loading}>
                {loading ? '등록 중...' : '등록하기'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: 완료 */}
        {step === 'done' && (
          <div className={styles.done}>
            <div className={styles.doneIcon}>✓</div>
            <h3>등록 완료!</h3>
            <p>이번 주 추천 도서가 등록되었어요.<br />다음 주에 또 만나요!</p>
            <button className={styles.primaryBtn} onClick={() => { setStep('auth'); setPicked(null); setComment(''); setOwnerNum(''); setOwner(null) }}>
              다시 등록하기
            </button>
          </div>
        )}
      </div>
    </div>
  )
}