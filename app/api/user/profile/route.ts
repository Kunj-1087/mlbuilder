import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { z } from "zod";

const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email format"),
  image: z.string().nullable().optional(),
});

export async function PATCH(request: Request) {
  console.log("PATCH /api/user/profile - request received");
  try {
    console.log("PATCH - retrieving session");
    const session = await auth();
    console.log("PATCH - session retrieved:", session?.user?.id);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    console.log("PATCH - request body parsed:", body);
    const parsed = updateProfileSchema.safeParse(body);

    if (!parsed.success) {
      console.log("PATCH - schema validation failed");
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, image } = parsed.data;
    const userId = session.user.id;

    // Check email uniqueness if email is changed
    console.log("PATCH - checking email change from", session.user.email, "to", email);
    if (email.toLowerCase() !== session.user.email?.toLowerCase()) {
      console.log("PATCH - looking up existing user by email:", email);
      const existingUser = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });
      console.log("PATCH - lookup completed. Found user id:", existingUser?.id);

      if (existingUser && existingUser.id !== userId) {
        return NextResponse.json(
          { error: "This email address is already registered to another account." },
          { status: 400 }
        );
      }
    }

    // Update in database
    console.log("PATCH - updating user in DB:", userId);
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email: email.toLowerCase(),
        image,
      },
    });
    console.log("PATCH - DB update completed successfully");

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        image: updatedUser.image,
      },
    });
  } catch (error: any) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id || !session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = session.user.id;
    const userEmail = session.user.email;

    // Delete user from DB
    await prisma.user.delete({
      where: { id: userId },
    });

    // Send confirmation email
    await sendEmail({
      to: userEmail,
      subject: "Confirm account deletion — MLBuilder",
      html: "<p>We are sorry to see you go. Your account has been permanently deleted.</p>",
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Account deletion error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
