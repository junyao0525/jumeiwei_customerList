import type { Customer } from "@/types/customer";

const CUSTOMERS_KEY = "customers";

/**
 * Load customers from localStorage
 * Returns null if data is corrupted or doesn't exist
 */
export function loadCustomers(): Customer[] | null {
  try {
    const data = localStorage.getItem(CUSTOMERS_KEY);
    if (!data) return null;

    const parsed = JSON.parse(data);

    // Validate that it's an array
    if (!Array.isArray(parsed)) {
      console.error("Corrupted localStorage data: not an array");
      return null;
    }

    return parsed as Customer[];
  } catch (error) {
    console.error("Error loading customers from localStorage:", error);
    return null;
  }
}

/**
 * Save customers to localStorage
 * Returns true if successful, false otherwise
 */
export function saveCustomers(customers: Customer[]): boolean {
  try {
    const data = JSON.stringify(customers);
    localStorage.setItem(CUSTOMERS_KEY, data);
    return true;
  } catch (error) {
    // Handle quota exceeded or other errors
    if (error instanceof Error && error.name === "QuotaExceededError") {
      console.error("localStorage quota exceeded");
    } else {
      console.error("Error saving customers to localStorage:", error);
    }
    return false;
  }
}

/**
 * Clear all customer data from localStorage
 */
export function clearCustomers(): void {
  try {
    localStorage.removeItem(CUSTOMERS_KEY);
  } catch (error) {
    console.error("Error clearing customers from localStorage:", error);
  }
}
