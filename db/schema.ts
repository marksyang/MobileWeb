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
