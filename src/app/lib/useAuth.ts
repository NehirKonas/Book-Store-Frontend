"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * useAuth
 * @param required if true, redirects to /login when not logged in
 */
export function useAuth(required: boolean = false) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("customerId") : null;
    if (stored) {
      setId(stored);
    } else if (required) {
      router.replace("/login");
    }
    setLoading(false);
  }, [required, router]);

  return { id, loading, loggedIn: !!id };
}
