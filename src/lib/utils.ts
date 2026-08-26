export function formatCurrency(cents?: number | null) {
  if (cents == null) return "Sob consulta";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
}

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export const statusLabels: Record<string, string> = {
  pending: "Pendente",
  reviewing: "Em análise",
  waiting_customer: "Aguardando cliente",
  approved: "Aprovado",
  rejected: "Recusado",
  in_production: "Em produção",
  completed: "Concluído",
  cancelled: "Cancelado",
};
