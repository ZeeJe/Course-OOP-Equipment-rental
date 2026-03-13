import { useRental, type RentalHistoryEntry } from "@/context/RentalContext";
import { RentalItem } from "@/components/RentalItem";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function formatDuration(ms: number) {
  const totalMinutes = Math.round(ms / 60000);
  if (totalMinutes < 60) return `${totalMinutes} хв`;
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h} год ${m} хв`;
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function HistoryRow({ entry }: { entry: RentalHistoryEntry }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
      <img src={entry.item.image} alt={entry.item.name} className="h-12 w-12 rounded-md object-cover" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">{entry.item.name}</p>
        <p className="text-xs text-muted-foreground">{formatDate(entry.startedAt)}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-xs text-muted-foreground">{formatDuration(entry.durationMs)}</p>
        <p className="text-sm font-bold text-foreground">-{entry.cost.toFixed(0)} грн</p>
      </div>
    </div>
  );
}

const Rentals = () => {
  const { transport, history } = useRental();
  const activeRentals = transport.filter((t) => t.status === "in-use" && t.rentedAt);

  return (
    <main className="container py-6">
      <h1 className="mb-4 text-xl font-bold text-foreground">Мої оренди</h1>

      <Tabs defaultValue="active">
        <TabsList className="mb-4 w-full">
          <TabsTrigger value="active" className="flex-1">
            Активна оренда
            {activeRentals.length > 0 && (
              <span className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {activeRentals.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="history" className="flex-1">Історія</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          {activeRentals.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">У вас немає активних оренд.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {activeRentals.map((item) => (
                <RentalItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history">
          {history.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Історія поїздок порожня.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {history.map((entry, i) => (
                <HistoryRow key={`${entry.item.id}-${entry.endedAt}-${i}`} entry={entry} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default Rentals;
