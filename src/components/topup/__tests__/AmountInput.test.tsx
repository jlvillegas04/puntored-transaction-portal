import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AmountInput } from '../AmountInput';

describe('AmountInput', () => {
  describe('Rendering', () => {
    it('should render the amount input field', () => {
      render(<AmountInput value="" onChange={vi.fn()} />);
      const input = screen.getByLabelText(/monto \(cop\)/i);
      expect(input).toBeInTheDocument();
    });

    it('should display helper text about min and max amounts', () => {
      render(<AmountInput value="" onChange={vi.fn()} />);
      const helperText = screen.getByText(/mín: 1\.000 cop - máx: 100\.000 cop/i);
      expect(helperText).toBeInTheDocument();
    });

    it('should show error message when error prop is provided', () => {
      const errorMessage = 'Amount is too low';
      render(<AmountInput value="" onChange={vi.fn()} error={errorMessage} />);
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  describe('User Interaction', () => {
    it('should call onChange when user types', () => {
      const handleChange = vi.fn();
      render(<AmountInput value="" onChange={handleChange} />);
      
      const input = screen.getByLabelText(/monto \(cop\)/i);
      fireEvent.change(input, { target: { value: '10000' } });
      
      expect(handleChange).toHaveBeenCalled();
    });

    it('should call onBlur when input loses focus', () => {
      const handleBlur = vi.fn();
      render(<AmountInput value="" onChange={vi.fn()} onBlur={handleBlur} />);
      
      const input = screen.getByLabelText(/monto \(cop\)/i);
      fireEvent.blur(input);
      
      expect(handleBlur).toHaveBeenCalled();
    });
  });

  describe('Business Rule: Only numeric values allowed', () => {
    it('should strip non-numeric characters', () => {
      const handleChange = vi.fn();
      render(<AmountInput value="" onChange={handleChange} />);
      
      const input = screen.getByLabelText(/monto \(cop\)/i);
      fireEvent.change(input, { target: { value: '1000abc' } });
      
      expect(handleChange).toHaveBeenCalledWith('1000');
    });

    it('should remove letters from input', () => {
      const handleChange = vi.fn();
      render(<AmountInput value="" onChange={handleChange} />);
      
      const input = screen.getByLabelText(/monto \(cop\)/i);
      fireEvent.change(input, { target: { value: '50ABC00' } });
      
      expect(handleChange).toHaveBeenCalledWith('5000');
    });

    it('should remove special characters from input', () => {
      const handleChange = vi.fn();
      render(<AmountInput value="" onChange={handleChange} />);
      
      const input = screen.getByLabelText(/monto \(cop\)/i);
      fireEvent.change(input, { target: { value: '10,000.50' } });
      
      expect(handleChange).toHaveBeenCalledWith('1000050');
    });

    it('should remove decimal points', () => {
      const handleChange = vi.fn();
      render(<AmountInput value="" onChange={handleChange} />);
      
      const input = screen.getByLabelText(/monto \(cop\)/i);
      fireEvent.change(input, { target: { value: '10000.99' } });
      
      expect(handleChange).toHaveBeenCalledWith('1000099');
    });
  });

  describe('Business Rule: Min/Max amount validation display', () => {
    it('should accept amount 1000', () => {
      const handleChange = vi.fn();
      render(<AmountInput value="" onChange={handleChange} />);
      
      const input = screen.getByLabelText(/monto \(cop\)/i);
      fireEvent.change(input, { target: { value: '1000' } });
      
      expect(handleChange).toHaveBeenCalledWith('1000');
    });

    it('should accept amount 5000', () => {
      const handleChange = vi.fn();
      render(<AmountInput value="" onChange={handleChange} />);
      
      const input = screen.getByLabelText(/monto \(cop\)/i);
      fireEvent.change(input, { target: { value: '5000' } });
      
      expect(handleChange).toHaveBeenCalledWith('5000');
    });

    it('should accept amount 50000', () => {
      const handleChange = vi.fn();
      render(<AmountInput value="" onChange={handleChange} />);
      
      const input = screen.getByLabelText(/monto \(cop\)/i);
      fireEvent.change(input, { target: { value: '50000' } });
      
      expect(handleChange).toHaveBeenCalledWith('50000');
    });

    it('should accept amount 100000', () => {
      const handleChange = vi.fn();
      render(<AmountInput value="" onChange={handleChange} />);
      
      const input = screen.getByLabelText(/monto \(cop\)/i);
      fireEvent.change(input, { target: { value: '100000' } });
      
      expect(handleChange).toHaveBeenCalledWith('100000');
    });
  });

  describe('Disabled State', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<AmountInput value="" onChange={vi.fn()} disabled={true} />);
      
      const input = screen.getByLabelText(/monto \(cop\)/i);
      expect(input).toBeDisabled();
    });

    it('should not be disabled by default', () => {
      render(<AmountInput value="" onChange={vi.fn()} />);
      
      const input = screen.getByLabelText(/monto \(cop\)/i);
      expect(input).not.toBeDisabled();
    });
  });

  describe('Value Display', () => {
    it('should display the current value', () => {
      render(<AmountInput value="10000" onChange={vi.fn()} />);
      
      const input = screen.getByLabelText(/monto \(cop\)/i) as HTMLInputElement;
      expect(input.value).toBe('10000');
    });

    it('should update when value prop changes', () => {
      const { rerender } = render(<AmountInput value="1000" onChange={vi.fn()} />);
      
      let input = screen.getByLabelText(/monto \(cop\)/i) as HTMLInputElement;
      expect(input.value).toBe('1000');
      
      rerender(<AmountInput value="50000" onChange={vi.fn()} />);
      
      input = screen.getByLabelText(/monto \(cop\)/i) as HTMLInputElement;
      expect(input.value).toBe('50000');
    });
  });

  describe('Error State Styling', () => {
    it('should apply error class when error is present', () => {
      render(<AmountInput value="" onChange={vi.fn()} error="Amount too low" />);
      
      const input = screen.getByLabelText(/monto \(cop\)/i);
      expect(input).toHaveClass('border-destructive');
    });

    it('should not have error class when no error', () => {
      render(<AmountInput value="" onChange={vi.fn()} />);
      
      const input = screen.getByLabelText(/monto \(cop\)/i);
      expect(input).not.toHaveClass('border-destructive');
    });
  });

  describe('Input Type', () => {
    it('should have text type with numeric input mode', () => {
      render(<AmountInput value="" onChange={vi.fn()} />);
      
      const input = screen.getByLabelText(/monto \(cop\)/i) as HTMLInputElement;
      expect(input.type).toBe('text');
      expect(input.inputMode).toBe('numeric');
    });
  });

  describe('Common recharge amounts', () => {
    it('should handle typical recharge values', () => {
      const commonAmounts = ['1000', '2000', '5000', '10000', '20000', '50000', '100000'];
      
      commonAmounts.forEach((amount) => {
        const handleChange = vi.fn();
        const { unmount } = render(<AmountInput value="" onChange={handleChange} />);
        
        const input = screen.getByLabelText(/monto \(cop\)/i);
        fireEvent.change(input, { target: { value: amount } });
        
        expect(handleChange).toHaveBeenCalledWith(amount);
        unmount();
      });
    });
  });
});