import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TopUpPage } from '../TopUpPage';

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

vi.mock('@/hooks/useSuppliers', () => ({
  useSuppliers: () => ({
    suppliers: [
      { id: '1', name: 'Claro', productCode: 'CLARO' },
      { id: '2', name: 'Movistar', productCode: 'MOVISTAR' },
    ],
    loading: false,
    error: null,
    usingCache: false,
  }),
}));

vi.mock('@/hooks/useTopUp', () => ({
  useTopUp: () => ({
    buyTopUp: vi.fn(),
    loading: false,
    error: null,
    ticket: null,
    reset: vi.fn(),
  }),
}));

vi.mock('@/services/storageService', () => ({
  storageService: {
    addTransaction: vi.fn(),
  },
}));

describe('TopUpPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Form Rendering', () => {
    it('should render the top-up form', () => {
      render(<TopUpPage />);
      
      expect(screen.getByText(/recarga de celular/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/número de celular/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/monto \(cop\)/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/terminal/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/contraseña transaccional/i)).toBeInTheDocument();
    });

    it('should render the submit button', () => {
      render(<TopUpPage />);
      
      const submitButton = screen.getByRole('button', { name: /comprar recarga/i });
      expect(submitButton).toBeInTheDocument();
    });

    it('should render all required field indicators', () => {
      render(<TopUpPage />);
      
      const labels = screen.getAllByText(/\*/);
      expect(labels.length).toBeGreaterThan(0);
    });
  });

  describe('Business Rule: Phone Validation', () => {
    it('should show error for phone not starting with 3', async () => {
      render(<TopUpPage />);
      
      const phoneInput = screen.getByLabelText(/número de celular/i);
      
      fireEvent.change(phoneInput, { target: { value: '2001234567' } });
      fireEvent.blur(phoneInput);
      
      await waitFor(() => {
        expect(screen.getByText(/phone must start with 3/i)).toBeInTheDocument();
      });
    });

    it('should show error for phone with less than 10 digits', async () => {
      render(<TopUpPage />);
      
      const phoneInput = screen.getByLabelText(/número de celular/i);
      
      fireEvent.change(phoneInput, { target: { value: '300123456' } });
      fireEvent.blur(phoneInput);
      
      await waitFor(() => {
        expect(screen.getByText(/phone must start with 3 and be exactly 10 digits/i)).toBeInTheDocument();
      });
    });

    it('should not show error for valid phone number', async () => {
      render(<TopUpPage />);
      
      const phoneInput = screen.getByLabelText(/número de celular/i);
      
      fireEvent.change(phoneInput, { target: { value: '3001234567' } });
      fireEvent.blur(phoneInput);
      
      await waitFor(() => {
        const errorMessages = screen.queryAllByText(/phone must start with 3/i);
        expect(errorMessages.length).toBe(0);
      });
    });
  });

  describe('Business Rule: Amount Validation', () => {
    it('should show error for amount less than 1000', async () => {
      render(<TopUpPage />);
      
      const amountInput = screen.getByLabelText(/monto \(cop\)/i);
      
      fireEvent.change(amountInput, { target: { value: '500' } });
      fireEvent.blur(amountInput);
      
      await waitFor(() => {
        expect(screen.getByText(/amount must be at least 1,000 cop/i)).toBeInTheDocument();
      });
    });

    it('should show error for amount greater than 100000', async () => {
      render(<TopUpPage />);
      
      const amountInput = screen.getByLabelText(/monto \(cop\)/i);
      
      fireEvent.change(amountInput, { target: { value: '150000' } });
      fireEvent.blur(amountInput);
      
      await waitFor(() => {
        expect(screen.getByText(/amount cannot exceed 100,000 cop/i)).toBeInTheDocument();
      });
    });

    it('should not show error for valid amount', async () => {
      render(<TopUpPage />);
      
      const amountInput = screen.getByLabelText(/monto \(cop\)/i);
      
      fireEvent.change(amountInput, { target: { value: '10000' } });
      fireEvent.blur(amountInput);
      
      await waitFor(() => {
        const errorMessages = screen.queryAllByText(/amount must be at least/i);
        expect(errorMessages.length).toBe(0);
      });
    });

    it('should accept minimum valid amount (1000)', async () => {
      render(<TopUpPage />);
      
      const amountInput = screen.getByLabelText(/monto \(cop\)/i);
      
      fireEvent.change(amountInput, { target: { value: '1000' } });
      fireEvent.blur(amountInput);
      
      await waitFor(() => {
        const errorMessages = screen.queryAllByText(/amount must be at least/i);
        expect(errorMessages.length).toBe(0);
      });
    });

    it('should accept maximum valid amount (100000)', async () => {
      render(<TopUpPage />);
      
      const amountInput = screen.getByLabelText(/monto \(cop\)/i);
      
      fireEvent.change(amountInput, { target: { value: '100000' } });
      fireEvent.blur(amountInput);
      
      await waitFor(() => {
        const errorMessages = screen.queryAllByText(/amount cannot exceed/i);
        expect(errorMessages.length).toBe(0);
      });
    });
  });

  describe('Form Field Interactions', () => {
    it('should update phone field when user types', () => {
      render(<TopUpPage />);
      
      const phoneInput = screen.getByLabelText(/número de celular/i) as HTMLInputElement;
      
      fireEvent.change(phoneInput, { target: { value: '3001234567' } });
      
      expect(phoneInput.value).toBe('3001234567');
    });

    it('should update amount field when user types', () => {
      render(<TopUpPage />);
      
      const amountInput = screen.getByLabelText(/monto \(cop\)/i) as HTMLInputElement;
      
      fireEvent.change(amountInput, { target: { value: '10000' } });
      
      expect(amountInput.value).toBe('10000');
    });

    it('should update terminal field when user types', () => {
      render(<TopUpPage />);
      
      const terminalInput = screen.getByLabelText(/terminal/i) as HTMLInputElement;
      
      fireEvent.change(terminalInput, { target: { value: 'TERM001' } });
      
      expect(terminalInput.value).toBe('TERM001');
    });

    it('should update password field when user types', () => {
      render(<TopUpPage />);
      
      const passwordInput = screen.getByLabelText(/contraseña transaccional/i) as HTMLInputElement;
      
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      
      expect(passwordInput.value).toBe('password123');
    });
  });

  describe('Required Fields Validation', () => {
    it('should show error when terminal is empty on blur', async () => {
      render(<TopUpPage />);
      
      const terminalInput = screen.getByLabelText(/terminal/i);
      
      fireEvent.focus(terminalInput);
      fireEvent.blur(terminalInput);
      
      await waitFor(() => {
        expect(screen.getByText(/terminal es requerido/i)).toBeInTheDocument();
      });
    });

    it('should show error when password is empty on blur', async () => {
      render(<TopUpPage />);
      
      const passwordInput = screen.getByLabelText(/contraseña transaccional/i);
      
      fireEvent.focus(passwordInput);
      fireEvent.blur(passwordInput);
      
      await waitFor(() => {
        expect(screen.getByText(/contraseña es requerida/i)).toBeInTheDocument();
      });
    });
  });

  describe('Submit Button State', () => {
    it('should have submit button enabled by default', () => {
      render(<TopUpPage />);
      
      const submitButton = screen.getByRole('button', { name: /comprar recarga/i });
      expect(submitButton).not.toBeDisabled();
    });
  });

  describe('Form Elements Accessibility', () => {
    it('should have proper labels for all form fields', () => {
      render(<TopUpPage />);
      
      expect(screen.getByLabelText(/número de celular/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/monto \(cop\)/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/terminal/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/contraseña transaccional/i)).toBeInTheDocument();
    });

    it('should have password field with type password', () => {
      render(<TopUpPage />);
      
      const passwordInput = screen.getByLabelText(/contraseña transaccional/i) as HTMLInputElement;
      expect(passwordInput.type).toBe('password');
    });
  });

  describe('Business Rules Integration', () => {
    it('should validate all business rules together', async () => {
      render(<TopUpPage />);
      
      const phoneInput = screen.getByLabelText(/número de celular/i);
      fireEvent.change(phoneInput, { target: { value: '2001234567' } });
      fireEvent.blur(phoneInput);
      
      const amountInput = screen.getByLabelText(/monto \(cop\)/i);
      fireEvent.change(amountInput, { target: { value: '500' } });
      fireEvent.blur(amountInput);
      
      await waitFor(() => {
        expect(screen.getByText(/phone must start with 3/i)).toBeInTheDocument();
        expect(screen.getByText(/amount must be at least 1,000 cop/i)).toBeInTheDocument();
      });
    });

    it('should clear errors when valid input is provided', async () => {
      render(<TopUpPage />);
      
      const phoneInput = screen.getByLabelText(/número de celular/i);
      
      fireEvent.change(phoneInput, { target: { value: '2001234567' } });
      fireEvent.blur(phoneInput);
      
      await waitFor(() => {
        expect(screen.getByText(/phone must start with 3/i)).toBeInTheDocument();
      });
      
      fireEvent.change(phoneInput, { target: { value: '3001234567' } });
      fireEvent.blur(phoneInput);
      
      await waitFor(() => {
        const errorMessages = screen.queryAllByText(/phone must start with 3/i);
        expect(errorMessages.length).toBe(0);
      });
    });
  });
});