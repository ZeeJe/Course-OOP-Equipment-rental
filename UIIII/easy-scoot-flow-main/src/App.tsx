import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RentalProvider } from "@/context/RentalContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { AppHeader } from "@/components/AppHeader";
import Landing from "./pages/Landing";
import Catalog from "./pages/Catalog";
import Rentals from "./pages/Rentals";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppHeader />
      {children}
    </>
  );
}

const App = () => (
  <ThemeProvider>
    <AuthProvider>
      <TooltipProvider>
        <Sonner />
        <BrowserRouter>
          <RentalProvider>
            <Routes>
              {/* User-facing pages with header */}
              <Route path="/" element={<UserLayout><Landing /></UserLayout>} />
              <Route path="/catalog" element={<UserLayout><Catalog /></UserLayout>} />
              <Route path="/rentals" element={<UserLayout><Rentals /></UserLayout>} />

              {/* Admin pages — own layout with sidebar */}
              <Route path="/admin" element={<AdminDashboard section="fleet" />} />
              <Route path="/admin/users" element={<AdminDashboard section="users" />} />

              <Route path="*" element={<UserLayout><NotFound /></UserLayout>} />
            </Routes>
          </RentalProvider>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
