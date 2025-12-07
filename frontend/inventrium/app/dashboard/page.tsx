import { Metadata } from "next";
import DashboardLayout from "../components/DashboardLayout";

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Dashboard'
}

export default function DashboardPage(){
  return (
    <DashboardLayout activeLink="dashboard">
      <div></div>
    </DashboardLayout>
  );
}