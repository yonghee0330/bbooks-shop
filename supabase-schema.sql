-- =========================================================
-- bbooks-shop Supabase 스키마
-- 실행: Supabase Dashboard > SQL Editor에서 붙여넣기
-- =========================================================

-- ── 0.1평 점주 ────────────────────────────────────────────
CREATE TABLE owners (
  id          SERIAL PRIMARY KEY,
  number      INT UNIQUE NOT NULL,          -- 점주 번호 (1~100)
  nickname    TEXT NOT NULL,
  email       TEXT UNIQUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── 0.1평 점주 추천 (주 1회) ──────────────────────────────
CREATE TABLE owner_picks (
  id          SERIAL PRIMARY KEY,
  owner_id    INT REFERENCES owners(id),
  week        TEXT NOT NULL,               -- 예: '2024-W50'
  isbn        TEXT,
  book_title  TEXT NOT NULL,
  author      TEXT,
  publisher   TEXT,
  price       INT,
  cover_url   TEXT,
  comment     TEXT,                        -- 점주 추천 코멘트
  is_visible  BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(owner_id, week)                   -- 주당 1권 제한
);

-- ── 비북스 큐레이션 ──────────────────────────────────────
CREATE TABLE bbooks_picks (
  id          SERIAL PRIMARY KEY,
  month       TEXT NOT NULL,               -- 예: '2024-12'
  isbn        TEXT,
  book_title  TEXT NOT NULL,
  author      TEXT,
  price       INT,
  cover_url   TEXT,
  comment     TEXT,
  sort_order  INT DEFAULT 0,
  is_visible  BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── 전문 큐레이터 ─────────────────────────────────────────
CREATE TABLE curators (
  id          TEXT PRIMARY KEY,             -- 'swim', 'emile' 등
  name        TEXT NOT NULL,
  bio         TEXT,
  color       TEXT,                         -- 브랜드 컬러 hex
  is_active   BOOLEAN DEFAULT TRUE
);

CREATE TABLE curator_picks (
  id          SERIAL PRIMARY KEY,
  curator_id  TEXT REFERENCES curators(id),
  month       TEXT NOT NULL,
  isbn        TEXT,
  book_title  TEXT NOT NULL,
  author      TEXT,
  price       INT,
  cover_url   TEXT,
  comment     TEXT,
  sort_order  INT DEFAULT 0,
  is_visible  BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── 주문 ──────────────────────────────────────────────────
CREATE TABLE orders (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_name    TEXT NOT NULL,
  buyer_phone   TEXT NOT NULL,
  addr          TEXT NOT NULL,
  addr_detail   TEXT,
  memo          TEXT,
  pay_method    TEXT,
  subtotal      INT NOT NULL,
  shipping_fee  INT DEFAULT 3000,
  total         INT NOT NULL,
  status        TEXT DEFAULT 'pending',     -- pending / paid / shipped / done
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_items (
  id          SERIAL PRIMARY KEY,
  order_id    UUID REFERENCES orders(id),
  isbn        TEXT,
  book_title  TEXT NOT NULL,
  author      TEXT,
  price       INT NOT NULL,
  qty         INT NOT NULL DEFAULT 1,
  source_type TEXT,                          -- 'owner' | 'bbooks' | 'pro' | 'search'
  source_name TEXT                           -- 점주 닉네임 또는 큐레이터명
);

-- ── Row Level Security (RLS) 기본 설정 ───────────────────
ALTER TABLE owner_picks  ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders       ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items  ENABLE ROW LEVEL SECURITY;

-- 공개 읽기 허용 (쇼핑 페이지 조회용)
CREATE POLICY "public read owner_picks"  ON owner_picks  FOR SELECT USING (is_visible = TRUE);
CREATE POLICY "public read bbooks_picks" ON bbooks_picks FOR SELECT USING (is_visible = TRUE);
CREATE POLICY "public read curator_picks" ON curator_picks FOR SELECT USING (is_visible = TRUE);

-- ── 인덱스 ────────────────────────────────────────────────
CREATE INDEX idx_owner_picks_week    ON owner_picks(week);
CREATE INDEX idx_bbooks_picks_month  ON bbooks_picks(month);
CREATE INDEX idx_curator_picks_month ON curator_picks(month, curator_id);
CREATE INDEX idx_orders_status       ON orders(status);

-- ── 초기 데이터 (큐레이터) ───────────────────────────────
INSERT INTO curators VALUES
  ('swim',  '헤엄치는뜰', '자연, 생태, 비인간 존재에 관한 깊은 독서', '#4a6741', TRUE),
  ('emile', '에밀',       '철학, 고전, 미디어 비평을 아우르는 큐레이션', '#b8862e', TRUE);
