/**
 * Database seed script
 *
 * Populates the Neon PostgreSQL database with phone and brand data.
 *
 * Usage:
 *   npm run db:seed              # Skip if data exists
 *   npm run db:seed -- --force   # Clear and re-insert all data
 */
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { count } from "drizzle-orm";
import * as schema from "./src/db/schema";
import { brands, phones, favorites, cartItems, orders, orderItems } from "./src/db/schema";
import { PHONE_DATA, BRANDS } from "./src/data/phone-data";

const shouldForce = process.argv.includes("--force");

async function main() {
  console.log("🌱 Starting database seed...");
  console.log("☕ Creating database connection...");

  // Create postgres client with connection settings for Neon
  const client = postgres(process.env.DATABASE_URL!, {
    max: 1,
    max_lifetime: null,
    connect_timeout: 30,
  });

  // Warmup query
  try {
    await client`SELECT 1`;
    console.log("✅ Connection established.");
  } catch {
    console.log("⏳ First connection attempt failed, retrying...");
    await new Promise((r) => setTimeout(r, 3000));
    await client`SELECT 1`;
    console.log("✅ Connection established after retry.");
  }

  const db = drizzle(client, { schema, casing: "snake_case" });

  // Use the same client for all operations
  const [result] = await db.select({ count: count() }).from(brands);
  const existingBrands = Number(result.count);

  if (existingBrands > 0 && !shouldForce) {
    console.log(`⏭ Brands already seeded (${existingBrands} records). Skipping.`);
    console.log("   Use --force to re-seed: npm run db:seed -- --force");
    await client.end();
    return;
  }

  if (shouldForce && existingBrands > 0) {
    console.log("🗑  --force flag detected. Clearing existing data...");
    // Delete in correct order to satisfy foreign key constraints
    await db.delete(orderItems);
    await db.delete(orders);
    await db.delete(cartItems);
    await db.delete(favorites);
    await db.delete(phones);
    await db.delete(brands);
    console.log("✅ Existing data cleared.");
  }

  // Seed brands
  console.log(`📦 Inserting ${BRANDS.length} brands...`);
  for (const brand of BRANDS) {
    await db.insert(brands).values(brand);
    console.log(`  ✓ ${brand.logo} ${brand.name}`);
  }

  // Seed phones
  console.log(`📱 Inserting ${PHONE_DATA.length} phones...`);
  for (const phone of PHONE_DATA) {
    await db.insert(phones).values({
      id: phone.id,
      name: phone.name,
      brandId: phone.brand,
      image: phone.image,
      images: phone.images,
      msrp: phone.msrp,
      price: phone.price,
      ranking: phone.ranking,
      specs: phone.specs,
      reviewLinks: phone.reviewLinks,
    });
  }
  console.log(`  ✓ ${PHONE_DATA.length} phones inserted.`);

  // Summary
  const brandSummary = new Map<string, number>();
  for (const phone of PHONE_DATA) {
    brandSummary.set(phone.brand, (brandSummary.get(phone.brand) ?? 0) + 1);
  }
  console.log("\n📊 Summary by brand:");
  for (const [brandId, cnt] of brandSummary.entries()) {
    const brandInfo = BRANDS.find((b) => b.id === brandId);
    console.log(`  ${brandInfo?.logo} ${brandInfo?.name}: ${cnt} phones`);
  }

  console.log(`\n✅ Seed complete! ${BRANDS.length} brands, ${PHONE_DATA.length} phones inserted.`);
  await client.end();
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  });
