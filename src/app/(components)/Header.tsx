// src/app/components/Header.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getCustomerId } from "../utils/auth";

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const [customerId, setCid] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const sync = () => setCid(getCustomerId());
    sync();
    window.addEventListener("customerIdChanged", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("customerIdChanged", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  if (!mounted) {
    return (
      <header className="header flex items-center justify-between px-6 py-3">
        <Link href="/dashboard" className="brandName text-2xl font-extrabold tracking-wide">
          BookStore
        </Link>
        <div className="mainIcons flex items-center gap-4">
          <div className="w-7 h-7" />
          <div className="w-7 h-7" />
          <div className="w-7 h-7" />
        </div>
      </header>
    );
  }

  const loggedIn = !!customerId;
  const hrefFor = (segment: "cart" | "profile" | "coupon") =>
    loggedIn ? `/${segment}/${encodeURIComponent(customerId as string)}` : "/login";

  return (
    <header className="header flex items-center justify-between px-6 py-3">
      <Link href="/dashboard" className="brandName text-2xl font-extrabold tracking-wide">
        BookStore
      </Link>

      <div className="mainIcons flex items-center gap-4">
        <Link href={hrefFor("cart")} aria-label="Cart" className="inline-block">
          <Image src="/icons/shopping-cart.png" alt="Cart" width={28} height={28} className="cursor-pointer" />
        </Link>

        <Link href={hrefFor("profile")} aria-label="Profile" className="inline-block">
          <Image src="/icons/user.png" alt={loggedIn ? "Profile" : "Login"} width={28} height={28} className="cursor-pointer" />
        </Link>

        <Link href={hrefFor("coupon")} aria-label="Discounts" className="inline-block">
          <Image src="/icons/percent.png" alt="Discounts" width={28} height={28} className="cursor-pointer" />
        </Link>
      </div>
    </header>
  );
}
