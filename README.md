# Puntored Transaction Portal

A production-ready Mobile Top-Up transaction portal built with React, TypeScript, and modern web technologies. This application enables secure mobile recharge transactions through the Puntored API.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18.2-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [Testing](#-testing)
- [Building for Production](#-building-for-production)
- [Project Structure](#-project-structure)
- [API Integration](#-api-integration)
- [Architecture](#-architecture)
- [Development Guidelines](#-development-guidelines)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### Core Functionality

- 🔐 **Secure Authentication** - Token-based auth with localStorage persistence
- 📱 **Mobile Top-Up** - Complete recharge flow with supplier selection
- ✅ **Smart Validation** - Client-side business rules enforcement (phone format, amount limits)
- 🎫 **Digital Receipts** - Transaction tickets with full details
- 📊 **Transaction History** - Persistent local storage of all transactions
- 🔄 **Real-time Updates** - Instant feedback on transaction status

### UX Enhancements

- 🎨 **Modern UI** - Clean interface with TailwindCSS and ShadCN components
- ⚡ **Fast & Responsive** - Optimized performance with React 18
- 🔔 **Toast Notifications** - User-friendly error and success messages
- 💀 **Skeleton Screens** - Smooth loading states
- ♿ **Accessible** - WCAG 2.1 AA compliant

### Technical Excellence

- 🔒 **Type-Safe** - 100% TypeScript coverage
- 🧪 **Well-Tested** - >80% code coverage with Vitest + RTL
- 📦 **Modular** - Clean architecture with separation of concerns
- 🚀 **Production-Ready** - Optimized build with code splitting
- 🔌 **Extensible** - Easy to add new features or payment methods

---

## 🛠️ Tech Stack

### Core

- **[React 18](https://react.dev/)** - UI library with concurrent features
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Vite](https://vitejs.dev/)** - Next-generation frontend tooling

### State & Routing

- **[Zustand](https://zustand-demo.pmnd.rs/)** - Lightweight state management
- **[React Router 6](https://reactrouter.com/)** - Client-side routing

### UI & Styling

- **[TailwindCSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[ShadCN UI](https://ui.shadcn.com/)** - Accessible component library
- **[Radix UI](https://www.radix-ui.com/)** - Unstyled, accessible components
- **[Lucide Icons](https://lucide.dev/)** - Beautiful icon library

### HTTP & API

- **[Axios](https://axios-http.com/)** - HTTP client with interceptors

### Testing

- **[Vitest](https://vitest.dev/)** - Fast unit test framework
- **[React Testing Library](https://testing-library.com/react)** - Component testing
- **[@testing-library/user-event](https://testing-library.com/docs/user-event/intro)** - User interaction simulation

### Developer Experience

- **[ESLint](https://eslint.org/)** - Code linting
- **[Prettier](https://prettier.io/)** - Code formatting

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** - Version 18.x or higher
- **npm** - Version 9.x or higher (comes with Node.js)
- **Git** - For version control

Check your versions:

```bash
node --version  # Should be v18.x.x or higher
npm --version   # Should be 9.x.x or higher
git --version   # Any recent version
```

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/puntored-transaction-portal.git
cd puntored-transaction-portal
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required dependencies including:

- React and React DOM
- TypeScript
- Vite
- TailwindCSS
- ShadCN components
- Testing libraries
- And more...

### 3. Verify Installation

```bash
npm run dev
```

If successful, you should see:

```
VITE v5.x.x  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# API Base URL
VITE_API_BASE=https://services.preprodcxr.co/puntored/api/v1

# Authentication Credentials
VITE_USERNAME=PRUEBACONEXRED
VITE_COMMERCE=539998

# Transaction Configuration
VITE_POINT_OF_SALE=271826
VITE_CITY_CODE=110001
VITE_DEFAULT_LATITUDE=225;36,34.96
VITE_DEFAULT_LONGITUDE=225;36,34.96
```

### Environment-Specific Configuration

#### Development (`.env.development`)

```env
VITE_API_BASE=https://services.preprodcxr.co/puntored/api/v1
# Development settings...
```

#### Production (`.env.production`)

```env
VITE_API_BASE=https://api.production.com/v1
# Production settings...
```

#### Testing (`.env.test`)

```env
VITE_API_BASE=https://api.test.com
# Test settings...
```

---

## 🏃 Running the Application

### Development Mode

Start the development server with hot module replacement:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

Features in dev mode:

- ⚡ Instant hot module replacement (HMR)
- 🔍 Source maps for debugging
- 📝 Detailed error messages
- 🔄 Auto-reload on file changes

### Preview Production Build

Build and preview the production version locally:

```bash
npm run build
npm run preview
```

The preview server will start at `http://localhost:4173`

---

## 🧪 Testing

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm test -- --watch
```

### Run Tests with Coverage

```bash
npm run test:coverage
```

Coverage report will be generated in `coverage/` directory.

### Run Tests with UI

```bash
npm run test:ui
```

Opens Vitest UI at `http://localhost:51204/__vitest__/`

### Test Structure

```
tests/
├── unit/                    # Unit tests
│   ├── validators.test.ts   # Validation logic tests
│   └── utils.test.ts        # Utility function tests
├── integration/             # Integration tests
│   ├── LoginPage.test.tsx   # Login flow tests
│   ├── TopUpPage.test.tsx   # Top-up flow tests
│   └── HistoryPage.test.tsx # History tests
├── utils/                   # Test utilities
│   ├── mockData.ts          # Mock data fixtures
│   └── test-utils.tsx       # Custom render functions
└── setup.ts                 # Test setup and configuration
```

### Coverage Goals

- **Overall**: >80%
- **Utilities/Validators**: >90%
- **Critical Paths**: 100% (auth, purchase flow)

---

## 🏗️ Building for Production

### Build the Application

```bash
npm run build
```

Output will be in the `dist/` directory:

```
dist/
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── ...
├── index.html
└── ...
```

### Build Optimization Features

- 📦 **Code Splitting** - Automatic route-based splitting
- 🗜️ **Minification** - Terser for JS, cssnano for CSS
- 🌲 **Tree Shaking** - Removes unused code
- 💾 **Compression** - Gzip/Brotli ready
- 🔍 **Source Maps** - For production debugging
- 📊 **Bundle Analysis** - Visualize bundle size

### Analyze Bundle Size

```bash
npm run build -- --mode analyze
```

### Build Statistics

Typical production build:

- **Initial Bundle**: ~150-200 KB (gzipped)
- **Total Assets**: ~300-400 KB
- **Build Time**: 5-10 seconds

---

## 📁 Project Structure

```
puntored-transaction-portal/
├── public/                          # Static assets
│   └── vite.svg
├── src/
│   ├── api/                         # API client configuration
│   │   ├── client.ts                # Axios instance with interceptors
│   │   ├── endpoints.ts             # API endpoint constants
│   │   └── types.ts                 # API type definitions
│   ├── components/
│   │   ├── ui/                      # ShadCN UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── select.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── skeleton.tsx
│   │   │   └── table.tsx
│   │   ├── layout/                  # Layout components
│   │   │   ├── AppLayout.tsx        # Main application layout
│   │   │   ├── Header.tsx           # Navigation header
│   │   │   └── ProtectedRoute.tsx   # Route guard component
│   │   ├── auth/                    # Authentication components
│   │   │   └── LoginForm.tsx        # Login form
│   │   ├── topup/                   # Top-up feature components
│   │   │   ├── TopUpForm.tsx        # Main top-up form
│   │   │   ├── SupplierSelect.tsx   # Supplier dropdown
│   │   │   ├── PhoneInput.tsx       # Phone number input
│   │   │   ├── AmountInput.tsx      # Amount input
│   │   │   └── TicketCard.tsx       # Transaction receipt
│   │   └── history/                 # History feature components
│   │       ├── HistoryTable.tsx     # Transaction table
│   │       └── TransactionRow.tsx   # Table row component
│   ├── hooks/                       # Custom React hooks
│   │   ├── useAuth.ts               # Authentication hook
│   │   ├── useSuppliers.ts          # Suppliers data hook
│   │   ├── useTopUp.ts              # Top-up transaction hook
│   │   └── useHistory.ts            # Transaction history hook
│   ├── lib/                         # Utility libraries
│   │   ├── utils.ts                 # General utilities (cn, formatters)
│   │   └── validators.ts            # Validation functions
│   ├── pages/                       # Page components
│   │   ├── LoginPage.tsx            # Login page (/login)
│   │   ├── TopUpPage.tsx            # Top-up page (/topup)
│   │   └── HistoryPage.tsx          # History page (/history)
│   ├── services/                    # Service layer
│   │   ├── authService.ts           # Authentication API calls
│   │   ├── rechargeService.ts       # Recharge API calls
│   │   └── storageService.ts        # localStorage abstraction
│   ├── store/                       # State management
│   │   ├── authStore.ts             # Zustand auth store
│   │   └── index.ts                 # Store exports
│   ├── types/                       # TypeScript definitions
│   │   ├── auth.types.ts            # Auth types
│   │   ├── recharge.types.ts        # Recharge types
│   │   ├── common.types.ts          # Common types
│   │   └── index.ts                 # Type exports
│   ├── App.tsx                      # Root component with router
│   ├── main.tsx                     # Application entry point
│   ├── index.css                    # Global styles & Tailwind
│   └── env.d.ts                     # Environment types
├── tests/                           # Test files
│   ├── unit/                        # Unit tests
│   ├── integration/                 # Integration tests
│   ├── utils/                       # Test utilities
│   └── setup.ts                     # Test configuration
├── .env.example                     # Environment template
├── .env                             # Local environment (gitignored)
├── .eslintrc.cjs                    # ESLint configuration
├── .gitignore                       # Git ignore rules
├── components.json                  # ShadCN configuration
├── index.html                       # HTML entry point
├── package.json                     # Dependencies and scripts
├── postcss.config.js                # PostCSS configuration
├── tailwind.config.js               # Tailwind configuration
├── tsconfig.json                    # TypeScript config (app)
├── tsconfig.node.json               # TypeScript config (node)
├── vite.config.ts                   # Vite configuration
├── vitest.config.ts                 # Vitest configuration
├── ARCHITECTURE.md                  # Architecture documentation
├── TYPE_DEFINITIONS.md              # Type system documentation
├── IMPLEMENTATION_PLAN.md           # Implementation guide
└── README.md                        # This file
```

---

## 🔌 API Integration

### Authentication

**Endpoint**: `POST /auth`

**Request**:

```typescript
{
  "username": "PRUEBACONEXRED",
  "password": "<hashed-password>",
  "commerce": 539998
}
```

**Response**:

```typescript
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "type": "Bearer",
    "expiration": "2024-01-15T23:59:59Z"
  }
}
```

### Find Suppliers

**Endpoint**: `POST /recharge/find-suppliers`

**Headers**: `Authorization: Bearer <token>`

**Request**:

```typescript
{
  "pointOfSale": "271826"
}
```

**Response**:

```typescript
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "Claro",
      "productCode": "668",
      "minAmount": 1000,
      "maxAmount": 100000
    }
  ]
}
```

### Buy Recharge

**Endpoint**: `POST /recharge/buy`

**Headers**: `Authorization: Bearer <token>`

**Request**:

```typescript
{
  "pointOfSale": 271826,
  "terminal": "383149",
  "transactionalPassword": "123456",
  "number": "3183372233",
  "amount": 10000,
  "trace": "aE312awwQasA",
  "productCode": "668",
  "Ciudad": "110001",
  "Latitud": "225;36,34.96",
  "Longitud": "225;36,34.96"
}
```

**Response**:

```typescript
{
  "success": true,
  "data": {
    "ticket": {
      "date": "2024-01-15T10:30:00Z",
      "transactionId": "TXN123456",
      "authorizationCode": "AUTH789",
      "number": "3183372233",
      "amount": 10000,
      "supplier": "Claro",
      "productCode": "668",
      "status": "success"
    }
  }
}
```

---

## 🏛️ Architecture

### Clean Architecture Layers

```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│     (Pages, Components, Hooks)      │
├─────────────────────────────────────┤
│         Application Layer           │
│     (State Management, Router)      │
├─────────────────────────────────────┤
│          Domain Layer               │
│     (Types, Validators, Utils)      │
├─────────────────────────────────────┤
│       Infrastructure Layer          │
│   (API Client, Services, Storage)   │
└─────────────────────────────────────┘
```

### Data Flow

```
User Interaction
      ↓
  Component
      ↓
   Custom Hook
      ↓
    Service
      ↓
  API Client
      ↓
External API
      ↓
  API Client (response)
      ↓
    Service
      ↓
   Store/State
      ↓
  Component (re-render)
      ↓
   Updated UI
```

### State Management

- **Auth State**: Zustand store with localStorage persistence
- **UI State**: React component state
- **Form State**: Local state with custom hooks
- **Server State**: Cached in hooks with manual refresh

---

## 💻 Development Guidelines

### Code Style

- Use **functional components** with hooks
- Follow **TypeScript strict mode**
- Use **explicit return types** for functions
- Avoid `any` type - use `unknown` if needed
- Keep components **small and focused**
- Extract **reusable logic** into custom hooks

### Component Best Practices

```typescript
// ✅ Good - Typed props, clear interface
interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

export const Button = ({ onClick, disabled, children }: ButtonProps) => {
  return (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

// ❌ Bad - No types, unclear props
export const Button = ({ onClick, disabled, children }) => {
  return (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};
```

### Naming Conventions

- **Components**: PascalCase (`TopUpForm.tsx`)
- **Hooks**: camelCase with `use` prefix (`useTopUp.ts`)
- **Utilities**: camelCase (`formatCurrency.ts`)
- **Types**: PascalCase (`AuthState`, `BuyRequest`)
- **Constants**: UPPER_SNAKE_CASE (`API_ENDPOINTS`)

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/new-feature
```

### Commit Convention

```
feat: new feature
fix: bug fix
docs: documentation changes
style: formatting, missing semicolons, etc.
refactor: code restructuring
test: adding tests
chore: maintenance tasks
```

---

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use

```bash
Error: Port 5173 is already in use
```

**Solution**:

```bash
# Find and kill the process
lsof -ti:5173 | xargs kill -9

# Or use a different port
npm run dev -- --port 3000
```

#### Module Not Found

```bash
Error: Cannot find module '@/components/ui/button'
```

**Solution**:

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### TypeScript Errors

```bash
Error: Type 'string' is not assignable to type 'number'
```

**Solution**:

- Check type definitions in `src/types/`
- Ensure proper type casting
- Run `npm run build` to see all errors

#### Environment Variables Not Loading

```bash
Error: import.meta.env.VITE_API_BASE is undefined
```

**Solution**:

- Ensure `.env` file exists in project root
- Variables must start with `VITE_`
- Restart dev server after changing `.env`

#### Tests Failing

```bash
Error: ReferenceError: localStorage is not defined
```

**Solution**:

- Check `tests/setup.ts` for proper mocks
- Ensure `jsdom` environment in vitest config
- Clear test cache: `npm test -- --clearCache`

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Write/update tests
5. Ensure all tests pass (`npm test`)
6. Commit your changes (`git commit -m 'feat: add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Pull Request Guidelines

- Clear title and description
- Reference related issues
- Include screenshots for UI changes
- Ensure tests pass
- Update documentation if needed

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Development Team** - Initial work

---

## 🙏 Acknowledgments

- [Puntored](https://www.puntored.com.co/) for the API
- [ShadCN](https://ui.shadcn.com/) for the amazing component library
- [React Team](https://react.dev/) for React 18
- [Vite Team](https://vitejs.dev/) for the blazing-fast build tool

---

## 📞 Support

For support, please:

- Open an issue on GitHub
- Contact the development team
- Check the [ARCHITECTURE.md](ARCHITECTURE.md) for detailed documentation

---

## 🗺️ Roadmap

### Phase 1 (Completed)

- ✅ Authentication
- ✅ Top-up flow
- ✅ Transaction history
- ✅ Comprehensive testing

### Phase 2 (Planned)

- ⏳ Multi-language support (i18n)
- ⏳ Dark mode
- ⏳ PWA capabilities
- ⏳ Export transaction history (CSV/PDF)
- ⏳ Advanced filtering

### Phase 3 (Future)

- 📋 Real-time transaction updates (WebSocket)
- 📋 Push notifications
- 📋 Biometric authentication
- 📋 QR code scanner
- 📋 Analytics dashboard

---

<div align="center">

**Made with ❤️ for Puntored**

[Report Bug](https://github.com/your-org/puntored-transaction-portal/issues) · [Request Feature](https://github.com/your-org/puntored-transaction-portal/issues)

</div>
