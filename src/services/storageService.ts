import { TransactionHistory, Supplier } from "@/types";

const STORAGE_KEYS = {
  HISTORY: "puntored_transaction_history",
  SUPPLIERS: "puntored_suppliers_cache",
  SUPPLIERS_TIMESTAMP: "puntored_suppliers_cache_timestamp",
} as const;

const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

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
      history.unshift(transaction);

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
  // Supplier caching methods
  getSuppliers(): Supplier[] | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SUPPLIERS);
      const timestamp = localStorage.getItem(STORAGE_KEYS.SUPPLIERS_TIMESTAMP);
      
      if (!data || !timestamp) return null;
      
      const cacheAge = Date.now() - parseInt(timestamp, 10);
      if (cacheAge > CACHE_DURATION_MS) {
        this.clearSuppliers();
        return null;
      }
      
      return JSON.parse(data);
    } catch (error) {
      console.error("Failed to parse suppliers cache:", error);
      return null;
    }
  }

  setSuppliers(suppliers: Supplier[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(suppliers));
      localStorage.setItem(STORAGE_KEYS.SUPPLIERS_TIMESTAMP, Date.now().toString());
    } catch (error) {
      console.error("Failed to cache suppliers:", error);
    }
  }

  clearSuppliers(): void {
    localStorage.removeItem(STORAGE_KEYS.SUPPLIERS);
    localStorage.removeItem(STORAGE_KEYS.SUPPLIERS_TIMESTAMP);
  }
}

export const storageService = new StorageService();