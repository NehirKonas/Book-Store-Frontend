"use client";

import React from "react";
import "./cart.css";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

interface CartItem {
  id: number;
  title: string;
  author: string;
  price: string;
  amount: number;
}

const fakeCart: CartItem[] = [
  { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", price: "$12.99" , amount: 2 },
  { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee", price: "$10.50", amount: 2  },
  { id: 3, title: "1984", author: "George Orwell", price: "$8.99", amount: 2  },
  { id: 4, title: "The Hobbit", author: "J.R.R. Tolkien", price: "$15.75" , amount: 2 },
  { id: 5, title: "Pride and Prejudice", author: "Jane Austen", price: "$9.20" , amount: 2 },
    { id: 6, title: "1984", author: "George Orwell", price: "$8.99" , amount: 2 },
  { id: 7, title: "The Hobbit", author: "J.R.R. Tolkien", price: "$15.75", amount: 2  },
  { id: 8, title: "Pride and Prejudice", author: "Jane Austen", price: "$9.20" , amount: 2 },
    { id: 9, title: "1984", author: "George Orwell", price: "$8.99", amount: 2  },
  { id: 10, title: "The Hobbit", author: "J.R.R. Tolkien", price: "$15.75" , amount: 2 },
  { id: 11, title: "Pride and Prejudice", author: "Jane Austen", price: "$9.20", amount: 2  },
];

export default function CartLayout() {
  return (
    <div className="cart-container">
      {/* Left side scrollable items */}
      <div className="cart-items-container">
        {fakeCart.map((item) => (
          <div key={item.id} className="ordered-item-card">
            <div className="ordered-item-image"></div>
            <div className="ordered-item-info">
              <div className="ordered-item-title">{item.title}</div>
              <div className="ordered-item-author">{item.author}</div>
              <div className="ordered-item-price">{item.price}</div>
            </div>
            <div className="ordered-item-buttons">
              <div className="ordered-item-ammount-button">
                 <button className="increment-amount-button">
                  <Image
                  src="/icons/plus.png"
                  alt="Trash"
                  width={10}
                  height={10}
                  className="cursor-pointer"
                />
                 </button>
                 <p className="amount-text">{item.amount}</p>
                 <button className="decrement-amount-button">
                  <Image
                  src="/icons/minus.png"
                  alt="Trash"
                  width={12}
                  height={14.7}
                  className="cursor-pointer"
                />
                 </button>
              </div>
              <button className="delete-button">
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
          <p>Total items: {fakeCart.length}</p>
          <p>
            Total price: $
            {fakeCart
              .reduce((sum, item) => sum + parseFloat(item.price.replace("$", "")), 0)
              .toFixed(2)}
          </p>
        </div>
        <div className="coupon-container">
            <input
              type="text"
              placeholder="Enter coupon code"
              id="coupon-input"
            />
            <button className="add-coupon-button">Add Coupon</button>
        </div>
        

        <button className="place-order-button">Place Order</button>
      </div>
    </div>
  );
}
