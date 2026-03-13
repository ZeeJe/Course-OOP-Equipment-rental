import { useEffect, useState } from "react";
import { type TransportItem } from "@/lib/transport-data";
import { useRental } from "@/context/RentalContext";
import { toast } from "sonner";
import { ReportIssueDialog } from "@/components/ReportIssueDialog";
import { AlertTriangle } from "lucide-react";

function formatDuration(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function RentalItem({ item }: { item: TransportItem }) {
  const { returnTransport } = useRental();
  const [elapsed, setElapsed] = useState(0);
  const [reportOpen, setReportOpen] = useState(false);

  useEffect(() => {
    if (!item.rentedAt) return;
    const interval = setInterval(() => {
      setElapsed(Date.now() - item.rentedAt!);
    }, 1000);
    return () => clearInterval(interval);
  }, [item.rentedAt]);

  const handleReturn = () => {
    returnTransport(item.id);
    toast.success(`${item.name} повернено!`);
  };

  return (
    <>
      <div className="flex items-center gap-4 rounded-lg border border-border bg-card p-3">
        <img src={item.image} alt={item.name} className="h-16 w-16 rounded-md object-cover" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-foreground">{item.name}</h3>
          <p className="font-mono text-xs text-muted-foreground">{item.id}</p>
          <p className="mt-1 font-mono text-sm font-medium text-status-in-use">
            ⏱ {formatDuration(elapsed)}
          </p>
        </div>
        <div className="flex flex-col gap-1.5 shrink-0">
          <button
            onClick={handleReturn}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90"
          >
            Повернути
          </button>
          <button
            onClick={() => setReportOpen(true)}
            className="flex items-center justify-center gap-1.5 rounded-md border border-destructive/40 px-4 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
          >
            <AlertTriangle className="h-3 w-3" />
            Поломка
          </button>
        </div>
      </div>

      <ReportIssueDialog item={item} open={reportOpen} onOpenChange={setReportOpen} />
    </>
  );
}
