# Architecture

## Overview

Clean architecture React application with TypeScript, focusing on maintainability, testability, and type safety.

## Architecture Layers

```
┌─────────────────────────────────┐
│   Presentation (Pages/Components)│
├─────────────────────────────────┤
│   Application (Hooks/Router)     │
├─────────────────────────────────┤
│   Domain (Types/Validators)      │
├─────────────────────────────────┤
│   Infrastructure (API/Services)  │
└─────────────────────────────────┘
```

## Technology Decisions

| Technology      | Justification                                       |
| --------------- | --------------------------------------------------- |
| **Vite**        | Fast dev server, optimized builds                   |
| **TypeScript**  | Type safety, better IDE support                     |
| **Zustand**     | Lightweight (1KB), simple API, built-in persistence |
| **TailwindCSS** | Utility-first, fast prototyping                     |
| **ShadCN**      | Accessible, customizable, no runtime overhead       |
| **Vitest**      | Fast, Vite-native, Jest-compatible                  |

## Folder Structure

```
src/
├── api/                    # HTTP client, endpoints
│   ├── client.ts          # Axios with interceptors
│   └── endpoints.ts       # API routes
├── components/
│   ├── ui/                # ShadCN components
│   ├── layout/            # AppLayout, ProtectedRoute
│   ├── topup/             # Top-up feature components
│   └── history/           # History feature components
├── hooks/                 # Custom React hooks
│   ├── useSuppliers.ts   # Fetch suppliers
│   ├── useTopUp.ts       # Transaction logic
│   └── useHistory.ts     # History management
├── lib/                   # Utilities
│   ├── validators.ts     # Validation functions
│   └── utils.ts          # Formatters, helpers
├── pages/                 # Route components
│   ├── LoginPage.tsx
│   ├── TopUpPage.tsx
│   └── HistoryPage.tsx
├── services/              # Business logic
│   ├── authService.ts    # Authentication
│   ├── rechargeService.ts # Recharge API
│   └── storageService.ts  # localStorage wrapper
├── store/                 # State management
│   └── authStore.ts      # Zustand auth store
└── types/                 # TypeScript definitions
    ├── auth.types.ts
    ├── recharge.types.ts
    └── common.types.ts
```

## Data Flow

```
User → Component → Hook → Service → API Client → Backend
                                                      ↓
User ← Component ← Hook ← Service ← API Client ← Response
```

## Key Patterns

### API Client

Centralized Axios instance with:

- Auth token injection via interceptors
- Error normalization
- Type-safe methods

```typescript
// Automatic auth injection
interceptor.request.use((config) => {
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Error normalization
interceptor.response.use(
  (response) => response,
  (error) => normalizeError(error)
);
```

### State Management

- **Global**: Zustand for auth (persisted to localStorage)
- **UI**: React hooks for component state
- **Forms**: Local state with validation

### Validation Strategy

Client-side validation for UX:

- Phone: `/^3\d{9}$/`
- Amount: 1,000-100,000 COP, integer only

Server-side validation trusted as source of truth.

### Protected Routes

```typescript
ProtectedRoute checks:
1. isAuthenticated
2. Token expiration
3. Redirects to /login if invalid
```

## Core Type System

### Authentication

```typescript
interface AuthState {
  token: string | null;
  type: string | null;
  expiration: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  checkExpiration: () => boolean;
}
```

### Transactions

```typescript
interface BuyRechargeRequest {
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

interface Ticket {
  date: string;
  transactionId: string;
  authorizationCode: string;
  number: string;
  amount: number;
  supplier: string;
  status: "success" | "failed" | "pending";
}
```

## Security

- **Auth**: Token-based, stored in localStorage
- **Token expiration**: Checked on navigation, auto-logout
- **Input validation**: Client-side for UX, server-side for security
- **HTTPS**: Required by API
- **XSS**: React escapes by default

## Performance

- **Code splitting**: Route-based automatic splitting
- **Tree shaking**: Removes unused code
- **Bundle size**: ~150-200KB gzipped
- **Caching**: Suppliers cached in memory

## Testing Strategy

```
        /\
       /  \       E2E (Manual)
      /    \
     /------\     Integration (RTL)
    /        \
   /----------\   Unit (Vitest)
  /__________  \
```

Coverage targets:

- Overall: >90%
- Validators: >90%
- Critical paths: 100%

## API Integration

### Authentication Flow

```
1. User enters password
2. authService.login(credentials)
3. Token stored in Zustand + localStorage
4. Axios interceptor adds token to requests
5. On expiration: auto-logout + redirect
```

### Transaction Flow

```
1. Load suppliers (useSuppliers)
2. User fills form with validation
3. Submit → useTopUp → rechargeService.buy
4. API returns ticket
5. Save to localStorage (storageService)
6. Display TicketCard
```

## Deployment

### Build

```bash
npm run build
# Output: dist/
# Typical size: ~300-400KB total
```

### Environment

Requires these variables:

- `VITE_API_BASE`
- `VITE_USERNAME`
- `VITE_COMMERCE`
- `VITE_POINT_OF_SALE`
- `VITE_CITY_CODE`
- `VITE_DEFAULT_LATITUDE`
- `VITE_DEFAULT_LONGITUDE`
