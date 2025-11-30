import { Metadata } from "next";
import Link from "next/link";
import AuthLayout from "../components/AuthLayout";

export const metadata: Metadata = {
  title: 'Create or join a company',
  description: 'Create or join a company'
}

export default function LoginPage(){
  return (
    <AuthLayout>
      <div id="affiliation-div" className="bg-[#F5F3E7] rounded-lg p-5 w-2/5 h-auto">
        <Link href="/join-company" className="block bg-[#E1A600] p-2 font-bold cursor-pointer rounded m-auto">Join company</Link>
        <Link href="/create-company" className="block bg-[#E1A600] p-2 mt-3 font-bold cursor-pointer rounded m-auto">Create company</Link>
      </div>
    </AuthLayout>
  );
}