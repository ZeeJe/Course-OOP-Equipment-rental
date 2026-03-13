import { useState } from "react";
import { useRental } from "@/context/RentalContext";
import { StatusBadge } from "@/components/StatusBadge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  SidebarProvider, SidebarTrigger,
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel,
  SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton,
} from "@/components/ui/sidebar";
import { NavLink } from "@/components/NavLink";
import { Bike, Users, Plus, ArrowLeft } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { TransportStatus } from "@/lib/transport-data";
import bike1 from "@/assets/bike-1.jpg";

const navItems = [
  { title: "Автопарк", url: "/admin", icon: Bike },
  { title: "Користувачі", url: "/admin/users", icon: Users },
];

function AdminSidebar() {
  const location = useLocation();
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Адмін-панель</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="hover:bg-muted/50"
                      activeClassName="bg-muted text-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

function FleetTab() {
  const { transport, setTransportStatus, addTransport } = useRental();
  const [addOpen, setAddOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<"bike" | "scooter">("bike");
  const [newPrice, setNewPrice] = useState("");

  const handleAdd = () => {
    if (!newName || !newPrice) { toast.error("Заповніть всі поля"); return; }
    const id = `${newType === "bike" ? "BK" : "SC"}-${String(transport.length + 1).padStart(3, "0")}`;
    addTransport({
      id, name: newName, type: newType,
      pricePerHour: Number(newPrice), pricePerMinute: Math.round(Number(newPrice) / 30 * 10) / 10,
      status: "available", image: bike1,
      specs: newType === "bike" ? { frameSize: "M (52 см)", hasBasket: false } : { battery: 100, range: 30 },
    });
    toast.success("Транспорт додано");
    setNewName(""); setNewPrice(""); setAddOpen(false);
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Автопарк</h2>
        <Button onClick={() => setAddOpen(true)} className="gap-1.5">
          <Plus className="h-4 w-4" /> Додати транспорт
        </Button>
      </div>

      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Тип</TableHead>
              <TableHead>Назва</TableHead>
              <TableHead>Ціна</TableHead>
              <TableHead>Статус</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transport.map((t) => (
              <TableRow key={t.id}>
                <TableCell><img src={t.image} alt="" className="h-8 w-8 rounded object-cover" /></TableCell>
                <TableCell className="font-mono text-xs">{t.id}</TableCell>
                <TableCell className="text-xs">{t.type === "bike" ? "Велосипед" : "Самокат"}</TableCell>
                <TableCell className="font-medium">{t.name}</TableCell>
                <TableCell className="font-mono text-sm">{t.pricePerHour} грн</TableCell>
                <TableCell>
                  <Select
                    value={t.status}
                    onValueChange={(v) => setTransportStatus(t.id, v as TransportStatus)}
                  >
                    <SelectTrigger className="h-8 w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Доступно</SelectItem>
                      <SelectItem value="in-use">В оренді</SelectItem>
                      <SelectItem value="maintenance">Обслуговування</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Додати транспорт</DialogTitle>
            <DialogDescription>Заповніть дані нового транспорту</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <div>
              <Label>Назва</Label>
              <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="City Cruiser Pro" />
            </div>
            <div>
              <Label>Тип</Label>
              <Select value={newType} onValueChange={(v) => setNewType(v as "bike" | "scooter")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="bike">Велосипед</SelectItem>
                  <SelectItem value="scooter">Самокат</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Ціна за годину (грн)</Label>
              <Input type="number" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} placeholder="80" />
            </div>
            <Button onClick={handleAdd} className="w-full">Додати</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function UsersTab() {
  const { users, toggleUserBlock } = useRental();

  return (
    <>
      <h2 className="mb-4 text-lg font-bold text-foreground">Користувачі</h2>
      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ім'я</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Баланс</TableHead>
              <TableHead>Поїздки</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead className="text-right">Дія</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.name}</TableCell>
                <TableCell className="font-mono text-xs">{u.id}</TableCell>
                <TableCell className="font-mono">{u.balance} грн</TableCell>
                <TableCell>{u.trips}</TableCell>
                <TableCell>
                  <span className={`inline-block rounded-sm px-2 py-0.5 text-xs font-semibold ${u.blocked ? "bg-destructive text-destructive-foreground" : "bg-status-available text-primary-foreground"}`}>
                    {u.blocked ? "Заблокований" : "Активний"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-xs text-muted-foreground">{u.blocked ? "Розблокувати" : "Заблокувати"}</span>
                    <Switch checked={u.blocked} onCheckedChange={() => toggleUserBlock(u.id)} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

interface AdminPageProps {
  section?: "fleet" | "users";
}

const AdminDashboard = ({ section = "fleet" }: AdminPageProps) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <header className="flex h-14 items-center gap-3 border-b border-border bg-card px-4">
            <SidebarTrigger />
            <Link to="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              На сайт
            </Link>
          </header>
          <main className="flex-1 p-6">
            {section === "fleet" && <FleetTab />}
            {section === "users" && <UsersTab />}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
