import { useState } from "react";
import { type TransportItem } from "@/lib/transport-data";
import { StatusBadge } from "@/components/StatusBadge";
import { TransportDetailSheet } from "@/components/TransportDetailSheet";
import { cn } from "@/lib/utils";

export function TransportCard({ item }: { item: TransportItem }) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const isAvailable = item.status === "available";

  return (
    <>
      <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-card">
        <div className="relative aspect-square overflow-hidden bg-secondary">
          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
          <div className="absolute left-2 top-2">
            <StatusBadge status={item.status} />
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2 p-3">
          <h3 className="text-sm font-semibold leading-tight text-foreground">{item.name}</h3>
          <p className="font-mono text-xs text-muted-foreground">{item.id}</p>
          <p className="font-mono text-sm font-medium text-foreground">{item.pricePerHour} грн/год</p>

          <button
            onClick={() => setSheetOpen(true)}
            disabled={!isAvailable}
            className={cn(
              "mt-auto w-full rounded-md py-2 text-sm font-semibold transition-colors",
              isAvailable
                ? "bg-primary text-primary-foreground hover:opacity-90"
                : "cursor-not-allowed bg-muted text-muted-foreground"
            )}
          >
            Орендувати
          </button>
        </div>
      </div>

      <TransportDetailSheet item={item} open={sheetOpen} onOpenChange={setSheetOpen} />
    </>
  );
}
