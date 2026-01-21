"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  sub: string;
  role: string;
}

export default function DashboardLayout({
  children,
  activeLink,
}: Readonly<{
  children: React.ReactNode;
  activeLink: string;
}>) {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  // Config pentru roluri permise pe fiecare secțiune
  const navConfig: Record<string, string[]> = {
    products: ["ADMINISTRATOR", "MANAGER", "OPERATOR"],
    categories: ["ADMINISTRATOR", "MANAGER"],
    warehouse: ["ADMINISTRATOR", "MANAGER", "OPERATOR"],
    users: ["ADMINISTRATOR"],
    batches: ["ADMINISTRATOR", "MANAGER", "OPERATOR"],
  };

  // Funcție de verificare acces
  const canAccess = (link: string) => {
    if (!user?.role) return false;
    return navConfig[link]?.includes(user.role);
  };

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      try {
        const decoded: JwtPayload = jwtDecode<JwtPayload>(token);
        setUser({ name: decoded.sub, role: decoded.role });
      } catch {
        setUser(null);
      }
    }
  }, []);

  return (
    <div className="h-screen flex flex-row bg-white">
      {/* Sidebar */}
      <div className="h-full w-[100px] flex flex-col items-start justify-center bg-[#111]">
        <Link href="/dashboard">
          <Image
            className="bg-[#E1A600]"
            src="/assets/inventrium_logo.png"
            alt="Company logo"
            width={300}
            height={300}
          />
        </Link>
        <nav className="mt-3 h-full w-full flex flex-col items-center">
          {/* Products */}
          {canAccess("products") && (
            <Link
              href="/dashboard/products"
              className={`group block flex flex-col justify-center items-center w-full py-1 ${
                activeLink === "products" ? "bg-[#222]" : ""
              }`}
            >
              <Image
                src="/assets/product-svgrepo-com.svg"
                alt="Products link"
                width={50}
                height={50}
              />
              <p className="hidden group-hover:block text-white font-bold text-xs mt-1">
                Products
              </p>
            </Link>
          )}

          {/* Categories */}
          {canAccess("categories") && (
            <Link
              href="/dashboard/categories"
              className={`group block flex flex-col justify-center items-center w-full py-1 ${
                activeLink === "categories" ? "bg-[#222]" : ""
              }`}
            >
              <Image
                src="/assets/product-catalog-svgrepo-com.svg"
                alt="Categories link"
                width={50}
                height={50}
              />
              <p className="hidden group-hover:block text-white font-bold text-xs mt-1">
                Categories
              </p>
            </Link>
          )}

          {/* Warehouse */}
          {canAccess("warehouse") && (
            <Link
              href="/dashboard/warehouse"
              className={`group block flex flex-col justify-center items-center w-full py-1 ${
                activeLink === "warehouse" ? "bg-[#222]" : ""
              }`}
            >
              <Image
                src="/assets/warehouse-svgrepo-com.svg"
                alt="Warehouse link"
                width={50}
                height={50}
              />
              <p className="hidden group-hover:block text-white font-bold text-xs mt-1">
                Warehouse
              </p>
            </Link>
          )}

          {/* Batches */}
          {canAccess("batches") && (
            <Link
              href="/dashboard/batch"
              className={`group block flex flex-col justify-center items-center w-full py-1 ${
                activeLink === "batches" ? "bg-[#222]" : ""
              }`}
            >
              <Image
                src="/assets/batch-svgrepo-com.svg"
                alt="Batches link"
                width={50}
                height={50}
              />
              <p className="hidden group-hover:block text-white font-bold text-xs mt-1">
                Batches
              </p>
            </Link>
          )}

          {/* Users */}
          {canAccess("users") && (
            <Link
              href="/dashboard/users"
              className={`group block flex flex-col justify-center items-center w-full py-1 ${
                activeLink === "members" ? "bg-[#222]" : ""
              }`}
            >
              <Image
                src="/assets/users-svgrepo-com.svg"
                alt="Users link"
                width={50}
                height={50}
              />
              <p className="hidden group-hover:block text-white font-bold text-xs mt-1">
                Users
              </p>
            </Link>
          )}
        </nav>
      </div>

      {/* Main content + top navbar */}
      <div className="h-full w-full flex flex-col overflow-auto">
        {/* Top navbar */}
        <header className="w-full bg-[#111] text-white flex justify-end items-center px-6 py-3">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="font-semibold">{user.name}</span>
              <span className="text-sm text-gray-400">{user.role}</span>
              <Image
                src="/assets/user-avatar.png"
                alt="User avatar"
                width={32}
                height={32}
                className="rounded-full"
              />
            </div>
          ) : (
            <span className="text-sm text-gray-400">Not logged in</span>
          )}
        </header>

        {/* Page content */}
        <main className="flex-1 flex items-center justify-center p-6">
          {children}
        </main>
      </div>
    </div>
  );
}