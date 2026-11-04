import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { getSiteSettings } from "@/lib/api";
import { getAdminPaymentView } from "@/lib/payment-config";

export default async function AdminPage() {
  const [settings, payments] = await Promise.all([
    getSiteSettings(),
    getAdminPaymentView(),
  ]);
  return <AdminDashboard storeName={settings.name} initial={payments} />;
}
