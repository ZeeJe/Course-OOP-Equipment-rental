export type TransportStatus = "available" | "in-use" | "maintenance";

export interface ScooterSpecs {
  battery: number; // percentage
  range: number; // km
}

export interface BikeSpecs {
  frameSize: string;
  hasBasket: boolean;
}

export interface TransportItem {
  id: string;
  name: string;
  type: "bike" | "scooter";
  pricePerHour: number;
  pricePerMinute: number;
  status: TransportStatus;
  image: string;
  rentedAt?: number;
  specs: ScooterSpecs | BikeSpecs;
}

import bike1 from "@/assets/bike-1.jpg";
import bike2 from "@/assets/bike-2.jpg";
import bike3 from "@/assets/bike-3.jpg";
import scooter1 from "@/assets/scooter-1.jpg";
import scooter2 from "@/assets/scooter-2.jpg";
import scooter3 from "@/assets/scooter-3.jpg";

export const initialTransport: TransportItem[] = [
  { id: "BK-001", name: "City Cruiser E", type: "bike", pricePerHour: 60, pricePerMinute: 2, status: "available", image: bike1, specs: { frameSize: "M (52 см)", hasBasket: true } },
  { id: "SC-002", name: "Urban Glide X", type: "scooter", pricePerHour: 80, pricePerMinute: 3, status: "available", image: scooter1, specs: { battery: 85, range: 25 } },
  { id: "BK-003", name: "Trail Blazer 27", type: "bike", pricePerHour: 75, pricePerMinute: 2.5, status: "in-use", image: bike2, specs: { frameSize: "L (56 см)", hasBasket: false } },
  { id: "SC-004", name: "Fold & Go Lite", type: "scooter", pricePerHour: 55, pricePerMinute: 1.5, status: "available", image: scooter2, specs: { battery: 62, range: 18 } },
  { id: "BK-005", name: "Retro Classic", type: "bike", pricePerHour: 45, pricePerMinute: 1.5, status: "maintenance", image: bike3, specs: { frameSize: "S (48 см)", hasBasket: true } },
  { id: "SC-006", name: "Power Max Pro", type: "scooter", pricePerHour: 95, pricePerMinute: 3.5, status: "available", image: scooter3, specs: { battery: 95, range: 35 } },
];
