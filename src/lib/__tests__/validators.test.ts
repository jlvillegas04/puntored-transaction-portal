import { describe, it, expect } from 'vitest';
import { validatePhone, validateAmount, generateTrace } from '../validators';

describe('validatePhone', () => {
  describe('Business Rule: Phone must start with 3', () => {
    it('should accept phone numbers starting with 3', () => {
      const result = validatePhone('3001234567');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject phone numbers not starting with 3', () => {
      const result = validatePhone('2001234567');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Phone must start with 3 and be exactly 10 digits');
    });

    it('should reject phone numbers starting with 4', () => {
      const result = validatePhone('4001234567');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Phone must start with 3 and be exactly 10 digits');
    });
  });

  describe('Business Rule: Phone must be exactly 10 characters', () => {
    it('should accept phone numbers with exactly 10 digits', () => {
      const result = validatePhone('3123456789');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject phone numbers with less than 10 digits', () => {
      const result = validatePhone('312345678');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Phone must start with 3 and be exactly 10 digits');
    });

    it('should reject phone numbers with more than 10 digits', () => {
      const result = validatePhone('31234567890');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Phone must start with 3 and be exactly 10 digits');
    });

    it('should reject empty phone numbers', () => {
      const result = validatePhone('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Phone number is required');
    });
  });

  describe('Business Rule: Phone must contain only numeric values', () => {
    it('should reject phone numbers with letters', () => {
      const result = validatePhone('3abc456789');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Phone must start with 3 and be exactly 10 digits');
    });

    it('should reject phone numbers with special characters', () => {
      const result = validatePhone('312-345-678');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Phone must start with 3 and be exactly 10 digits');
    });

    it('should reject phone numbers with spaces', () => {
      const result = validatePhone('312 345 6789');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Phone must start with 3 and be exactly 10 digits');
    });
  });

  describe('Valid phone number examples', () => {
    it('should accept valid Colombian mobile numbers', () => {
      const validNumbers = [
        '3001234567',
        '3101234567',
        '3201234567',
        '3501234567',
        '3991234567',
      ];

      validNumbers.forEach((number) => {
        const result = validatePhone(number);
        expect(result.isValid).toBe(true);
        expect(result.error).toBeUndefined();
      });
    });
  });
});

describe('validateAmount', () => {
  describe('Business Rule: Minimum amount is 1,000 COP', () => {
    it('should accept amount equal to 1000', () => {
      const result = validateAmount(1000);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept amounts greater than 1000', () => {
      const result = validateAmount(5000);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject amounts less than 1000', () => {
      const result = validateAmount(999);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Amount must be at least 1,000 COP');
    });

    it('should reject amount 0', () => {
      const result = validateAmount(0);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Amount must be at least 1,000 COP');
    });

    it('should reject negative amounts', () => {
      const result = validateAmount(-100);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Amount must be at least 1,000 COP');
    });
  });

  describe('Business Rule: Maximum amount is 100,000 COP', () => {
    it('should accept amount equal to 100000', () => {
      const result = validateAmount(100000);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept amounts less than 100000', () => {
      const result = validateAmount(50000);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject amounts greater than 100000', () => {
      const result = validateAmount(100001);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Amount cannot exceed 100,000 COP');
    });

    it('should reject significantly large amounts', () => {
      const result = validateAmount(500000);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Amount cannot exceed 100,000 COP');
    });
  });

  describe('Business Rule: Amount must be a whole number', () => {
    it('should accept whole numbers', () => {
      const result = validateAmount(10000);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject decimal amounts', () => {
      const result = validateAmount(10000.50);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Amount must be a whole number');
    });

    it('should reject amounts with decimals within valid range', () => {
      const result = validateAmount(5000.99);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Amount must be a whole number');
    });
  });

  describe('Valid amount examples', () => {
    it('should accept common recharge amounts', () => {
      const validAmounts = [1000, 2000, 5000, 10000, 20000, 50000, 100000];

      validAmounts.forEach((amount) => {
        const result = validateAmount(amount);
        expect(result.isValid).toBe(true);
        expect(result.error).toBeUndefined();
      });
    });
  });
});

describe('generateTrace', () => {
  it('should generate a trace ID', () => {
    const trace = generateTrace();
    expect(trace).toBeDefined();
    expect(typeof trace).toBe('string');
  });

  it('should generate trace IDs with 12 characters or less', () => {
    const trace = generateTrace();
    expect(trace.length).toBeLessThanOrEqual(12);
  });

  it('should generate unique trace IDs', () => {
    const trace1 = generateTrace();
    const trace2 = generateTrace();
    expect(trace1).not.toBe(trace2);
  });

  it('should not contain hyphens', () => {
    const trace = generateTrace();
    expect(trace).not.toContain('-');
  });
});