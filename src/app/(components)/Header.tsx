"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const [customerId, setCustomerId] = useState<string | null>(null);

  useEffect(() => {
    // Safe on client only
    const cid = localStorage.getItem("customerId");
    setCustomerId(cid);
  }, []);

  const loggedIn = !!customerId;
  const hrefFor = (segment: "cart" | "profile" | "coupon") =>
    loggedIn ? `/${segment}/${encodeURIComponent(customerId!)}` : "/login";

  return (
    <header className="header flex items-center justify-between px-6 py-3">
      <Link href="/dashboard" className="brandName text-2xl font-extrabold tracking-wide">
        BookStore
      </Link>

      <div className="mainIcons flex items-center gap-4">
        {/* Cart */}
        <Link href={hrefFor("cart")} aria-label="Cart" className="inline-block">
          <Image
            src="/icons/shopping-cart.png"
            alt="Cart"
            width={28}
            height={28}
            className="cursor-pointer"
          />
        </Link>

        {/* Profile */}
        <Link href={hrefFor("profile")} aria-label="Profile" className="inline-block">
          <Image
            src="/icons/user.png"
            alt={loggedIn ? "Profile" : "Login"}
            width={28}
            height={28}
            className="cursor-pointer"
          />
        </Link>

        {/* Coupon */}
        <Link href={hrefFor("coupon")} aria-label="Discounts" className="inline-block">
          <Image
            src="/icons/percent.png"
            alt="Discounts"
            width={28}
            height={28}
            className="cursor-pointer"
          />
        </Link>
      </div>
    </header>
  );
}
