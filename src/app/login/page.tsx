"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; 
import "./login.css";
import Link from "next/link";


export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        const id = String(data.customerId ?? data.id);
        localStorage.setItem("customerId", String(data.customerId));
        setMessage("Logegd In!");
        router.replace(`/profile/${encodeURIComponent(id)}`);
        
        
      } else {
        setMessage(data?.message || "Incorrect email or password!!");
      }
    } catch (err) {
      setMessage("Could Not Connect With the Server!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mainContainer">
      <form className="loginBox" onSubmit={handleLogin}>
        <h1 className="loginH">Log In</h1>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="inputField"
          autoComplete="email"
          required
        />

        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="inputField"
          autoComplete="current-password"
          required
        />

        <button type="submit" className="loginBtn" disabled={loading}>
          {loading ? "Logging in..." : "Log In"}
        </button>

        <p className="pls">
          If you are not a member please{" "}
          <Link href="/signin" className="underline font-medium">
            Sign In
          </Link>
        </p>

        {message && <p className="msgText">{message}</p>}
      </form>
    </main>
  );
}

