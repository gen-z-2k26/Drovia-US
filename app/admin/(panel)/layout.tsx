import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-session";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAdmin())) redirect("/admin/login");
  return children;
}
