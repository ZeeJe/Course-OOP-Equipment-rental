import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRental } from "@/context/RentalContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { CreditCard } from "lucide-react";

const quickAmounts = [100, 200, 500];

export function TopUpDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { topUp } = useRental();
  const [selected, setSelected] = useState<number | null>(null);
  const [custom, setCustom] = useState("");
  const [loading, setLoading] = useState(false);

  const amount = selected ?? (custom ? Number(custom) : 0);

  const handlePay = async () => {
    if (!amount || amount <= 0) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    topUp(amount);
    toast.success(`Баланс поповнено на ${amount} грн`);
    setLoading(false);
    setSelected(null);
    setCustom("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Поповнити баланс</DialogTitle>
          <DialogDescription>Оберіть суму або введіть свою</DialogDescription>
        </DialogHeader>

        {/* Quick amounts */}
        <div className="flex gap-2">
          {quickAmounts.map((a) => (
            <button
              key={a}
              onClick={() => { setSelected(a); setCustom(""); }}
              className={cn(
                "flex-1 rounded-lg border-2 py-2.5 text-sm font-bold transition-colors",
                selected === a
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-foreground hover:border-muted-foreground/30"
              )}
            >
              {a} ₴
            </button>
          ))}
        </div>

        {/* Custom amount */}
        <div className="relative">
          <Input
            type="number"
            placeholder="Інша сума"
            value={custom}
            onChange={(e) => { setCustom(e.target.value); setSelected(null); }}
            className="pr-10"
            min={1}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">₴</span>
        </div>

        {/* Pay button */}
        <Button
          onClick={handlePay}
          disabled={!amount || amount <= 0 || loading}
          className="w-full gap-2"
          size="lg"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              Обробка…
            </span>
          ) : (
            <>
              <CreditCard className="h-4 w-4" />
              Оплатити {amount > 0 ? `${amount} ₴` : ""}
            </>
          )}
        </Button>

        {/* Payment icons */}
        <div className="flex items-center justify-center gap-3 pt-1">
          <span className="rounded bg-secondary px-2 py-1 text-[10px] font-bold text-muted-foreground">Apple Pay</span>
          <span className="rounded bg-secondary px-2 py-1 text-[10px] font-bold text-muted-foreground">Google Pay</span>
          <span className="rounded bg-secondary px-2 py-1 text-[10px] font-bold text-muted-foreground">Visa</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
