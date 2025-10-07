# Component Hierarchy & Architecture Diagrams

This document provides visual representations of the application's component structure, data flow, and architectural patterns.

---

## Table of Contents

1. [Application Component Tree](#application-component-tree)
2. [Page Component Breakdown](#page-component-breakdown)
3. [Data Flow Diagram](#data-flow-diagram)
4. [State Management Flow](#state-management-flow)
5. [API Integration Flow](#api-integration-flow)
6. [Authentication Flow](#authentication-flow)
7. [Transaction Flow](#transaction-flow)

---

## Application Component Tree

This diagram shows the complete component hierarchy from App root to leaf components.

```mermaid
graph TD
    A[App.tsx] --> B[BrowserRouter]
    B --> C[Routes]
    C --> D[Public Route: /login]
    C --> E[Protected Routes]

    D --> F[LoginPage]

    E --> G[ProtectedRoute]
    G --> H[AppLayout]

    H --> I[Header]
    H --> J[Main Content]

    J --> K[TopUpPage]
    J --> L[HistoryPage]

    I --> M[Navigation]
    I --> N[Logout Button]

    K --> O[TopUpForm]
    K --> P[TicketCard]

    O --> Q[SupplierSelect]
    O --> R[PhoneInput]
    O --> S[AmountInput]
    O --> T[Terminal Input]
    O --> U[Password Input]

    L --> V[HistoryTable]
    V --> W[TransactionRow]

    A --> X[Toaster]

    style A fill:#e1f5ff
    style F fill:#fff4e6
    style K fill:#e8f5e9
    style L fill:#e8f5e9
    style H fill:#f3e5f5
```

---

## Page Component Breakdown

### LoginPage Components

```mermaid
graph LR
    A[LoginPage] --> B[Card]
    B --> C[CardHeader]
    B --> D[CardContent]

    C --> E[Title]
    C --> F[Description]

    D --> G[Login Form]
    G --> H[Username Input - disabled]
    G --> I[Password Input]
    G --> J[Submit Button]

    A --> K[useAuthStore]
    A --> L[useToast]
    A --> M[useNavigate]

    style A fill:#fff4e6
    style K fill:#e3f2fd
    style L fill:#e3f2fd
    style M fill:#e3f2fd
```

### TopUpPage Components

```mermaid
graph TB
    A[TopUpPage] --> B[Card Container]
    B --> C[Form State]
    B --> D[Validation State]

    B --> E[SupplierSelect]
    B --> F[PhoneInput]
    B --> G[AmountInput]
    B --> H[Terminal Input]
    B --> I[Password Input]
    B --> J[Submit Button]

    A --> K[useSuppliers Hook]
    A --> L[useTopUp Hook]
    A --> M[useToast Hook]

    K --> N[rechargeService.findSuppliers]
    L --> O[rechargeService.buy]

    A --> P{Has Ticket?}
    P -->|Yes| Q[TicketCard]
    P -->|No| B

    Q --> R[Transaction Details]
    Q --> S[Authorization Code]
    Q --> T[New Transaction Button]

    style A fill:#e8f5e9
    style K fill:#e3f2fd
    style L fill:#e3f2fd
    style M fill:#e3f2fd
    style Q fill:#fff9c4
```

### HistoryPage Components

```mermaid
graph TB
    A[HistoryPage] --> B[Page Header]
    A --> C[Action Buttons]
    A --> D[History Card]

    B --> E[Title]
    B --> F[Description]

    C --> G[Refresh Button]
    C --> H[Clear All Button]

    H --> I[AlertDialog]
    I --> J[Confirmation]

    D --> K{Loading?}
    K -->|Yes| L[Skeleton Screens]
    K -->|No| M[HistoryTable]

    M --> N{Has Transactions?}
    N -->|Yes| O[Table with Rows]
    N -->|No| P[Empty State]

    O --> Q[TransactionRow]
    Q --> R[Date Column]
    Q --> S[Phone Column]
    Q --> T[Supplier Column]
    Q --> U[Amount Column]
    Q --> V[Status Badge]
    Q --> W[Auth Code Column]

    A --> X[useHistory Hook]
    X --> Y[storageService]

    style A fill:#e8f5e9
    style X fill:#e3f2fd
```

---

## Data Flow Diagram

This diagram illustrates how data flows through the application.

```mermaid
sequenceDiagram
    participant U as User
    participant C as Component
    participant H as Custom Hook
    participant S as Service
    participant API as API Client
    participant BE as Backend API
    participant Store as Zustand Store
    participant LS as LocalStorage

    U->>C: Interaction (click, type)
    C->>H: Call hook function
    H->>S: Call service method
    S->>API: HTTP request
    API->>API: Add auth token
    API->>BE: Send request
    BE->>API: Response
    API->>API: Normalize errors
    API->>S: Return data
    S->>H: Process data
    H->>Store: Update state (if needed)
    Store->>LS: Persist (if configured)
    H->>C: Return result
    C->>C: Re-render
    C->>U: Updated UI
```

---

## State Management Flow

### Zustand Auth Store Pattern

```mermaid
graph TB
    A[User Action] --> B[Component]
    B --> C[useAuthStore Hook]

    C --> D{Action Type}

    D -->|login| E[Call authService.login]
    D -->|logout| F[Clear state]
    D -->|checkExpiration| G[Validate token]

    E --> H[API Request]
    H --> I{Success?}
    I -->|Yes| J[Update Store State]
    I -->|No| K[Throw Error]

    J --> L[Zustand Middleware]
    L --> M[Persist to LocalStorage]

    M --> N[Trigger Subscribers]
    N --> O[Component Re-renders]

    F --> M
    G --> P{Valid?}
    P -->|No| F
    P -->|Yes| Q[Continue]

    style C fill:#e3f2fd
    style J fill:#c8e6c9
    style K fill:#ffcdd2
    style M fill:#fff9c4
```

### Component State Pattern

```mermaid
graph LR
    A[Component Mount] --> B[Initialize State]
    B --> C[useState Hooks]

    C --> D[Form Values]
    C --> E[Errors]
    C --> F[Touched Fields]
    C --> G[Loading State]

    H[User Input] --> I[handleChange]
    I --> J[Update Values]
    J --> K{Should Validate?}
    K -->|Yes| L[validateField]
    K -->|No| M[Update State Only]

    L --> N{Valid?}
    N -->|Yes| O[Clear Error]
    N -->|No| P[Set Error]

    Q[Form Submit] --> R[validateAll]
    R --> S{All Valid?}
    S -->|Yes| T[Submit to API]
    S -->|No| U[Show Errors]

    T --> V{Success?}
    V -->|Yes| W[Show Success]
    V -->|No| X[Show Error]

    style C fill:#e3f2fd
    style L fill:#fff9c4
    style T fill:#c8e6c9
```

---

## API Integration Flow

### Request Lifecycle

```mermaid
sequenceDiagram
    participant C as Component
    participant H as Hook
    participant S as Service
    participant AC as API Client
    participant INT as Interceptor
    participant BE as Backend

    C->>H: Call action
    H->>S: Call service method
    S->>AC: HTTP request

    Note over AC,INT: Request Phase
    AC->>INT: Request interceptor
    INT->>INT: Get auth token from localStorage
    INT->>INT: Add Authorization header
    INT->>BE: Send modified request

    Note over BE: Processing
    BE->>BE: Validate & Process

    Note over INT,BE: Response Phase
    BE->>INT: Response
    INT->>INT: Check status

    alt Success (2xx)
        INT->>AC: Return response
        AC->>S: Return data
        S->>H: Return result
        H->>C: Success callback
    else Error (4xx/5xx)
        INT->>INT: Normalize error
        INT->>AC: Throw normalized error
        AC->>S: Propagate error
        S->>H: Return error
        H->>C: Error callback
    end
```

### Error Handling Flow

```mermaid
graph TB
    A[API Error] --> B{Error Type}

    B -->|Network Error| C[No Response]
    B -->|Server Error| D[Response Error]
    B -->|Request Error| E[Config Error]

    C --> F[Create Network Error]
    F --> G[status: 0]
    F --> H[message: Network error]

    D --> I[Extract Status Code]
    D --> J[Extract Error Message]
    I --> K[Create API Error]
    J --> K

    E --> L[Create Config Error]

    G --> M[Normalized Error]
    K --> M
    L --> M

    M --> N[Return to Caller]
    N --> O[Display Toast]
    N --> P[Update Error State]
    N --> Q[Log to Console]

    style M fill:#ffcdd2
    style O fill:#fff9c4
```

---

## Authentication Flow

### Login Process

```mermaid
sequenceDiagram
    participant U as User
    participant LP as LoginPage
    participant AS as AuthStore
    participant AuthS as AuthService
    participant API as API Client
    participant BE as Backend
    participant LS as LocalStorage

    U->>LP: Enter password
    U->>LP: Click Sign In

    LP->>AS: login(credentials)
    AS->>AuthS: login(credentials)
    AuthS->>API: POST /auth
    API->>BE: Request

    alt Success
        BE->>API: 200 OK + token
        API->>AuthS: Return auth data
        AuthS->>AS: Return response
        AS->>AS: Set token, type, expiration
        AS->>LS: Persist auth state
        AS->>LP: Success
        LP->>LP: Navigate to /topup
        LP->>U: Show success toast
    else Failure
        BE->>API: 401 Unauthorized
        API->>AuthS: Throw error
        AuthS->>AS: Propagate error
        AS->>AS: Clear auth state
        AS->>LP: Throw error
        LP->>U: Show error toast
    end
```

### Protected Route Check

```mermaid
graph TB
    A[User Navigates] --> B[ProtectedRoute Component]
    B --> C{Authenticated?}

    C -->|No| D[Redirect to /login]

    C -->|Yes| E[Check Token Expiration]
    E --> F{Token Valid?}

    F -->|No| G[Call logout]
    G --> D

    F -->|Yes| H[Render AppLayout]
    H --> I[Render Page Content]

    I --> J{Which Page?}
    J -->|/topup| K[TopUpPage]
    J -->|/history| L[HistoryPage]

    style C fill:#fff9c4
    style E fill:#fff9c4
    style H fill:#c8e6c9
    style D fill:#ffcdd2
```

---

## Transaction Flow

### Complete Top-Up Process

```mermaid
sequenceDiagram
    participant U as User
    participant TP as TopUpPage
    participant SH as useSuppliers
    participant TH as useTopUp
    participant RS as RechargeService
    participant API as API Client
    participant BE as Backend
    participant SS as StorageService
    participant LS as LocalStorage

    Note over TP,SH: Initialization
    TP->>SH: Fetch suppliers
    SH->>RS: findSuppliers(pointOfSale)
    RS->>API: POST /recharge/find-suppliers
    API->>BE: Request with auth
    BE->>API: Suppliers list
    API->>RS: Return data
    RS->>SH: Return suppliers
    SH->>TP: Update state
    TP->>U: Display suppliers dropdown

    Note over U,TP: Form Filling
    U->>TP: Select supplier
    U->>TP: Enter phone number
    TP->>TP: Validate phone (3XXXXXXXXX)
    U->>TP: Enter amount
    TP->>TP: Validate amount (1000-100000)
    U->>TP: Enter terminal
    U->>TP: Enter password

    Note over U,BE: Submission
    U->>TP: Click Buy Top-Up
    TP->>TP: validateAll()

    alt Valid Form
        TP->>TH: buyTopUp(request)
        TH->>TH: Generate trace ID
        TH->>RS: buy(buyRequest)
        RS->>API: POST /recharge/buy
        API->>BE: Request with auth

        alt Success
            BE->>API: 200 OK + ticket
            API->>RS: Return ticket
            RS->>TH: Return ticket
            TH->>TP: Return ticket

            TP->>SS: addTransaction(history)
            SS->>LS: Save to localStorage

            TP->>TP: Show TicketCard
            TP->>U: Display success ticket
        else Failure
            BE->>API: Error response
            API->>RS: Throw error
            RS->>TH: Propagate error
            TH->>TP: Return error
            TP->>U: Show error toast
        end
    else Invalid Form
        TP->>U: Show validation errors
    end
```

### History Retrieval Flow

```mermaid
graph TB
    A[User Navigates to /history] --> B[HistoryPage Mount]
    B --> C[useHistory Hook]
    C --> D[Call loadHistory]

    D --> E[StorageService.getHistory]
    E --> F[Read from LocalStorage]
    F --> G[Parse JSON]

    G --> H{Parse Success?}
    H -->|Yes| I[Return transactions array]
    H -->|No| J[Return empty array]

    I --> K[Update State]
    J --> K

    K --> L[Set loading = false]
    L --> M{Has Transactions?}

    M -->|Yes| N[Render HistoryTable]
    M -->|No| O[Render Empty State]

    N --> P[Map transactions]
    P --> Q[Render TransactionRow]
    Q --> R[Display Details]

    style B fill:#e8f5e9
    style E fill:#fff9c4
    style K fill:#c8e6c9
```

---

## Component Interaction Matrix

This matrix shows which components interact with which services, stores, and hooks.

| Component          | Auth Store | Storage Service | API Hooks                 | Router      |
| ------------------ | ---------- | --------------- | ------------------------- | ----------- |
| **LoginPage**      | ✅ Write   | ❌              | ❌                        | ✅ Navigate |
| **ProtectedRoute** | ✅ Read    | ❌              | ❌                        | ✅ Redirect |
| **AppLayout**      | ✅ Read    | ❌              | ❌                        | ✅ Navigate |
| **TopUpPage**      | ❌         | ✅ Write        | ✅ useSuppliers, useTopUp | ❌          |
| **HistoryPage**    | ❌         | ✅ Read/Write   | ✅ useHistory             | ❌          |
| **TicketCard**     | ❌         | ❌              | ❌                        | ❌          |

---

## Dependency Graph

### Service Dependencies

```mermaid
graph LR
    A[Components] --> B[Custom Hooks]
    B --> C[Services]
    C --> D[API Client]

    A --> E[Zustand Stores]
    E --> C

    C --> F[StorageService]
    F --> G[LocalStorage]

    D --> H[Axios]
    D --> I[Environment Config]

    B --> J[Validators]
    B --> K[Formatters]

    style A fill:#e1f5ff
    style B fill:#c8e6c9
    style C fill:#fff9c4
    style E fill:#f3e5f5
```

### Type Dependencies

```mermaid
graph TB
    A[Common Types] --> B[Auth Types]
    A --> C[Recharge Types]

    B --> D[Component Props]
    C --> D

    D --> E[Page Components]
    D --> F[UI Components]

    B --> G[Services]
    C --> G

    G --> H[API Client]

    style A fill:#e1f5ff
    style B fill:#c8e6c9
    style C fill:#fff9c4
```

---

## Lifecycle Diagrams

### Component Lifecycle with Data Fetching

```mermaid
sequenceDiagram
    participant R as React
    participant C as Component
    participant H as Custom Hook
    participant S as Service

    R->>C: Mount
    C->>C: useState (initialize)
    C->>H: useEffect (data fetch)

    H->>H: Set loading = true
    H->>S: Fetch data

    alt Success
        S->>H: Return data
        H->>H: Set data
        H->>H: Set loading = false
        H->>C: Return { data, loading: false }
        C->>R: Re-render with data
    else Error
        S->>H: Throw error
        H->>H: Set error
        H->>H: Set loading = false
        H->>C: Return { error, loading: false }
        C->>R: Re-render with error
    end

    Note over R,C: User Interaction
    R->>C: User action
    C->>H: Call mutation
    H->>S: Update data
    S->>H: Success
    H->>C: Callback
    C->>R: Re-render
```

---

## Architecture Patterns

### Custom Hook Pattern

```typescript
// Pattern: Encapsulate API logic in custom hooks
export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response = await rechargeService.findSuppliers(pointOfSale);
      setSuppliers(response.data);
    } catch (err) {
      setError(err.message);
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

### Service Layer Pattern

```typescript
// Pattern: Separate business logic from UI
class RechargeService {
  async buy(request: BuyRechargeRequest): Promise<BuyRechargeResponse> {
    // Validation, transformation, API call
    return apiClient.post<BuyRechargeResponse>(API_ENDPOINTS.BUY, request);
  }
}
```

### Validation Pattern

```typescript
// Pattern: Pure functions for validation
export const validatePhone = (phone: string): ValidationResult => {
  if (!phone) return { isValid: false, error: "Required" };
  if (!/^3\d{9}$/.test(phone))
    return { isValid: false, error: "Invalid format" };
  return { isValid: true };
};
```

---

## Summary

This component hierarchy demonstrates:

1. **Clear Separation of Concerns** - UI, business logic, and data access are separated
2. **Unidirectional Data Flow** - Data flows from stores → hooks → components
3. **Encapsulation** - Complex logic is hidden in hooks and services
4. **Reusability** - Components and hooks can be reused across pages
5. **Testability** - Each layer can be tested independently
6. **Maintainability** - Changes are localized to specific layers

The architecture follows React best practices and modern patterns for building scalable applications.
