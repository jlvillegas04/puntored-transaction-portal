import { ValidationResult } from "@/types";

const VALIDATION_RULES = {
  PHONE: {
    STARTS_WITH: "3",
    LENGTH: 10,
    PATTERN: /^3\d{9}$/,
  },
  AMOUNT: {
    MIN: 1000,
    MAX: 100000,
  },
} as const;

export const validatePhone = (phone: string): ValidationResult => {
  if (!phone) {
    return { isValid: false, error: "Phone number is required" };
  }

  if (!VALIDATION_RULES.PHONE.PATTERN.test(phone)) {
    return {
      isValid: false,
      error: "Phone must start with 3 and be exactly 10 digits",
    };
  }

  return { isValid: true };
};

export const validateAmount = (amount: number): ValidationResult => {
  if (!amount || amount < VALIDATION_RULES.AMOUNT.MIN) {
    return {
      isValid: false,
      error: `Amount must be at least ${VALIDATION_RULES.AMOUNT.MIN.toLocaleString()} COP`,
    };
  }

  if (amount > VALIDATION_RULES.AMOUNT.MAX) {
    return {
      isValid: false,
      error: `Amount cannot exceed ${VALIDATION_RULES.AMOUNT.MAX.toLocaleString()} COP`,
    };
  }

  if (!Number.isInteger(amount)) {
    return {
      isValid: false,
      error: "Amount must be a whole number",
    };
  }

  return { isValid: true };
};

export const generateTrace = (): string => {
  return crypto.randomUUID().slice(0, 12).replace(/-/g, "");
};