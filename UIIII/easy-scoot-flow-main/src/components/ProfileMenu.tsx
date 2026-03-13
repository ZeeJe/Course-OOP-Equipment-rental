import { User, Moon, Sun, LogOut, Bike } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function ProfileMenu() {
  const { theme, toggleTheme } = useTheme();
  const { username, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-foreground transition-colors hover:bg-accent">
          <User className="h-4 w-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-56 p-2">
        <div className="border-b border-border px-3 py-2 mb-1">
          <p className="text-sm font-medium text-foreground">{username}</p>
          <p className="text-xs text-muted-foreground">Мій профіль</p>
        </div>

        <button
          onClick={() => { navigate("/rentals"); setOpen(false); }}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent"
        >
          <Bike className="h-4 w-4" />
          Мої оренди
        </button>

        <button
          onClick={toggleTheme}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent"
        >
          {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          {theme === "light" ? "Темна тема" : "Світла тема"}
        </button>

        <div className="my-1 border-t border-border" />

        <button
          onClick={() => { logout(); navigate("/"); setOpen(false); }}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4" />
          Вийти
        </button>
      </PopoverContent>
    </Popover>
  );
}
