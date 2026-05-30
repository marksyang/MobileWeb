# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 專案概述

MobileWeb 是台灣手機比價平台，列出全台灣市面上所有手機的產品資料、規格與價格比較。使用者可透過 GitHub OAuth 登入，收藏喜歡的手機、管理購物車、下單購買與追蹤訂單物流。

## 技術堆疊

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript
- **Styling:** Tailwind CSS 4（深色主題，自訂 color palette）
- **Database:** Neon PostgreSQL（雲端-hosted）
- **ORM:** Drizzle ORM
- **Auth:** Auth.js v5 (next-auth@beta) + GitHub OAuth，自訂 PKCE 流程
- **Deployment:** Vercel（production）+ Neon（database）

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
│   ├── layout.tsx                # RootLayout：Navbar + footer，zh-TW，Google Fonts
│   ├── page.tsx                  # 首頁：本月 Top 20 熱門手機
│   ├── brand/[brandId]/page.tsx  # 品牌頁：列出該品牌所有手機
│   ├── phone/[phoneId]/page.tsx  # 手機詳情頁：規格、價格、收藏/購物車按鈕
│   ├── login/page.tsx            # 登入頁
│   ├── profile/page.tsx          # 個人資料頁（需登入）：編輯姓名/電話/地址
│   ├── favorites/page.tsx        # 收藏列表頁（需登入）
│   ├── account/page.tsx          # 帳戶管理頁（需登入）：檢視/編輯帳號資料
│   ├── cart/page.tsx             # 購物車頁（需登入）：管理商品、數量、清除
│   ├── checkout/page.tsx         # 結帳頁（需登入）：配送資訊 + 信用卡表單
│   ├── checkout/success/page.tsx # 訂單成功頁
│   ├── orders/page.tsx           # 訂單列表頁（需登入）
│   ├── orders/[orderId]/tracking/page.tsx  # 物流追蹤頁（含 dummy 物流資料）
│   ├── globals.css               # Tailwind CSS 4，深色主題，自訂 color/font
│   └── api/                      # API Routes
│       ├── auth/                 # Auth 路由（自訂 OAuth 流程）
│       │   ├── [...nextauth]/route.ts  # 導出 NextAuth handlers（向後相容）
│       │   ├── signin/github/route.ts  # 自訂 signin，產生 PKCE code challenge
│       │   ├── callback/github/route.ts # OAuth callback，交換 token 並建立 session
│       │   └── signout/route.ts        # 刪除 session 記錄
│       ├── favorites/route.ts    # 收藏 CRUD API
│       ├── cart/route.ts         # 購物車 CRUD API（新增/更新/刪除/清空）
│       ├── checkout/route.ts     # 建立訂單，清空購物車
│       ├── orders/route.ts       # 訂單列表查詢 + 取消訂單
│       └── account/route.ts      # 帳戶資料 GET/PUT
├── components/
│   ├── Navbar.tsx                # 導航列：品牌選單 + 購物車徽章 + 使用者選單
│   ├── PhoneCard.tsx             # 手機卡片（首頁/品牌頁共用，含 rank/discount badge）
│   ├── FavoriteButton.tsx        # 收藏/取消收藏按鈕（Client Component）
│   ├── CartButton.tsx            # 加入購物車按鈕（Client Component）
│   ├── CartItemRow.tsx           # 購物車單行（Client Component）
│   ├── CheckoutForm.tsx          # 結帳表單：信用卡 + 配送（Client Component）
│   ├── ProfileForm.tsx           # 個人資料表單（Client Component）
│   ├── OrderCard.tsx             # 訂單卡片（顯示訂單明細、狀態）
│   ├── CancelOrderButton.tsx     # 取消訂單按鈕（Client Component）
│   ├── GitHubSignIn.tsx          # GitHub 登入按鈕
│   ├── SignOutButton.tsx         # 登出按鈕（Client Component）
│   └── UserMenu.tsx              # 使用者下拉選單（Client Component）
├── db/
│   ├── index.ts                  # Drizzle DB 連線（postgres-js，snake_case）
│   ├── schema.ts                 # 所有資料表 schema（re-export 到 db/schema.ts）
│   └── queries.ts                # 資料庫查詢函數
├── lib/
│   ├── auth.ts                   # auth()：讀 cookie + DB session 查詢；同时導出 NextAuth config
│   ├── auth-config.ts            # 自訂 OAuth 配置（PKCE、cookie 管理、session 建立）
│   └── types.ts                  # TypeScript 類型定義（Phone, Order, CartItem 等）
└── data/
    └── mock-data.ts              # 初始 seed 資料（8 品牌、20 手機）
```

### 資料庫 Schema（10 張表）

所有 schema 位於 `src/db/schema.ts`，`db/schema.ts` 為 re-export 供 drizzle-kit 使用。

**核心資料表：**
- **brands** — 手機品牌（id, name, logo）
- **phones** — 手機產品（id, name, brandId, image, images[], msrp, price, ranking, specs, reviewLinks, created_at, updated_at）
- **favorites** — 使用者收藏（id, userId, phoneId, createdAt）
- **cartItems** — 購物車（id, userId, phoneId, quantity, createdAt）
- **orders** — 訂單（id, userId, totalAmount, status, shippingName, shippingPhone, shippingAddress, paymentMethod, createdAt）
- **orderItems** — 訂單明細（id, orderId, phoneId, phoneName, phoneImage, price, quantity）
- **userProfile** — 使用者聯絡資料（userId, name, phone, address, updated_at）

**Auth 資料表：**
- **user** — Auth.js 使用者
- **account** — Auth.js 第三方帳號關聯
- **session** — Auth.js session 管理
- **verificationToken** — Auth.js 驗證 token

`specs`、`images`、`reviewLinks` 等欄位使用 JSONB 儲存彈性資料。

### 認證流程（重要）

由於 Next.js 16 的 catch-all 路由與 Auth.js v5 beta 有相容性問題，專案使用**自訂 OAuth 路由**而非 Auth.js 內建路由：

1. 使用者點擊登入 → `/api/signin/github` 產生 PKCE codeChallenge 並重定向至 GitHub
2. GitHub 回調 → `/api/auth/callback/github` 驗證 state、交換 token、建立/更新使用者和 session
3. Session 儲存在 PostgreSQL `session` 表，cookie 名稱為 `authjs.session-token`（定義於 `auth-config.ts` 的 `sessionCookieName`）
4. 登出 → `/api/auth/signout` 刪除 session 記錄
5. `src/lib/auth.ts` 的 `auth()` 函數讀取 cookie + 查詢 DB 回傳 session 資料

**middleware.ts** 使用 cookie 檢查保護以下路由：
`/profile`、`/favorites`、`/cart`、`/checkout`、`/checkout/success`、`/account`、`/orders`、`/orders/:path*`

### 購物車與訂單流程

1. 使用者在手機詳情頁點擊「加入購物車」→ 呼叫 `/api/cart` 新增/更新購物車項目
2. 在購物車頁管理商品數量或清空購物車
3. 前往結帳頁，填寫配送資訊與信用卡資料（含驗證）
4. 提交訂單 → `/api/checkout` 建立訂單記錄 + 訂單明細，並清空購物車
5. 跳转至成功頁，可在訂單列表頁檢視所有訂單與取消未出貨訂單
6. 物流追蹤頁顯示 dummy 物流資料

### 資料流程

所有手機資料透過 `seed.ts`（專案根目錄）植入 Neon 資料庫，來源參考手機王和傑昇通訊。`src/db/queries.ts` 提供所有查詢函數，各頁面直接使用（Server Component 模式）。

## 資料來源參考

- 手機王：https://www.sogi.com.tw/
- 傑昇通訊：https://www.jyes.com.tw/
