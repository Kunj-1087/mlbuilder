import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";
import bcrypt from "bcryptjs";

const TEST_DB_URL = process.env.TEST_DATABASE_URL || "postgresql://postgres:postgres@127.0.0.1:5432/mlbuilder_test?schema=public";

// Create a client bound specifically to the test database
export const testPrisma = new PrismaClient({
  datasources: {
    db: {
      url: TEST_DB_URL,
    },
  },
});

/**
 * Initialize test database schema using prisma db push.
 * This runs before E2E or unit suites are executed.
 */
export function setupTestDb() {
  try {
    console.log("🔄 Aligning test database schema...");
    execSync("npx prisma db push --accept-data-loss --skip-generate", {
      env: {
        ...process.env,
        DATABASE_URL: TEST_DB_URL,
      },
      stdio: "inherit",
    });
    console.log("✅ Test database schema is aligned.");
  } catch (error) {
    console.error("❌ Failed to push schema to test database:", error);
    throw error;
  }
}

/**
 * Clean all data in the test database by truncating all user tables.
 */
export async function resetTestDb() {
  try {
    const tablenames = await testPrisma.$queryRaw<Array<{ tablename: string }>>`
      SELECT tablename FROM pg_tables WHERE schemaname='public'
    `;

    const tables = tablenames
      .map(({ tablename }) => tablename)
      .filter((name) => name !== "_prisma_migrations")
      .map((name) => `"public"."${name}"`)
      .join(", ");

    if (tables) {
      await testPrisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`);
    }
  } catch (error) {
    console.error("❌ Failed to reset test database data:", error);
    throw error;
  }
}

/**
 * Seed a known test user with pre-hashed credentials.
 */
export async function seedTestUser(email = "test@example.com", password = "password123", name = "Test User") {
  const hashedPassword = await bcrypt.hash(password, 10);
  return await testPrisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    },
  });
}
