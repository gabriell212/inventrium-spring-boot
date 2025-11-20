import Image from "next/image"

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex flex-row items-center justify-center">
      <div className="h-full w-1/3 flex items-center justify-center bg-[#E1A600]">
        <Image
          src="/inventrium_logo.png"
          alt="Company logo"
          width={300}
          height={300}
        />
      </div>
      <div className="h-full w-2/3 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
