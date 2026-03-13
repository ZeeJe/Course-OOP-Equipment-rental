import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bike, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthDialog } from "@/components/AuthDialog";
import { useAuth } from "@/context/AuthContext";

const Landing = () => {
  const [authOpen, setAuthOpen] = useState(false);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleCTA = () => {
    if (isLoggedIn) {
      navigate("/catalog");
    } else {
      setAuthOpen(true);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-4">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-8 text-center">
        {/* Icon group */}
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Bike className="h-7 w-7" />
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-status-in-use/10 text-status-in-use">
            <Zap className="h-7 w-7" />
          </div>
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Прокат велосипедів<br />та електросамокатів
        </h1>

        <p className="max-w-md text-lg text-muted-foreground">
          Швидко, зручно, доступно. Орендуйте транспорт за лічені секунди — просто оберіть і їдьте.
        </p>

        <Button size="lg" onClick={handleCTA} className="gap-2 text-base px-8">
          Перейти до оренди
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} onSuccess={() => navigate("/catalog")} />
    </main>
  );
};

export default Landing;
