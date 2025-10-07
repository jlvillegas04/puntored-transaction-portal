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