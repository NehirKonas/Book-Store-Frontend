"use client";

import React, { useEffect, useMemo, useState } from "react";
import "./coupon.css";

export type CouponCardProps = {
  discountRate: number;
  code: string;
  expiresAt: string | Date;
  title?: string;
  description?: string;
};

type TimeLeft = { d: number; h: number; m: number; s: number; totalMs: number };

function getTimeLeft(expiresAt: Date): TimeLeft {
  const now = new Date().getTime();
  const end = expiresAt.getTime();
  const diff = Math.max(end - now, 0);
  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const m = Math.floor((diff / (1000 * 60)) % 60);
  const s = Math.floor((diff / 1000) % 60);
  return { d, h, m, s, totalMs: diff };
}

function CouponCard({
  discountRate,
  code,
  expiresAt,
  title = "Limited Offer",
  description = "",
}: CouponCardProps) {
  const expiry = useMemo(
    () => (expiresAt instanceof Date ? expiresAt : new Date(expiresAt)),
    [expiresAt]
  );

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => getTimeLeft(expiry));
  const isExpired = timeLeft.totalMs === 0;

  useEffect(() => {
    const t = setInterval(() => setTimeLeft(getTimeLeft(expiry)), 1000);
    return () => clearInterval(t);
  }, [expiry]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      const el = document.getElementById(`copy-status-${code}`);
      if (el) {
        el.textContent = "Copied!";
        setTimeout(() => (el.textContent = ""), 1200);
      }
    } catch {
      const temp = document.createElement("input");
      temp.value = code;
      document.body.appendChild(temp);
      temp.select();
      document.execCommand("copy");
      document.body.removeChild(temp);
    }
  };

  return (
    <div className={`coupon-card ${isExpired ? "coupon-expired" : ""}`}>
      <div className="coupon-left">
        <div className="coupon-discount">
          <span className="coupon-rate">{discountRate}%</span>
          <span className="coupon-off">OFF</span>
        </div>
        <div className="coupon-text">
          <h3 className="coupon-title">{title}</h3>
          {description ? <p className="coupon-desc">{description}</p> : null}
          {!isExpired ? (
            <p className="coupon-timer" aria-live="polite">
              Expires in: <strong>{timeLeft.d}d {timeLeft.h}h {timeLeft.m}m {timeLeft.s}s</strong>
            </p>
          ) : (
            <p className="coupon-expired-text">Expired</p>
          )}
        </div>
      </div>

      <div className="coupon-right">
        <div className="coupon-code-wrap">
          <span className="coupon-code">{code}</span>
          <button
            className="coupon-copy-btn"
            onClick={handleCopy}
            aria-label={`Copy coupon code ${code}`}
            title="Copy code"
          >
            Copy
          </button>
        </div>
        <span id={`copy-status-${code}`} className="copy-status" />
      </div>
    </div>
  );
}

export default function CouponLayout() {
  const coupons: CouponCardProps[] = [
    {
      discountRate: 20,
      code: "SAVE20",
      expiresAt: new Date("2025-09-10T23:59:59"),
      title: "Back to School",
      description: "20% off all textbooks!",
    },
    {
      discountRate: 50,
      code: "HALFOFF",
      expiresAt: new Date("2025-09-15T23:59:59"),
      title: "Flash Sale",
      description: "50% off select items!",
    },
    {
      discountRate: 10,
      code: "WELCOME10",
      expiresAt: new Date("2025-10-01T23:59:59"),
      title: "Welcome Bonus",
      description: "10% off your first order",
    },
     {
      discountRate: 20,
      code: "SAVE20",
      expiresAt: new Date("2025-09-10T23:59:59"),
      title: "Back to School",
      description: "20% off all textbooks!",
    },
    {
      discountRate: 50,
      code: "HALFOFF",
      expiresAt: new Date("2025-09-15T23:59:59"),
      title: "Flash Sale",
      description: "50% off select items!",
    },
    {
      discountRate: 10,
      code: "WELCOME10",
      expiresAt: new Date("2025-10-01T23:59:59"),
      title: "Welcome Bonus",
      description: "10% off your first order",
    },
     {
      discountRate: 20,
      code: "SAVE20",
      expiresAt: new Date("2025-09-10T23:59:59"),
      title: "Back to School",
      description: "20% off all textbooks!",
    },
    {
      discountRate: 50,
      code: "HALFOFF",
      expiresAt: new Date("2025-09-15T23:59:59"),
      title: "Flash Sale",
      description: "50% off select items!",
    },
    {
      discountRate: 10,
      code: "WELCOME10",
      expiresAt: new Date("2025-10-01T23:59:59"),
      title: "Welcome Bonus",
      description: "10% off your first order",
    },
  ];

  return (
    <div className="coupon-container">
      {coupons.map((coupon) => (
        <CouponCard
          key={coupon.code}
          discountRate={coupon.discountRate}
          code={coupon.code}
          expiresAt={coupon.expiresAt}
          title={coupon.title}
          description={coupon.description}
        />
      ))}
    </div>
  );
}
