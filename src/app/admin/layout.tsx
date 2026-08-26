import { AdminSidebar } from "@/components/admin-sidebar";
import { databaseConfigured } from "@/db";
import { requireAdmin } from "@/lib/session";
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (databaseConfigured) await requireAdmin();
  return (
    <div className="admin-shell">
      <AdminSidebar />
      <main className="admin-main">
        {!databaseConfigured && (
          <div className="demo-banner">
            Painel demonstrativo — configure DATABASE_URL e execute as migrações para persistir
            alterações.
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
