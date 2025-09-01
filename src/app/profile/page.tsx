"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfileIndex() {
  const router = useRouter();

  useEffect(() => {
    const id = typeof window !== "undefined" ? localStorage.getItem("customerId") : null;
    router.replace(id ? `/profile/${encodeURIComponent(id)}` : "/login");
  }, [router]);

  return null; // İstersen spinner koy
}
