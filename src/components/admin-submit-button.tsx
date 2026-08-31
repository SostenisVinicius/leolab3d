"use client";

import { LoaderCircle } from "lucide-react";
import { useFormStatus } from "react-dom";

export function AdminSubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button className="button" disabled={pending}>
      {pending ? (
        <>
          <LoaderCircle className="spin" /> Salvando...
        </>
      ) : (
        children
      )}
    </button>
  );
}
