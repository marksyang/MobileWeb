# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 專案概述

MobileWeb 是台灣手機比價平台，列出全台灣市面上所有手機的產品資料、規格與價格比較。使用者可透過 GitHub OAuth 登入並收藏喜歡的手機。

## 技術堆疊

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript
- **Styling:** Tailwind CSS 4
- **Database:** Neon PostgreSQL (雲端-hosted)
- **ORM:** Drizzle ORM
- **Auth:** Auth.js v5 (next-auth@beta) + GitHub OAuth，自訂 PKCE 流程
- **Deployment:** Vercel (production) + Neon (database)

## 開發命令

```bash
npm run dev          # 啟動開發伺服器 (localhost:3000)
npm run build        # 生產環境建構
npm start            # 運行生產建構
npm run lint         # ESLint 檢查
npm run db:generate  # 從 schema 產生 migration SQL
npm run db:push      # 將 schema 直接推送到資料庫
npm run db:seed      # 使用 tsx seed.ts 植入初始資料
```

## 環境變數

複製 `.env.local.example` 為 `.env.local` 並填入以下變數：

- `DATABASE_URL` — Neon PostgreSQL 連線字串
- `AUTH_SECRET` — Auth.js 簽署金鑰（`openssl rand -hex 32`）
- `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` — GitHub OAuth App 憑證

## 架構說明

### 目錄結構

```
src/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # 首頁：本月 Top 20 熱門手機
│   ├── brand/[brandId]/page.tsx  # 品牌頁：列出該品牌所有手機
│   ├── phone/[phoneId]/page.tsx  # 手機詳情頁：規格、價格、收藏按鈕
│   ├── profile/page.tsx          # 個人資料頁（需登入）
│   ├── favorites/page.tsx        # 收藏列表頁（需登入）
│   ├── login/page.tsx            # 登入頁
│   └── api/                      # API Routes
│       ├── auth/                 # Auth 路由（自訂 OAuth 流程）
│       │   ├── [...nextauth]/route.ts
│       │   ├── signin/github/route.ts       # 自訂 signin，產生 PKCE code challenge
│       │   ├── callback/github/route.ts     # OAuth callback，交換 token 並建立 session
│       │   └── signout/route.ts
│       └── favorites/route.ts    # 收藏 CRUD API
├── components/
│   ├── Navbar.tsx                # 導航列，包含品牌選單與使用者選單
│   ├── PhoneCard.tsx             # 手機卡片（首頁/品牌頁共用）
│   ├── FavoriteButton.tsx        # 收藏/取消收藏按鈕
│   ├── GitHubSignIn.tsx          # GitHub 登入按鈕
│   ├── SignOutButton.tsx         # 登出按鈕
│   └── UserMenu.tsx              # 使用者選單（登入狀態、暈像）
├── db/
│   ├── index.ts                  # Drizzle DB 連線（postgres-js）
│   ├── schema.ts                 # 所有資料表 schema
│   └── queries.ts                # 資料庫查詢函數
├── lib/
│   ├── auth.ts                   # NextAuth 設定（DrizzleAdapter、callbacks）
│   ├── auth-config.ts            # 自訂 OAuth 配置（PKCE、cookie 管理、session 建立）
│   └── types.ts                  # TypeScript 類型定義
└── data/
    └── mock-data.ts              # 初始 seed 資料（品牌、手機規格）
```

### 資料庫 Schema

核心資料表（位於 `db/schema.ts`）：

- **brands** — 手機品牌（id, name, logo）
- **phones** — 手機產品（id, name, brandId, image, images[], msrp, price, ranking, specs, reviewLinks）
- **user** — Auth.js 使用者
- **account** — Auth.js 第三方帳號關聯
- **session** — Auth.js session 管理
- **verificationToken** — Auth.js 驗證 token
- **favorites** — 使用者收藏（userId + phoneId，composite PK）

`specs` 和 `images` 等欄位使用 JSONB 儲存彈性資料。

### 認證流程（重要）

由於 Next.js 16 的 catch-all 路由與 Auth.js v5 beta 有相容性問題，專案使用**自訂 OAuth 路由**而非 Auth.js 內建路由：

1. 使用者點擊登入 → `/api/signin/github` 產生 PKCE codeChallenge 並重定向至 GitHub
2. GitHub 回調 → `/api/auth/callback/github` 驗證 state、交換 token、建立/更新使用者和 session
3. Session 儲存在 PostgreSQL `session` 表，cookie 名稱為 `authjs.session-token`
4. 登出 → `/api/auth/signout` 刪除 session 記錄

**middleware.ts** 使用 `auth()` 保護 `/profile` 和 `/favorites` 路由。

### 資料流程

所有手機資料透過 `seed.ts` 植入 Neon 資料庫，來源參考手機王（sogi.com.tw）和傑昇通訊（jyes.com.tw）。`src/db/queries.ts` 提供所有查詢函數，各頁面直接使用（Server Component 模式）。

### Seed 資料

`seed.ts` 位於專案根目錄，包含所有品牌與手機的初始資料。修改 schema 後需執行 `npm run db:generate && npm run db:push`。

## 資料來源參考

- 手機王：https://www.sogi.com.tw/
- 傑昇通訊：https://www.jyes.com.tw/
