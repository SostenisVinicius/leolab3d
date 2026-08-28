export type AdminEntity = "produto" | "coleção";

export type AdminNotice = {
  tone: "success" | "draft";
  title: string;
  message: string;
  /** O link público só faz sentido quando o conteúdo está visível para os clientes. */
  showPublicLink: boolean;
};

const feminine = (entity: AdminEntity) => entity === "coleção";

export function adminNotice({
  entity,
  status,
  deleted = false,
}: {
  entity: AdminEntity;
  status?: string;
  deleted?: boolean;
}): AdminNotice {
  const name = feminine(entity) ? "Coleção" : "Produto";
  if (deleted) {
    return {
      tone: "success",
      title: `${name} ${feminine(entity) ? "excluída" : "excluído"} com sucesso`,
      message: `${feminine(entity) ? "A coleção foi removida" : "O produto foi removido"} do painel e do conteúdo público.`,
      showPublicLink: false,
    };
  }
  if (status === "published") {
    return {
      tone: "success",
      title: `${name} ${feminine(entity) ? "publicada" : "publicado"} com sucesso`,
      message: `Já está visível no ${feminine(entity) ? "site" : "catálogo"} para os clientes.`,
      showPublicLink: true,
    };
  }
  if (status === "archived") {
    return {
      tone: "draft",
      title: `${name} ${feminine(entity) ? "arquivada" : "arquivado"}`,
      message: "Não está mais disponível no catálogo público.",
      showPublicLink: false,
    };
  }
  return {
    tone: "draft",
    title: "Rascunho salvo com sucesso",
    message: `Est${feminine(entity) ? "a coleção" : "e produto"} ainda não está visível para os clientes.`,
    showPublicLink: false,
  };
}
