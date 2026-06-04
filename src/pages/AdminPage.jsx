import React, { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase.js'

const TABS = ['주문 현황', '점주 관리', '큐레이션 관리']

export default function AdminPage() {
  const [tab, setTab] = useState('주문 현황')
  const [pw, setPw] = useState('')
  const [authed, setAuthed] = useState(false)

  if (!authed) return (
    <div style={{ maxWidth: 400, margin: '6rem auto', padding: '2rem', background: 'white', borderRadius: 8, border: '1px solid #e2dbd0' }}>
      <h2 style={{ fontFamily: 'Noto Serif KR, serif', marginBottom: '1.5rem', textAlign: 'center' }}>관리자 로그인</h2>
      <input
        type="password"
        value={pw}
        onChange={e => setPw(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && (pw === 'bbooks2024' ? setAuthed(true) : alert('비밀번호 오류'))}
        placeholder="관리자 비밀번호"
        style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2dbd0', borderRadius: 4, fontFamily: 'Noto Sans KR, sans-serif', marginBottom: '0.8rem', boxSizing: 'border-box' }}
      />
      <button
        onClick={() => pw === 'bbooks2024' ? setAuthed(true) : alert('비밀번호 오류')}
        style={{ width: '100%', background: '#c4562a', color: 'white', border: 'none', padding: 12, borderRadius: 4, fontFamily: 'Noto Sans KR, sans-serif', cursor: 'pointer' }}
      >
        로그인
      </button>
    </div>
  )

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Noto Serif KR, serif', fontSize: '1.5rem' }}>비북스 관리자</h1>
        <button onClick={() => setAuthed(false)} style={{ background: 'none', border: '1px solid #e2dbd0', padding: '6px 14px', borderRadius: 4, cursor: 'pointer', fontSize: '0.82rem', color: '#7a6f68' }}>로그아웃</button>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: '2rem', borderBottom: '1px solid #e2dbd0', paddingBottom: '1rem' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            background: tab === t ? '#c4562a' : 'white',
            color: tab === t ? 'white' : '#3d3530',
            border: '1px solid #e2dbd0',
            padding: '8px 18px', borderRadius: 4,
            fontFamily: 'Noto Sans KR, sans-serif',
            cursor: 'pointer', fontSize: '0.85rem',
          }}>{t}</button>
        ))}
      </div>

      {tab === '주문 현황' && <OrdersTab />}
      {tab === '점주 관리' && <OwnersTab />}
      {tab === '큐레이션 관리' && <CurationTab />}
    </div>
  )
}

// ── 주문 현황 ──────────────────────────────────────────
function OrdersTab() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const STATUS_LABELS = { pending: '접수', paid: '결제완료', shipped: '배송중', done: '완료', cancelled: '취소' }
  const STATUS_COLORS = { pending: '#b8862e', paid: '#3a6b8a', shipped: '#4a6741', done: '#7a6f68', cancelled: '#c4562a' }

  useEffect(() => {
    supabase.from('orders').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setOrders(data || []); setLoading(false) })
  }, [])

  const updateStatus = async (id, status) => {
    await supabase.from('orders').update({ status }).eq('id', id)
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o))
  }

  if (loading) return <div style={{ color: '#7a6f68' }}>불러오는 중...</div>
  if (orders.length === 0) return <div style={{ color: '#7a6f68', padding: '2rem' }}>아직 주문이 없어요.</div>

  return (
    <div>
      <div style={{ marginBottom: '1rem', fontSize: '0.85rem', color: '#7a6f68' }}>총 {orders.length}건</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {orders.map(o => (
          <div key={o.id} style={{ background: 'white', border: '1px solid #e2dbd0', borderRadius: 8, padding: '1.2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#7a6f68', fontFamily: 'monospace' }}>{o.id.slice(0, 8).toUpperCase()}</span>
                <span style={{ marginLeft: 10, fontSize: '0.82rem', color: '#7a6f68' }}>{new Date(o.created_at).toLocaleString('ko-KR')}</span>
              </div>
              <select
                value={o.status}
                onChange={e => updateStatus(o.id, e.target.value)}
                style={{ border: `1px solid ${STATUS_COLORS[o.status]}`, color: STATUS_COLORS[o.status], borderRadius: 4, padding: '4px 8px', fontSize: '0.78rem', fontFamily: 'Noto Sans KR, sans-serif', cursor: 'pointer', background: 'white', fontWeight: 600 }}
              >
                {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: '0.83rem' }}>
              <div><span style={{ color: '#7a6f68' }}>받는 분: </span>{o.buyer_name}</div>
              <div><span style={{ color: '#7a6f68' }}>연락처: </span>{o.buyer_phone}</div>
              <div style={{ gridColumn: '1/-1' }}><span style={{ color: '#7a6f68' }}>주소: </span>{o.addr} {o.addr_detail}</div>
              <div><span style={{ color: '#7a6f68' }}>결제: </span>{o.pay_method}</div>
              <div><span style={{ color: '#7a6f68' }}>금액: </span><strong>₩{o.total?.toLocaleString()}</strong></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── 점주 관리 ──────────────────────────────────────────
function OwnersTab() {
  const [owners, setOwners] = useState([])
  const [loading, setLoading] = useState(true)
  const [newNum, setNewNum] = useState('')
  const [newNick, setNewNick] = useState('')

  useEffect(() => {
    supabase.from('owners').select('*').order('number')
      .then(({ data }) => { setOwners(data || []); setLoading(false) })
  }, [])

  const addOwner = async () => {
    if (!newNum || !newNick) return
    const { data } = await supabase.from('owners').insert({ number: parseInt(newNum), nickname: newNick }).select().single()
    if (data) { setOwners([...owners, data].sort((a, b) => a.number - b.number)); setNewNum(''); setNewNick('') }
  }

  const deleteOwner = async (id) => {
    if (!confirm('삭제할까요?')) return
    await supabase.from('owners').delete().eq('id', id)
    setOwners(owners.filter(o => o.id !== id))
  }

  if (loading) return <div style={{ color: '#7a6f68' }}>불러오는 중...</div>

  return (
    <div>
      <div style={{ background: 'white', border: '1px solid #e2dbd0', borderRadius: 8, padding: '1.2rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontFamily: 'Noto Serif KR, serif', marginBottom: '1rem', fontSize: '0.95rem' }}>점주 추가</h3>
        <div style={{ display: 'flex', gap: 8 }}>
          <input value={newNum} onChange={e => setNewNum(e.target.value)} placeholder="번호" type="number" style={{ width: 80, padding: '8px 10px', border: '1px solid #e2dbd0', borderRadius: 4, fontFamily: 'Noto Sans KR, sans-serif' }} />
          <input value={newNick} onChange={e => setNewNick(e.target.value)} placeholder="서점명" style={{ flex: 1, padding: '8px 10px', border: '1px solid #e2dbd0', borderRadius: 4, fontFamily: 'Noto Sans KR, sans-serif' }} />
          <button onClick={addOwner} style={{ background: '#c4562a', color: 'white', border: 'none', padding: '8px 16px', borderRadius: 4, cursor: 'pointer', fontFamily: 'Noto Sans KR, sans-serif' }}>추가</button>
        </div>
      </div>

      <div style={{ marginBottom: '0.8rem', fontSize: '0.85rem', color: '#7a6f68' }}>총 {owners.length}명</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
        {owners.map(o => (
          <div key={o.id} style={{ background: 'white', border: '1px solid #e2dbd0', borderRadius: 6, padding: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>
              <span style={{ fontSize: '0.72rem', color: '#c4562a', fontWeight: 600, marginRight: 6 }}>{o.number}번</span>
              <span style={{ fontSize: '0.85rem' }}>{o.nickname}</span>
            </span>
            <button onClick={() => deleteOwner(o.id)} style={{ background: 'none', border: 'none', color: '#7a6f68', cursor: 'pointer', fontSize: '0.75rem' }}>삭제</button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── 큐레이션 관리 ──────────────────────────────────────
function CurationTab() {
  const [subTab, setSubTab] = useState('bbooks')
  const [bbooksPicks, setBbooksPicks] = useState([])
  const [curatorPicks, setCuratorPicks] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ book_title: '', author: '', price: '', comment: '', tag: '', emoji: '📚', month: new Date().toISOString().slice(0, 7), curator_id: 'swim' })

  useEffect(() => {
    Promise.all([
      supabase.from('bbooks_picks').select('*').order('created_at', { ascending: false }),
      supabase.from('curator_picks').select('*, curators(*)').order('created_at', { ascending: false }),
    ]).then(([b, c]) => {
      setBbooksPicks(b.data || [])
      setCuratorPicks(c.data || [])
      setLoading(false)
    })
  }, [])

  const addPick = async () => {
    if (!form.book_title) return
    if (subTab === 'bbooks') {
      const { data } = await supabase.from('bbooks_picks').insert({ ...form, price: parseInt(form.price) || 0, is_visible: true }).select().single()
      if (data) setBbooksPicks([data, ...bbooksPicks])
    } else {
      const { data } = await supabase.from('curator_picks').select('*, curators(*)').eq('id', (
        await supabase.from('curator_picks').insert({ ...form, price: parseInt(form.price) || 0, is_visible: true }).select().single()
      ).data?.id).single()
      if (data) setCuratorPicks([data, ...curatorPicks])
    }
    setForm({ ...form, book_title: '', author: '', price: '', comment: '', tag: '', emoji: '📚' })
  }

  const deletePick = async (id, type) => {
    if (!confirm('삭제할까요?')) return
    if (type === 'bbooks') {
      await supabase.from('bbooks_picks').delete().eq('id', id)
      setBbooksPicks(bbooksPicks.filter(p => p.id !== id))
    } else {
      await supabase.from('curator_picks').delete().eq('id', id)
      setCuratorPicks(curatorPicks.filter(p => p.id !== id))
    }
  }

  if (loading) return <div style={{ color: '#7a6f68' }}>불러오는 중...</div>

  const picks = subTab === 'bbooks' ? bbooksPicks : curatorPicks

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem' }}>
        <button onClick={() => setSubTab('bbooks')} style={{ background: subTab === 'bbooks' ? '#3a6b8a' : 'white', color: subTab === 'bbooks' ? 'white' : '#3d3530', border: '1px solid #e2dbd0', padding: '6px 16px', borderRadius: 4, cursor: 'pointer', fontFamily: 'Noto Sans KR, sans-serif', fontSize: '0.83rem' }}>비북스 픽</button>
        <button onClick={() => setSubTab('pro')} style={{ background: subTab === 'pro' ? '#4a6741' : 'white', color: subTab === 'pro' ? 'white' : '#3d3530', border: '1px solid #e2dbd0', padding: '6px 16px', borderRadius: 4, cursor: 'pointer', fontFamily: 'Noto Sans KR, sans-serif', fontSize: '0.83rem' }}>큐레이터 픽</button>
      </div>

      <div style={{ background: 'white', border: '1px solid #e2dbd0', borderRadius: 8, padding: '1.2rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontFamily: 'Noto Serif KR, serif', marginBottom: '1rem', fontSize: '0.95rem' }}>새 책 추가</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
          <input value={form.book_title} onChange={e => setForm({ ...form, book_title: e.target.value })} placeholder="책 제목 *" style={inputStyle} />
          <input value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} placeholder="저자" style={inputStyle} />
          <input value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="가격" type="number" style={inputStyle} />
          <input value={form.tag} onChange={e => setForm({ ...form, tag: e.target.value })} placeholder="태그 (예: 소설)" style={inputStyle} />
          <input value={form.emoji} onChange={e => setForm({ ...form, emoji: e.target.value })} placeholder="이모지" style={inputStyle} />
          <input value={form.month} onChange={e => setForm({ ...form, month: e.target.value })} placeholder="월 (YYYY-MM)" style={inputStyle} />
          {subTab === 'pro' && (
            <select value={form.curator_id} onChange={e => setForm({ ...form, curator_id: e.target.value })} style={inputStyle}>
              <option value="swim">헤엄치는뜰</option>
              <option value="emile">에밀</option>
            </select>
          )}
        </div>
        <textarea value={form.comment} onChange={e => setForm({ ...form, comment: e.target.value })} placeholder="코멘트" rows={2} style={{ ...inputStyle, width: '100%', marginBottom: 8, resize: 'vertical' }} />
        <button onClick={addPick} style={{ background: '#c4562a', color: 'white', border: 'none', padding: '8px 20px', borderRadius: 4, cursor: 'pointer', fontFamily: 'Noto Sans KR, sans-serif' }}>추가</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {picks.map(p => (
          <div key={p.id} style={{ background: 'white', border: '1px solid #e2dbd0', borderRadius: 6, padding: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{p.emoji} {p.book_title}</span>
              <span style={{ fontSize: '0.75rem', color: '#7a6f68', marginLeft: 8 }}>{p.author} · {p.month}</span>
              {p.curators && <span style={{ fontSize: '0.72rem', color: '#4a6741', marginLeft: 6 }}>{p.curators.name}</span>}
            </div>
            <button onClick={() => deletePick(p.id, subTab)} style={{ background: 'none', border: 'none', color: '#c4562a', cursor: 'pointer', fontSize: '0.75rem' }}>삭제</button>
          </div>
        ))}
      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '8px 10px',
  border: '1px solid #e2dbd0',
  borderRadius: 4,
  fontFamily: 'Noto Sans KR, sans-serif',
  fontSize: '0.85rem',
  background: '#f7f3ed',
  boxSizing: 'border-box',
}