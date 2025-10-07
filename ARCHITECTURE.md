# Puntored Mobile Top-Up Portal - Technical Architecture

## 📋 Executive Summary

This document outlines the technical architecture for a production-ready Mobile Top-Up transactional portal for Puntored. The solution follows a progressive enhancement approach (Level 0 → Level 4), emphasizing clean architecture, type safety, testability, and excellent UX.

---

## 🎯 Core Requirements Analysis

### Functional Requirements

1. **Authentication**: Secure login with token-based auth
2. **Top-Up Flow**: Multi-step transaction with supplier selection, validation, and ticket generation
3. **Transaction History**: Persistent local storage of completed transactions
4. **Validation**: Client-side business rules enforcement
5. **Error Handling**: Graceful error states with user feedback

### Non-Functional Requirements

- **Type Safety**: Comprehensive TypeScript coverage
- **Performance**: Fast, responsive UI with optimistic updates
- **UX**: Loading states, skeleton screens, error toasts, accessibility
- **Testability**: Unit and integration tests (>80% coverage target)
- **Maintainability**: Clean code, separation of concerns, SOLID principles
- **Extensibility**: Easy to add new payment methods or transaction types

### Business Rules (Client-Side Validation)

```typescript
// Phone number validation
- Must start with "3"
- Exactly 10 digits
- Numeric only
- Regex: /^3\d{9}$/

// Amount validation
- Minimum: 1,000 COP
- Maximum: 100,000 COP
- Must be integer
```

---

## 🏗️ Folder Structure

```
puntored-transaction-portal/
├── public/
│   └── vite.svg
├── src/
│   ├── api/
│   │   ├── client.ts              # Axios instance with interceptors
│   │   ├── endpoints.ts           # API endpoint definitions
│   │   └── types.ts               # API request/response types
│   ├── components/
│   │   ├── ui/                    # ShadCN components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── select.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── toaster.tsx
│   │   │   ├── skeleton.tsx
│   │   │   └── table.tsx
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx      # Main layout with navigation
│   │   │   ├── Header.tsx         # Header with user info
│   │   │   └── ProtectedRoute.tsx # Route guard HOC
│   │   ├── auth/
│   │   │   └── LoginForm.tsx      # Login form component
│   │   ├── topup/
│   │   │   ├── TopUpForm.tsx      # Main top-up form
│   │   │   ├── SupplierSelect.tsx # Supplier dropdown
│   │   │   ├── PhoneInput.tsx     # Phone validation input
│   │   │   ├── AmountInput.tsx    # Amount validation input
│   │   │   └── TicketCard.tsx     # Transaction receipt
│   │   └── history/
│   │       ├── HistoryTable.tsx   # Transaction history table
│   │       └── TransactionRow.tsx # Individual transaction row
│   ├── hooks/
│   │   ├── useAuth.ts             # Auth state and actions
│   │   ├── useSuppliers.ts        # Fetch and cache suppliers
│   │   ├── useTopUp.ts            # Top-up transaction logic
│   │   └── useHistory.ts          # Transaction history logic
│   ├── lib/
│   │   ├── utils.ts               # General utilities (cn, formatters)
│   │   └── validators.ts          # Validation functions
│   ├── pages/
│   │   ├── LoginPage.tsx          # /login
│   │   ├── TopUpPage.tsx          # /topup (protected)
│   │   └── HistoryPage.tsx        # /history (protected)
│   ├── services/
│   │   ├── authService.ts         # Authentication API calls
│   │   ├── rechargeService.ts     # Recharge API calls
│   │   └── storageService.ts      # localStorage abstraction
│   ├── store/
│   │   ├── authStore.ts           # Zustand auth store
│   │   └── index.ts               # Store exports
│   ├── types/
│   │   ├── auth.types.ts          # Auth-related types
│   │   ├── recharge.types.ts      # Recharge/transaction types
│   │   └── index.ts               # Type exports
│   ├── App.tsx                    # Root component with router
│   ├── main.tsx                   # Entry point
│   └── index.css                  # Tailwind imports
├── tests/
│   ├── unit/
│   │   ├── validators.test.ts     # Validation function tests
│   │   └── utils.test.ts          # Utility function tests
│   ├── integration/
│   │   ├── LoginPage.test.tsx     # Login flow tests
│   │   ├── TopUpPage.test.tsx     # Top-up flow tests
│   │   └── HistoryPage.test.tsx   # History tests
│   └── setup.ts                   # Test setup and mocks
├── .env.example                   # Environment variables template
├── .env                           # Local environment (gitignored)
├── .eslintrc.cjs                  # ESLint configuration
├── .prettierrc                    # Prettier configuration
├── index.html                     # HTML entry
├── package.json                   # Dependencies
├── postcss.config.js              # PostCSS config
├── tailwind.config.js             # Tailwind configuration
├── tsconfig.json                  # TypeScript configuration
├── tsconfig.node.json             # Node TypeScript config
├── vite.config.ts                 # Vite configuration
├── vitest.config.ts               # Vitest configuration
├── components.json                # ShadCN configuration
├── ARCHITECTURE.md                # This file
└── README.md                      # Project documentation
```

---

## 📦 TypeScript Type System

### Core Type Definitions

```typescript
// src/types/auth.types.ts
export interface LoginCredentials {
  username: string;
  password: string;
  commerce: number;
}

export interface AuthTokenData {
  token: string;
  type: string;
  expiration: string;
}

export interface AuthResponse {
  success: boolean;
  data: AuthTokenData;
  message?: string;
}

export interface AuthState {
  token: string | null;
  type: string | null;
  expiration: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  checkExpiration: () => boolean;
}

// src/types/recharge.types.ts
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

export interface FindSuppliersResponse {
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
  status: "success" | "failed";
}

export interface BuyRechargeResponse {
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
  authorizationCode: string;
  status: "success" | "failed";
}

// Validation types
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface FormErrors {
  phone?: string;
  amount?: string;
  supplier?: string;
  terminal?: string;
  password?: string;
}
```

---

## 🔧 API Client Architecture

### Design Principles

1. **Centralized Configuration**: Single axios instance with base URL
2. **Automatic Auth Injection**: Interceptor adds Bearer token
3. **Error Normalization**: Consistent error format across app
4. **Type Safety**: Fully typed request/response
5. **Retry Logic**: Automatic retry for transient failures

### Implementation Strategy

```typescript
// src/api/client.ts
import axios, { AxiosError, AxiosInstance } from "axios";

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_BASE,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor: inject auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("auth_token");
        const type = localStorage.getItem("auth_type");

        if (token && type) {
          config.headers.Authorization = `${type} ${token}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor: normalize errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const normalizedError = this.normalizeError(error);
        return Promise.reject(normalizedError);
      }
    );
  }

  private normalizeError(error: AxiosError): ApiError {
    if (error.response) {
      return {
        status: error.response.status,
        message: error.response.data?.message || "Server error",
        code: error.response.data?.code,
      };
    } else if (error.request) {
      return {
        status: 0,
        message: "Network error. Please check your connection.",
      };
    } else {
      return {
        status: 0,
        message: error.message || "Unknown error",
      };
    }
  }

  // Generic typed methods
  async post<TResponse, TRequest = unknown>(
    url: string,
    data?: TRequest
  ): Promise<TResponse> {
    const response = await this.client.post<TResponse>(url, data);
    return response.data;
  }

  async get<TResponse>(url: string): Promise<TResponse> {
    const response = await this.client.get<TResponse>(url);
    return response.data;
  }
}

export const apiClient = new ApiClient();
```

---

## 🗄️ State Management (Zustand)

### Why Zustand?

- Lightweight (~1KB)
- No boilerplate
- Easy localStorage persistence
- Built-in DevTools support
- TypeScript-friendly

### Auth Store Design

```typescript
// src/store/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthState } from "@/types/auth.types";
import { authService } from "@/services/authService";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      type: null,
      expiration: null,
      isAuthenticated: false,

      login: async (credentials) => {
        const response = await authService.login(credentials);

        set({
          token: response.data.token,
          type: response.data.type,
          expiration: response.data.expiration,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          token: null,
          type: null,
          expiration: null,
          isAuthenticated: false,
        });
      },

      checkExpiration: () => {
        const { expiration } = get();
        if (!expiration) return false;

        const isExpired = new Date(expiration) < new Date();

        if (isExpired) {
          get().logout();
          return false;
        }

        return true;
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        token: state.token,
        type: state.type,
        expiration: state.expiration,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
```

---

## 🛣️ Routing Architecture

### Route Structure

```typescript
// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/topup" element={<TopUpPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Route>

        {/* Redirects */}
        <Route path="/" element={<Navigate to="/topup" replace />} />
        <Route path="*" element={<Navigate to="/topup" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
```

### Protected Route Pattern

```typescript
// src/components/layout/ProtectedRoute.tsx
const ProtectedRoute = () => {
  const { isAuthenticated, checkExpiration } = useAuthStore();

  useEffect(() => {
    checkExpiration();
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
};
```

---

## ✅ Validation Strategy

### Client-Side Validation

```typescript
// src/lib/validators.ts

export const validatePhone = (phone: string): ValidationResult => {
  if (!phone) {
    return { isValid: false, error: "Phone number is required" };
  }

  if (!/^3\d{9}$/.test(phone)) {
    return {
      isValid: false,
      error: "Phone must start with 3 and be exactly 10 digits",
    };
  }

  return { isValid: true };
};

export const validateAmount = (amount: number): ValidationResult => {
  if (!amount || amount < 1000) {
    return {
      isValid: false,
      error: "Amount must be at least 1,000 COP",
    };
  }

  if (amount > 100000) {
    return {
      isValid: false,
      error: "Amount cannot exceed 100,000 COP",
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
```

### Form-Level Validation Hook

```typescript
// src/hooks/useFormValidation.ts
export const useFormValidation = <T extends Record<string, any>>(
  initialValues: T,
  validationRules: ValidationRules<T>
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const validateField = (name: keyof T, value: any): string | undefined => {
    const rule = validationRules[name];
    if (!rule) return undefined;

    const result = rule(value);
    return result.isValid ? undefined : result.error;
  };

  const handleChange = (name: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (name: keyof T) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, values[name]);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateAll = (): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.keys(validationRules).forEach((key) => {
      const error = validateField(key as keyof T, values[key as keyof T]);
      if (error) {
        newErrors[key as keyof T] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    setValues,
  };
};
```

---

## 💾 Local Storage Strategy

### Transaction History Persistence

```typescript
// src/services/storageService.ts

const STORAGE_KEYS = {
  HISTORY: "puntored_transaction_history",
  AUTH: "auth-storage", // managed by Zustand
} as const;

export const storageService = {
  // Transaction history
  getHistory: (): TransactionHistory[] => {
    const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return data ? JSON.parse(data) : [];
  },

  addTransaction: (transaction: TransactionHistory): void => {
    const history = storageService.getHistory();
    history.unshift(transaction); // Add to beginning
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  },

  clearHistory: (): void => {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
  },

  // Optional: IndexedDB for larger datasets
  async migrateToIndexedDB(): Promise<void> {
    // Future enhancement for Level 4
  },
};
```

---

## 🎨 UI/UX Design Principles

### Component Library: ShadCN

- Unstyled, accessible components
- Full customization with Tailwind
- Copy-paste approach (no runtime dependency)
- Built on Radix UI primitives

### UX Patterns

#### Loading States

```typescript
// Skeleton screens during data fetch
<SupplierSelect>
  {isLoading ? <Skeleton className="h-10 w-full" /> : <Select>...</Select>}
</SupplierSelect>
```

#### Error Handling

```typescript
// Toast notifications for errors
import { useToast } from "@/components/ui/use-toast";

const { toast } = useToast();

const handleError = (error: ApiError) => {
  toast({
    variant: "destructive",
    title: "Transaction Failed",
    description: error.message,
  });
};
```

#### Disabled States

```typescript
// Submit button disabled until valid
<Button type="submit" disabled={!isValid || isSubmitting} className="w-full">
  {isSubmitting ? "Processing..." : "Buy Top-Up"}
</Button>
```

#### Optimistic Updates

```typescript
// Immediately update UI, rollback on error
const handleBuy = async (data: BuyRechargeRequest) => {
  const optimisticTransaction = {
    id: generateTrace(),
    ...data,
    status: "pending",
  };

  // Update UI
  addOptimisticTransaction(optimisticTransaction);

  try {
    const result = await rechargeService.buy(data);
    updateTransaction(optimisticTransaction.id, result);
  } catch (error) {
    removeTransaction(optimisticTransaction.id);
    handleError(error);
  }
};
```

---

## 🧪 Testing Strategy

### Test Pyramid

```
        /\
       /  \       E2E Tests (Manual/Playwright - Level 4)
      /    \
     /------\     Integration Tests (RTL)
    /        \
   /----------\   Unit Tests (Vitest)
  /__________  \
```

### Unit Tests (Vitest)

```typescript
// tests/unit/validators.test.ts
describe("validatePhone", () => {
  it("should accept valid phone starting with 3", () => {
    expect(validatePhone("3183372233").isValid).toBe(true);
  });

  it("should reject phone not starting with 3", () => {
    expect(validatePhone("2183372233").isValid).toBe(false);
  });

  it("should reject phone with incorrect length", () => {
    expect(validatePhone("318337223").isValid).toBe(false);
  });
});
```

### Integration Tests (RTL)

```typescript
// tests/integration/TopUpPage.test.tsx
describe("TopUpPage", () => {
  it("should disable submit until form is valid", async () => {
    render(<TopUpPage />);

    const submitButton = screen.getByRole("button", { name: /buy/i });
    expect(submitButton).toBeDisabled();

    await userEvent.type(screen.getByLabelText(/phone/i), "3183372233");
    await userEvent.type(screen.getByLabelText(/amount/i), "10000");

    expect(submitButton).toBeEnabled();
  });

  it("should show ticket after successful purchase", async () => {
    mockApiClient.post.mockResolvedValue({
      success: true,
      data: { ticket: mockTicket },
    });

    render(<TopUpPage />);

    // Fill form and submit
    await fillAndSubmitForm();

    // Assert ticket is displayed
    expect(screen.getByText(/transaction successful/i)).toBeInTheDocument();
    expect(screen.getByText(mockTicket.authorizationCode)).toBeInTheDocument();
  });
});
```

### Test Coverage Goals

- Unit tests: >90% for utilities and validators
- Integration tests: >80% for components and pages
- Critical paths: 100% (auth, purchase flow)

---

## 🔒 Security Considerations

### Authentication

- Token stored in localStorage (XSS mitigation via CSP)
- Token expiration check on route navigation
- Automatic logout on token expiration

### Input Validation

- Client-side validation (UX)
- Server-side validation (security)
- Sanitize inputs before API calls

### API Security

- HTTPS only (enforced by API)
- CORS headers (handled by API)
- Rate limiting (handled by API)

### Data Privacy

- No sensitive data in logs
- Transaction history stored locally only
- Clear data on logout option

---

## 📊 Performance Optimization

### Bundle Size

- Code splitting by route
- Lazy loading for heavy components
- Tree-shaking unused ShadCN components

### Runtime Performance

- Memoization for expensive computations
- Virtual scrolling for large history lists (Level 4)
- Debounced validation for input fields

### Network Optimization

- Request caching for suppliers list
- Retry logic for failed requests
- Loading states to prevent duplicate requests

---

## 🚀 Deployment Strategy

### Environment Configuration

```bash
# .env.example
VITE_API_BASE=https://services.preprodcxr.co/puntored/api/v1
VITE_POINT_OF_SALE=271826
VITE_USERNAME=PRUEBACONEXRED
VITE_COMMERCE=539998
```

### Build Configuration

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "ui-vendor": ["@radix-ui/react-select", "@radix-ui/react-toast"],
        },
      },
    },
  },
});
```

---

## 🔄 Level 4: Microfrontend Architecture (Optional)

### Module Federation Setup

```typescript
// vite.config.ts (with Module Federation)
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "topup-module",
      filename: "remoteEntry.js",
      exposes: {
        "./TopUpApp": "./src/App.tsx",
        "./TopUpForm": "./src/components/topup/TopUpForm.tsx",
      },
      shared: ["react", "react-dom", "react-router-dom"],
    }),
  ],
});
```

### Host Shell Integration

```typescript
// host-app/src/App.tsx
const TopUpModule = React.lazy(() => import("topup-module/TopUpApp"));

const App = () => {
  return (
    <Suspense fallback={<Loading />}>
      <TopUpModule />
    </Suspense>
  );
};
```

---

## 📈 Future Enhancements

### Phase 2 Features

1. **Multi-language support** (i18n with react-i18next)
2. **Dark mode** (Tailwind dark: variant)
3. **PWA capabilities** (offline support, install prompt)
4. **Export history** (CSV/PDF download)
5. **Advanced filtering** (date range, amount, supplier)

### Phase 3 Features

1. **Real-time updates** (WebSocket for transaction status)
2. **Push notifications** (service worker)
3. **Biometric auth** (WebAuthn API)
4. **QR code scanner** (for phone number input)
5. **Analytics dashboard** (spending patterns, insights)

---

## 🛠️ Development Workflow

### Git Strategy

```
main          Production-ready code
├── develop   Integration branch
    ├── feature/level-0-auth
    ├── feature/level-1-topup
    ├── feature/level-2-history
    └── feature/level-3-testing
```

### Commit Convention

```
feat(auth): implement login page with token persistence
fix(topup): validate phone number before submission
test(validators): add unit tests for amount validation
docs(readme): update setup instructions
```

### Code Review Checklist

- [ ] TypeScript types defined
- [ ] Unit tests written
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Accessibility reviewed
- [ ] Mobile responsive
- [ ] Code documented

---

## 📚 Technology Justifications

| Technology                | Justification                                               |
| ------------------------- | ----------------------------------------------------------- |
| **Vite**                  | Fast dev server, optimized builds, modern tooling           |
| **TypeScript**            | Type safety, better IDE support, fewer runtime errors       |
| **React 18**              | Concurrent features, suspense, excellent ecosystem          |
| **Zustand**               | Lightweight, simple API, built-in persistence               |
| **React Router 6**        | Standard routing solution, type-safe, nested routes         |
| **TailwindCSS**           | Utility-first, fast prototyping, consistent design          |
| **ShadCN**                | Accessible, customizable, no runtime overhead               |
| **Vitest**                | Fast, Vite-native, Jest-compatible API                      |
| **React Testing Library** | User-centric tests, maintainable, encourages best practices |

---

## 🎓 Key Architectural Decisions

### 1. Zustand over Redux

**Why:** Simpler API, less boilerplate, built-in persistence. Redux would be overkill for this app's state complexity.

### 2. ShadCN over Material-UI

**Why:** No runtime dependency, full customization, better performance. MUI adds significant bundle size.

### 3. LocalStorage over IndexedDB

**Why:** Simpler API, sufficient for current needs. Can migrate to IndexedDB in Level 4 if needed.

### 4. Monorepo Structure (for Level 4)

**Why:** Single repository for host + modules, shared tooling, easier development. Requires Nx or Turborepo.

### 5. Client-Side Validation + Server Trust

**Why:** Better UX with immediate feedback, but always trust server as source of truth.

---

## 📋 Implementation Checklist

### Level 0: Scaffold & Auth

- [ ] Initialize Vite + React + TypeScript
- [ ] Setup Tailwind CSS
- [ ] Install and configure ShadCN
- [ ] Install React Router + Zustand
- [ ] Create folder structure
- [ ] Define TypeScript types
- [ ] Implement API client
- [ ] Create auth store
- [ ] Build login page
- [ ] Setup protected routes

### Level 1: Top-Up Flow

- [ ] Create TopUp page
- [ ] Implement supplier dropdown
- [ ] Build phone input with validation
- [ ] Build amount input with validation
- [ ] Implement form submission
- [ ] Create ticket card component
- [ ] Add loading and error states

### Level 2: History & Navigation

- [ ] Implement history storage service
- [ ] Create history page
- [ ] Build transaction table
- [ ] Add navigation menu
- [ ] Implement logout functionality

### Level 3: Testing

- [ ] Setup Vitest + RTL
- [ ] Write validator unit tests
- [ ] Write component integration tests
- [ ] Add test coverage reporting
- [ ] Document testing approach

### Level 4: Microfrontend (Optional)

- [ ] Setup Module Federation
- [ ] Create host shell
- [ ] Expose TopUp module
- [ ] Test remote loading
- [ ] Document MF architecture

---

## 🎯 Success Metrics

### Functional

- ✅ User can log in and access protected routes
- ✅ User can select supplier and make purchase
- ✅ Ticket is displayed after successful transaction
- ✅ History persists across browser refreshes
- ✅ All validations work correctly

### Technical

- ✅ >80% test coverage
- ✅ No TypeScript errors
- ✅ Bundle size <500KB (gzipped)
- ✅ Lighthouse score >90
- ✅ Zero runtime errors in production

### UX

- ✅ All actions provide visual feedback
- ✅ Error messages are clear and actionable
- ✅ Mobile responsive (320px+)
- ✅ Accessible (WCAG 2.1 AA)
- ✅ Fast (<3s time to interactive)

---

## 📞 Support & Maintenance

### Known Limitations

1. Password is stored in plain text in code (use env var in production)
2. No server-side validation mocking in tests (requires MSW or similar)
3. LocalStorage has 5-10MB limit (migrate to IndexedDB for large histories)

### Troubleshooting

```bash
# Clear all local storage
localStorage.clear()

# Check auth token
localStorage.getItem('auth-storage')

# View transaction history
localStorage.getItem('puntored_transaction_history')
```

---

## 🤝 Contributing Guidelines

1. Follow the established folder structure
2. Write tests for new features
3. Use TypeScript strictly (no `any` types)
4. Follow React best practices (hooks, composition)
5. Keep components small and focused
6. Document complex logic with comments
7. Update this architecture doc when making structural changes

---

## 📄 License & Credits

**Project:** Puntored Mobile Top-Up Portal  
**Architecture:** Clean Architecture + Feature-Sliced Design  
**Author:** [Your Name]  
**Date:** 2025-10-02

---

_This architecture document is a living document and should be updated as the project evolves._
