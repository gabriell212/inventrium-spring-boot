import { Metadata } from "next";
import DashboardLayout from "../../components/DashboardLayout";
import Users from "../../components/Users";

export const metadata: Metadata = {
  title: 'Users',
  description: 'Users'
}

export default function ProductsPage(){
  return (
    <DashboardLayout activeLink="users">
      <Users />
    </DashboardLayout>
  );
}