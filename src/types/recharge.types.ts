import { ApiResponse } from "./common.types";

export interface Supplier {
  id: string;
  name: string;
  productCode: string;
  minAmount?: number;
  maxAmount?: number;
  description?: string;
}

export interface FindSuppliersRequest {
  pointOfSale: string;
}

export interface FindSuppliersResponse extends ApiResponse<Supplier[]> {
  success: boolean;
  data: Supplier[];
  message?: string;
}

export interface BuyRechargeRequest {
  pointOfSale: number;
  terminal: string;
  transactionalPassword: string;
  number: string;
  amount: number;
  trace: string;
  productCode: string;
  Ciudad: string;
  Latitud: string;
  Longitud: string;
}

export interface Ticket {
  date: string;
  transactionId: string;
  authorizationCode: string;
  number: string;
  amount: number;
  supplier: string;
  productCode: string;
  status: "success" | "failed" | "pending";
  balance?: number;
  message?: string;
}

export interface BuyRechargeResponse extends ApiResponse<{ ticket: Ticket }> {
  success: boolean;
  data: {
    ticket: Ticket;
    balance?: number;
  };
  message?: string;
}

export interface TransactionHistory {
  id: string;
  date: string;
  number: string;
  amount: number;
  supplier: string;
  supplierName: string;
  authorizationCode: string;
  transactionId: string;
  status: "success" | "failed" | "pending";
  productCode: string;
}