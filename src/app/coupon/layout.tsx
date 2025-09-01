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

export default function CouponCard({
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

//eg values
code="EXCODE01";
discountRate=20;


//idk what dis is
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => getTimeLeft(expiry));
  const isExpired = timeLeft.totalMs === 0;
  useEffect(() => {
    const t = setInterval(() => setTimeLeft(getTimeLeft(expiry)), 1000);
    return () => clearInterval(t);
  }, [expiry]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      // Optional: quick visual feedback
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
              Expires in:{" "}
              <strong>
                {timeLeft.d}d {timeLeft.h}h {timeLeft.m}m {timeLeft.s}s
              </strong>
            </p>
          ) : (
            <p className="coupon-expired-text">Expired</p>
          )}
        </div>
      </div>

      <div className="coupon-right">
        <div className="coupon-code-wrap">
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
        </div>
        <span id={`copy-status-${code}`} className="copy-status" />
      </div>
    </div>
  );
}
