// // app/admin/dashboard/page.tsx
// import getServerSession from "next-auth";
// import { auth } from "@/lib/auth";
// import { prisma } from "@/lib/prisma";
// import { redirect } from "next/navigation";
// import { Card, CardContent } from "@/components/ui/card";
// import { useEffect } from "react";

// export default async function AdminDashboardPage() {
//   //   const session = await getServerSession(authOptions);
//   const session = await auth();

//   console.log("ppp", session?.user?.roles);

//   // if (!session || session?.user?.roles.includes("admin")) {
//   //   return redirect("/login");
//   // }

//   const users = await prisma.user.findMany();
//   const products = await prisma.product.findMany();

//   return (
//     <div className="p-6 space-y-6">
//       <h1 className="text-3xl font-bold">Admin Dashboard</h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <Card>
//           <CardContent className="p-4">
//             <h2 className="text-xl font-semibold mb-2">Users</h2>
//             <ul className="space-y-2">
//               {users.map((user: any) => (
//                 <li key={user.id} className="flex justify-between">
//                   <span>{user.email}</span>
//                   <span className="text-sm text-gray-500">{user.role}</span>
//                 </li>
//               ))}
//             </ul>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="p-4">
//             <h2 className="text-xl font-semibold mb-2">Inventory</h2>
//             <ul className="space-y-2">
//               {products.map((product: any) => (
//                 <li key={product.id} className="flex justify-between">
//                   <span>{product.name}</span>
//                   <span className="text-sm text-gray-500">
//                     ${product.price}
//                   </span>
//                 </li>
//               ))}
//             </ul>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }


// app/admin/page.tsx
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Plus, Users, Package } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function AdminDashboardPage() {
  const session = await auth();

  // Uncomment and modify this check as needed
  // if (!session || !session?.user?.roles?.includes("admin")) {
  //   return redirect("/login");
  // }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      roles: true,
      profilePic: true,
      _count: {
        select: {
          orders: true,
          cart: true,
        },
      },
    },
  });

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Server Actions
  async function createUser(formData: FormData) {
    "use server";
    
    const email = formData.get("email") as string;
    const username = formData.get("username") as string;
    const name = formData.get("name") as string;
    const password = formData.get("password") as string;
    const roles = formData.getAll("roles") as string[];
    const profilePic = formData.get("profilePic") as string;

    try {
      await prisma.user.create({
        data: {
          email,
          username,
          name,
          password, // In production, hash this password
          roles: roles.length > 0 ? roles : ["user"],
          profilePic: profilePic || "",
        },
      });
      revalidatePath("/admin");
    } catch (error) {
      console.error("Error creating user:", error);
    }
  }

  async function updateUser(formData: FormData) {
    "use server";
    
    const id = formData.get("id") as string;
    const email = formData.get("email") as string;
    const username = formData.get("username") as string;
    const name = formData.get("name") as string;
    const roles = formData.getAll("roles") as string[];
    const profilePic = formData.get("profilePic") as string;

    try {
      await prisma.user.update({
        where: { id },
        data: {
          email,
          username,
          name,
          roles: roles.length > 0 ? roles : ["user"],
          profilePic,
        },
      });
      revalidatePath("/admin");
    } catch (error) {
      console.error("Error updating user:", error);
    }
  }

  async function deleteUser(formData: FormData) {
    "use server";
    
    const id = formData.get("id") as string;

    try {
      await prisma.user.delete({
        where: { id },
      });
      revalidatePath("/admin");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }

  async function createProduct(formData: FormData) {
    "use server";
    
    const name = formData.get("name") as string;
    const price = parseFloat(formData.get("price") as string);
    const stock = parseInt(formData.get("stock") as string);

    try {
      await prisma.product.create({
        data: {
          name,
          price,
          stock,
        },
      });
      revalidatePath("/admin");
    } catch (error) {
      console.error("Error creating product:", error);
    }
  }

  async function updateProduct(formData: FormData) {
    "use server";
    
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const price = parseFloat(formData.get("price") as string);
    const stock = parseInt(formData.get("stock") as string);

    try {
      await prisma.product.update({
        where: { id },
        data: {
          name,
          price,
          stock,
        },
      });
      revalidatePath("/admin");
    } catch (error) {
      console.error("Error updating product:", error);
    }
  }

  async function deleteProduct(formData: FormData) {
    "use server";
    
    const id = formData.get("id") as string;

    try {
      await prisma.product.delete({
        where: { id },
      });
      revalidatePath("/admin");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-sm">
            <Users className="w-4 h-4 mr-1" />
            {users.length} Users
          </Badge>
          <Badge variant="outline" className="text-sm">
            <Package className="w-4 h-4 mr-1" />
            {products.length} Products
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="products">Product Management</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Users</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New User</DialogTitle>
                    </DialogHeader>
                    <form action={createUser} className="space-y-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" required />
                      </div>
                      <div>
                        <Label htmlFor="username">Username</Label>
                        <Input id="username" name="username" required />
                      </div>
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" name="name" required />
                      </div>
                      <div>
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" name="password" type="password" required />
                      </div>
                      <div>
                        <Label htmlFor="profilePic">Profile Picture URL</Label>
                        <Input id="profilePic" name="profilePic" />
                      </div>
                      <div>
                        <Label>Roles</Label>
                        <div className="flex gap-2 mt-2">
                          <label className="flex items-center gap-2">
                            <input type="checkbox" name="roles" value="user" defaultChecked />
                            User
                          </label>
                          <label className="flex items-center gap-2">
                            <input type="checkbox" name="roles" value="admin" />
                            Admin
                          </label>
                        </div>
                      </div>
                      <Button type="submit" className="w-full">Create User</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user: any) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        {user.profilePic ? (
                          <img src={user.profilePic} alt={user.name} className="w-10 h-10 rounded-full" />
                        ) : (
                          <Users className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold">{user.name}</div>
                        <div className="text-sm text-gray-500">@{user.username}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex gap-1">
                          {user.roles.map((role: any) => (
                            <Badge key={role} variant={role === "admin" ? "default" : "secondary"}>
                              {role}
                            </Badge>
                          ))}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {user._count.orders} orders, {user._count.cart} cart items
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit User</DialogTitle>
                            </DialogHeader>
                            <form action={updateUser} className="space-y-4">
                              <input type="hidden" name="id" value={user.id} />
                              <div>
                                <Label htmlFor={`email-${user.id}`}>Email</Label>
                                <Input id={`email-${user.id}`} name="email" type="email" defaultValue={user.email} required />
                              </div>
                              <div>
                                <Label htmlFor={`username-${user.id}`}>Username</Label>
                                <Input id={`username-${user.id}`} name="username" defaultValue={user.username} required />
                              </div>
                              <div>
                                <Label htmlFor={`name-${user.id}`}>Name</Label>
                                <Input id={`name-${user.id}`} name="name" defaultValue={user.name} required />
                              </div>
                              <div>
                                <Label htmlFor={`profilePic-${user.id}`}>Profile Picture URL</Label>
                                <Input id={`profilePic-${user.id}`} name="profilePic" defaultValue={user.profilePic} />
                              </div>
                              <div>
                                <Label>Roles</Label>
                                <div className="flex gap-2 mt-2">
                                  <label className="flex items-center gap-2">
                                    <input type="checkbox" name="roles" value="user" defaultChecked={user.roles.includes("user")} />
                                    User
                                  </label>
                                  <label className="flex items-center gap-2">
                                    <input type="checkbox" name="roles" value="admin" defaultChecked={user.roles.includes("admin")} />
                                    Admin
                                  </label>
                                </div>
                              </div>
                              <Button type="submit" className="w-full">Update User</Button>
                            </form>
                          </DialogContent>
                        </Dialog>
                        <form action={deleteUser} className="inline">
                          <input type="hidden" name="id" value={user.id} />
                          <Button variant="destructive" size="sm" type="submit">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </form>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Products</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Product</DialogTitle>
                    </DialogHeader>
                    <form action={createProduct} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Product Name</Label>
                        <Input id="name" name="name" required />
                      </div>
                      <div>
                        <Label htmlFor="price">Price</Label>
                        <Input id="price" name="price" type="number" step="0.01" min="0" required />
                      </div>
                      <div>
                        <Label htmlFor="stock">Stock</Label>
                        <Input id="stock" name="stock" type="number" min="0" required />
                      </div>
                      <Button type="submit" className="w-full">Create Product</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {products.map((product: any) => (
                  <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <Package className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold">{product.name}</div>
                        <div className="text-sm text-gray-500">
                          Created: {new Date(product.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-semibold">${product.price.toFixed(2)}</div>
                        <div className="text-sm text-gray-500">
                          Stock: {product.stock}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Product</DialogTitle>
                            </DialogHeader>
                            <form action={updateProduct} className="space-y-4">
                              <input type="hidden" name="id" value={product.id} />
                              <div>
                                <Label htmlFor={`name-${product.id}`}>Product Name</Label>
                                <Input id={`name-${product.id}`} name="name" defaultValue={product.name} required />
                              </div>
                              <div>
                                <Label htmlFor={`price-${product.id}`}>Price</Label>
                                <Input id={`price-${product.id}`} name="price" type="number" step="0.01" min="0" defaultValue={product.price} required />
                              </div>
                              <div>
                                <Label htmlFor={`stock-${product.id}`}>Stock</Label>
                                <Input id={`stock-${product.id}`} name="stock" type="number" min="0" defaultValue={product.stock} required />
                              </div>
                              <Button type="submit" className="w-full">Update Product</Button>
                            </form>
                          </DialogContent>
                        </Dialog>
                        <form action={deleteProduct} className="inline">
                          <input type="hidden" name="id" value={product.id} />
                          <Button variant="destructive" size="sm" type="submit">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </form>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}