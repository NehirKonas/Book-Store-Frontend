"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import "../../signin/signin.css";

type Customer = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  address?: string;
  phone?: string;
  birthDate?: string;  // yyyy-mm-dd
};

export default function ProfilePage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080";
  const params = useParams() as { profileId?: string };
  const router = useRouter();

  const [id, setId] = useState<string | null>(params?.profileId ?? null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // URL’de id yoksa localStorage’dan al
  useEffect(() => {
    if (!id) {
      const stored = typeof window !== "undefined" ? localStorage.getItem("customerId") : null;
      if (stored) {
        setId(stored);
        router.replace(`/profile/${encodeURIComponent(stored)}`);
      } else {
        setErr("Not logged in");
        router.replace("/login");
      }
    }
  }, [id, router]);

  // Profil bilgilerini çek
  useEffect(() => {
    if (!id) return;

    const ctrl = new AbortController();
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    (async () => {
      try {
        setLoading(true);
        setErr(null);

        const res = await fetch(`${API_BASE}/api/customers/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          signal: ctrl.signal,
        });

        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            localStorage.removeItem("customerId");
            localStorage.removeItem("token");
            setErr("Session expired. Please log in again.");
            setTimeout(() => router.replace("/login"), 1000);
            return;
          }
          if (res.status === 404) {
            setErr("Profile not found. Please log in again.");
            setTimeout(() => router.replace("/login"), 1000);
            return;
          }
          throw new Error(`Failed to load profile (${res.status})`);
        }

        const data: Customer = await res.json();
        setCustomer(data);
      } catch (e: any) {
        if (e.name !== "AbortError") {
          setErr(e?.message || "Could not load profile");
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => ctrl.abort();
  }, [id, API_BASE, router]);

  const toYYYYMMDD = (d?: string) => (d && d.length >= 10 ? d.slice(0, 10) : d ?? "");

  if (loading) {
    return (
      <main className="mainContainer">
        <div className="signinBox" style={{ maxWidth: 520 }}>
          <h1 className="signinH">Your Profile</h1>
          <p className="msgText">Loading…</p>
        </div>
      </main>
    );
  }

  if (err) {
    return (
      <main className="mainContainer">
        <div className="signinBox" style={{ maxWidth: 520 }}>
          <h1 className="signinH">Your Profile</h1>
          <p className="msgText" style={{ color: "#ef4444" }}>{err}</p>
          <Link href="/login" className="loginBtn">Go to Login</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mainContainer">
      <div className="signinBox" style={{ maxWidth: 520 }}>
        <h1 className="signinH">Your Profile {id ? `(ID: ${id})` : ""}</h1>

        {customer && (
          <>
            <div className="nameRow">
              <input
                className="inputName"
                value={customer.firstName ?? ""}
                readOnly
                placeholder="First Name"
              />
              <input
                className="inputName"
                value={customer.lastName ?? ""}
                readOnly
                placeholder="Last Name"
              />
            </div>

            <input
              className="inputField"
              value={customer.email ?? ""}
              readOnly
              placeholder="Email"
            />
            <input
              className="inputField"
              value={customer.phone ?? ""}
              readOnly
              placeholder="Phone"
            />
            <input
              className="inputField"
              value={toYYYYMMDD(customer.birthDate)}
              readOnly
              placeholder="Birth Date"
            />
            <textarea
              className="inputAddress"
              rows={3}
              value={customer.address ?? ""}
              readOnly
              placeholder="Address"
            />
          </>
        )}

        <Link href={`/profile/${id ?? ""}/edit`} className="loginBtn">Edit Profile</Link>
        <p className="pls"><Link href="/books" className="link">← Back to store</Link></p>
      </div>
    </main>
  );
}
