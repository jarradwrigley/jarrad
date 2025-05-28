// // prisma/seed.ts
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// async function main() {
//   // 1. Create Products
//   const products = await prisma.product.createMany({
//     data: [
//       { name: "Acoustic Guitar", price: 299.99, stock: 10 },
//       { name: "Electric Keyboard", price: 499.99, stock: 5 },
//       { name: "Drum Set", price: 799.99, stock: 3 },
//     ],
//   });

//   // 2. Create Users
//   const user1 = await prisma.user.create({
//     data: {
//       email: "admin@example.com",
//       name: "Admin User",
//       role: ["admin"],
//     },
//   });

//   const user2 = await prisma.user.create({
//     data: {
//       email: "user@example.com",
//       name: "Regular User",
//       role: ["user"],
//     },
//   });

//   // 3. Add a CartItem for user2
//   const product = await prisma.product.findFirst();
//   if (product) {
//     await prisma.cartItem.create({
//       data: {
//         productId: product.id,
//         quantity: 2,
//         user: { connect: { id: user2.id } },
//       },
//     });
//   }

//   // 4. Create an Order for user2
//   await prisma.order.create({
//     data: {
//       total: 499.99,
//       user: { connect: { id: user2.id } },
//     },
//   });

//   console.log("✅ Database seeded.");
// }

// main()
//   .catch((e) => {
//     console.error("❌ Seed failed:", e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });


import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed products
  const products = await prisma.product.createMany({
    data: [
      { name: "T-Shirt", price: 25.99, stock: 100 },
      { name: "Vinyl Record", price: 49.99, stock: 50 },
      { name: "Hoodie", price: 59.99, stock: 75 },
    ],
  });

  console.log(`Seeded ${products.count} products.`);

  // Create a user
  const user = await prisma.user.create({
    data: {
      email: "fan@example.com",
      username: "superfan123",
      name: "Super Fan",
      password: "hashed-password", // Ideally, hash this
      profilePic: "https://example.com/profile.jpg",
      roles: ["user"],
    },
  });

  console.log(`Created user ${user.name} (${user.email})`);

  // Create a cart item for the user
  const product = await prisma.product.findFirst();

  if (product) {
    await prisma.cartItem.create({
      data: {
        productId: product.id,
        quantity: 2,
        userId: user.id,
      },
    });

    console.log("Created cart item.");
  }

  // Create an order for the user
  await prisma.order.create({
    data: {
      total: 99.99,
      userId: user.id,
    },
  });

  console.log("Created order.");
}

main()
  .then(() => {
    console.log("🌱 Seed completed successfully.");
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    return prisma.$disconnect().finally(() => process.exit(1));
  });
