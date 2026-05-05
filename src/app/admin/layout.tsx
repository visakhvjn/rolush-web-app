import { auth } from "@/auth";
import { AdminSidebar } from "@/components/admin/sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="min-h-screen bg-[#eef3f9] lg:flex">
      {session?.user ? <AdminSidebar /> : null}
      <div className="flex-1">{children}</div>
    </div>
  );
}
