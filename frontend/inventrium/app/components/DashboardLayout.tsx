import Image from "next/image"
import Link from "next/link"

export default function DashboardLayout({
  children,
  activeLink,
}: Readonly<{
  children: React.ReactNode;
  activeLink : string
}>) {
  return (
    <div className="h-screen flex flex-row items-center justify-center bg-white">
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
          <Link href="/dashboard/products" className={`block flex flex-col justify-center items-center w-full py-1 ${activeLink === 'products' ? 'bg-[#222]' : ''}`}>
            <Image 
                src="/assets/product-svgrepo-com.svg"
                alt="Products link"
                width={50}
                height={50}
            />
            <p className="block text-white font-bold hidden">Products</p>
          </Link>
          <Link href="/dashboard/categories" className={`block flex flex-col justify-center items-center w-full py-1 ${activeLink === 'catalog' ? 'bg-[#222]' : ''}`}>
            <Image 
              src="/assets/product-catalog-svgrepo-com.svg"
              alt="Categories link"
              width={50}
              height={50}
            />
            <p className="block text-white font-bold hidden">Categories</p>
          </Link>
          <Link href="/dashboard/warehouse" className={`block flex flex-col justify-center items-center w-full py-1 ${activeLink === 'warehouse' ? 'bg-[#222]' : ''}`}>
            <Image 
              src="/assets/warehouse-svgrepo-com.svg"
              alt="Warehouse link"
              width={50}
              height={50}
            />
            <p className="block text-white font-bold hidden">Warehouse</p>
          </Link>
          <Link href="/dashboard/users" className={`block flex flex-col justify-center items-center w-full py-1 ${activeLink === 'members' ? 'bg-[#222]' : ''}`}>
            <Image 
              src="/assets/users-svgrepo-com.svg"
              alt="Users link"
              width={50}
              height={50}
            />
            <p className="block text-white font-bold hidden">Users</p>
          </Link>
        </nav>
      </div>
      <div className="h-full w-full flex items-center justify-center overflow-auto">
        {children}
      </div>
    </div>
  );
}
