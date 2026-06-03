# 비북스 큐레이션샵 (bbooks-shop)

부천 독립서점 비북스의 큐레이션 온라인 판매 사이트.

## 페이지 구성

| 섹션 | 설명 | 업데이트 주기 |
|------|------|--------------|
| 0.1평 점주 추천 | 100명의 작은 점주 각 1권 | 주 1회 (점주 직접 등록) |
| 비북스 큐레이션 | 비북스 팀 직접 선별 | 월 1회 |
| 전문 큐레이터 | 헤엄치는뜰, 에밀 | 월 1회 |
| 책 직접 검색 | 알라딘 API 연동 검색 | 실시간 |

## 스택

- **Frontend**: Vite + React + Zustand
- **Hosting**: Vercel (GitHub 연동)
- **DB**: Supabase (PostgreSQL)
- **API**: 알라딘 Open API (Vercel Route 프록시)
- **스타일**: CSS Modules

## 로컬 실행

```bash
# 1. 프로젝트 폴더로 이동
cd bbooks-shop

# 2. 의존성 설치
npm install

# 3. 환경 변수 설정
cp .env.example .env.local
# .env.local 열어서 값 입력

# 4. 개발 서버 실행
npm run dev
# → http://localhost:5173
```

## 배포 (Vercel)

```bash
# GitHub에 push하면 Vercel 자동 배포
git add .
git commit -m "feat: 초기 세팅"
git push origin main

# Vercel 환경 변수도 Dashboard에서 설정 필요
# Settings > Environment Variables
```

## Supabase 세팅

```
1. supabase.com에서 새 프로젝트 생성
2. SQL Editor에서 supabase-schema.sql 실행
3. Project URL과 anon key를 .env.local에 입력
```

## 알라딘 API 연동

```
1. https://blog.aladin.co.kr/openapi/category/3058660 에서 API 키 신청
2. VITE_ALADIN_API_KEY에 입력
3. Vercel에 api/aladin/ 라우트 파일 추가 (utils/aladinApi.js 하단 주석 참고)
4. CORS 때문에 직접 호출 불가 → Vercel Edge Function 필수
```

## 주요 폴더 구조

```
src/
├── components/
│   ├── Header.jsx          # 상단 네비 + 장바구니 버튼
│   ├── CartSidebar.jsx     # 장바구니 슬라이드 패널
│   ├── BookCard.jsx        # 공통 도서 카드
│   └── tabs/
│       ├── OwnerPicksTab.jsx
│       ├── BbooksPicksTab.jsx
│       ├── ProPicksTab.jsx
│       └── SearchTab.jsx
├── pages/
│   ├── ShopPage.jsx        # 메인 쇼핑 페이지
│   ├── OrderPage.jsx       # 주문/결제 페이지
│   └── OwnerAdminPage.jsx  # 점주 추천 등록 (/owner-admin)
├── store/
│   └── cartStore.js        # Zustand 장바구니 상태
├── data/
│   └── mockData.js         # 개발용 목업 데이터
├── utils/
│   └── aladinApi.js        # 알라딘 API 유틸리티
└── styles/
    └── global.css          # CSS 변수 + 리셋
```

## 다음 단계 (개발 로드맵)

- [ ] Supabase 실제 연동 (mockData → DB 조회)
- [ ] 알라딘 API 프록시 Vercel Route 추가
- [ ] 점주 인증 (점주번호 + 간단 비번 or 카카오)
- [ ] 주문 완료 → Supabase 저장 + 이메일 알림
- [ ] 결제 PG 연동 (토스페이먼츠 권장)
- [ ] 관리자 대시보드 (주문 현황, 점주 관리)
- [ ] 0.1평 점주 페이지 (개인 추천 히스토리)
