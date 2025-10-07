# TypeScript Type Definitions

This document contains all TypeScript types and interfaces for the Puntored Mobile Top-Up Portal.

## File Structure

```
src/types/
├── auth.types.ts        # Authentication-related types
├── recharge.types.ts    # Recharge/transaction types
├── common.types.ts      # Shared/common types
└── index.ts             # Type exports
```

---

## 1. Common Types (src/types/common.types.ts)

```typescript
/**
 * Generic API response wrapper
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  code?: string;
}

/**
 * Normalized API error structure
 */
export interface ApiError {
  status: number;
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

/**
 * Validation result for form fields
 */
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Generic form errors
 */
export type FormErrors<T> = Partial<Record<keyof T, string>>;

/**
 * Generic form touched state
 */
export type FormTouched<T> = Partial<Record<keyof T, boolean>>;

/**
 * Loading state for async operations
 */
export type LoadingState = "idle" | "loading" | "success" | "error";

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page: number;
  limit: number;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

/**
 * Sort direction
 */
export type SortDirection = "asc" | "desc";

/**
 * Sort parameters
 */
export interface SortParams<T> {
  field: keyof T;
  direction: SortDirection;
}

/**
 * Filter operators
 */
export type FilterOperator =
  | "eq"
  | "ne"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "contains"
  | "startsWith"
  | "endsWith";

/**
 * Generic filter
 */
export interface Filter<T> {
  field: keyof T;
  operator: FilterOperator;
  value: unknown;
}
```

---

## 2. Authentication Types (src/types/auth.types.ts)

```typescript
import { ApiResponse } from "./common.types";

/**
 * Login credentials payload
 */
export interface LoginCredentials {
  username: string;
  password: string;
  commerce: number;
}

/**
 * Authentication token data from API
 */
export interface AuthTokenData {
  token: string;
  type: string; // e.g., "Bearer"
  expiration: string; // ISO 8601 date string
}

/**
 * API response for authentication
 */
export interface AuthResponse extends ApiResponse<AuthTokenData> {
  success: boolean;
  data: AuthTokenData;
  message?: string;
}

/**
 * Decoded token payload (if JWT)
 */
export interface TokenPayload {
  sub: string; // Subject (user ID)
  iat: number; // Issued at
  exp: number; // Expiration time
  username?: string;
  commerce?: number;
}

/**
 * Zustand auth store state
 */
export interface AuthState {
  // State
  token: string | null;
  type: string | null;
  expiration: string | null;
  isAuthenticated: boolean;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  checkExpiration: () => boolean;
  isTokenValid: () => boolean;
}

/**
 * Auth context value (if using Context API)
 */
export interface AuthContextValue extends AuthState {
  loading: boolean;
  error: string | null;
}

/**
 * Login form values
 */
export interface LoginFormValues {
  username: string;
  password: string;
}

/**
 * Login form errors
 */
export interface LoginFormErrors {
  username?: string;
  password?: string;
  general?: string;
}
```

---

## 3. Recharge Types (src/types/recharge.types.ts)

```typescript
import { ApiResponse } from "./common.types";

/**
 * Supplier/operator information
 */
export interface Supplier {
  id: string;
  name: string;
  productCode: string;
  minAmount?: number;
  maxAmount?: number;
  description?: string;
  icon?: string;
  enabled?: boolean;
}

/**
 * Request to find available suppliers
 */
export interface FindSuppliersRequest {
  pointOfSale: string;
}

/**
 * API response for suppliers
 */
export interface FindSuppliersResponse extends ApiResponse<Supplier[]> {
  success: boolean;
  data: Supplier[];
  message?: string;
}

/**
 * Buy/recharge request payload
 */
export interface BuyRechargeRequest {
  pointOfSale: number;
  terminal: string;
  transactionalPassword: string;
  number: string; // Phone number
  amount: number;
  trace: string; // Unique transaction ID
  productCode: string;
  Ciudad: string; // City code
  Latitud: string; // Latitude
  Longitud: string; // Longitude
}

/**
 * Transaction ticket information
 */
export interface Ticket {
  date: string; // ISO 8601 date string
  transactionId: string;
  authorizationCode: string;
  number: string; // Phone number
  amount: number;
  supplier: string;
  productCode: string;
  status: "success" | "failed" | "pending";
  balance?: number; // Remaining balance
  message?: string;
}

/**
 * API response for buy/recharge
 */
export interface BuyRechargeResponse extends ApiResponse<{ ticket: Ticket }> {
  success: boolean;
  data: {
    ticket: Ticket;
    balance?: number;
  };
  message?: string;
}

/**
 * Transaction history item
 */
export interface TransactionHistory {
  id: string; // Same as trace
  date: string; // ISO 8601 date string
  number: string;
  amount: number;
  supplier: string;
  supplierName: string;
  authorizationCode: string;
  transactionId: string;
  status: "success" | "failed" | "pending";
  productCode: string;
}

/**
 * Top-up form values
 */
export interface TopUpFormValues {
  supplier: string;
  phone: string;
  amount: string; // String for input, converted to number
  terminal: string;
  transactionalPassword: string;
}

/**
 * Top-up form errors
 */
export interface TopUpFormErrors {
  supplier?: string;
  phone?: string;
  amount?: string;
  terminal?: string;
  transactionalPassword?: string;
  general?: string;
}

/**
 * Geolocation data
 */
export interface GeolocationData {
  latitude: string;
  longitude: string;
  city: string;
}

/**
 * Transaction status
 */
export type TransactionStatus = "success" | "failed" | "pending";

/**
 * Transaction filter options
 */
export interface TransactionFilter {
  startDate?: string;
  endDate?: string;
  status?: TransactionStatus;
  supplier?: string;
  minAmount?: number;
  maxAmount?: number;
}

/**
 * Transaction statistics
 */
export interface TransactionStats {
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  totalAmount: number;
  averageAmount: number;
  mostUsedSupplier?: string;
}

/**
 * Recharge service response
 */
export interface RechargeServiceResponse<T> {
  data: T;
  error: string | null;
  loading: boolean;
}
```

---

## 4. Component Props Types

```typescript
// src/components/auth/LoginForm.tsx
export interface LoginFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
}

// src/components/topup/TopUpForm.tsx
export interface TopUpFormProps {
  onSuccess?: (ticket: Ticket) => void;
  onError?: (error: string) => void;
  className?: string;
}

// src/components/topup/SupplierSelect.tsx
export interface SupplierSelectProps {
  value: string;
  onChange: (value: string) => void;
  suppliers: Supplier[];
  loading?: boolean;
  error?: string | null;
  disabled?: boolean;
  className?: string;
}

// src/components/topup/PhoneInput.tsx
export interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  disabled?: boolean;
  className?: string;
}

// src/components/topup/AmountInput.tsx
export interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  min?: number;
  max?: number;
  disabled?: boolean;
  className?: string;
}

// src/components/topup/TicketCard.tsx
export interface TicketCardProps {
  ticket: Ticket;
  onClose?: () => void;
  onPrint?: () => void;
  className?: string;
}

// src/components/history/HistoryTable.tsx
export interface HistoryTableProps {
  transactions: TransactionHistory[];
  loading?: boolean;
  onRefresh?: () => void;
  onExport?: () => void;
  className?: string;
}

// src/components/history/TransactionRow.tsx
export interface TransactionRowProps {
  transaction: TransactionHistory;
  onClick?: (transaction: TransactionHistory) => void;
  className?: string;
}

// src/components/layout/AppLayout.tsx
export interface AppLayoutProps {
  children: React.ReactNode;
  className?: string;
}

// src/components/layout/Header.tsx
export interface HeaderProps {
  username?: string;
  onLogout?: () => void;
  className?: string;
}

// src/components/layout/ProtectedRoute.tsx
export interface ProtectedRouteProps {
  children?: React.ReactNode;
  redirectTo?: string;
}
```

---

## 5. Hook Types

```typescript
// src/hooks/useAuth.ts
export interface UseAuthReturn extends AuthState {
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

// src/hooks/useSuppliers.ts
export interface UseSuppliersReturn {
  suppliers: Supplier[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// src/hooks/useTopUp.ts
export interface UseTopUpParams {
  onSuccess?: (ticket: Ticket) => void;
  onError?: (error: string) => void;
}

export interface UseTopUpReturn {
  buyTopUp: (data: BuyRechargeRequest) => Promise<void>;
  loading: boolean;
  error: string | null;
  ticket: Ticket | null;
  reset: () => void;
}

// src/hooks/useHistory.ts
export interface UseHistoryReturn {
  transactions: TransactionHistory[];
  loading: boolean;
  error: string | null;
  addTransaction: (transaction: TransactionHistory) => void;
  clearHistory: () => void;
  filterTransactions: (filter: TransactionFilter) => TransactionHistory[];
  getStats: () => TransactionStats;
}

// src/hooks/useFormValidation.ts
export type ValidationRule<T> = (value: T) => ValidationResult;
export type ValidationRules<T> = Partial<Record<keyof T, ValidationRule<any>>>;

export interface UseFormValidationReturn<T> {
  values: T;
  errors: FormErrors<T>;
  touched: FormTouched<T>;
  isValid: boolean;
  handleChange: (name: keyof T, value: any) => void;
  handleBlur: (name: keyof T) => void;
  validateAll: () => boolean;
  setValues: (values: T) => void;
  reset: () => void;
}

// src/hooks/useGeolocation.ts
export interface UseGeolocationReturn {
  location: GeolocationData | null;
  loading: boolean;
  error: string | null;
  getLocation: () => Promise<void>;
}
```

---

## 6. Service Types

```typescript
// src/services/authService.ts
export interface AuthService {
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  refreshToken?(): Promise<AuthResponse>;
  validateToken(token: string): boolean;
}

// src/services/rechargeService.ts
export interface RechargeService {
  findSuppliers(pointOfSale: string): Promise<FindSuppliersResponse>;
  buy(request: BuyRechargeRequest): Promise<BuyRechargeResponse>;
}

// src/services/storageService.ts
export interface StorageService {
  // Generic storage operations
  getItem<T>(key: string): T | null;
  setItem<T>(key: string, value: T): void;
  removeItem(key: string): void;
  clear(): void;

  // Transaction history specific
  getHistory(): TransactionHistory[];
  addTransaction(transaction: TransactionHistory): void;
  clearHistory(): void;

  // Auth specific (optional, handled by Zustand)
  getAuthToken(): string | null;
  setAuthToken(token: string, type: string, expiration: string): void;
  clearAuthToken(): void;
}
```

---

## 7. Utility Types

```typescript
// src/lib/validators.ts
export interface PhoneValidationOptions {
  required?: boolean;
  startsWith?: string;
  length?: number;
}

export interface AmountValidationOptions {
  required?: boolean;
  min?: number;
  max?: number;
  integer?: boolean;
}

export interface ValidationOptions {
  phone?: PhoneValidationOptions;
  amount?: AmountValidationOptions;
}

// src/lib/formatters.ts
export interface FormatCurrencyOptions {
  locale?: string;
  currency?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

export interface FormatDateOptions {
  locale?: string;
  dateStyle?: "full" | "long" | "medium" | "short";
  timeStyle?: "full" | "long" | "medium" | "short";
}
```

---

## 8. Test Types

```typescript
// tests/setup.ts
export interface MockApiClient {
  post: jest.Mock;
  get: jest.Mock;
  put: jest.Mock;
  delete: jest.Mock;
}

export interface MockAuthStore {
  token: string | null;
  isAuthenticated: boolean;
  login: jest.Mock;
  logout: jest.Mock;
}

export interface TestProviders {
  wrapper: React.ComponentType<{ children: React.ReactNode }>;
}

export interface RenderOptions {
  initialEntries?: string[];
  authState?: Partial<AuthState>;
}

// Test fixtures
export interface MockSupplier extends Supplier {
  id: string;
  name: string;
  productCode: string;
}

export interface MockTicket extends Ticket {
  date: string;
  transactionId: string;
  authorizationCode: string;
}

export interface MockTransaction extends TransactionHistory {
  id: string;
  date: string;
}
```

---

## 9. Environment Types

```typescript
// src/env.d.ts
interface ImportMetaEnv {
  readonly VITE_API_BASE: string;
  readonly VITE_POINT_OF_SALE: string;
  readonly VITE_USERNAME: string;
  readonly VITE_COMMERCE: string;
  readonly VITE_CITY_CODE: string;
  readonly VITE_DEFAULT_LATITUDE: string;
  readonly VITE_DEFAULT_LONGITUDE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

---

## 10. Router Types

```typescript
// src/App.tsx
export type RouteConfig = {
  path: string;
  element: React.ReactElement;
  protected?: boolean;
  title?: string;
};

export interface NavigationItem {
  path: string;
  label: string;
  icon?: React.ComponentType;
  protected?: boolean;
}
```

---

## 11. Constants Types

```typescript
// src/constants/index.ts
export const ROUTES = {
  LOGIN: "/login",
  TOPUP: "/topup",
  HISTORY: "/history",
  ROOT: "/",
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];

export const STORAGE_KEYS = {
  AUTH: "auth-storage",
  HISTORY: "puntored_transaction_history",
  PREFERENCES: "user-preferences",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

export const VALIDATION_RULES = {
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

export const API_ENDPOINTS = {
  AUTH: "/auth",
  FIND_SUPPLIERS: "/recharge/find-suppliers",
  BUY: "/recharge/buy",
} as const;

export type ApiEndpoint = (typeof API_ENDPOINTS)[keyof typeof API_ENDPOINTS];
```

---

## 12. Type Guards

```typescript
// src/lib/typeGuards.ts

/**
 * Type guard for API errors
 */
export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    "message" in error
  );
}

/**
 * Type guard for successful API responses
 */
export function isSuccessResponse<T>(
  response: ApiResponse<T>
): response is ApiResponse<T> & { success: true } {
  return response.success === true;
}

/**
 * Type guard for valid phone number
 */
export function isValidPhone(value: string): value is string {
  return /^3\d{9}$/.test(value);
}

/**
 * Type guard for valid amount
 */
export function isValidAmount(value: number): value is number {
  return (
    Number.isInteger(value) &&
    value >= VALIDATION_RULES.AMOUNT.MIN &&
    value <= VALIDATION_RULES.AMOUNT.MAX
  );
}

/**
 * Type guard for transaction history
 */
export function isTransactionHistory(
  value: unknown
): value is TransactionHistory {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "date" in value &&
    "number" in value &&
    "amount" in value &&
    "status" in value
  );
}
```

---

## 13. Mapped Types & Utilities

```typescript
// src/types/utilities.ts

/**
 * Make all properties required and non-nullable
 */
export type RequiredNotNull<T> = {
  [P in keyof T]-?: NonNullable<T[P]>;
};

/**
 * Make specified properties optional
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Make specified properties required
 */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;

/**
 * Extract promise type
 */
export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

/**
 * Async function type
 */
export type AsyncFunction<T = void> = (...args: any[]) => Promise<T>;

/**
 * Extract data type from API response
 */
export type ExtractApiData<T> = T extends ApiResponse<infer U> ? U : never;

/**
 * Deep partial type
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Deep readonly type
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};
```

---

## 14. Form Handling Types

```typescript
// src/types/forms.types.ts

/**
 * Generic form state
 */
export interface FormState<T> {
  values: T;
  errors: FormErrors<T>;
  touched: FormTouched<T>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
}

/**
 * Form field props
 */
export interface FormFieldProps<T = string> {
  name: string;
  value: T;
  onChange: (value: T) => void;
  onBlur: () => void;
  error?: string;
  touched?: boolean;
  disabled?: boolean;
  required?: boolean;
}

/**
 * Form submission handler
 */
export type FormSubmitHandler<T> = (
  values: T,
  helpers: FormHelpers<T>
) => void | Promise<void>;

/**
 * Form helpers
 */
export interface FormHelpers<T> {
  setSubmitting: (isSubmitting: boolean) => void;
  setErrors: (errors: FormErrors<T>) => void;
  setFieldError: (field: keyof T, error: string) => void;
  resetForm: () => void;
}
```

---

## Type Export Index (src/types/index.ts)

```typescript
// Common types
export * from "./common.types";

// Auth types
export * from "./auth.types";

// Recharge types
export * from "./recharge.types";

// Form types
export * from "./forms.types";

// Utility types
export * from "./utilities";
```

---

## Usage Examples

### Example 1: Using Auth Types

```typescript
import { AuthState, LoginCredentials } from "@/types";

const authStore = create<AuthState>((set) => ({
  token: null,
  type: null,
  expiration: null,
  isAuthenticated: false,

  login: async (credentials: LoginCredentials) => {
    // Implementation
  },

  logout: () => {
    set({ token: null, isAuthenticated: false });
  },

  checkExpiration: () => {
    // Implementation
    return true;
  },

  isTokenValid: () => {
    // Implementation
    return true;
  },
}));
```

### Example 2: Using Recharge Types

```typescript
import { BuyRechargeRequest, Ticket } from "@/types";

const handlePurchase = async (formData: TopUpFormValues): Promise<Ticket> => {
  const request: BuyRechargeRequest = {
    pointOfSale: Number(import.meta.env.VITE_POINT_OF_SALE),
    terminal: formData.terminal,
    transactionalPassword: formData.transactionalPassword,
    number: formData.phone,
    amount: Number(formData.amount),
    trace: generateTrace(),
    productCode: formData.supplier,
    Ciudad: import.meta.env.VITE_CITY_CODE,
    Latitud: import.meta.env.VITE_DEFAULT_LATITUDE,
    Longitud: import.meta.env.VITE_DEFAULT_LONGITUDE,
  };

  const response = await rechargeService.buy(request);
  return response.data.ticket;
};
```

### Example 3: Using Validation Types

```typescript
import { ValidationResult, PhoneValidationOptions } from "@/types";

const validatePhone = (
  phone: string,
  options?: PhoneValidationOptions
): ValidationResult => {
  const { required = true, startsWith = "3", length = 10 } = options || {};

  if (!phone && required) {
    return { isValid: false, error: "Phone number is required" };
  }

  const pattern = new RegExp(`^${startsWith}\\d{${length - 1}}$`);

  if (!pattern.test(phone)) {
    return {
      isValid: false,
      error: `Phone must start with ${startsWith} and be ${length} digits`,
    };
  }

  return { isValid: true };
};
```

---

## Type Safety Best Practices

1. **Always use explicit types**: Avoid `any` at all costs
2. **Use type guards**: For runtime type checking
3. **Leverage mapped types**: For DRY code
4. **Use const assertions**: For literal types
5. **Export all types**: From a central index file
6. **Document complex types**: With JSDoc comments
7. **Use discriminated unions**: For variant types
8. **Prefer interfaces over types**: For object shapes
9. **Use generics**: For reusable types
10. **Type API responses**: Always type external data

---

_This document serves as a comprehensive reference for all TypeScript types used in the project._
