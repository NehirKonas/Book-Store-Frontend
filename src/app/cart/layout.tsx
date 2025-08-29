"use client";

import React from "react";
import "./cart.css";

interface CartItem {
  id: number;
  title: string;
  author: string;
  price: string;
}

const fakeCart: CartItem[] = [
  { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", price: "$12.99" },
  { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee", price: "$10.50" },
  { id: 3, title: "1984", author: "George Orwell", price: "$8.99" },
  { id: 4, title: "The Hobbit", author: "J.R.R. Tolkien", price: "$15.75" },
  { id: 5, title: "Pride and Prejudice", author: "Jane Austen", price: "$9.20" },
    { id: 3, title: "1984", author: "George Orwell", price: "$8.99" },
  { id: 4, title: "The Hobbit", author: "J.R.R. Tolkien", price: "$15.75" },
  { id: 5, title: "Pride and Prejudice", author: "Jane Austen", price: "$9.20" },
    { id: 3, title: "1984", author: "George Orwell", price: "$8.99" },
  { id: 4, title: "The Hobbit", author: "J.R.R. Tolkien", price: "$15.75" },
  { id: 5, title: "Pride and Prejudice", author: "Jane Austen", price: "$9.20" },
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
          </div>
        ))}
      </div>

      <div className="cart-order-pane">
        <h2>Order Summary</h2>
        <p>Total items: {fakeCart.length}</p>
        <p>
          Total price: $
          {fakeCart
            .reduce((sum, item) => sum + parseFloat(item.price.replace("$", "")), 0)
            .toFixed(2)}
        </p>
      </div>
    </div>
  );
}
