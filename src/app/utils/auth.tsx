// src/app/utils/auth.tsx
// Tab-scoped session via sessionStorage (auto-clears when tab closes)

export type CustomerId = string;
const SESSION_KEY = "customerId";

export function setCustomerId(id: CustomerId | null) {
  try {
    if (id) sessionStorage.setItem(SESSION_KEY, id);
    else sessionStorage.removeItem(SESSION_KEY);
    window.dispatchEvent(new CustomEvent("customerIdChanged"));
  } catch (e) {
    console.error("auth:setCustomerId error:", e);
  }
}

export function getCustomerId(): CustomerId | null {
  try {
    return sessionStorage.getItem(SESSION_KEY);
  } catch (e) {
    console.error("auth:getCustomerId error:", e);
    return null;
  }
}

export function clearCustomerId() {
  setCustomerId(null);
}
