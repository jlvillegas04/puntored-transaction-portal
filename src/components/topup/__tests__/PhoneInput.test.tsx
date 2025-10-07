import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PhoneInput } from '../PhoneInput';

describe('PhoneInput', () => {
  describe('Rendering', () => {
    it('should render the phone input field', () => {
      render(<PhoneInput value="" onChange={vi.fn()} />);
      const input = screen.getByLabelText(/número de celular/i);
      expect(input).toBeInTheDocument();
    });

    it('should display helper text about phone format', () => {
      render(<PhoneInput value="" onChange={vi.fn()} />);
      const helperText = screen.getByText(/debe iniciar con 3 y tener 10 dígitos/i);
      expect(helperText).toBeInTheDocument();
    });

    it('should show error message when error prop is provided', () => {
      const errorMessage = 'Invalid phone number';
      render(<PhoneInput value="" onChange={vi.fn()} error={errorMessage} />);
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  describe('User Interaction', () => {
    it('should call onChange when user types', () => {
      const handleChange = vi.fn();
      render(<PhoneInput value="" onChange={handleChange} />);
      
      const input = screen.getByLabelText(/número de celular/i);
      fireEvent.change(input, { target: { value: '3001234567' } });
      
      expect(handleChange).toHaveBeenCalled();
    });

    it('should call onBlur when input loses focus', () => {
      const handleBlur = vi.fn();
      render(<PhoneInput value="" onChange={vi.fn()} onBlur={handleBlur} />);
      
      const input = screen.getByLabelText(/número de celular/i);
      fireEvent.blur(input);
      
      expect(handleBlur).toHaveBeenCalled();
    });
  });

  describe('Business Rule: Only numeric values allowed', () => {
    it('should strip non-numeric characters', () => {
      const handleChange = vi.fn();
      render(<PhoneInput value="" onChange={handleChange} />);
      
      const input = screen.getByLabelText(/número de celular/i);
      fireEvent.change(input, { target: { value: '3abc456def' } });
      
      // The component should call onChange with only numeric values
      expect(handleChange).toHaveBeenCalledWith('3456');
    });

    it('should remove letters from input', () => {
      const handleChange = vi.fn();
      render(<PhoneInput value="" onChange={handleChange} />);
      
      const input = screen.getByLabelText(/número de celular/i);
      fireEvent.change(input, { target: { value: '300ABCD123' } });
      
      expect(handleChange).toHaveBeenCalledWith('300123');
    });

    it('should remove special characters from input', () => {
      const handleChange = vi.fn();
      render(<PhoneInput value="" onChange={handleChange} />);
      
      const input = screen.getByLabelText(/número de celular/i);
      fireEvent.change(input, { target: { value: '300-123-4567' } });
      
      expect(handleChange).toHaveBeenCalledWith('3001234567');
    });
  });

  describe('Business Rule: Maximum 10 characters', () => {
    it('should limit input to 10 digits', () => {
      const handleChange = vi.fn();
      render(<PhoneInput value="" onChange={handleChange} />);
      
      const input = screen.getByLabelText(/número de celular/i);
      fireEvent.change(input, { target: { value: '30012345678901234' } });
      
      // Should only pass the first 10 digits
      expect(handleChange).toHaveBeenCalledWith('3001234567');
    });

    it('should allow exactly 10 digits', () => {
      const handleChange = vi.fn();
      render(<PhoneInput value="" onChange={handleChange} />);
      
      const input = screen.getByLabelText(/número de celular/i);
      fireEvent.change(input, { target: { value: '3001234567' } });
      
      expect(handleChange).toHaveBeenCalledWith('3001234567');
    });

    it('should allow less than 10 digits', () => {
      const handleChange = vi.fn();
      render(<PhoneInput value="" onChange={handleChange} />);
      
      const input = screen.getByLabelText(/número de celular/i);
      fireEvent.change(input, { target: { value: '300123' } });
      
      expect(handleChange).toHaveBeenCalledWith('300123');
    });
  });

  describe('Disabled State', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<PhoneInput value="" onChange={vi.fn()} disabled={true} />);
      
      const input = screen.getByLabelText(/número de celular/i);
      expect(input).toBeDisabled();
    });

    it('should not be disabled by default', () => {
      render(<PhoneInput value="" onChange={vi.fn()} />);
      
      const input = screen.getByLabelText(/número de celular/i);
      expect(input).not.toBeDisabled();
    });
  });

  describe('Value Display', () => {
    it('should display the current value', () => {
      render(<PhoneInput value="3001234567" onChange={vi.fn()} />);
      
      const input = screen.getByLabelText(/número de celular/i) as HTMLInputElement;
      expect(input.value).toBe('3001234567');
    });

    it('should update when value prop changes', () => {
      const { rerender } = render(<PhoneInput value="300" onChange={vi.fn()} />);
      
      let input = screen.getByLabelText(/número de celular/i) as HTMLInputElement;
      expect(input.value).toBe('300');
      
      rerender(<PhoneInput value="3001234567" onChange={vi.fn()} />);
      
      input = screen.getByLabelText(/número de celular/i) as HTMLInputElement;
      expect(input.value).toBe('3001234567');
    });
  });

  describe('Error State Styling', () => {
    it('should apply error class when error is present', () => {
      render(<PhoneInput value="" onChange={vi.fn()} error="Invalid phone" />);
      
      const input = screen.getByLabelText(/número de celular/i);
      expect(input).toHaveClass('border-destructive');
    });

    it('should not have error class when no error', () => {
      render(<PhoneInput value="" onChange={vi.fn()} />);
      
      const input = screen.getByLabelText(/número de celular/i);
      expect(input).not.toHaveClass('border-destructive');
    });
  });
});