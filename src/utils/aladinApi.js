const PROXY = '/api/aladin'

function normalizeItem(item) {
  return {
    id:         `aladin-${item.itemId}`,
    isbn:        item.isbn13 || item.isbn || '',
    title:       item.title || '',
    author:      (item.author || '').replace(/\s*지음$/, '').replace(/\s*저$/, ''),
    publisher:   item.publisher || '',
    price:       item.priceSales || item.priceStandard || 0,
    cover:       item.cover || '',
    emoji:       '📚',
    source:      '알라딘 검색',
    sourceType:  'search',
  }
}

export async function searchBooks(query, searchType = 'Keyword', maxResults = 10) {
  if (!query.trim()) return []
  try {
    const params = new URLSearchParams({ action: 'search', query, searchType, maxResults })
    const res = await fetch(`${PROXY}?${params}`)
    if (!res.ok) throw new Error('검색 실패')
    const data = await res.json()
    return (data.item || []).map(normalizeItem)
  } catch (e) {
    console.error('알라딘 검색 오류:', e)
    return getMockResults(query)
  }
}

export async function getBestSellers(maxResults = 10) {
  try {
    const params = new URLSearchParams({ action: 'bestseller', maxResults })
    const res = await fetch(`${PROXY}?${params}`)
    if (!res.ok) throw new Error('실패')
    const data = await res.json()
    return (data.item || []).map(normalizeItem)
  } catch (e) {
    return []
  }
}

export async function getBookByISBN(isbn) {
  try {
    const params = new URLSearchParams({ action: 'lookup', isbn })
    const res = await fetch(`${PROXY}?${params}`)
    if (!res.ok) throw new Error('실패')
    const data = await res.json()
    return data.item?.[0] ? normalizeItem(data.item[0]) : null
  } catch (e) {
    return null
  }
}

function getMockResults(query) {
  return [
    { id: 'mock-1', title: `"${query}" 검색 결과 1`, author: '저자명', publisher: '출판사', price: 14000, cover: '', emoji: '📗', sourceType: 'search' },
    { id: 'mock-2', title: `"${query}" 검색 결과 2`, author: '저자명', publisher: '출판사', price: 16000, cover: '', emoji: '📘', sourceType: 'search' },
  ]
}