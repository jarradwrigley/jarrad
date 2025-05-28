// app/admin/dashboard/page.tsx
import getServerSession from "next-auth";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect } from "react";

export default async function AdminDashboardPage() {
  //   const session = await getServerSession(authOptions);
  const session = await auth();

  console.log("ppp", session?.user?.roles);

  // if (!session || session?.user?.roles.includes("admin")) {
  //   return redirect("/login");
  // }

  const users = await prisma.user.findMany();
  const products = await prisma.product.findMany();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-2">Users</h2>
            <ul className="space-y-2">
              {users.map((user: any) => (
                <li key={user.id} className="flex justify-between">
                  <span>{user.email}</span>
                  <span className="text-sm text-gray-500">{user.role}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-2">Inventory</h2>
            <ul className="space-y-2">
              {products.map((product: any) => (
                <li key={product.id} className="flex justify-between">
                  <span>{product.name}</span>
                  <span className="text-sm text-gray-500">
                    ${product.price}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
