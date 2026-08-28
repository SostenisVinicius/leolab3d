"use client";

import { AlertTriangle, LoaderCircle, Trash2, X } from "lucide-react";
import { useRef } from "react";
import { useFormStatus } from "react-dom";
import { deleteCollection, deleteProduct } from "@/app/actions/admin";

function DeleteSubmit() {
  const { pending } = useFormStatus();
  return (
    <button className="danger-button" disabled={pending}>
      {pending ? (
        <>
          <LoaderCircle className="spin" /> Excluindo...
        </>
      ) : (
        <>
          <Trash2 /> Excluir definitivamente
        </>
      )}
    </button>
  );
}

export function DeleteEntityButton({ id, entity }: { id: string; entity: "produto" | "coleção" }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const action = entity === "produto" ? deleteProduct : deleteCollection;
  return (
    <>
      <button
        type="button"
        className="delete-trigger"
        onClick={() => dialogRef.current?.showModal()}
      >
        <Trash2 /> Excluir {entity}
      </button>
      <dialog
        ref={dialogRef}
        className="delete-dialog"
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
      >
        <form action={action} className="delete-dialog-card">
          <input type="hidden" name="id" value={id} />
          <button
            type="button"
            className="dialog-close"
            onClick={() => dialogRef.current?.close()}
            aria-label="Fechar"
          >
            <X />
          </button>
          <span className="dialog-warning">
            <AlertTriangle />
          </span>
          <h2>Excluir {entity}?</h2>
          <p>
            {entity === "produto"
              ? "Esta ação remove o produto do catálogo e das coleções. Pedidos antigos continuarão preservados."
              : "Os produtos não serão excluídos. Apenas a coleção e seus vínculos serão removidos."}
          </p>
          <div className="dialog-actions">
            <button
              type="button"
              className="button button-ghost"
              onClick={() => dialogRef.current?.close()}
            >
              Cancelar
            </button>
            <DeleteSubmit />
          </div>
        </form>
      </dialog>
    </>
  );
}
