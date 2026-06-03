import React, { useState } from 'react'
import styles from './OwnerAdminPage.module.css'
import { searchBooks } from '../utils/aladinApi'

// 0.1평 점주가 이번 주 추천 도서를 등록하는 페이지
// TODO: 인증 추가 (점주번호 + 비밀번호 or 카카오 로그인)
// TODO: Supabase insert → owner_picks 테이블

export default function OwnerAdminPage() {
  const [step, setStep]     = useState('auth')   // auth → search → confirm → done
  const [ownerNum, setOwnerNum] = useState('')
  const [ownerNick, setOwnerNick] = useState('')
  const [query, setQuery]   = useState('')
  const [results, setResults] = useState([])
  const [picked, setPicked] = useState(null)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAuth = () => {
    if (!ownerNum || !ownerNick) { alert('점주 번호와 닉네임을 입력해주세요'); return }
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
    if (!comment) { alert('짧은 추천 코멘트를 남겨주세요!'); return }
    // TODO: Supabase insert
    console.log('등록:', { ownerNum, ownerNick, ...picked, comment })
    setStep('done')
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.badge}>0.1평 점주</span>
          <h2>이번 주 추천 도서 등록</h2>
          <p>매주 월요일~일요일, 1인 1권</p>
        </div>

        {/* STEP 1: 인증 */}
        {step === 'auth' && (
          <div className={styles.form}>
            <div className={styles.formGroup}>
              <label>점주 번호</label>
              <input type="number" value={ownerNum} onChange={e => setOwnerNum(e.target.value)} placeholder="예: 34" />
            </div>
            <div className={styles.formGroup}>
              <label>닉네임</label>
              <input value={ownerNick} onChange={e => setOwnerNick(e.target.value)} placeholder="예: 미나" />
            </div>
            <button className={styles.primaryBtn} onClick={handleAuth}>다음</button>
          </div>
        )}

        {/* STEP 2: 검색 */}
        {step === 'search' && (
          <div>
            <p className={styles.stepInfo}>안녕하세요, <strong>{ownerNum}번 점주 {ownerNick}</strong>님!</p>
            <div className={styles.searchBar}>
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="책 제목이나 저자 검색..." onKeyDown={e => e.key === 'Enter' && handleSearch()} />
              <button onClick={handleSearch} disabled={loading}>{loading ? '검색 중...' : '검색'}</button>
            </div>
            <div className={styles.results}>
              {results.map(book => (
                <div key={book.id} className={styles.resultItem} onClick={() => handlePick(book)}>
                  <div className={styles.bookCover}>
                    {book.cover ? <img src={book.cover} alt={book.title} /> : '📚'}
                  </div>
                  <div className={styles.bookInfo}>
                    <div className={styles.bookTitle}>{book.title}</div>
                    <div className={styles.bookMeta}>{book.author} · {book.publisher}</div>
                    <div className={styles.bookPrice}>₩{book.price?.toLocaleString()}</div>
                  </div>
                  <button className={styles.selectBtn}>선택</button>
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
              <button className={styles.primaryBtn} onClick={handleSubmit}>등록하기</button>
            </div>
          </div>
        )}

        {/* STEP 4: 완료 */}
        {step === 'done' && (
          <div className={styles.done}>
            <div className={styles.doneIcon}>✓</div>
            <h3>등록 완료!</h3>
            <p>이번 주 추천 도서가 등록되었어요.<br />다음 주에 또 만나요!</p>
            <button className={styles.primaryBtn} onClick={() => { setStep('auth'); setPicked(null); setComment(''); }}>
              다시 등록하기
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
