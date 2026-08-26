import Link from "next/link";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="logo" aria-label="LeoLab3D — início">
      <span className="logo-mark">L3</span>
      {!compact && (
        <span>
          LeoLab<span>3D</span>
        </span>
      )}
    </Link>
  );
}
