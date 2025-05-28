// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 1. Create Products
  const products = await prisma.product.createMany({
    data: [
      { name: "Acoustic Guitar", price: 299.99, stock: 10 },
      { name: "Electric Keyboard", price: 499.99, stock: 5 },
      { name: "Drum Set", price: 799.99, stock: 3 },
    ],
  });

  // 2. Create Users
  const user1 = await prisma.user.create({
    data: {
      email: "admin@example.com",
      name: "Admin User",
      role: ["admin"],
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "user@example.com",
      name: "Regular User",
      role: ["user"],
    },
  });

  // 3. Add a CartItem for user2
  const product = await prisma.product.findFirst();
  if (product) {
    await prisma.cartItem.create({
      data: {
        productId: product.id,
        quantity: 2,
        user: { connect: { id: user2.id } },
      },
    });
  }

  // 4. Create an Order for user2
  await prisma.order.create({
    data: {
      total: 499.99,
      user: { connect: { id: user2.id } },
    },
  });

  console.log("✅ Database seeded.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
