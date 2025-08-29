"use client";   // <-- Add this at the very top

import React, { ReactNode } from "react";
import Image from "next/image";
import "./dashboard.css";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="dashboard-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for title, author, publisher, genre..."
          id="search-input"
        />
        <button id="search-button">
          <Image
            src="/icons/magnifier.png"
            alt="Search"
            width={20}
            height={20}
          />
        </button>
      </div>
      <div className="books-container">
            <div className="books-cards-container"> 
                {children}

            </div>
        </div>
    </div>
  );
}
