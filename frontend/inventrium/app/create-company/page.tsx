import { Metadata } from "next";
import AuthLayout from "../components/AuthLayout";
import CreateCompanyForm from "../components/CreateCompanyForm";

export const metadata: Metadata = {
  title: 'Create a company',
  description: 'Create a company'
}

export default function LoginPage(){
  return (
    <AuthLayout>
      <CreateCompanyForm />
    </AuthLayout>
  );
}