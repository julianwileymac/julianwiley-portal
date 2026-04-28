import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getAccess } from "@/lib/access";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?redirect=/app");
  }

  const access = await getAccess();

  return (
    <AdminShell
      user={session.user}
      access={{
        viewBlogAdmin: access.can.viewBlogAdmin,
        viewContactInbox: access.can.viewContactInbox,
      }}
    >
      {children}
    </AdminShell>
  );
}
