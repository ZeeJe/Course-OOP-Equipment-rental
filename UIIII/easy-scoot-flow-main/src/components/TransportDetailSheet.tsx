import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { type TransportItem, type ScooterSpecs, type BikeSpecs } from "@/lib/transport-data";
import { StatusBadge } from "@/components/StatusBadge";
import { useRental } from "@/context/RentalContext";
import { toast } from "sonner";
import { Battery, Bike, MapPin, ShoppingBasket, Ruler } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Props {
  item: TransportItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TransportDetailSheet({ item, open, onOpenChange }: Props) {
  const { rentTransport } = useRental();
  const [loading, setLoading] = useState(false);
  const [tariff, setTariff] = useState<"minute" | "hour">("hour");

  if (!item) return null;

  const isAvailable = item.status === "available";
  const isScooter = item.type === "scooter";
  const specs = item.specs as any;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await rentTransport(item.id);
      toast.success(`${item.name} орендовано за ${tariff === "hour" ? "годинним" : "похвилинним"} тарифом!`);
      onOpenChange(false);
    } catch (e: any) {
      if (e.message === "TransportUnavailable") {
        toast.error("Помилка: Цей транспорт вже орендовано або він зламався");
      } else if (e.message === "InsufficientFunds") {
        toast.error("Помилка: Недостатньо коштів на балансі");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col gap-0 overflow-y-auto p-0 sm:max-w-md">
        {/* Image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-secondary">
          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
          <div className="absolute left-3 top-3">
            <StatusBadge status={item.status} />
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-5 p-5">
          {/* Header */}
          <SheetHeader className="space-y-1 p-0">
            <SheetTitle className="text-xl font-bold text-foreground">{item.name}</SheetTitle>
            <p className="font-mono text-xs text-muted-foreground">{item.id}</p>
          </SheetHeader>

          {/* Specs */}
          <div className="grid grid-cols-2 gap-2.5">
            {isScooter ? (
              <>
                <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/50 p-3">
                  <Battery className="h-5 w-5 text-status-available" />
                  <div>
                    <p className="text-xs text-muted-foreground">Заряд</p>
                    <p className="text-sm font-semibold text-foreground">{(specs as ScooterSpecs).battery}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/50 p-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Запас ходу</p>
                    <p className="text-sm font-semibold text-foreground">{(specs as ScooterSpecs).range} км</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/50 p-3">
                  <Ruler className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Рама</p>
                    <p className="text-sm font-semibold text-foreground">{(specs as BikeSpecs).frameSize}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/50 p-3">
                  <ShoppingBasket className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Кошик</p>
                    <p className="text-sm font-semibold text-foreground">
                      {(specs as BikeSpecs).hasBasket ? "Є" : "Немає"}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Tariff selection */}
          <div>
            <p className="mb-2 text-sm font-semibold text-foreground">Оберіть тариф</p>
            <RadioGroup
              value={tariff}
              onValueChange={(v) => setTariff(v as "minute" | "hour")}
              className="grid grid-cols-1 gap-2"
            >
              <Label
                htmlFor="tariff-minute"
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-lg border-2 p-3 transition-colors",
                  tariff === "minute"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-muted-foreground/30"
                )}
              >
                <RadioGroupItem value="minute" id="tariff-minute" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Похвилинно</p>
                  <p className="text-xs text-muted-foreground">Гнучко для коротких поїздок</p>
                </div>
                <span className="font-mono text-sm font-bold text-foreground">{item.pricePerMinute} грн/хв</span>
              </Label>

              <Label
                htmlFor="tariff-hour"
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-lg border-2 p-3 transition-colors",
                  tariff === "hour"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-muted-foreground/30"
                )}
              >
                <RadioGroupItem value="hour" id="tariff-hour" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Годинний тариф</p>
                  <p className="text-xs text-muted-foreground">Вигідно для довгих прогулянок</p>
                </div>
                <span className="font-mono text-sm font-bold text-foreground">{item.pricePerHour} грн/год</span>
              </Label>
            </RadioGroup>
          </div>

          {/* Confirm button */}
          <button
            onClick={handleConfirm}
            disabled={!isAvailable || loading}
            className={cn(
              "mt-auto w-full rounded-lg py-3.5 text-base font-bold transition-colors",
              isAvailable
                ? "bg-primary text-primary-foreground hover:opacity-90"
                : "cursor-not-allowed bg-muted text-muted-foreground"
            )}
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Обробка…
              </span>
            ) : isAvailable ? (
              "Підтвердити оренду"
            ) : (
              "Недоступно"
            )}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
