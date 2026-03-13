import { type TransportStatus } from "@/lib/transport-data";
import { cn } from "@/lib/utils";

const config: Record<TransportStatus, { label: string; className: string }> = {
  available: { label: "Доступно", className: "bg-status-available text-primary-foreground animate-pulse-available" },
  "in-use": { label: "В оренді", className: "bg-status-in-use text-primary-foreground" },
  maintenance: { label: "Обслуговування", className: "bg-status-maintenance text-primary-foreground" },
};

export function StatusBadge({ status }: { status: TransportStatus }) {
  const { label, className } = config[status];
  return (
    <span className={cn("inline-block rounded-sm px-2 py-0.5 text-xs font-semibold", className)}>
      {label}
    </span>
  );
}
