import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AuthDialog({ open, onOpenChange, onSuccess }: AuthDialogProps) {
  const { login } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (mode === "register" && !name)) {
      toast.error("Заповніть усі поля");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    login(mode === "register" ? name : email.split("@")[0]);
    toast.success(mode === "register" ? "Реєстрація успішна!" : "Вхід успішний!");
    setLoading(false);
    onOpenChange(false);
    onSuccess?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === "register" ? "Реєстрація" : "Вхід"}</DialogTitle>
          <DialogDescription>
            {mode === "register"
              ? "Створіть акаунт, щоб почати оренду"
              : "Увійдіть у свій акаунт"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === "register" && (
            <div className="space-y-2">
              <Label htmlFor="name">Ім'я</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ваше ім'я" />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Пароль</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                {mode === "register" ? "Реєстрація…" : "Вхід…"}
              </span>
            ) : mode === "register" ? "Зареєструватися" : "Увійти"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            {mode === "register" ? "Вже маєте акаунт?" : "Немає акаунту?"}{" "}
            <button
              type="button"
              onClick={() => setMode(mode === "register" ? "login" : "register")}
              className="font-medium text-primary hover:underline"
            >
              {mode === "register" ? "Увійти" : "Зареєструватися"}
            </button>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
