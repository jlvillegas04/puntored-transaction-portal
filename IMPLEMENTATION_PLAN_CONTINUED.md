# Implementation Plan (Continued)

## Level 2: History & Navigation (Continued)

### Step 2.3: Create History Components (Continued)

**src/components/history/HistoryTable.tsx (continued):**

```typescript
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Supplier</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Auth Code</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell className="font-medium">
              {formatDate(transaction.date)}
            </TableCell>
            <TableCell>{formatPhone(transaction.number)}</TableCell>
            <TableCell>{transaction.supplierName}</TableCell>
            <TableCell className="text-right">
              {formatCurrency(transaction.amount)}
            </TableCell>
            <TableCell>{getStatusBadge(transaction.status)}</TableCell>
            <TableCell className="font-mono text-sm">
              {transaction.authorizationCode}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
```

---

### Step 2.4: Implement History Page

**src/pages/HistoryPage.tsx:**

```typescript
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useHistory } from "@/hooks/useHistory";
import { HistoryTable } from "@/components/history/HistoryTable";
import { RefreshCw, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const HistoryPage = () => {
  const { transactions, loading, refreshHistory, clearHistory } = useHistory();
  const { toast } = useToast();

  const handleClearHistory = () => {
    clearHistory();
    toast({
      title: "History Cleared",
      description: "All transaction history has been deleted.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Transaction History</h1>
          <p className="text-muted-foreground mt-1">
            View all your past mobile top-up transactions
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshHistory}
            disabled={loading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>

          {transactions.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Clear Transaction History?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all transaction records from
                    your device. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearHistory}>
                    Clear History
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>
            {transactions.length} transaction
            {transactions.length !== 1 ? "s" : ""} recorded
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <HistoryTable transactions={transactions} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
```

---

### Step 2.5: Update Navigation (Already done in AppLayout)

The navigation between Top-Up and History pages is already implemented in [`AppLayout.tsx`](IMPLEMENTATION_PLAN.md:500) from Level 0.

---

### Level 2 Testing Checklist

- [ ] Navigate to History page
- [ ] See list of completed transactions
- [ ] Transaction details display correctly
- [ ] Refresh button works
- [ ] Clear history confirmation dialog works
- [ ] Empty state shows when no transactions
- [ ] Transactions persist across browser refreshes
- [ ] Latest transaction appears at top
- [ ] Success/Failed status badges display correctly

---

## Level 3: Testing

### Objectives

- ✅ Setup Vitest and React Testing Library
- ✅ Create test utilities and mocks
- ✅ Write unit tests for validators
- ✅ Write integration tests for components
- ✅ Setup test coverage reporting

---

### Step 3.1: Install Testing Dependencies

```bash
npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

---

### Step 3.2: Configure Vitest

**vitest.config.ts:**

```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./tests/setup.ts",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "tests/",
        "**/*.d.ts",
        "**/*.config.*",
        "**/mockData.ts",
        "src/main.tsx",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

---

### Step 3.3: Create Test Setup

**tests/setup.ts:**

```typescript
import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock environment variables
vi.stubEnv("VITE_API_BASE", "https://api.test.com");
vi.stubEnv("VITE_USERNAME", "TEST_USER");
vi.stubEnv("VITE_COMMERCE", "123456");
vi.stubEnv("VITE_POINT_OF_SALE", "123456");
vi.stubEnv("VITE_CITY_CODE", "110001");
vi.stubEnv("VITE_DEFAULT_LATITUDE", "0.0");
vi.stubEnv("VITE_DEFAULT_LONGITUDE", "0.0");

// Mock window.crypto.randomUUID
Object.defineProperty(global, "crypto", {
  value: {
    randomUUID: () => "test-uuid-1234-5678-90ab",
  },
});
```

**tests/utils/mockData.ts:**

```typescript
import { Supplier, Ticket, TransactionHistory, AuthTokenData } from "@/types";

export const mockSuppliers: Supplier[] = [
  {
    id: "1",
    name: "Claro",
    productCode: "668",
    minAmount: 1000,
    maxAmount: 100000,
  },
  {
    id: "2",
    name: "Movistar",
    productCode: "669",
    minAmount: 1000,
    maxAmount: 100000,
  },
  {
    id: "3",
    name: "Tigo",
    productCode: "670",
    minAmount: 1000,
    maxAmount: 100000,
  },
];

export const mockTicket: Ticket = {
  date: "2024-01-15T10:30:00Z",
  transactionId: "TXN123456",
  authorizationCode: "AUTH789",
  number: "3183372233",
  amount: 10000,
  supplier: "Claro",
  productCode: "668",
  status: "success",
  balance: 50000,
};

export const mockTransactions: TransactionHistory[] = [
  {
    id: "trace-001",
    date: "2024-01-15T10:30:00Z",
    number: "3183372233",
    amount: 10000,
    supplier: "668",
    supplierName: "Claro",
    authorizationCode: "AUTH789",
    transactionId: "TXN123456",
    status: "success",
    productCode: "668",
  },
  {
    id: "trace-002",
    date: "2024-01-14T15:20:00Z",
    number: "3201234567",
    amount: 20000,
    supplier: "669",
    supplierName: "Movistar",
    authorizationCode: "AUTH456",
    transactionId: "TXN789012",
    status: "success",
    productCode: "669",
  },
];

export const mockAuthData: AuthTokenData = {
  token: "mock-jwt-token-12345",
  type: "Bearer",
  expiration: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
};
```

**tests/utils/test-utils.tsx:**

```typescript
import { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";

// Mock Zustand store
export const createMockAuthStore = (overrides = {}) => ({
  token: null,
  type: null,
  expiration: null,
  isAuthenticated: false,
  login: vi.fn(),
  logout: vi.fn(),
  checkExpiration: vi.fn(),
  isTokenValid: vi.fn(),
  ...overrides,
});

// Custom render with providers
interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  initialRoute?: string;
}

export function renderWithRouter(
  ui: ReactElement,
  { initialRoute = "/", ...renderOptions }: CustomRenderOptions = {}
) {
  window.history.pushState({}, "Test page", initialRoute);

  return render(ui, {
    wrapper: ({ children }) => <BrowserRouter>{children}</BrowserRouter>,
    ...renderOptions,
  });
}

// Mock API client
export const createMockApiClient = () => ({
  post: vi.fn(),
  get: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
});
```

---

### Step 3.4: Unit Tests - Validators

**tests/unit/validators.test.ts:**

```typescript
import { describe, it, expect } from "vitest";
import { validatePhone, validateAmount, generateTrace } from "@/lib/validators";

describe("validatePhone", () => {
  it("should accept valid phone starting with 3 and 10 digits", () => {
    const result = validatePhone("3183372233");
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it("should reject empty phone number", () => {
    const result = validatePhone("");
    expect(result.isValid).toBe(false);
    expect(result.error).toBe("Phone number is required");
  });

  it("should reject phone not starting with 3", () => {
    const result = validatePhone("2183372233");
    expect(result.isValid).toBe(false);
    expect(result.error).toContain("start with 3");
  });

  it("should reject phone with less than 10 digits", () => {
    const result = validatePhone("318337223");
    expect(result.isValid).toBe(false);
    expect(result.error).toContain("10 digits");
  });

  it("should reject phone with more than 10 digits", () => {
    const result = validatePhone("31833722334");
    expect(result.isValid).toBe(false);
    expect(result.error).toContain("10 digits");
  });

  it("should reject phone with non-numeric characters", () => {
    const result = validatePhone("318337223a");
    expect(result.isValid).toBe(false);
  });
});

describe("validateAmount", () => {
  it("should accept valid amount within range", () => {
    const result = validateAmount(10000);
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it("should accept minimum amount", () => {
    const result = validateAmount(1000);
    expect(result.isValid).toBe(true);
  });

  it("should accept maximum amount", () => {
    const result = validateAmount(100000);
    expect(result.isValid).toBe(true);
  });

  it("should reject amount below minimum", () => {
    const result = validateAmount(500);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain("1,000");
  });

  it("should reject amount above maximum", () => {
    const result = validateAmount(150000);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain("100,000");
  });

  it("should reject decimal amounts", () => {
    const result = validateAmount(10000.5);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain("whole number");
  });

  it("should reject zero amount", () => {
    const result = validateAmount(0);
    expect(result.isValid).toBe(false);
  });
});

describe("generateTrace", () => {
  it("should generate a string", () => {
    const trace = generateTrace();
    expect(typeof trace).toBe("string");
  });

  it("should generate a 12-character string", () => {
    const trace = generateTrace();
    expect(trace.length).toBe(12);
  });

  it("should not contain hyphens", () => {
    const trace = generateTrace();
    expect(trace).not.toContain("-");
  });

  it("should generate unique values", () => {
    const trace1 = generateTrace();
    const trace2 = generateTrace();
    expect(trace1).not.toBe(trace2);
  });
});
```

---

### Step 3.5: Unit Tests - Utilities

**tests/unit/utils.test.ts:**

```typescript
import { describe, it, expect } from "vitest";
import { formatCurrency, formatDate, formatPhone } from "@/lib/utils";

describe("formatCurrency", () => {
  it("should format amount in COP", () => {
    const result = formatCurrency(10000);
    expect(result).toContain("10.000");
  });

  it("should handle zero", () => {
    const result = formatCurrency(0);
    expect(result).toContain("0");
  });

  it("should format large amounts", () => {
    const result = formatCurrency(1000000);
    expect(result).toContain("1.000.000");
  });
});

describe("formatPhone", () => {
  it("should format 10-digit phone number", () => {
    const result = formatPhone("3183372233");
    expect(result).toBe("318 337 2233");
  });

  it("should return unchanged if not 10 digits", () => {
    const result = formatPhone("318337223");
    expect(result).toBe("318337223");
  });

  it("should handle empty string", () => {
    const result = formatPhone("");
    expect(result).toBe("");
  });
});

describe("formatDate", () => {
  it("should format ISO date string", () => {
    const result = formatDate("2024-01-15T10:30:00Z");
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
  });
});
```

---

### Step 3.6: Integration Tests - Login Page

**tests/integration/LoginPage.test.tsx:**

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginPage } from "@/pages/LoginPage";
import { renderWithRouter } from "../utils/test-utils";
import { useAuthStore } from "@/store/authStore";

vi.mock("@/store/authStore");

describe("LoginPage", () => {
  const mockLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuthStore as any).mockReturnValue({
      login: mockLogin,
      isAuthenticated: false,
    });
  });

  it("should render login form", () => {
    renderWithRouter(<LoginPage />);

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
  });

  it("should disable submit button when password is empty", () => {
    renderWithRouter(<LoginPage />);

    const submitButton = screen.getByRole("button", { name: /sign in/i });
    expect(submitButton).toBeDisabled();
  });

  it("should enable submit button when password is entered", async () => {
    const user = userEvent.setup();
    renderWithRouter(<LoginPage />);

    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    await user.type(passwordInput, "test-password");

    expect(submitButton).toBeEnabled();
  });

  it("should call login with correct credentials on submit", async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValue(undefined);

    renderWithRouter(<LoginPage />);

    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    await user.type(passwordInput, "test-password");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        username: expect.any(String),
        password: "test-password",
        commerce: expect.any(Number),
      });
    });
  });

  it("should show loading state during login", async () => {
    const user = userEvent.setup();
    mockLogin.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    renderWithRouter(<LoginPage />);

    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    await user.type(passwordInput, "test-password");
    await user.click(submitButton);

    expect(screen.getByText(/signing in/i)).toBeInTheDocument();
  });
});
```

---

### Step 3.7: Integration Tests - Top-Up Page

**tests/integration/TopUpPage.test.tsx:**

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TopUpPage } from "@/pages/TopUpPage";
import { renderWithRouter } from "../utils/test-utils";
import { mockSuppliers, mockTicket } from "../utils/mockData";
import * as suppliersHook from "@/hooks/useSuppliers";
import * as topUpHook from "@/hooks/useTopUp";

vi.mock("@/hooks/useSuppliers");
vi.mock("@/hooks/useTopUp");
vi.mock("@/services/storageService");

describe("TopUpPage", () => {
  const mockBuyTopUp = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(suppliersHook, "useSuppliers").mockReturnValue({
      suppliers: mockSuppliers,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    vi.spyOn(topUpHook, "useTopUp").mockReturnValue({
      buyTopUp: mockBuyTopUp,
      loading: false,
      error: null,
      ticket: null,
      reset: vi.fn(),
    });
  });

  it("should render top-up form", () => {
    renderWithRouter(<TopUpPage />);

    expect(screen.getByLabelText(/supplier/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/terminal/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("should disable submit button until form is valid", async () => {
    const user = userEvent.setup();
    renderWithRouter(<TopUpPage />);

    const submitButton = screen.getByRole("button", { name: /buy top-up/i });
    expect(submitButton).toBeDisabled();

    // Fill form
    await user.click(screen.getByRole("combobox", { name: /supplier/i }));
    await user.click(screen.getByText("Claro"));
    await user.type(screen.getByLabelText(/phone number/i), "3183372233");
    await user.type(screen.getByLabelText(/amount/i), "10000");
    await user.type(screen.getByLabelText(/terminal/i), "123456");
    await user.type(screen.getByLabelText(/password/i), "test123");

    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });
  });

  it("should show validation errors for invalid phone", async () => {
    const user = userEvent.setup();
    renderWithRouter(<TopUpPage />);

    const phoneInput = screen.getByLabelText(/phone number/i);

    await user.type(phoneInput, "2183372233");
    await user.tab(); // Blur

    await waitFor(() => {
      expect(screen.getByText(/must start with 3/i)).toBeInTheDocument();
    });
  });

  it("should show validation errors for invalid amount", async () => {
    const user = userEvent.setup();
    renderWithRouter(<TopUpPage />);

    const amountInput = screen.getByLabelText(/amount/i);

    await user.type(amountInput, "500");
    await user.tab(); // Blur

    await waitFor(() => {
      expect(screen.getByText(/at least/i)).toBeInTheDocument();
    });
  });

  it("should call buyTopUp on valid form submission", async () => {
    const user = userEvent.setup();
    mockBuyTopUp.mockResolvedValue(mockTicket);

    renderWithRouter(<TopUpPage />);

    // Fill form
    await user.click(screen.getByRole("combobox", { name: /supplier/i }));
    await user.click(screen.getByText("Claro"));
    await user.type(screen.getByLabelText(/phone number/i), "3183372233");
    await user.type(screen.getByLabelText(/amount/i), "10000");
    await user.type(screen.getByLabelText(/terminal/i), "123456");
    await user.type(screen.getByLabelText(/password/i), "test123");

    const submitButton = screen.getByRole("button", { name: /buy top-up/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockBuyTopUp).toHaveBeenCalledWith(
        expect.objectContaining({
          number: "3183372233",
          amount: 10000,
          productCode: "668",
        })
      );
    });
  });

  it("should display ticket after successful purchase", async () => {
    const user = userEvent.setup();

    vi.spyOn(topUpHook, "useTopUp").mockReturnValue({
      buyTopUp: mockBuyTopUp,
      loading: false,
      error: null,
      ticket: mockTicket,
      reset: vi.fn(),
    });

    renderWithRouter(<TopUpPage />);

    expect(screen.getByText(/transaction successful/i)).toBeInTheDocument();
    expect(screen.getByText(mockTicket.authorizationCode)).toBeInTheDocument();
    expect(screen.getByText(/new transaction/i)).toBeInTheDocument();
  });
});
```

---

### Step 3.8: Integration Tests - History Page

**tests/integration/HistoryPage.test.tsx:**

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HistoryPage } from "@/pages/HistoryPage";
import { renderWithRouter } from "../utils/test-utils";
import { mockTransactions } from "../utils/mockData";
import * as historyHook from "@/hooks/useHistory";

vi.mock("@/hooks/useHistory");

describe("HistoryPage", () => {
  const mockRefreshHistory = vi.fn();
  const mockClearHistory = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(historyHook, "useHistory").mockReturnValue({
      transactions: mockTransactions,
      loading: false,
      refreshHistory: mockRefreshHistory,
      clearHistory: mockClearHistory,
    });
  });

  it("should render history page with transactions", () => {
    renderWithRouter(<HistoryPage />);

    expect(screen.getByText(/transaction history/i)).toBeInTheDocument();
    expect(screen.getByText(/claro/i)).toBeInTheDocument();
    expect(screen.getByText(/movistar/i)).toBeInTheDocument();
  });

  it("should show empty state when no transactions", () => {
    vi.spyOn(historyHook, "useHistory").mockReturnValue({
      transactions: [],
      loading: false,
      refreshHistory: mockRefreshHistory,
      clearHistory: mockClearHistory,
    });

    renderWithRouter(<HistoryPage />);

    expect(screen.getByText(/no transactions yet/i)).toBeInTheDocument();
  });

  it("should call refreshHistory when refresh button clicked", async () => {
    const user = userEvent.setup();
    renderWithRouter(<HistoryPage />);

    const refreshButton = screen.getByRole("button", { name: /refresh/i });
    await user.click(refreshButton);

    expect(mockRefreshHistory).toHaveBeenCalled();
  });

  it("should show confirmation dialog before clearing history", async () => {
    const user = userEvent.setup();
    renderWithRouter(<HistoryPage />);

    const clearButton = screen.getByRole("button", { name: /clear all/i });
    await user.click(clearButton);

    expect(screen.getByText(/clear transaction history/i)).toBeInTheDocument();
    expect(screen.getByText(/cannot be undone/i)).toBeInTheDocument();
  });

  it("should display transaction count", () => {
    renderWithRouter(<HistoryPage />);

    expect(screen.getByText(/2 transactions recorded/i)).toBeInTheDocument();
  });

  it("should show loading skeleton when loading", () => {
    vi.spyOn(historyHook, "useHistory").mockReturnValue({
      transactions: [],
      loading: true,
      refreshHistory: mockRefreshHistory,
      clearHistory: mockClearHistory,
    });

    renderWithRouter(<HistoryPage />);

    // Skeletons are rendered
    const skeletons = document.querySelectorAll('[data-testid="skeleton"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });
});
```

---

### Step 3.9: Update package.json Scripts

**package.json (add test scripts):**

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

---

### Level 3 Testing Checklist

- [ ] Run `npm test` - all tests pass
- [ ] Run `npm run test:coverage` - coverage >80%
- [ ] Validator tests cover all edge cases
- [ ] Component tests verify user interactions
- [ ] Integration tests validate full workflows
- [ ] Mocks work correctly
- [ ] No flaky tests
- [ ] Tests run fast (<5 seconds)

---

## Level 4: Microfrontend (Optional)

### Objectives

- ✅ Setup Module Federation with Vite
- ✅ Create host shell application
- ✅ Expose Top-Up module
- ✅ Test remote module loading

---

### Step 4.1: Install Module Federation Plugin

```bash
npm install -D @originjs/vite-plugin-federation
```

---

### Step 4.2: Configure Module Federation

**vite.config.ts (with Module Federation):**

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "topupModule",
      filename: "remoteEntry.js",
      exposes: {
        "./TopUpApp": "./src/App",
        "./TopUpPage": "./src/pages/TopUpPage",
        "./HistoryPage": "./src/pages/HistoryPage",
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: "^18.2.0",
        },
        "react-dom": {
          singleton: true,
          requiredVersion: "^18.2.0",
        },
        "react-router-dom": {
          singleton: true,
        },
        zustand: {
          singleton: true,
        },
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
});
```

---

### Step 4.3: Create Host Shell

**Create a new Vite project for host:**

```bash
cd ..
npm create vite@latest puntored-host -- --template react-ts
cd puntored-host
npm install
npm install -D @originjs/vite-plugin-federation
```

**puntored-host/vite.config.ts:**

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "host",
      remotes: {
        topupModule: "http://localhost:5173/assets/remoteEntry.js",
      },
      shared: {
        react: {
          singleton: true,
        },
        "react-dom": {
          singleton: true,
        },
        "react-router-dom": {
          singleton: true,
        },
      },
    }),
  ],
  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
  server: {
    port: 5174,
  },
});
```

**puntored-host/src/App.tsx:**

```typescript
import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// @ts-ignore
const TopUpApp = lazy(() => import("topupModule/TopUpApp"));

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold">Puntored Host Shell</h1>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          <Suspense fallback={<div>Loading Top-Up Module...</div>}>
            <Routes>
              <Route path="/*" element={<TopUpApp />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
```

---

### Step 4.4: Test Microfrontend Setup

1. Start the remote (top-up module):

```bash
cd puntored-transaction-portal
npm run dev
```

2. Start the host:

```bash
cd puntored-host
npm run dev
```

3. Navigate to `http://localhost:5174` - should load the top-up module remotely

---

### Level 4 Testing Checklist

- [ ] Remote module builds successfully
- [ ] Host shell loads without errors
- [ ] Top-Up module loads in host
- [ ] All functionality works in host
- [ ] Shared dependencies work correctly
- [ ] No duplicate React instances
- [ ] CSS loads properly
- [ ] State persists correctly

---

## Final Deployment Steps

### Build for Production

```bash
# Build the application
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Check coverage
npm run test:coverage

# Lint code
npm run lint
```

### Environment Variables for Production

Create `.env.production`:

```env
VITE_API_BASE=https://services.preprodcxr.co/puntored/api/v1
VITE_USERNAME=<production-username>
VITE_COMMERCE=<production-commerce>
VITE_POINT_OF_SALE=<production-pos>
VITE_CITY_CODE=<production-city>
VITE_DEFAULT_LATITUDE=<production-lat>
VITE_DEFAULT_LONGITUDE=<production-lon>
```

---

## Summary

You've successfully implemented a production-ready Mobile Top-Up Transaction Portal with:

✅ **Level 0**: Authentication, routing, and API client
✅ **Level 1**: Complete top-up flow with validation
✅ **Level 2**: Transaction history with persistence
✅ **Level 3**: Comprehensive testing with >80% coverage
✅ **Level 4**: Microfrontend architecture (optional)

### Key Features Delivered:

- Secure authentication with token persistence
- Validated phone and amount inputs
- Real-time supplier fetching
- Transaction execution with ticket display
- Persistent transaction history
- Comprehensive test coverage
- Clean, maintainable codebase
- Production-ready architecture

### Next Steps:

1. Deploy to hosting platform (Vercel, Netlify, etc.)
2. Setup CI/CD pipeline
3. Add error monitoring (Sentry)
4. Implement analytics
5. Add performance monitoring
6. Setup staging environment
