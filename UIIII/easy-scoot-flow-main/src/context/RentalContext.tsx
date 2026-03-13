import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { initialTransport, type TransportItem } from "@/lib/transport-data";

export interface RentalHistoryEntry {
  item: TransportItem;
  startedAt: number;
  endedAt: number;
  durationMs: number;
  cost: number;
  reportedIssue?: boolean;
}

export interface MockUser {
  id: string;
  name: string;
  balance: number;
  trips: number;
  blocked: boolean;
}

interface RentalContextType {
  transport: TransportItem[];
  balance: number;
  history: RentalHistoryEntry[];
  users: MockUser[];
  rentTransport: (id: string) => Promise<void>;
  returnTransport: (id: string) => void;
  reportAndReturn: (id: string) => void;
  topUp: (amount: number) => void;
  setTransportStatus: (id: string, status: TransportItem["status"]) => void;
  addTransport: (item: TransportItem) => void;
  toggleUserBlock: (userId: string) => void;
}

const RentalContext = createContext<RentalContextType | null>(null);

const mockUsers: MockUser[] = [
  { id: "USR-001", name: "Олексій Мельник", balance: 500, trips: 12, blocked: false },
  { id: "USR-002", name: "Марія Коваленко", balance: 230, trips: 5, blocked: false },
  { id: "USR-003", name: "Дмитро Шевченко", balance: 0, trips: 28, blocked: true },
  { id: "USR-004", name: "Анна Бондаренко", balance: 1050, trips: 3, blocked: false },
  { id: "USR-005", name: "Ігор Ткаченко", balance: 80, trips: 17, blocked: false },
];

export function RentalProvider({ children }: { children: ReactNode }) {
  const [transport, setTransport] = useState<TransportItem[]>(initialTransport);
  const [balance, setBalance] = useState(500);
  const [history, setHistory] = useState<RentalHistoryEntry[]>([]);
  const [users, setUsers] = useState<MockUser[]>(mockUsers);

  const rentTransport = useCallback(async (id: string) => {
    await new Promise((r) => setTimeout(r, 1200));
    const item = transport.find((t) => t.id === id);
    if (!item) return;
    if (item.status !== "available") throw new Error("TransportUnavailable");
    if (balance < item.pricePerHour) throw new Error("InsufficientFunds");

    setBalance((b) => b - item.pricePerHour);
    setTransport((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "in-use" as const, rentedAt: Date.now() } : t))
    );
  }, [transport, balance]);

  const doReturn = useCallback((id: string, reported: boolean) => {
    setTransport((prev) => {
      const item = prev.find((t) => t.id === id);
      if (item && item.rentedAt) {
        const durationMs = Date.now() - item.rentedAt;
        const minutes = Math.ceil(durationMs / 60000);
        const cost = minutes * item.pricePerMinute;
        setHistory((h) => [
          { item: { ...item }, startedAt: item.rentedAt!, endedAt: Date.now(), durationMs, cost, reportedIssue: reported },
          ...h,
        ]);
      }
      const newStatus = reported ? ("maintenance" as const) : ("available" as const);
      return prev.map((t) => (t.id === id ? { ...t, status: newStatus, rentedAt: undefined } : t));
    });
  }, []);

  const returnTransport = useCallback((id: string) => doReturn(id, false), [doReturn]);
  const reportAndReturn = useCallback((id: string) => doReturn(id, true), [doReturn]);

  const topUp = useCallback((amount: number) => {
    setBalance((b) => b + amount);
  }, []);

  const setTransportStatus = useCallback((id: string, status: TransportItem["status"]) => {
    setTransport((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  }, []);

  const addTransport = useCallback((item: TransportItem) => {
    setTransport((prev) => [...prev, item]);
  }, []);

  const toggleUserBlock = useCallback((userId: string) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, blocked: !u.blocked } : u)));
  }, []);

  return (
    <RentalContext.Provider
      value={{
        transport, balance, history, users,
        rentTransport, returnTransport, reportAndReturn, topUp,
        setTransportStatus, addTransport, toggleUserBlock,
      }}
    >
      {children}
    </RentalContext.Provider>
  );
}

export function useRental() {
  const ctx = useContext(RentalContext);
  if (!ctx) throw new Error("useRental must be used within RentalProvider");
  return ctx;
}
