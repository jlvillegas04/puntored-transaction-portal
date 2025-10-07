import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useTopUp } from '../useTopUp';
import { rechargeService } from '@/services/rechargeService';
import type { BuyRechargeRequest, Ticket } from '@/types';

vi.mock('@/services/rechargeService', () => ({
  rechargeService: {
    buy: vi.fn(),
  },
}));

describe('useTopUp', () => {
  const mockRequest: BuyRechargeRequest = {
    pointOfSale: 12345,
    terminal: 'TERM001',
    transactionalPassword: 'password123',
    number: '3001234567',
    amount: 10000,
    trace: 'trace123',
    productCode: 'CLARO',
    Ciudad: '11',
    Latitud: '4.6097',
    Longitud: '-74.0817',
  };

  const mockTicket: Ticket = {
    date: '2024-01-01T10:00:00Z',
    transactionId: 'TXN123456',
    authorizationCode: 'AUTH123',
    number: '3001234567',
    amount: 10000,
    supplier: 'Claro',
    productCode: 'CLARO',
    status: 'success',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should have initial loading state as false', () => {
      const { result } = renderHook(() => useTopUp());
      
      expect(result.current.loading).toBe(false);
    });

    it('should have initial error as null', () => {
      const { result } = renderHook(() => useTopUp());
      
      expect(result.current.error).toBeNull();
    });

    it('should have initial ticket as null', () => {
      const { result } = renderHook(() => useTopUp());
      
      expect(result.current.ticket).toBeNull();
    });

    it('should provide buyTopUp function', () => {
      const { result } = renderHook(() => useTopUp());
      
      expect(typeof result.current.buyTopUp).toBe('function');
    });

    it('should provide reset function', () => {
      const { result } = renderHook(() => useTopUp());
      
      expect(typeof result.current.reset).toBe('function');
    });
  });

  describe('buyTopUp - Successful Transaction', () => {
    it('should set loading to true during transaction', async () => {
      const mockBuy = vi.mocked(rechargeService.buy);
      mockBuy.mockImplementation(() => new Promise(() => {})); 

      const { result } = renderHook(() => useTopUp());

      result.current.buyTopUp(mockRequest, 'Claro');

      await waitFor(() => {
        expect(result.current.loading).toBe(true);
      });
    });

    it('should call rechargeService.buy with correct parameters', async () => {
      const mockBuy = vi.mocked(rechargeService.buy);
      mockBuy.mockResolvedValue({
        success: true,
        data: { ticket: mockTicket },
        message: 'Success',
      });

      const { result } = renderHook(() => useTopUp());

      await result.current.buyTopUp(mockRequest, 'Claro');

      expect(mockBuy).toHaveBeenCalledWith(mockRequest, 'Claro');
      expect(mockBuy).toHaveBeenCalledTimes(1);
    });

    it('should set ticket on successful transaction', async () => {
      const mockBuy = vi.mocked(rechargeService.buy);
      mockBuy.mockResolvedValue({
        success: true,
        data: { ticket: mockTicket },
        message: 'Success',
      });

      const { result } = renderHook(() => useTopUp());

      await result.current.buyTopUp(mockRequest, 'Claro');

      await waitFor(() => {
        expect(result.current.ticket).toEqual(mockTicket);
      });
    });

    it('should set loading to false after successful transaction', async () => {
      const mockBuy = vi.mocked(rechargeService.buy);
      mockBuy.mockResolvedValue({
        success: true,
        data: { ticket: mockTicket },
        message: 'Success',
      });

      const { result } = renderHook(() => useTopUp());

      await result.current.buyTopUp(mockRequest, 'Claro');

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it('should return the ticket data', async () => {
      const mockBuy = vi.mocked(rechargeService.buy);
      mockBuy.mockResolvedValue({
        success: true,
        data: { ticket: mockTicket },
        message: 'Success',
      });

      const { result } = renderHook(() => useTopUp());

      const returnedTicket = await result.current.buyTopUp(mockRequest, 'Claro');

      expect(returnedTicket).toEqual(mockTicket);
    });

    it('should clear error on successful transaction', async () => {
      const mockBuy = vi.mocked(rechargeService.buy);
      mockBuy.mockResolvedValue({
        success: true,
        data: { ticket: mockTicket },
        message: 'Success',
      });

      const { result } = renderHook(() => useTopUp());

      await result.current.buyTopUp(mockRequest, 'Claro');

      await waitFor(() => {
        expect(result.current.error).toBeNull();
      });
    });
  });

  describe('buyTopUp - Failed Transaction', () => {
    it('should throw error when transaction fails', async () => {
      const mockBuy = vi.mocked(rechargeService.buy);
      mockBuy.mockResolvedValue({
        success: false,
        data: { ticket: mockTicket },
        message: 'Transaction failed',
      });

      const { result } = renderHook(() => useTopUp());

      await expect(
        result.current.buyTopUp(mockRequest, 'Claro')
      ).rejects.toThrow('Transaction failed');
    });

    it('should set error state when transaction fails', async () => {
      const mockBuy = vi.mocked(rechargeService.buy);
      const errorMessage = 'Insufficient balance';
      mockBuy.mockRejectedValue({
        message: errorMessage,
      });

      const { result } = renderHook(() => useTopUp());

      try {
        await result.current.buyTopUp(mockRequest, 'Claro');
      } catch (error) {
        // Expected to throw
      }

      await waitFor(() => {
        expect(result.current.error).toBe(errorMessage);
      });
    });

    it('should set loading to false after failed transaction', async () => {
      const mockBuy = vi.mocked(rechargeService.buy);
      mockBuy.mockRejectedValue({
        message: 'Network error',
      });

      const { result } = renderHook(() => useTopUp());

      try {
        await result.current.buyTopUp(mockRequest, 'Claro');
      } catch (error) {
        // Expected to throw
      }

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it('should not set ticket when transaction fails', async () => {
      const mockBuy = vi.mocked(rechargeService.buy);
      mockBuy.mockRejectedValue({
        message: 'Transaction failed',
      });

      const { result } = renderHook(() => useTopUp());

      try {
        await result.current.buyTopUp(mockRequest, 'Claro');
      } catch (error) {
        // Expected to throw
      }

      await waitFor(() => {
        expect(result.current.ticket).toBeNull();
      });
    });

    it('should handle errors without message property', async () => {
      const mockBuy = vi.mocked(rechargeService.buy);
      mockBuy.mockRejectedValue(new Error());

      const { result } = renderHook(() => useTopUp());

      try {
        await result.current.buyTopUp(mockRequest, 'Claro');
      } catch (error) {
        // Expected to throw
      }

      await waitFor(() => {
        expect(result.current.error).toBe('Transaction failed. Please try again.');
      });
    });
  });

  describe('reset function', () => {
    it('should provide reset function', () => {
      const { result } = renderHook(() => useTopUp());
      
      expect(typeof result.current.reset).toBe('function');
    });

    it('should reset to initial state', () => {
      const { result } = renderHook(() => useTopUp());

      result.current.reset();

      expect(result.current.ticket).toBeNull();
      expect(result.current.error).toBeNull();
    });
  });

  describe('Business Rules Integration', () => {
    it('should handle valid minimum recharge amount (1000)', async () => {
      const mockBuy = vi.mocked(rechargeService.buy);
      const ticketWith1000 = { ...mockTicket, amount: 1000 };
      mockBuy.mockResolvedValue({
        success: true,
        data: { ticket: ticketWith1000 },
        message: 'Success',
      });

      const { result } = renderHook(() => useTopUp());
      const request = { ...mockRequest, amount: 1000 };

      await result.current.buyTopUp(request, 'Claro');

      await waitFor(() => {
        expect(result.current.ticket?.amount).toBe(1000);
      });
    });

    it('should handle valid maximum recharge amount (100000)', async () => {
      const mockBuy = vi.mocked(rechargeService.buy);
      const ticketWith100000 = { ...mockTicket, amount: 100000 };
      mockBuy.mockResolvedValue({
        success: true,
        data: { ticket: ticketWith100000 },
        message: 'Success',
      });

      const { result } = renderHook(() => useTopUp());
      const request = { ...mockRequest, amount: 100000 };

      await result.current.buyTopUp(request, 'Claro');

      await waitFor(() => {
        expect(result.current.ticket?.amount).toBe(100000);
      });
    });

    it('should handle phone numbers starting with 3', async () => {
      const mockBuy = vi.mocked(rechargeService.buy);
      const ticketWithValidPhone = { ...mockTicket, number: '3101234567' };
      mockBuy.mockResolvedValue({
        success: true,
        data: { ticket: ticketWithValidPhone },
        message: 'Success',
      });

      const { result } = renderHook(() => useTopUp());
      const request = { ...mockRequest, number: '3101234567' };

      await result.current.buyTopUp(request, 'Claro');

      await waitFor(() => {
        expect(result.current.ticket?.number).toBe('3101234567');
      });
    });
  });

  describe('Multiple Transaction Handling', () => {
    it('should handle multiple consecutive successful transactions', async () => {
      const mockBuy = vi.mocked(rechargeService.buy);
      mockBuy.mockResolvedValue({
        success: true,
        data: { ticket: mockTicket },
        message: 'Success',
      });

      const { result } = renderHook(() => useTopUp());

      await result.current.buyTopUp(mockRequest, 'Claro');
      await waitFor(() => {
        expect(result.current.ticket).not.toBeNull();
      });

      result.current.reset();

      await result.current.buyTopUp(mockRequest, 'Movistar');
      await waitFor(() => {
        expect(result.current.ticket).not.toBeNull();
      });
    });
  });
});