import SuperAdminLayout from "@/app/super-admin/layout";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SuperAdminLayout>{children}</SuperAdminLayout>;
}
