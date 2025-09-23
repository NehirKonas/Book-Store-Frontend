"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import "./cart.css";
import { useAuth } from "@/app/lib/useAuth";

interface CartItemView {
  bookId: number;
  title: string;
  author: string;
  price: number;
  quantity: number;
}

export default function CartPage() {
  const { loading, loggedIn } = useAuth(true);

  // --- Hooks (always at the top)
  const [cart, setCart] = useState<CartItemView[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [userId, setUserId] = useState<string | null>(null);

  // Load userId safely on client-side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const id = localStorage.getItem("customerId");
      setUserId(id);
    }
  }, []);

  // Fetch cart items
  useEffect(() => {
    if (!userId || !loggedIn) return;

    async function fetchCart() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/api/carts/${userId}/items`
        );
        if (!res.ok) throw new Error("Cannot fetch cart");
        const data: any[] = await res.json();

        const mapped: CartItemView[] = data.map((row) => ({
          bookId: row[0],
          title: row[1],
          author: row[2],
          price: parseFloat(row[3]),
          quantity: row[4],
        }));

        setCart(mapped);
      } catch (err) {
        console.error(err);
      }
    }

    fetchCart();
  }, [userId, loggedIn]);

  // Fetch total whenever cart changes
  useEffect(() => {
    if (!userId || !loggedIn) return;

    async function fetchTotal() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/api/carts/${userId}/items/total`
        );
        if (!res.ok) throw new Error("Cannot fetch total");
        const data = await res.json();
        setTotal(data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchTotal();
  }, [cart, userId, loggedIn]);

  if (loading) return <div style={{ padding: 24 }}>Loading cart…</div>;
  if (!loggedIn) return null;

  // --- Handlers
  const handleDelete = async (bookId: number) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/carts/${userId}/items/${bookId}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Could not delete item");

      setCart((prev) => prev.filter((item) => item.bookId !== bookId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete item from cart");
    }
  };

  const handleIncrement = async (bookId: number) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/carts/${userId}/items/${bookId}/increment`,
        { method: "PUT" }
      );
      if (!res.ok) throw new Error("Could not increment item");

      setCart((prev) =>
        prev.map((item) =>
          item.bookId === bookId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to increment item from cart");
    }
  };

  const handleDecrement = async (bookId: number) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/carts/${userId}/items/${bookId}/decrement`,
        { method: "PUT" }
      );
      if (!res.ok) throw new Error("Could not decrement item");

      setCart((prev) =>
      prev.map((item) =>
        item.bookId === bookId
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      )
    );
    } catch (err) {
      console.error(err);
      alert("Failed to decrement item from cart");
    }
  };


  
const placeOrder = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/orders/cart/${userId}/checkout`,
      { method: "POST" }
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("Backend error:", res.status, text);
      throw new Error("Could not place order");
    }

    const data = await res.json();
    console.log("Order placed:", data);

    // If success, reload the page
    window.location.reload();

  } catch (err) {
    console.error(err);
    alert("Failed to place order");
  }
};


  return (
    <div className="cart-container">
      <div className="cart-items-container">
        {cart.map((item) => (
          <div key={item.bookId} className="ordered-item-card">
            <div className="ordered-item-image"></div>

            <div className="ordered-item-info">
              <div className="ordered-item-title">{item.title}</div>
              <div className="ordered-item-author">{item.author}</div>
              <div className="ordered-item-price">{item.price}</div>
            </div>

            <div className="ordered-item-buttons">
              <div className="ordered-item-ammount-button">
                <button className="increment-amount-button" onClick={() => handleIncrement(item.bookId)}>
                  <Image
                    src="/icons/plus.png"
                    alt="Plus"
                    width={10}
                    height={10}
                    className="cursor-pointer"
                  />
                </button>

                <p className="amount-text">{item.quantity}</p>

                <button className="decrement-amount-button" onClick={() => handleDecrement(item.bookId)}>
                  <Image
                    src="/icons/minus.png"
                    alt="Minus"
                    width={12}
                    height={15}
                    className="cursor-pointer"
                  />
                </button>
              </div>

              <button className="delete-button" onClick={() => handleDelete(item.bookId)}>
                <Image
                  src="/icons/trash-bin.png"
                  alt="Trash"
                  width={18}
                  height={19}
                  className="cursor-pointer"
                />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-order-pane">
        <h2>Order Summary</h2>

        <div className="price-container">
          <p>Total price: ${total.toFixed(2)}</p>
        </div>

        <div className="coupon-container">
          <input type="text" placeholder="Enter coupon code" id="coupon-input" />
          <button className="add-coupon-button">Add Coupon</button>
        </div>

        <button className="place-order-button" onClick={() => placeOrder()}>Place Order</button>
      </div>
    </div>
  );
}