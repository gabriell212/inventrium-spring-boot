import { Metadata } from "next";
import DashboardLayout from "../../components/DashboardLayout";

export const metadata: Metadata = {
  title: 'Warehouse',
  description: 'Warehouse'
}

export default function WarehousePage(){
  return (
    <DashboardLayout activeLink="warehouse">
      <div>Warehouse</div>
    </DashboardLayout>
  );
}