import { useState } from 'react';
import { BuyRechargeRequest, Ticket, ApiError } from '@/types';
import { rechargeService } from '@/services/rechargeService';

export const useTopUp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ticket, setTicket] = useState<Ticket | null>(null);

  const buyTopUp = async (data: BuyRechargeRequest, supplierName?: string) => {
    try {
      setLoading(true);
      setError(null);
      setTicket(null);

      const response = await rechargeService.buy(data, supplierName);

      if (response.success && response.data.ticket) {
        setTicket(response.data.ticket);
        return response.data.ticket;
      } else {
        throw new Error(response.message || 'Transaction failed');
      }
    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage = apiError.message || 'Transaction failed. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setTicket(null);
    setError(null);
  };

  return { buyTopUp, loading, error, ticket, reset };
};