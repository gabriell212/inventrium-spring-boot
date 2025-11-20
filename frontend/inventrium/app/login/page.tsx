import { Metadata } from "next";
import AuthLayout from "../components/AuthLayout";
import LoginForm from "../components/LoginForm";

export const metadata: Metadata = {
  title: 'Log-in',
  description: 'Log-in to Inventrium'
}

export default function LoginPage(){
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}