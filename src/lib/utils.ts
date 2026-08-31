export function formatCurrency(cents?: number | null) {
  if (cents == null) return "Sob consulta";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
}

export function formatCurrencyInput(cents?: number | null) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    (cents ?? 0) / 100,
  );
}

export function parseCurrencyInput(value?: string | null) {
  if (!value?.trim()) return null;
  const digits = value.replace(/\D/g, "");
  return digits ? Number(digits) : 0;
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
