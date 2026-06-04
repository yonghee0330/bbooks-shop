import AdminPage from './pages/AdminPage.jsx'
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import CartSidebar from './components/CartSidebar'
import ShopPage from './pages/ShopPage'
import OrderPage from './pages/OrderPage'
import OwnerAdminPage from './pages/OwnerAdminPage'
import '../src/styles/global.css'

// ─── 라우팅 구조 ──────────────────────────────────────────────────────────
// /          → ShopPage    (메인 쇼핑 페이지)
// /order     → OrderPage   (주문/결제 페이지)
// /owner-admin → OwnerAdminPage (0.1평 점주 추천 등록 - 추후 인증 추가)

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <CartSidebar />
      <Routes>
        <Route path="/"            element={<ShopPage />} />
        <Route path="/order"       element={<OrderPage />} />
        <Route path="/owner-admin" element={<OwnerAdminPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  )
}
