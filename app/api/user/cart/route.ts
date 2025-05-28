import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth"; // Import the auth function

export async function GET() {
  const session = await auth(); // Use auth() directly, no parameters needed

  if (!session?.user?.email) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { cart: true },
  });

  return Response.json(user?.cart || []);
}
