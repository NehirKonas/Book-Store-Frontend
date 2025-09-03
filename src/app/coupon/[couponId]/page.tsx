// app/coupon/[couponId]/page.tsx
"use client";

import { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/lib/useAuth";
import CouponCard from "../_components/CouponCard";

type Coupon = {
  id: string;
  code: string;
  discountRate: number;
  expiresAt: string;
  title?: string;
  description?: string;
};

export default function UserCouponsPage() {
  const { loggedIn, loading, id: authId } = useAuth(true);
  const params = useParams() as { couponId?: string };
  const router = useRouter();

  // Enforce own coupons only
  useEffect(() => {
    if (!loading && loggedIn && authId && params?.couponId !== authId) {
      router.replace(`/coupon/${encodeURIComponent(authId)}`);
    }
  }, [loading, loggedIn, authId, params, router]);

  if (loading || !loggedIn) return null;

  // TODO: fetch from API: /api/coupons/{authId}
  // For now, fake data
  const coupons: Coupon[] = [
    {
      id: "c1",
      code: "EXCODE01",
      discountRate: 20,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days
      title: "Welcome Discount",
      description: "Enjoy 20% off on your first order",
    },
    {
      id: "c2",
      code: "SHIPFREE",
      discountRate: 0,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString(), // 12 hours
      title: "Free Shipping",
      description: "No shipping fee for orders over $25",
    },
  ];

  return (
    <main style={{ padding: 16 }}>
      <h1 style={{ margin: "8px 16px" }}>My Coupons</h1>

      {coupons.map((c) => (
        <CouponCard
          key={c.id}
          code={c.code}
          discountRate={c.discountRate}
          expiresAt={c.expiresAt}
          title={c.title}
          description={c.description}
        />
      ))}
    </main>
  );
}
