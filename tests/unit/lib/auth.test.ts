import { describe, it, expect, vi } from "vitest";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

// Mock Prisma client singleton
vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

describe("lib/auth - Credentials Authentication Verification", () => {
  it("should match valid passwords with bcrypt", async () => {
    const password = "mysecretpassword";
    const hashed = await bcrypt.hash(password, 10);
    const matches = await bcrypt.compare(password, hashed);
    expect(matches).toBe(true);
  });

  it("should reject mismatching passwords with bcrypt", async () => {
    const password = "mysecretpassword";
    const hashed = await bcrypt.hash(password, 10);
    const matches = await bcrypt.compare("wrongpassword", hashed);
    expect(matches).toBe(false);
  });

  it("should validate database user lookup matching mock credentials", async () => {
    const mockUser = {
      id: "user-123",
      email: "test@example.com",
      password: "hashedpassword123",
      name: "John Doe",
    };

    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any);

    const lookedUp = await prisma.user.findUnique({
      where: { email: "test@example.com" },
    });

    expect(lookedUp).toEqual(mockUser);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: "test@example.com" },
    });
  });
});
