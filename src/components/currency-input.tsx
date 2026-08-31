"use client";

import { useState } from "react";
import { formatCurrencyInput, parseCurrencyInput } from "@/lib/utils";

export function CurrencyInput({
  name,
  initialCents,
  id,
}: {
  name: string;
  initialCents?: number | null;
  id?: string;
}) {
  const [cents, setCents] = useState<number | null>(initialCents ?? null);
  return (
    <>
      <input type="hidden" name={name} value={cents ?? ""} />
      <input
        id={id}
        type="text"
        inputMode="numeric"
        value={formatCurrencyInput(cents)}
        onChange={(event) => setCents(parseCurrencyInput(event.target.value))}
        onFocus={(event) => event.currentTarget.select()}
        aria-label="Valor em reais"
      />
    </>
  );
}
