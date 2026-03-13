import { useState } from "react";
import { useRental } from "@/context/RentalContext";
import { TransportCard } from "@/components/TransportCard";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { TransportStatus } from "@/lib/transport-data";

type TypeFilter = "all" | "bike" | "scooter";
type StatusFilter = "all" | TransportStatus;
type SortOption = "default" | "price-asc" | "price-desc";

const typeOptions: { value: TypeFilter; label: string }[] = [
  { value: "all", label: "Усі" },
  { value: "bike", label: "Велосипеди" },
  { value: "scooter", label: "Самокати" },
];

const statusOptions: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "Усі" },
  { value: "available", label: "Доступні" },
  { value: "in-use", label: "В оренді" },
  { value: "maintenance", label: "Обслуговування" },
];

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "default", label: "За замовчуванням" },
  { value: "price-asc", label: "Дешевші" },
  { value: "price-desc", label: "Дорожчі" },
];

const Catalog = () => {
  const { transport } = useRental();
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sort, setSort] = useState<SortOption>("default");
  const [showFilters, setShowFilters] = useState(true);

  let filtered = transport.filter((item) => {
    const matchesQuery =
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.id.toLowerCase().includes(query.toLowerCase());
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesQuery && matchesType && matchesStatus;
  });

  if (sort === "price-asc") filtered = [...filtered].sort((a, b) => a.pricePerHour - b.pricePerHour);
  if (sort === "price-desc") filtered = [...filtered].sort((a, b) => b.pricePerHour - a.pricePerHour);

  const activeFilters = (typeFilter !== "all" ? 1 : 0) + (statusFilter !== "all" ? 1 : 0) + (sort !== "default" ? 1 : 0);

  return (
    <main className="container py-6">
      {/* Search + filter toggle */}
      <div className="mb-4 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Пошук за назвою або ID…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          variant={showFilters ? "secondary" : "outline"}
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
          className="relative shrink-0"
        >
          <SlidersHorizontal className="h-4 w-4" />
          {activeFilters > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              {activeFilters}
            </span>
          )}
        </Button>
      </div>

      {/* Filter chips */}
      {showFilters && (
        <div className="mb-5 flex flex-col gap-3 rounded-lg border border-border bg-card p-3">
          {/* Type */}
          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">Тип транспорту</p>
            <div className="flex flex-wrap gap-1.5">
              {typeOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setTypeFilter(opt.value)}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                    typeFilter === opt.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-accent"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">Статус</p>
            <div className="flex flex-wrap gap-1.5">
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setStatusFilter(opt.value)}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                    statusFilter === opt.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-accent"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">Сортування</p>
            <div className="flex flex-wrap gap-1.5">
              {sortOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSort(opt.value)}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                    sort === opt.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-accent"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">Нічого не знайдено</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((item) => (
            <TransportCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </main>
  );
};

export default Catalog;
