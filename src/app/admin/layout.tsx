import { AdminSidebar } from "@/components/admin-sidebar";
import { databaseConfigured } from "@/db";
import { requireAdmin } from "@/lib/session";
import { count, inArray } from "drizzle-orm";
import { db } from "@/db";
import { quoteRequests } from "@/db/schema";
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = databaseConfigured ? await requireAdmin() : null;
  const [pending] = databaseConfigured
    ? await db
        .select({ total: count() })
        .from(quoteRequests)
        .where(inArray(quoteRequests.status, ["pending", "reviewing"]))
    : [{ total: 0 }];
  return (
    <div className="admin-shell">
      <AdminSidebar
        user={{
          name: session?.user.name ?? "Administrador",
          email: session?.user.email ?? "modo demonstração",
        }}
        pendingCount={Number(pending.total)}
      />
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
