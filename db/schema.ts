import {
  pgTable,
  varchar,
  integer,
  jsonb,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const brands = pgTable("brands", {
  id: varchar("id", { length: 50 }).primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  logo: text("logo").notNull(),
});

export const phones = pgTable("phones", {
  id: varchar("id", { length: 100 }).primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  brandId: varchar("brand_id", { length: 50 })
    .notNull()
    .references(() => brands.id),
  image: text("image").notNull(),
  images: jsonb("images").notNull().default([]),
  msrp: integer("msrp").notNull(),
  price: integer("price").notNull(),
  ranking: integer("ranking"),
  specs: jsonb("specs").notNull(),
  reviewLinks: jsonb("review_links").notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// Auth.js tables
export const user = pgTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    withTimezone: true,
  }),
  image: text("image"),
});

export const account = pgTable("account", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  userId: varchar("userId", { length: 255 })
    .notNull()
    .references(() => user.id),
  type: varchar("type", { length: 50 }).notNull(),
  provider: varchar("provider", { length: 50 }).notNull(),
  providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: varchar("token_type", { length: 20 }),
  scope: varchar("scope", { length: 255 }),
  session_state: varchar("session_state", { length: 255 }),
  oauth_token: varchar("oauth_token", { length: 255 }),
  oauth_secret: varchar("oauth_secret", { length: 255 }),
});

export const session = pgTable("session", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  sessionToken: varchar("sessionToken", { length: 255 }).notNull().unique(),
  userId: varchar("userId", { length: 255 })
    .notNull()
    .references(() => user.id),
  expires: timestamp("expires", { mode: "date", withTimezone: true }).notNull(),
});

export const verificationToken = pgTable("verificationToken", {
  identifier: varchar("identifier", { length: 255 }).notNull(),
  token: varchar("token", { length: 255 }).notNull(),
  expires: timestamp("expires", { mode: "date", withTimezone: true }).notNull(),
});

// Favorites (Wishlist)
export const favorites = pgTable("favorites", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("userId", { length: 255 })
    .notNull()
    .references(() => user.id),
  phoneId: varchar("phoneId", { length: 100 })
    .notNull()
    .references(() => phones.id),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// Shopping Cart
export const cartItems = pgTable("cartItems", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("userId", { length: 255 })
    .notNull()
    .references(() => user.id),
  phoneId: varchar("phoneId", { length: 100 })
    .notNull()
    .references(() => phones.id),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// Orders
export const orders = pgTable("orders", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("userId", { length: 255 })
    .notNull()
    .references(() => user.id),
  totalAmount: integer("totalAmount").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  shippingName: varchar("shippingName", { length: 100 }).notNull(),
  shippingPhone: varchar("shippingPhone", { length: 20 }).notNull(),
  shippingAddress: text("shippingAddress").notNull(),
  paymentMethod: varchar("paymentMethod", { length: 20 }).notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const orderItems = pgTable("orderItems", {
  id: varchar("id", { length: 255 }).primaryKey(),
  orderId: varchar("orderId", { length: 255 })
    .notNull()
    .references(() => orders.id),
  phoneId: varchar("phoneId", { length: 100 })
    .notNull()
    .references(() => phones.id),
  phoneName: varchar("phoneName", { length: 200 }).notNull(),
  phoneImage: text("phoneImage").notNull(),
  price: integer("price").notNull(),
  quantity: integer("quantity").notNull(),
});
