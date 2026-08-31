"use client";

import Link from "next/link";
import { CheckCircle2, FilePenLine, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { adminNotice, type AdminEntity } from "@/lib/admin-notice";

export function AdminToast({
  entity,
  status,
  deleted,
  publicHref,
}: {
  entity: AdminEntity;
  status?: string;
  deleted?: boolean;
  publicHref?: string;
}) {
  const [visible, setVisible] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const notice = adminNotice({ entity, status, deleted });

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 7000);
    return () => clearTimeout(timer);
  }, []);

  function close() {
    setVisible(false);
    router.replace(pathname, { scroll: false });
  }

  if (!visible) return null;
  const success = notice.tone === "success";
  return (
    <div className={`admin-toast ${success ? "published" : ""}`} role="status">
      <span>{success ? <CheckCircle2 /> : <FilePenLine />}</span>
      <div>
        <strong>{notice.title}</strong>
        <p>{notice.message}</p>
        {notice.showPublicLink && publicHref && (
          <Link href={publicHref} target="_blank">
            Ver {entity === "produto" ? "produto" : "coleção"} no site
          </Link>
        )}
      </div>
      <button onClick={close} aria-label="Fechar">
        <X />
      </button>
    </div>
  );
}
