import { Search, ShieldCheck, UserRound, UsersRound } from "lucide-react";
import { getAdminUsers } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/session";
import { RoleChangeForm } from "@/components/role-change-form";

export default async function TeamPage({
  searchParams,
}: {
  searchParams: Promise<{ busca?: string; papel?: string }>;
}) {
  const [query, session] = await Promise.all([searchParams, requireAdmin()]);
  const people = await getAdminUsers(query.busca, query.papel);
  const admins = people.filter((person) => person.role === "admin").length;
  return (
    <>
      <header className="admin-header">
        <div>
          <span>Acessos e permissões</span>
          <h1>Equipe e usuários</h1>
          <p>
            Clientes criam suas contas normalmente. Você decide quem pode administrar o laboratório.
          </p>
        </div>
      </header>
      <section className="admin-content">
        <div className="team-info">
          <ShieldCheck />
          <div>
            <strong>Acesso administrativo controlado</strong>
            <p>
              Somente administradores podem promover outros perfis. Você não pode remover o próprio
              acesso nem o último administrador.
            </p>
          </div>
        </div>
        <div className="team-stats">
          <div>
            <UsersRound />
            <span>
              <strong>{people.length}</strong> perfis encontrados
            </span>
          </div>
          <div>
            <ShieldCheck />
            <span>
              <strong>{admins}</strong> administradores nesta lista
            </span>
          </div>
        </div>
        <form className="admin-toolbar team-toolbar">
          <label>
            <Search />
            <input
              name="busca"
              defaultValue={query.busca}
              placeholder="Buscar por nome ou e-mail..."
            />
          </label>
          <select name="papel" defaultValue={query.papel ?? "all"}>
            <option value="all">Todos os perfis</option>
            <option value="admin">Administradores</option>
            <option value="customer">Clientes</option>
          </select>
          <button className="button button-sm">Filtrar</button>
        </form>
        <div className="data-card people-table">
          <div className="people-head">
            <span>Pessoa</span>
            <span>Cadastro</span>
            <span>Acesso</span>
            <span>Ação</span>
          </div>
          {people.map((person) => {
            const self = person.id === session.user.id;
            return (
              <div className="people-row" key={person.id}>
                <div>
                  <span className="avatar">
                    {person.name
                      .split(" ")
                      .map((x) => x[0])
                      .join("")
                      .slice(0, 2)}
                  </span>
                  <span>
                    <strong>{person.name}</strong>
                    <small>{person.email}</small>
                  </span>
                </div>
                <span>{new Intl.DateTimeFormat("pt-BR").format(person.createdAt)}</span>
                <span className={person.role === "admin" ? "role-badge admin" : "role-badge"}>
                  {person.role === "admin" ? (
                    <>
                      <ShieldCheck /> Administrador
                    </>
                  ) : (
                    <>
                      <UserRound /> Cliente
                    </>
                  )}
                </span>
                <RoleChangeForm
                  userId={person.id}
                  userName={person.name}
                  isAdmin={person.role === "admin"}
                  isSelf={self}
                />
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
