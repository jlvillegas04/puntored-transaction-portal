# Puntored Transaction Portal - Implementation Plan

This document provides a step-by-step guide to implement the Puntored Mobile Top-Up Portal following a progressive enhancement approach from Level 0 to Level 3.

---

## Table of Contents

1. [Level 0: Scaffold & Auth](#level-0-scaffold--auth)
2. [Level 1: Top-Up Flow](#level-1-top-up-flow)
3. [Level 2: History & Navigation](#level-2-history--navigation)
4. [Level 3: Testing](#level-3-testing)
5. [Level 4: Microfrontend (Optional)](#level-4-microfrontend-optional)

---

## Level 0: Scaffold & Auth

### Objectives

- ✅ Setup project with Vite + React + TypeScript
- ✅ Configure Tailwind CSS
- ✅ Install and setup ShadCN UI
- ✅ Install React Router and Zustand
- ✅ Create folder structure
- ✅ Implement API client with auth injection
- ✅ Create auth store with localStorage persistence
- ✅ Build login page
- ✅ Setup protected routes

---

### Step 0.1: Initialize Project

```bash
# Create Vite project with React + TypeScript template
npm create vite@latest puntored-transaction-portal -- --template react-ts

# Navigate to project directory
cd puntored-transaction-portal

# Install dependencies
npm install

# Install core dependencies
npm install react-router-dom zustand axios

# Install TailwindCSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Install ShadCN CLI
npx shadcn-ui@latest init
```

**ShadCN Configuration** (during init):

- Style: Default
- Base color: Slate
- CSS variables: Yes
- React Server Components: No (we're using Vite)
- Write to components.json: Yes
- Import alias: @/components

**Install ShadCN Components:**

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add card
npx shadcn-ui@latest add select
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add skeleton
npx shadcn-ui@latest add table
```

---

### Step 0.2: Configure Tailwind CSS

**tailwind.config.js:**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
```

**src/index.css:**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 48%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

---

### Step 0.3: Setup Environment Variables

**.env.example:**

```env
# API Configuration
VITE_API_BASE=https://services.preprodcxr.co/puntored/api/v1

# Authentication
VITE_USERNAME=PRUEBACONEXRED
VITE_COMMERCE=539998

# Transaction Configuration
VITE_POINT_OF_SALE=271826
VITE_CITY_CODE=110001
VITE_DEFAULT_LATITUDE=225;36,34.96
VITE_DEFAULT_LONGITUDE=225;36,34.96
```

**.env:**

```env
# Copy from .env.example and fill in actual values
VITE_API_BASE=https://services.preprodcxr.co/puntored/api/v1
VITE_USERNAME=PRUEBACONEXRED
VITE_COMMERCE=539998
VITE_POINT_OF_SALE=271826
VITE_CITY_CODE=110001
VITE_DEFAULT_LATITUDE=225;36,34.96
VITE_DEFAULT_LONGITUDE=225;36,34.96
```

**src/env.d.ts:**

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE: string;
  readonly VITE_USERNAME: string;
  readonly VITE_COMMERCE: string;
  readonly VITE_POINT_OF_SALE: string;
  readonly VITE_CITY_CODE: string;
  readonly VITE_DEFAULT_LATITUDE: string;
  readonly VITE_DEFAULT_LONGITUDE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

---

### Step 0.4: Create Folder Structure

```bash
# Create all necessary directories
mkdir -p src/{api,components/{ui,layout,auth,topup,history},hooks,lib,pages,services,store,types}
mkdir -p tests/{unit,integration}
```

---

### Step 0.5: Define TypeScript Types

**src/types/common.types.ts:**

```typescript
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  code?: string;
}

export interface ApiError {
  status: number;
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export type LoadingState = "idle" | "loading" | "success" | "error";
```

**src/types/auth.types.ts:**

```typescript
import { ApiResponse } from "./common.types";

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

export interface AuthResponse extends ApiResponse<AuthTokenData> {
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
  isTokenValid: () => boolean;
}
```

**src/types/recharge.types.ts:**

```typescript
import { ApiResponse } from "./common.types";

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

export interface FindSuppliersResponse extends ApiResponse<Supplier[]> {
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
  status: "success" | "failed" | "pending";
  balance?: number;
  message?: string;
}

export interface BuyRechargeResponse extends ApiResponse<{ ticket: Ticket }> {
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
  supplierName: string;
  authorizationCode: string;
  transactionId: string;
  status: "success" | "failed" | "pending";
  productCode: string;
}
```

**src/types/index.ts:**

```typescript
export * from "./common.types";
export * from "./auth.types";
export * from "./recharge.types";
```

---

### Step 0.6: Create API Client

**src/api/client.ts:**

```typescript
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { ApiError } from "@/types";

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

  private setupInterceptors(): void {
    // Request interceptor: inject auth token
    this.client.interceptors.request.use(
      (config) => {
        const authStorage = localStorage.getItem("auth-storage");

        if (authStorage) {
          try {
            const { state } = JSON.parse(authStorage);
            const { token, type } = state;

            if (token && type) {
              config.headers.Authorization = `${type} ${token}`;
            }
          } catch (error) {
            console.error("Failed to parse auth storage:", error);
          }
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
      // Server responded with error
      return {
        status: error.response.status,
        message:
          (error.response.data as any)?.message ||
          "An error occurred. Please try again.",
        code: (error.response.data as any)?.code,
        details: error.response.data as Record<string, unknown>,
      };
    } else if (error.request) {
      // Request made but no response
      return {
        status: 0,
        message: "Network error. Please check your internet connection.",
      };
    } else {
      // Error setting up request
      return {
        status: 0,
        message: error.message || "An unexpected error occurred.",
      };
    }
  }

  async post<TResponse, TRequest = unknown>(
    url: string,
    data?: TRequest,
    config?: AxiosRequestConfig
  ): Promise<TResponse> {
    const response = await this.client.post<TResponse>(url, data, config);
    return response.data;
  }

  async get<TResponse>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<TResponse> {
    const response = await this.client.get<TResponse>(url, config);
    return response.data;
  }

  async put<TResponse, TRequest = unknown>(
    url: string,
    data?: TRequest,
    config?: AxiosRequestConfig
  ): Promise<TResponse> {
    const response = await this.client.put<TResponse>(url, data, config);
    return response.data;
  }

  async delete<TResponse>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<TResponse> {
    const response = await this.client.delete<TResponse>(url, config);
    return response.data;
  }
}

export const apiClient = new ApiClient();
```

**src/api/endpoints.ts:**

```typescript
export const API_ENDPOINTS = {
  AUTH: "/auth",
  FIND_SUPPLIERS: "/recharge/find-suppliers",
  BUY: "/recharge/buy",
} as const;
```

---

### Step 0.7: Create Auth Service

**src/services/authService.ts:**

```typescript
import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import { AuthResponse, LoginCredentials } from "@/types";

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return apiClient.post<AuthResponse, LoginCredentials>(
      API_ENDPOINTS.AUTH,
      credentials
    );
  }

  validateToken(token: string): boolean {
    // Basic validation - check if token exists
    return !!token && token.length > 0;
  }

  isTokenExpired(expiration: string): boolean {
    const expirationDate = new Date(expiration);
    const now = new Date();
    return expirationDate < now;
  }
}

export const authService = new AuthService();
```

---

### Step 0.8: Create Auth Store (Zustand)

**src/store/authStore.ts:**

```typescript
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthState, LoginCredentials } from "@/types";
import { authService } from "@/services/authService";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      type: null,
      expiration: null,
      isAuthenticated: false,

      login: async (credentials: LoginCredentials) => {
        try {
          const response = await authService.login(credentials);

          if (response.success && response.data) {
            set({
              token: response.data.token,
              type: response.data.type,
              expiration: response.data.expiration,
              isAuthenticated: true,
            });
          } else {
            throw new Error(response.message || "Login failed");
          }
        } catch (error) {
          // Reset auth state on error
          set({
            token: null,
            type: null,
            expiration: null,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      logout: () => {
        set({
          token: null,
          type: null,
          expiration: null,
          isAuthenticated: false,
        });
      },

      checkExpiration: (): boolean => {
        const { expiration } = get();

        if (!expiration) return false;

        const isExpired = authService.isTokenExpired(expiration);

        if (isExpired) {
          get().logout();
          return false;
        }

        return true;
      },

      isTokenValid: (): boolean => {
        const { token, expiration } = get();

        if (!token) return false;
        if (!authService.validateToken(token)) return false;
        if (expiration && authService.isTokenExpired(expiration)) {
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

### Step 0.9: Create Login Page

**src/pages/LoginPage.tsx:**

```typescript
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ApiError } from "@/types";

export const LoginPage = () => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login({
        username: import.meta.env.VITE_USERNAME,
        password,
        commerce: Number(import.meta.env.VITE_COMMERCE),
      });

      toast({
        title: "Login Successful",
        description: "Welcome to Puntored Transaction Portal",
      });

      navigate("/topup");
    } catch (error) {
      const apiError = error as ApiError;
      toast({
        variant: "destructive",
        title: "Login Failed",
        description:
          apiError.message || "Please check your credentials and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Puntored
          </CardTitle>
          <CardDescription className="text-center">
            Mobile Top-Up Transaction Portal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={import.meta.env.VITE_USERNAME}
                disabled
                className="bg-gray-100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !password}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
```

---

### Step 0.10: Create Protected Route

**src/components/layout/ProtectedRoute.tsx:**

```typescript
import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { AppLayout } from "./AppLayout";

export const ProtectedRoute = () => {
  const { isAuthenticated, checkExpiration } = useAuthStore();

  useEffect(() => {
    checkExpiration();
  }, [checkExpiration]);

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

**src/components/layout/AppLayout.tsx:**

```typescript
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { LogOut, CreditCard, History } from "lucide-react";

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-primary">Puntored</h1>
              <nav className="hidden md:flex space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => navigate("/topup")}
                  className="flex items-center space-x-2"
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Top-Up</span>
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/history")}
                  className="flex items-center space-x-2"
                >
                  <History className="h-4 w-4" />
                  <span>History</span>
                </Button>
              </nav>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};
```

---

### Step 0.11: Setup Router

**src/App.tsx:**

```typescript
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "@/pages/LoginPage";
import { TopUpPage } from "@/pages/TopUpPage";
import { HistoryPage } from "@/pages/HistoryPage";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Toaster } from "@/components/ui/toaster";

function App() {
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

      <Toaster />
    </BrowserRouter>
  );
}

export default App;
```

---

### Step 0.12: Create Placeholder Pages

**src/pages/TopUpPage.tsx (placeholder):**

```typescript
export const TopUpPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold">Top-Up</h1>
      <p className="text-gray-600">Coming soon in Level 1...</p>
    </div>
  );
};
```

**src/pages/HistoryPage.tsx (placeholder):**

```typescript
export const HistoryPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold">History</h1>
      <p className="text-gray-600">Coming soon in Level 2...</p>
    </div>
  );
};
```

---

### Step 0.13: Update tsconfig.json

**tsconfig.json:**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* Path aliases */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**vite.config.ts:**

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

---

### Level 0 Testing Checklist

- [ ] Run `npm run dev` - dev server starts
- [ ] Navigate to `http://localhost:5173` - login page loads
- [ ] Enter password and click "Sign In" - successful login
- [ ] Redirected to `/topup` - placeholder page shows
- [ ] Click "History" in navigation - placeholder page shows
- [ ] Click "Logout" - redirected to login page
- [ ] Try accessing `/topup` without login - redirected to `/login`
- [ ] No TypeScript errors
- [ ] No console errors

---

## Level 1: Top-Up Flow

### Objectives

- ✅ Create recharge service
- ✅ Implement supplier fetching and selection
- ✅ Build validated phone and amount inputs
- ✅ Create form with all fields
- ✅ Implement buy transaction
- ✅ Display ticket after successful purchase
- ✅ Add loading and error states

---

### Step 1.1: Create Recharge Service

**src/services/rechargeService.ts:**

```typescript
import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import {
  FindSuppliersRequest,
  FindSuppliersResponse,
  BuyRechargeRequest,
  BuyRechargeResponse,
} from "@/types";

class RechargeService {
  async findSuppliers(pointOfSale: string): Promise<FindSuppliersResponse> {
    const request: FindSuppliersRequest = { pointOfSale };
    return apiClient.post<FindSuppliersResponse, FindSuppliersRequest>(
      API_ENDPOINTS.FIND_SUPPLIERS,
      request
    );
  }

  async buy(request: BuyRechargeRequest): Promise<BuyRechargeResponse> {
    return apiClient.post<BuyRechargeResponse, BuyRechargeRequest>(
      API_ENDPOINTS.BUY,
      request
    );
  }
}

export const rechargeService = new RechargeService();
```

---

### Step 1.2: Create Validation Utilities

**src/lib/validators.ts:**

```typescript
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
```

**src/lib/utils.ts:**

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(dateString));
};

export const formatPhone = (phone: string): string => {
  if (phone.length !== 10) return phone;
  return `${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6)}`;
};
```

---

### Step 1.3: Create Custom Hooks

**src/hooks/useSuppliers.ts:**

```typescript
import { useState, useEffect } from "react";
import { Supplier } from "@/types";
import { rechargeService } from "@/services/rechargeService";

export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      setError(null);

      const pointOfSale = import.meta.env.VITE_POINT_OF_SALE;
      const response = await rechargeService.findSuppliers(pointOfSale);

      if (response.success && response.data) {
        setSuppliers(response.data);
      } else {
        throw new Error(response.message || "Failed to fetch suppliers");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load suppliers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  return { suppliers, loading, error, refetch: fetchSuppliers };
};
```

**src/hooks/useTopUp.ts:**

```typescript
import { useState } from "react";
import { BuyRechargeRequest, Ticket, ApiError } from "@/types";
import { rechargeService } from "@/services/rechargeService";

export const useTopUp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ticket, setTicket] = useState<Ticket | null>(null);

  const buyTopUp = async (data: BuyRechargeRequest) => {
    try {
      setLoading(true);
      setError(null);
      setTicket(null);

      const response = await rechargeService.buy(data);

      if (response.success && response.data.ticket) {
        setTicket(response.data.ticket);
        return response.data.ticket;
      } else {
        throw new Error(response.message || "Transaction failed");
      }
    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage =
        apiError.message || "Transaction failed. Please try again.";
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
```

---

### Step 1.4: Create Top-Up Components

**src/components/topup/SupplierSelect.tsx:**

```typescript
import { Supplier } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

interface SupplierSelectProps {
  value: string;
  onChange: (value: string) => void;
  suppliers: Supplier[];
  loading?: boolean;
  error?: string | null;
  disabled?: boolean;
}

export const SupplierSelect = ({
  value,
  onChange,
  suppliers,
  loading,
  error,
  disabled,
}: SupplierSelectProps) => {
  if (loading) {
    return (
      <div className="space-y-2">
        <Label>Supplier</Label>
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-2">
        <Label>Supplier</Label>
        <div className="text-sm text-destructive">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="supplier">Supplier *</Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger id="supplier">
          <SelectValue placeholder="Select a supplier" />
        </SelectTrigger>
        <SelectContent>
          {suppliers.map((supplier) => (
            <SelectItem key={supplier.productCode} value={supplier.productCode}>
              {supplier.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
```

**src/components/topup/PhoneInput.tsx:**

```typescript
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { validatePhone } from "@/lib/validators";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  disabled?: boolean;
}

export const PhoneInput = ({
  value,
  onChange,
  onBlur,
  error,
  disabled,
}: PhoneInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/\D/g, "").slice(0, 10);
    onChange(newValue);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="phone">Phone Number *</Label>
      <Input
        id="phone"
        type="tel"
        placeholder="3XX XXX XXXX"
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        disabled={disabled}
        className={error ? "border-destructive" : ""}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <p className="text-xs text-muted-foreground">
        Must start with 3 and be 10 digits
      </p>
    </div>
  );
};
```

**src/components/topup/AmountInput.tsx:**

```typescript
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  disabled?: boolean;
}

export const AmountInput = ({
  value,
  onChange,
  onBlur,
  error,
  disabled,
}: AmountInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/\D/g, "");
    onChange(newValue);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="amount">Amount (COP) *</Label>
      <Input
        id="amount"
        type="text"
        inputMode="numeric"
        placeholder="10000"
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        disabled={disabled}
        className={error ? "border-destructive" : ""}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      {value && !error && (
        <p className="text-xs text-muted-foreground">
          {formatCurrency(Number(value))}
        </p>
      )}
      <p className="text-xs text-muted-foreground">
        Min: 1,000 COP - Max: 100,000 COP
      </p>
    </div>
  );
};
```

**src/components/topup/TicketCard.tsx:**

```typescript
import { Ticket } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";
import { formatCurrency, formatDate, formatPhone } from "@/lib/utils";

interface TicketCardProps {
  ticket: Ticket;
  onClose: () => void;
}

export const TicketCard = ({ ticket, onClose }: TicketCardProps) => {
  const isSuccess = ticket.status === "success";

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center justify-center mb-4">
          {isSuccess ? (
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          ) : (
            <XCircle className="h-16 w-16 text-destructive" />
          )}
        </div>
        <CardTitle className="text-center">
          {isSuccess ? "Transaction Successful" : "Transaction Failed"}
        </CardTitle>
        <CardDescription className="text-center">
          {formatDate(ticket.date)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Transaction ID</p>
            <p className="font-medium">{ticket.transactionId}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Authorization</p>
            <p className="font-medium">{ticket.authorizationCode}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Phone Number</p>
            <p className="font-medium">{formatPhone(ticket.number)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Amount</p>
            <p className="font-medium">{formatCurrency(ticket.amount)}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-muted-foreground">Supplier</p>
            <p className="font-medium">{ticket.supplier}</p>
          </div>
        </div>

        {ticket.message && (
          <div className="p-3 bg-muted rounded-md">
            <p className="text-sm">{ticket.message}</p>
          </div>
        )}

        <Button onClick={onClose} className="w-full">
          New Transaction
        </Button>
      </CardContent>
    </Card>
  );
};
```

---

### Step 1.5: Implement Top-Up Page

**src/pages/TopUpPage.tsx:**

```typescript
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useSuppliers } from "@/hooks/useSuppliers";
import { useTopUp } from "@/hooks/useTopUp";
import { SupplierSelect } from "@/components/topup/SupplierSelect";
import { PhoneInput } from "@/components/topup/PhoneInput";
import { AmountInput } from "@/components/topup/AmountInput";
import { TicketCard } from "@/components/topup/TicketCard";
import { validatePhone, validateAmount, generateTrace } from "@/lib/validators";
import { BuyRechargeRequest, ApiError } from "@/types";
import { storageService } from "@/services/storageService";

export const TopUpPage = () => {
  const {
    suppliers,
    loading: loadingSuppliers,
    error: suppliersError,
  } = useSuppliers();
  const { buyTopUp, loading: buyingTopUp, ticket } = useTopUp();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    supplier: "",
    phone: "",
    amount: "",
    terminal: "",
    transactionalPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
    validateField(field, formData[field as keyof typeof formData]);
  };

  const validateField = (field: string, value: string) => {
    let error = "";

    switch (field) {
      case "supplier":
        if (!value) error = "Supplier is required";
        break;
      case "phone":
        const phoneResult = validatePhone(value);
        if (!phoneResult.isValid) error = phoneResult.error || "";
        break;
      case "amount":
        const amountResult = validateAmount(Number(value));
        if (!amountResult.isValid) error = amountResult.error || "";
        break;
      case "terminal":
        if (!value) error = "Terminal is required";
        break;
      case "transactionalPassword":
        if (!value) error = "Password is required";
        break;
    }

    setErrors({ ...errors, [field]: error });
    return !error;
  };

  const validateAll = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    Object.keys(formData).forEach((field) => {
      const value = formData[field as keyof typeof formData];
      if (!validateField(field, value)) {
        isValid = false;
        newErrors[field] = errors[field];
      }
    });

    setErrors(newErrors);
    setTouched({
      supplier: true,
      phone: true,
      amount: true,
      terminal: true,
      transactionalPassword: true,
    });

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAll()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fix all errors before submitting.",
      });
      return;
    }

    try {
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

      const ticketData = await buyTopUp(request);

      // Save to history
      const supplierName =
        suppliers.find((s) => s.productCode === formData.supplier)?.name ||
        "Unknown";
      storageService.addTransaction({
        id: request.trace,
        date: ticketData.date,
        number: ticketData.number,
        amount: ticketData.amount,
        supplier: ticketData.productCode,
        supplierName,
        authorizationCode: ticketData.authorizationCode,
        transactionId: ticketData.transactionId,
        status: ticketData.status,
        productCode: ticketData.productCode,
      });

      toast({
        title: "Success",
        description: "Top-up transaction completed successfully!",
      });
    } catch (error) {
      const apiError = error as ApiError;
      toast({
        variant: "destructive",
        title: "Transaction Failed",
        description: apiError.message || "Please try again.",
      });
    }
  };

  const handleNewTransaction = () => {
    setFormData({
      supplier: "",
      phone: "",
      amount: "",
      terminal: "",
      transactionalPassword: "",
    });
    setErrors({});
    setTouched({});
  };

  if (ticket) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <TicketCard ticket={ticket} onClose={handleNewTransaction} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Mobile Top-Up</CardTitle>
          <CardDescription>
            Select a supplier and enter the details to complete a mobile top-up
            transaction
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <SupplierSelect
              value={formData.supplier}
              onChange={(value) =>
                setFormData({ ...formData, supplier: value })
              }
              suppliers={suppliers}
              loading={loadingSuppliers}
              error={suppliersError}
              disabled={buyingTopUp}
            />

            <PhoneInput
              value={formData.phone}
              onChange={(value) => setFormData({ ...formData, phone: value })}
              onBlur={() => handleBlur("phone")}
              error={touched.phone ? errors.phone : undefined}
              disabled={buyingTopUp}
            />

            <AmountInput
              value={formData.amount}
              onChange={(value) => setFormData({ ...formData, amount: value })}
              onBlur={() => handleBlur("amount")}
              error={touched.amount ? errors.amount : undefined}
              disabled={buyingTopUp}
            />

            <div className="space-y-2">
              <Label htmlFor="terminal">Terminal *</Label>
              <Input
                id="terminal"
                type="text"
                placeholder="Enter terminal ID"
                value={formData.terminal}
                onChange={(e) =>
                  setFormData({ ...formData, terminal: e.target.value })
                }
                onBlur={() => handleBlur("terminal")}
                disabled={buyingTopUp}
                className={
                  touched.terminal && errors.terminal
                    ? "border-destructive"
                    : ""
                }
              />
              {touched.terminal && errors.terminal && (
                <p className="text-sm text-destructive">{errors.terminal}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Transactional Password *</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={formData.transactionalPassword}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    transactionalPassword: e.target.value,
                  })
                }
                onBlur={() => handleBlur("transactionalPassword")}
                disabled={buyingTopUp}
                className={
                  touched.transactionalPassword && errors.transactionalPassword
                    ? "border-destructive"
                    : ""
                }
              />
              {touched.transactionalPassword &&
                errors.transactionalPassword && (
                  <p className="text-sm text-destructive">
                    {errors.transactionalPassword}
                  </p>
                )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={buyingTopUp || loadingSuppliers}
            >
              {buyingTopUp ? "Processing..." : "Buy Top-Up"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
```

---

### Level 1 Testing Checklist

- [ ] Suppliers load successfully
- [ ] Can select a supplier
- [ ] Phone validation works (starts with 3, 10 digits)
- [ ] Amount validation works (1,000-100,000)
- [ ] Submit button disabled until form is valid
- [ ] Successful transaction shows ticket
- [ ] Ticket displays all correct information
- [ ] "New Transaction" button resets form
- [ ] Error messages display correctly
- [ ] Loading states work properly

---

## Level 2: History & Navigation

### Objectives

- ✅ Create storage service for transaction history
- ✅ Implement history page with transaction list
- ✅ Add transaction persistence
- ✅ Enhance navigation
- ✅ Add logout functionality

---

### Step 2.1: Create Storage Service

**src/services/storageService.ts:**

```typescript
import { TransactionHistory } from "@/types";

const STORAGE_KEYS = {
  HISTORY: "puntored_transaction_history",
} as const;

class StorageService {
  getHistory(): TransactionHistory[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Failed to parse transaction history:", error);
      return [];
    }
  }

  addTransaction(transaction: TransactionHistory): void {
    try {
      const history = this.getHistory();
      history.unshift(transaction); // Add to beginning

      // Keep only last 100 transactions
      const trimmedHistory = history.slice(0, 100);

      localStorage.setItem(
        STORAGE_KEYS.HISTORY,
        JSON.stringify(trimmedHistory)
      );
    } catch (error) {
      console.error("Failed to save transaction:", error);
    }
  }

  clearHistory(): void {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
  }

  getTransaction(id: string): TransactionHistory | null {
    const history = this.getHistory();
    return history.find((t) => t.id === id) || null;
  }
}

export const storageService = new StorageService();
```

---

### Step 2.2: Create History Hook

**src/hooks/useHistory.ts:**

```typescript
import { useState, useEffect } from "react";
import { TransactionHistory } from "@/types";
import { storageService } from "@/services/storageService";

export const useHistory = () => {
  const [transactions, setTransactions] = useState<TransactionHistory[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = () => {
    setLoading(true);
    const history = storageService.getHistory();
    setTransactions(history);
    setLoading(false);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const clearHistory = () => {
    storageService.clearHistory();
    setTransactions([]);
  };

  return {
    transactions,
    loading,
    refreshHistory: loadHistory,
    clearHistory,
  };
};
```

---

### Step 2.3: Create History Components

**src/components/history/HistoryTable.tsx:**

```typescript
import { TransactionHistory } from '@/types';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate, formatPhone } from '@/lib/utils';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

interface HistoryTableProps {
  transactions: TransactionHistory[];
}

export const HistoryTable = ({ transactions }: HistoryTableProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variant = status === 'success' ? 'default' : status === 'failed' ? 'destructive' : 'secondary';
    return (
      <Badge variant={variant} className="flex items-center gap-1">
        {getStatusIcon(status)}
        <span className="capitalize">{status}</span>
      </Badge>
    );
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No transactions yet</p>
        <p className="text-sm text-muted-foreground mt-2">
          Complete a top-up to see it here
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableCaption>Transaction history</TableCaption>

```
