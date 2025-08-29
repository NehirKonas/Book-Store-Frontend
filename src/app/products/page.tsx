"use client";
import Link from "next/link";

export default function ProductList() {
  const prods: string[] = ["a", "b", "c"];
  const message = prods.length === 0 && <p>No Products Found</p>;

  return (
    <>
      <h1>Products</h1>
      {message}

      <ul className="list-group">
        {prods.map((prod, index) => (
          <li className="list-group-item" key={prod}>
            <Link href={`/products/${prod}`}>Product {index + 1}</Link>
          </li>
        ))}
      </ul>

      <Link href="/">Home</Link>
    </>
  );
}
