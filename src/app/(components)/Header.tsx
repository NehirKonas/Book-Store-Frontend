"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [customerId, setCustomerId] = useState<string | null>(null);

  useEffect(() => {
    const cid = localStorage.getItem("customerId");
    setLoggedIn(!!cid);
    setCustomerId(cid);
  }, []);

  return (
    <header className="header flex items-center justify-between px-6 py-3">
      <Link href="/dashboard">
        <p className="brandName text-2xl font-extrabold tracking-wide">BookStore</p>
      </Link>

      <div className="mainIcons">
        <Link href={customerId ? `/cart/${encodeURIComponent(customerId)}` : "/cart"}>
          <Image src="/icons/shopping-cart.png" alt="Cart" width={28} height={28} className="cursor-pointer" />
        </Link>

        {/* Profile icon */}
{loggedIn ? (
  <Link href={customerId ? `/profile/${encodeURIComponent(customerId)}` : "/profile"}>
    <Image
      src="/icons/user.png"
      alt="Profile"
      width={28}
      height={28}
      className="cursor-pointer"
    />
  </Link>
) : (
  <Link href="/login">
    <Image
      src="/icons/user.png"
      alt="Login"
      width={28}
      height={28}
      className="cursor-pointer"
    />
  </Link>
)}

{/* Coupon icon */}
{loggedIn && customerId ? (
  <Link href={`/coupon/${encodeURIComponent(customerId)}`}>
    <Image
      src="/icons/percent.png"
      alt="Discounts"
      width={28}
      height={28}
      className="cursor-pointer"
    />
  </Link>
) : (
  <Link href="/login">
    <Image
      src="/icons/percent.png"
      alt="Discounts"
      width={28}
      height={28}
      className="cursor-pointer"
    />
  </Link>
)}

      </div>
    </header>
  );
}
