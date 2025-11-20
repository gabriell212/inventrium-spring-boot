import { Metadata } from "next";
import AuthLayout from "../components/AuthLayout"
import SignupForm from "../components/SignupForm"

export const metadata : Metadata = {
  title: 'Sign-up',
  description: 'Sign-up to Inventrium'
}

export default function SignupPage(){
  return (
    <AuthLayout>
      <SignupForm />
    </AuthLayout>
  );
}