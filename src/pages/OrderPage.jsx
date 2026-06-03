import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import styles from './OrderPage.module.css'

const PAY_METHODS = ['카드 결제', '카카오페이', '네이버페이', '토스페이', '무통장입금']

export default function OrderPage() {
  const navigate = useNavigate()
  const { items, getSubtotal, getTotal, clearCart } = useCartStore()
  const [payMethod, setPayMethod] = useState('카드 결제')
  const [form, setForm] = useState({ name: '', phone: '', addr1: '', addr2: '', memo: '' })

  const itemList = Object.values(items)
  const subtotal  = getSubtotal()
  const total     = getTotal()

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = () => {
    if (!form.name || !form.phone || !form.addr1) {
      alert('배송 정보를 모두 입력해 주세요.')
      return
    }
    // TODO: Supabase에 주문 저장 / 결제 PG 연동
    alert('주문이 접수되었습니다!\n(결제 PG 연동 후 실 주문 처리됩니다)')
    clearCart()
    navigate('/')
  }

  if (itemList.length === 0) {
    return (
      <div className={styles.empty}>
        <p>장바구니가 비어있어요.</p>
        <button onClick={() => navigate('/')}>쇼핑 계속하기</button>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <button className={styles.back} onClick={() => navigate('/')}>← 쇼핑 계속하기</button>

      {/* 주문 목록 */}
      <div className={styles.card}>
        <h2>📦 주문 목록</h2>
        <div className={styles.itemList}>
          {itemList.map(item => (
            <div key={item.id} className={styles.orderItem}>
              <span>{item.emoji || '📚'} {item.title}</span>
              <span className={styles.meta}>{item.author} · {item.qty}권</span>
              <span className={styles.price}>₩{(item.price * item.qty).toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div className={styles.summary}>
          <div className={styles.row}><span>소계</span><span>₩{subtotal.toLocaleString()}</span></div>
          <div className={styles.row}><span>배송비</span><span>₩3,000</span></div>
          <div className={styles.totalRow}><strong>합계</strong><strong>₩{total.toLocaleString()}</strong></div>
        </div>
      </div>

      {/* 배송 정보 */}
      <div className={styles.card}>
        <h2>👤 배송 정보</h2>
        <div className={styles.formGroup}>
          <label>받는 분</label>
          <input name="name"  value={form.name}  onChange={handleChange} placeholder="이름" />
        </div>
        <div className={styles.formGroup}>
          <label>연락처</label>
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="010-0000-0000" />
        </div>
        <div className={styles.formGroup}>
          <label>주소</label>
          <input name="addr1" value={form.addr1} onChange={handleChange} placeholder="주소 검색" style={{ marginBottom: 6 }} />
          <input name="addr2" value={form.addr2} onChange={handleChange} placeholder="상세 주소" />
        </div>
        <div className={styles.formGroup}>
          <label>요청사항</label>
          <input name="memo"  value={form.memo}  onChange={handleChange} placeholder="배송 요청사항 (선택)" />
        </div>
      </div>

      {/* 결제 수단 */}
      <div className={styles.card}>
        <h2>💳 결제 방법</h2>
        <div className={styles.payGrid}>
          {PAY_METHODS.map(m => (
            <button
              key={m}
              className={`${styles.payBtn} ${payMethod === m ? styles.paySelected : ''}`}
              onClick={() => setPayMethod(m)}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <button className={styles.confirmBtn} onClick={handleSubmit}>
        주문 확인 및 결제하기 ({payMethod})
      </button>
    </div>
  )
}
