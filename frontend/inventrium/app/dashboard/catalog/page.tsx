import { Metadata } from "next";
import DashboardLayout from "../../components/DashboardLayout";

export const metadata: Metadata = {
  title: 'Catalog',
  description: 'Catalog'
}

export default function CatalogPage(){
  return (
    <DashboardLayout activeLink="catalog">
      <div>Catalog</div>
    </DashboardLayout>
  );
}