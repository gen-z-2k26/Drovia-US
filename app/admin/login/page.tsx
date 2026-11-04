import { redirect } from "next/navigation";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { adminAuthReady, isAdmin } from "@/lib/admin-session";
import { getSiteSettings } from "@/lib/api";

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin");
  const settings = await getSiteSettings();
  return <AdminLogin storeName={settings.name} ready={adminAuthReady()} />;
}
