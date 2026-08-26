"use client";

import { useFormStatus } from "react-dom";
import { changeUserRole } from "@/app/actions/admin";

function SubmitButton({ isAdmin, isSelf }: { isAdmin: boolean; isSelf: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button disabled={isSelf || pending} className={isAdmin ? "role-action danger" : "role-action"}>
      {isSelf
        ? "Seu perfil"
        : pending
          ? "Salvando..."
          : isAdmin
            ? "Remover acesso"
            : "Tornar admin"}
    </button>
  );
}

export function RoleChangeForm({
  userId,
  userName,
  isAdmin,
  isSelf,
}: {
  userId: string;
  userName: string;
  isAdmin: boolean;
  isSelf: boolean;
}) {
  return (
    <form
      action={changeUserRole}
      onSubmit={(event) => {
        const action = isAdmin
          ? "remover o acesso administrativo de"
          : "conceder acesso administrativo a";
        if (!window.confirm(`Deseja ${action} ${userName}?`)) event.preventDefault();
      }}
    >
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="role" value={isAdmin ? "customer" : "admin"} />
      <SubmitButton isAdmin={isAdmin} isSelf={isSelf} />
    </form>
  );
}
