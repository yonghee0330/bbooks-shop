// ─── 알라딘 API 유틸리티 ─────────────────────────────────────────────────
// 알라딘 Open API: https://blog.aladin.co.kr/openapi/category/3058660
//
// ⚠️  CORS 주의: 알라딘 API는 CORS를 지원하지 않으므로
//     직접 브라우저에서 호출 불가 → Vercel Edge Function / Google Apps Script 프록시 필요
//
// 권장 방법: Google Apps Script를 프록시로 활용 (기존 스택과 동일)
//   - GAS 웹앱 URL로 요청 → GAS가 알라딘 API 호출 후 JSON 반환
//   - 또는 Vercel API Route (api/search.js) 사용

const ALADIN_BASE = 'https://www.aladin.co.kr/ttb/api'

// ── 환경 변수 (Vite) ──────────────────────────────────────────────────────
// .env.local 파일에 설정:
//   VITE_ALADIN_API_KEY=TTBxxxxxxxx
//   VITE_ALADIN_PROXY_URL=https://your-vercel-app.vercel.app/api/aladin
//
const API_KEY   = import.meta.env.VITE_ALADIN_API_KEY
const PROXY_URL = import.meta.env.VITE_ALADIN_PROXY_URL

// ── 검색 ──────────────────────────────────────────────────────────────────
// query: 검색어
// searchType: Keyword(기본) | Title | Author | Publisher
// returns: [{ isbn, title, author, publisher, priceSales, cover, itemId }]
export async function searchBooks(query, searchType = 'Keyword', maxResults = 10) {
  if (!PROXY_URL) {
    // 개발 단계: 목업 데이터 반환
    return getMockSearchResults(query)
  }

  const params = new URLSearchParams({
    query,
    searchType,
    maxResults,
    output: 'js',
    Version: '20131101',
  })

  const res = await fetch(`${PROXY_URL}/search?${params}`)
  if (!res.ok) throw new Error('알라딘 검색 실패')
  const data = await res.json()

  return (data.item || []).map(normalizeAladinItem)
}

// ── 베스트셀러 ───────────────────────────────────────────────────────────
// listType: Bestseller | NewBook | BlogBest | ItemNewAll
export async function getBestSellers(listType = 'Bestseller', maxResults = 20) {
  if (!PROXY_URL) return []

  const params = new URLSearchParams({
    listType,
    maxResults,
    output: 'js',
    Version: '20131101',
    CategoryId: 0,  // 전체 카테고리
  })

  const res = await fetch(`${PROXY_URL}/list?${params}`)
  if (!res.ok) throw new Error('알라딘 리스트 실패')
  const data = await res.json()
  return (data.item || []).map(normalizeAladinItem)
}

// ── ISBN으로 상세 조회 ───────────────────────────────────────────────────
export async function getBookByISBN(isbn) {
  if (!PROXY_URL) return null

  const params = new URLSearchParams({
    itemIdType: 'ISBN13',
    ItemId: isbn,
    output: 'js',
    Version: '20131101',
  })

  const res = await fetch(`${PROXY_URL}/lookup?${params}`)
  if (!res.ok) throw new Error('알라딘 조회 실패')
  const data = await res.json()
  return data.item?.[0] ? normalizeAladinItem(data.item[0]) : null
}

// ── 응답 정규화 ──────────────────────────────────────────────────────────
function normalizeAladinItem(item) {
  return {
    id:         `aladin-${item.itemId}`,
    isbn:       item.isbn13 || item.isbn,
    title:      item.title,
    author:     item.author?.replace(/\s*지음$/, ''),
    publisher:  item.publisher,
    price:      item.priceSales || item.priceStandard,
    cover:      item.cover,       // 표지 이미지 URL
    link:       item.link,        // 알라딘 상품 페이지
    description: item.description || '',
    pubDate:    item.pubDate,
    source:     'aladin',
    sourceType: 'search',
  }
}

// ── 개발용 목업 ──────────────────────────────────────────────────────────
function getMockSearchResults(query) {
  return [
    { id: 'mock-1', isbn: '9788936434267', title: `${query} 검색 결과 예시 1`, author: '저자명', publisher: '출판사', price: 14000, cover: null, sourceType: 'search' },
    { id: 'mock-2', isbn: '9788936434268', title: `${query} 관련 책 예시 2`,   author: '저자명', publisher: '출판사', price: 16000, cover: null, sourceType: 'search' },
    { id: 'mock-3', isbn: '9788936434269', title: `${query} 추천 도서 예시 3`, author: '저자명', publisher: '출판사', price: 13000, cover: null, sourceType: 'search' },
  ]
}

// ── Vercel API Route 템플릿 (/api/aladin/[action].js) ────────────────────
// 아래 내용을 vercel 프로젝트의 /api/aladin/search.js 에 복사:
/*
export default async function handler(req, res) {
  const { query, searchType = 'Keyword', maxResults = 10 } = req.query
  const API_KEY = process.env.ALADIN_API_KEY

  const url = `https://www.aladin.co.kr/ttb/api/ItemSearch.aspx?` +
    `ttbkey=${API_KEY}&Query=${encodeURIComponent(query)}&QueryType=${searchType}` +
    `&MaxResults=${maxResults}&output=js&Version=20131101&Cover=Big`

  const r = await fetch(url)
  const data = await r.json()

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.json(data)
}
*/
