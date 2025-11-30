import { Metadata } from "next";
import AuthLayout from "../components/AuthLayout";
import JoinCompanyForm from "../components/JoinCompanyForm";

export const metadata: Metadata = {
  title: 'Join a company',
  description: 'Join a company'
}

export default function LoginPage(){
  return (
    <AuthLayout>
      <JoinCompanyForm />
    </AuthLayout>
  );
}