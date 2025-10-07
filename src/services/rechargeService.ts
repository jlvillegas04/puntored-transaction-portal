import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import {
  FindSuppliersRequest,
  FindSuppliersResponse,
  BuyRechargeRequest,
  BuyRechargeResponse,
  Supplier,
  Ticket,
} from "@/types";

interface RawSupplier {
  supplierCode: string;
  supplierDescription: string;
  supplierLogo: string;
}

interface RawFindSuppliersResponse {
  state: boolean;
  message: string;
  code: string;
  data: {
    suppliers: RawSupplier[];
  };
}

class RechargeService {
  async findSuppliers(pointOfSale: string): Promise<FindSuppliersResponse> {
    const request: FindSuppliersRequest = { pointOfSale };
    const rawResponse = await apiClient.post<RawFindSuppliersResponse>(
      API_ENDPOINTS.FIND_SUPPLIERS,
      request
    );

    const suppliers: Supplier[] = rawResponse.data.suppliers.map((raw) => ({
      id: raw.supplierCode,
      name: raw.supplierDescription,
      productCode: raw.supplierCode,
      description: raw.supplierDescription,
    }));

    return {
      success: rawResponse.state,
      data: suppliers,
      message: rawResponse.message,
      code: rawResponse.code,
    };
  }

  async buy(request: BuyRechargeRequest, supplierName?: string): Promise<BuyRechargeResponse> {
    const rawResponse = await apiClient.post<any, BuyRechargeRequest>(
      API_ENDPOINTS.BUY,
      request
    );

    // Map raw response to typed response
    const ticketData = rawResponse.data;
    const ticket: Ticket = {
      date: ticketData.date,
      transactionId: ticketData.transactionId,
      authorizationCode: ticketData.authorizationCode,
      number: request.number,
      amount: request.amount,
      supplier: supplierName || request.productCode,
      productCode: request.productCode,
      status: rawResponse.state ? 'success' : 'failed',
      message: ticketData.message,
    };

    return {
      success: rawResponse.state,
      data: {
        ticket,
        balance: rawResponse.data?.balance,
      },
      message: rawResponse.message,
      code: rawResponse.code,
    };
  }
}

export const rechargeService = new RechargeService();