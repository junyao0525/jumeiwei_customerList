export type Customer = {
  id: number;
  name: string;
  orderKg: number;
  createdDate: string;
  totalOrder: number;
  type: string;
  status: string;
  requestedDate: string;
  deliverKg: number;
  remainingKg: number;
};

export type ViewMode = "table" | "card";
