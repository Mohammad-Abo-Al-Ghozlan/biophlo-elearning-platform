import { Link } from "react-router-dom";

export function Logo({ compact = false, className = "" }: { compact?: boolean; className?: string }) {
  return (
    <Link className={`app-logo ${compact ? "app-logo-compact" : ""} ${className}`.trim()} to="/" aria-label="BIOPHLO home">
      <img src="/assets/biophlo-logo-transparent.png" alt="BIOPHLO" />
    </Link>
  );
}
