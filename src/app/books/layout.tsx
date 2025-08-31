

import React from "react";
import "./book.css";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import Link from "next/link";



export default function BookLayout() {
  return (
    <div className="page">
      <div className="book-image-container">

      </div>
      <div className="book-container">
        <div className="book-primary-info">{/*name&author&publisher*/}
          <h1>Persepolis</h1>
          <h2>Marjane Satrapi</h2>
          <h3>Panama Publishing</h3>
        </div>
        <button className="add-to-cart-button">Add to Cart</button>
        <div className="book-secondary-info">{/*pagenum&size&coveretc*/}
            <p>600 pg.</p>
            <p>20 x 15 cm</p>
            <p>NON FICTIONAL</p>

          <p>Lorem ipsum dolor sit amet...</p>
<p>Lorem ipsum dolor sit amet...</p>
<p>Lorem ipsum dolor sit amet...</p>
<p>Lorem ipsum dolor sit amet...</p>
<p>Lorem ipsum dolor sit amet...</p>
<p>Lorem ipsum dolor sit amet...</p>
<p>Lorem ipsum dolor sit amet...</p>
<p>Lorem ipsum dolor sit amet...</p>
<p>Lorem ipsum dolor sit amet...</p>
<p>Lorem ipsum dolor sit amet...</p>
<p>Lorem ipsum dolor sit amet...</p>
<p>Lorem ipsum dolor sit amet...</p>
<p>Lorem ipsum dolor sit amet...</p>
<p>Lorem ipsum dolor sit amet...</p>
<p>Lorem ipsum dolor sit amet...</p>
        </div>
      </div>
    </div>
  );
}
