# Test Summary – Puntored Transaction Portal

Comprehensive test suite for the **Top-up Application** using **Vitest + React Testing Library**.  
Covers validators, components, hooks, and full form integration.

**Business Rules:**

- **Phone:** Must start with `3`, exactly 10 digits, numeric only
- **Amount:** Min `1000 COP`, Max `100000 COP`, whole numbers only

**Validators:**  
Tests cover all edge cases for `validatePhone`, `validateAmount`, and `generateTrace` ensuring strict input validation and unique trace generation.

**Components:**  
`PhoneInput` and `AmountInput` tested for rendering, input behavior, error handling, numeric filtering, prop changes (`disabled`, `error`, `value`), and UI consistency.

**TopUpPage (Integration):**  
Validates full form workflow—field updates, blur validation, accessibility labels, password masking, and business rule enforcement (min/max/format).

**useTopUp Hook:**  
Tests loading, error, and ticket states; handles successful and failed transactions; mocks `rechargeService.buy` for isolated logic.

**File Structure:**

```
src/
├─ lib/tests/validators.test.ts
├─ components/topup/tests/{PhoneInput,AmountInput}.test.tsx
├─ pages/tests/TopUpPage.test.tsx
└─ hooks/tests/useTopUp.test.ts
```

**Execution:**

```bash
npm test
npm run test:ui
npm run test:coverage
```
