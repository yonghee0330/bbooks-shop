// ─── Mock Data ────────────────────────────────────────────────────────────
// 실 서비스에서는 Supabase 또는 Google Sheets API로 교체
// 각 타입별 데이터 구조 참고용

// ── 0.1평 점주 추천 ──────────────────────────────────────────────────────
// DB 테이블: owner_picks
// 컬럼: id, owner_number, owner_nickname, book_title, author, price,
//        isbn, cover_url, comment, week, created_at
export const OWNER_PICKS = [
  { id: 1,  ownerId: 34, ownerNick: "미나",  book: "채식주의자",      author: "한강",           price: 13000, isbn: "9788936434267", emoji: "🌿", tag: "소설",    week: "2024-W50" },
  { id: 2,  ownerId: 7,  ownerNick: "준호",  book: "파친코",          author: "이민진",         price: 17000, isbn: "9791162540046", emoji: "📖", tag: "역사소설", week: "2024-W50" },
  { id: 3,  ownerId: 52, ownerNick: "소연",  book: "82년생 김지영",   author: "조남주",         price: 12000, isbn: "9788934972464", emoji: "🌸", tag: "소설",    week: "2024-W50" },
  { id: 4,  ownerId: 88, ownerNick: "태웅",  book: "총, 균, 쇠",      author: "제레드 다이아몬드", price: 22000, isbn: "9788924024291", emoji: "🔬", tag: "인문",    week: "2024-W50" },
  { id: 5,  ownerId: 13, ownerNick: "혜진",  book: "아몬드",          author: "손원평",         price: 13500, isbn: "9791162540558", emoji: "🫀", tag: "소설",    week: "2024-W50" },
  { id: 6,  ownerId: 61, ownerNick: "동현",  book: "코스모스",        author: "칼 세이건",      price: 19000, isbn: "9788983711892", emoji: "🌌", tag: "과학",    week: "2024-W50" },
  { id: 7,  ownerId: 29, ownerNick: "나연",  book: "작별하지 않는다", author: "한강",           price: 14000, isbn: "9791190090834", emoji: "❄️", tag: "소설",    week: "2024-W50" },
  { id: 8,  ownerId: 45, ownerNick: "우진",  book: "데미안",          author: "헤르만 헤세",    price: 10000, isbn: "9788937461750", emoji: "🦅", tag: "고전",    week: "2024-W50" },
  { id: 9,  ownerId: 3,  ownerNick: "지민",  book: "달러구트 꿈 백화점", author: "이미예",       price: 14000, isbn: "9791190090018", emoji: "💤", tag: "판타지",  week: "2024-W50" },
  { id: 10, ownerId: 77, ownerNick: "은서",  book: "나는 나로 살기로 했다", author: "김수현",    price: 14500, isbn: "9788901220703", emoji: "🌻", tag: "에세이",  week: "2024-W50" },
  { id: 11, ownerId: 92, ownerNick: "민재",  book: "완전한 행복",     author: "정유정",         price: 15000, isbn: "9788954665339", emoji: "🔪", tag: "스릴러",  week: "2024-W50" },
  { id: 12, ownerId: 18, ownerNick: "아름",  book: "소년이 온다",     author: "한강",           price: 13000, isbn: "9788936434342", emoji: "🕯️", tag: "소설",    week: "2024-W50" },
]

// ── 비북스 큐레이션 ──────────────────────────────────────────────────────
// DB 테이블: bbooks_picks
// 컬럼: id, book_title, author, price, isbn, cover_url, comment, month, created_at
export const BBOOKS_PICKS = [
  { id: 101, book: "우리가 빛의 속도로 갈 수 없다면", author: "김초엽", price: 14000, isbn: "9791161571126", emoji: "✨", tag: "SF",    comment: "SF와 인문학의 경계에서 가장 아름다운 질문들을 던지는 책.", month: "2024-12" },
  { id: 102, book: "지구 끝의 온실",                  author: "김초엽", price: 15000, isbn: "9791161573410", emoji: "🌱", tag: "소설",  comment: "멸종 이후를 살아가는 사람들의 이야기. 희망에 관한 소설.", month: "2024-12" },
  { id: 103, book: "불편한 편의점",                   author: "김호연", price: 14000, isbn: "9791137201354", emoji: "🏪", tag: "소설",  comment: "따뜻함이 필요한 모든 날을 위한 책.", month: "2024-12" },
  { id: 104, book: "흰",                              author: "한강",   price: 11000, isbn: "9788936434465", emoji: "⚪", tag: "산문",  comment: "빛과 흼에 관한 시적인 산문. 글을 읽는다는 것의 의미.", month: "2024-12" },
]

// ── 전문 큐레이터 ──────────────────────────────────────────────────────
// DB 테이블: curator_picks
// 컬럼: id, curator_id, curator_name, book_title, author, price, isbn, cover_url, comment, month
export const CURATORS = [
  { id: "swim",  name: "헤엄치는뜰", color: "#4a6741", bio: "자연, 생태, 비인간 존재에 관한 깊은 독서" },
  { id: "emile", name: "에밀",       color: "#b8862e", bio: "철학, 고전, 미디어 비평을 아우르는 큐레이션" },
]

export const PRO_PICKS = [
  { id: 201, curatorId: "swim",  book: "숲은 생각한다",         author: "에두아르도 콘",  price: 24000, isbn: "9788932020587", emoji: "🌲", tag: "철학/인류학", comment: "인류학자가 열대우림에서 발견한 '존재'의 철학. 비인간 중심의 새로운 세계관." },
  { id: 202, curatorId: "swim",  book: "이반 일리치의 죽음",    author: "톨스토이",       price: 9000,  isbn: "9788937461667", emoji: "🕯️", tag: "고전",       comment: "죽음 앞에서 비로소 발견하는 삶의 의미. 짧지만 묵직한 고전." },
  { id: 203, curatorId: "emile", book: "생각하지 않는 사람들",  author: "니콜라스 카",    price: 16000, isbn: "9788904574902", emoji: "🧠", tag: "인문/과학",  comment: "인터넷이 우리의 사고 방식을 어떻게 바꾸는지에 대한 냉정한 분석." },
  { id: 204, curatorId: "emile", book: "모비딕",                author: "허먼 멜빌",      price: 29000, isbn: "9788937461889", emoji: "🐋", tag: "고전",       comment: "바다, 집착, 인간. 모든 문학이 이 책을 향해 있다." },
]
