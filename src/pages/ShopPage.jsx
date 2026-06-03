import React, { useState } from 'react'
import styles from './ShopPage.module.css'
import OwnerPicksTab from '../components/tabs/OwnerPicksTab'
import BbooksPicksTab from '../components/tabs/BbooksPicksTab'
import ProPicksTab from '../components/tabs/ProPicksTab'
import SearchTab from '../components/tabs/SearchTab'

const TABS = [
  { id: 'owners', label: '0.1평 점주 추천', color: '#c4562a', desc: '100명의 점주 · 주 1회 업데이트' },
  { id: 'bbooks', label: '비북스 큐레이션', color: '#3a6b8a', desc: '비북스 팀 직접 선별' },
  { id: 'pro',    label: '전문 큐레이터',   color: '#4a6741', desc: '헤엄치는뜰 · 에밀' },
  { id: 'search', label: '책 직접 검색',    color: '#b8862e', desc: '알라딘 API 연동' },
]

export default function ShopPage() {
  const [activeTab, setActiveTab] = useState('owners')

  return (
    <div>
      {/* HERO */}
      <section className={styles.hero}>
        <p className={styles.heroLabel}>✦ bbooks curation shop</p>
        <h1 className={styles.heroTitle}>당신의 0.1평에서 시작된<br />이 달의 책</h1>
        <p className={styles.heroDesc}>
          100명의 작은 점주들이 추천하는 이 주의 책 한 권<br />
          큐레이터가 고른 특별한 읽기 경험
        </p>
      </section>

      {/* TABS */}
      <nav className={styles.tabBar}>
        <div className={styles.tabInner}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`${styles.tabBtn} ${activeTab === tab.id ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab.id)}
              style={activeTab === tab.id ? { borderBottomColor: tab.color, color: tab.color } : {}}
            >
              <span className={styles.tabDot} style={{ background: tab.color }} />
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* CONTENT */}
      <main className={styles.main}>
        {activeTab === 'owners' && <OwnerPicksTab />}
        {activeTab === 'bbooks' && <BbooksPicksTab />}
        {activeTab === 'pro'    && <ProPicksTab />}
        {activeTab === 'search' && <SearchTab />}
      </main>
    </div>
  )
}
