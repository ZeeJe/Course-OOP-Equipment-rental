import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useRental } from "@/context/RentalContext";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";
import type { TransportItem } from "@/lib/transport-data";

const issueTypes = [
  "Спущене колесо",
  "Не працюють гальма",
  "Розряджений акумулятор",
  "Пошкоджене сидіння",
  "Інше",
];

interface Props {
  item: TransportItem;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function ReportIssueDialog({ item, open, onOpenChange }: Props) {
  const { reportAndReturn } = useRental();
  const [issueType, setIssueType] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!issueType) {
      toast.error("Оберіть тип проблеми");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    reportAndReturn(item.id);
    toast.success("Звіт надіслано. Оренду завершено.");
    setLoading(false);
    setIssueType("");
    setComment("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Повідомити про поломку
          </DialogTitle>
          <DialogDescription>{item.name} · {item.id}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <Select value={issueType} onValueChange={setIssueType}>
            <SelectTrigger>
              <SelectValue placeholder="Оберіть тип проблеми" />
            </SelectTrigger>
            <SelectContent>
              {issueTypes.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Textarea
            placeholder="Додатковий коментар (необов'язково)…"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
          />

          <Button
            onClick={handleSubmit}
            disabled={loading}
            variant="destructive"
            className="w-full"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-destructive-foreground border-t-transparent" />
                Обробка…
              </span>
            ) : (
              "Відправити та завершити оренду"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
