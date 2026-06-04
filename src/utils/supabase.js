import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// 비북스 큐레이션 조회
export async function getBbooksPicks(month) {
  const { data, error } = await supabase
    .from('bbooks_picks')
    .select('*')
    .eq('month', month)
    .eq('is_visible', true)
    .order('sort_order')
  if (error) { console.error(error); return [] }
  return data
}

// 전문 큐레이터 픽 조회
export async function getCuratorPicks(month) {
  const { data, error } = await supabase
    .from('curator_picks')
    .select('*, curators(*)')
    .eq('month', month)
    .eq('is_visible', true)
    .order('sort_order')
  if (error) { console.error(error); return [] }
  return data
}

// 점주 추천 조회
export async function getOwnerPicks(week) {
  const { data, error } = await supabase
    .from('owner_picks')
    .select('*, owners(*)')
    .eq('week', week)
    .eq('is_visible', true)
  if (error) { console.error(error); return [] }
  return data
}

// 점주 추천 등록
export async function submitOwnerPick(pick) {
  const { data, error } = await supabase
    .from('owner_picks')
    .upsert(pick, { onConflict: 'owner_id,week' })
  if (error) throw error
  return data
}
// 주문 저장
export async function submitOrder(orderData, items) {
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert(orderData)
    .select()
    .single()
  if (orderError) throw orderError

  const orderItems = items.map(item => ({
    order_id:   order.id,
    book_title: item.title,
    author:     item.author,
    price:      item.price,
    qty:        item.qty,
    source_type: item.sourceType,
    source_name: item.source,
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)
  if (itemsError) throw itemsError

  return order
}
