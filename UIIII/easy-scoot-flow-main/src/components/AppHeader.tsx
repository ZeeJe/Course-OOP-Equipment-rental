import { useState } from "react";
import { useRental } from "@/context/RentalContext";
import { useAuth } from "@/context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { ProfileMenu } from "@/components/ProfileMenu";
import { TopUpDialog } from "@/components/TopUpDialog";

export function AppHeader() {
  const { balance } = useRental();
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  const [topUpOpen, setTopUpOpen] = useState(false);

  const showBalance = isLoggedIn && location.pathname !== "/";

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-card">
        <div className="container flex h-14 items-center justify-between">
          <Link to="/" className="text-lg font-bold tracking-tight text-foreground">
            UrbanRide
          </Link>

          <div className="flex items-center gap-3">
            {showBalance && (
              <button
                onClick={() => setTopUpOpen(true)}
                className="rounded-md bg-secondary px-3 py-1.5 font-mono text-sm font-medium text-foreground transition-colors hover:bg-accent"
                title="Поповнити баланс"
              >
                {balance} грн
              </button>
            )}
            {isLoggedIn && <ProfileMenu />}
          </div>
        </div>
      </header>

      <TopUpDialog open={topUpOpen} onOpenChange={setTopUpOpen} />
    </>
  );
}
