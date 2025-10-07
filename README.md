# Puntored Transaction Portal

Mobile top-up transaction portal built with React, TypeScript, and Vite.

## Tech Stack

- **Frontend**: React 18, TypeScript 5, Vite
- **State**: Zustand (store management), React hooks (UI state)
- **Routing**: React Router 7
- **Styling**: TailwindCSS, ShadCN UI
- **HTTP**: Axios
- **Testing**: Vitest, React Testing Library

## Requirements

- Node.js 18+
- npm 9+

## Installation

```bash
# Clone and install
git clone <repository-url>
cd puntored-transaction-portal
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Run development server
npm run dev
```

## Environment Variables

All environment variables can be found on Puntored's Postman API collection.

## Available Commands

```bash
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Build for production
npm run preview      # Preview production build
npm test             # Run tests
npm run test:ui      # Run tests with UI
npm run test:coverage # Generate coverage report
```

## Features

- **Authentication**: Token-based with localStorage persistence
- **Top-Up Flow**: Supplier selection, validated inputs, transaction execution
- **Validation**: Phone (starts with 3, 10 digits), Amount (1,000-100,000 COP)
- **Transaction History**: Persistent local storage
- **Testing**: >90% coverage

## Project Structure

```
src/
├── api/              # API client, endpoints
├── components/       # React components
│   ├── ui/          # ShadCN components
│   ├── layout/      # Layout, navigation
│   ├── topup/       # Top-up feature
│   └── history/     # Transaction history
├── hooks/           # Custom React hooks
├── lib/             # Utilities, validators
├── pages/           # Page components
├── services/        # API services, storage
├── store/           # Zustand stores
└── types/           # TypeScript types
```

## Key Validation Rules

**Phone Number**:

- Must start with 3
- Exactly 10 digits
- Pattern: `/^3\d{9}$/`

**Amount**:

- Minimum: 1,000 COP
- Maximum: 100,000 COP
- Must be integer

## API Endpoints

- `POST /auth` - Authentication
- `POST /recharge/find-suppliers` - Get suppliers
- `POST /recharge/buy` - Execute top-up

## Building for Production

```bash
npm run build
# Output in dist/ directory

npm run preview
# Preview at http://localhost:4173
```

## Testing

```bash
# Run all tests
npm test

# Watch mode
npm test -- --watch

# Coverage report
npm run test:coverage
```

Coverage targets:

- Overall: >90%
- Validators: >90%
- Critical paths: 100%

## License

MIT
