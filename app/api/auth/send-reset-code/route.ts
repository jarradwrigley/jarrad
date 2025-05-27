import { getMockStorage } from "@/lib/mock-storage";

// Generate random 6-digit code
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  try {
    const { emailOrPhone } = await req.json();
    const storage = getMockStorage();

    if (!emailOrPhone) {
      return Response.json(
        { message: "Email or phone is required" },
        { status: 400 }
      );
    }

    // Normalize and treat as email for mock logic
    const normalizedEmail = emailOrPhone.toLowerCase();

    if (!storage.users.has(normalizedEmail)) {
      return Response.json(
        { message: "No account found with this email" },
        { status: 400 }
      );
    }

    const code = generateVerificationCode();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    storage.verificationCodes.set(normalizedEmail, { code, expiresAt });

    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay

    console.log(`Reset code for ${emailOrPhone}: ${code}`);

    return Response.json(
      {
        message: "Reset code sent successfully",
        debug: { code }, // Remove in production
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Send reset code error:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
