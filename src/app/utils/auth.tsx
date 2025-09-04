// utils/auth.ts
export const setCustomerId = (customerId: string | null) => {
  try {
    if (customerId) {
      localStorage.setItem("customerId", customerId);
    } else {
      localStorage.removeItem("customerId");
    }
    
    // Dispatch custom event to notify Header component
    window.dispatchEvent(new CustomEvent("customerIdChanged"));
  } catch (error) {
    console.error("Error updating localStorage:", error);
  }
};

export const getCustomerId = (): string | null => {
  try {
    return localStorage.getItem("customerId");
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return null;
  }
};

export const clearCustomerId = () => {
  setCustomerId(null);
};