import { testPrisma } from "../test-database";
import { testUsers } from "../fixtures/users";
import { testLeadMagnets } from "../fixtures/leadMagnets";
import { testBlogPosts } from "../fixtures/blogPosts";
import bcrypt from "bcryptjs";

/**
 * Seeds the test database with all fixtures for integration/E2E testing.
 */
export async function seedTestDb() {
  console.log("🌱 Seeding test database fixtures...");

  // 1. Clear existing data in correct dependency order
  await testPrisma.accountDeletion.deleteMany();
  await testPrisma.emailChange.deleteMany();
  await testPrisma.passwordResetToken.deleteMany();
  await testPrisma.platformVote.deleteMany();
  await testPrisma.searchLog.deleteMany();
  await testPrisma.leadMagnetClaim.deleteMany();
  await testPrisma.leadMagnet.deleteMany();
  await testPrisma.post.deleteMany();
  await testPrisma.session.deleteMany();
  await testPrisma.account.deleteMany();
  await testPrisma.subscriber.deleteMany();
  await testPrisma.user.deleteMany();

  // 2. Seed Users
  const regularPasswordHash = await bcrypt.hash(testUsers.regular.password, 10);
  const regularUser = await testPrisma.user.create({
    data: {
      email: testUsers.regular.email,
      name: testUsers.regular.name,
      password: regularPasswordHash,
    },
  });

  const anotherPasswordHash = await bcrypt.hash(testUsers.another.password, 10);
  await testPrisma.user.create({
    data: {
      email: testUsers.another.email,
      name: testUsers.another.name,
      password: anotherPasswordHash,
    },
  });

  // 3. Seed Posts
  for (const post of testBlogPosts) {
    await testPrisma.post.create({
      data: {
        id: post.id,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        category: post.category,
        published: post.published,
        authorId: regularUser.id,
      },
    });
  }

  // 4. Seed Lead Magnets
  for (const magnet of testLeadMagnets) {
    await testPrisma.leadMagnet.create({
      data: {
        id: magnet.id,
        slug: magnet.slug,
        title: magnet.title,
        tagline: magnet.title,
        description: magnet.description,
        filePath: magnet.downloadUrl,
        fileSizeKb: magnet.fileSizeKb,
        coverColor: magnet.coverColor,
        coverEmoji: magnet.coverEmoji,
        whatYouLearn: magnet.bullets,
        status: magnet.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT",
      },
    });
  }

  console.log("✅ Seeding test database completed.");
}

// Allow running this script directly
if (require.main === module || (process.argv && process.argv[1] && process.argv[1].includes("seed.ts"))) {
  seedTestDb()
    .catch((err) => {
      console.error("❌ Seeding failed:", err);
      process.exit(1);
    })
    .finally(async () => {
      await testPrisma.$disconnect();
    });
}
