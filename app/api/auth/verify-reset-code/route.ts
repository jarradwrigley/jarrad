import { getMockStorage } from "@/lib/mock-storage";

export async function POST(req: Request) {
  try {
    const { emailOrPhone, verificationCode } = await req.json();
    const storage = getMockStorage();

    if (!emailOrPhone || !verificationCode) {
      return Response.json(
        { message: "Email and verification code are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = emailOrPhone.toLowerCase();
    const storedData = storage.verificationCodes.get(normalizedEmail);

    if (!storedData) {
      return Response.json(
        { message: "No verification code found" },
        { status: 400 }
      );
    }

    if (Date.now() > storedData.expiresAt) {
      storage.verificationCodes.delete(normalizedEmail);
      return Response.json(
        { message: "Verification code has expired" },
        { status: 400 }
      );
    }

    if (storedData.code !== verificationCode) {
      return Response.json(
        { message: "Invalid verification code" },
        { status: 400 }
      );
    }

    storage.verifiedResets.add(normalizedEmail);

    await new Promise((resolve) => setTimeout(resolve, 500));

    return Response.json(
      { message: "Code verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verify reset code error:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
