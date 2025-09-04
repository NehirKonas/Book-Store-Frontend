"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

interface Book {
  id: number;
  title: string;
  authorId: number;
  price: number;
  format: string;
  language: string;
  genre: string;
  date: string;
  pageNumber: number;
  isbn: string;
  stock: number;
  publisherId: number;
}
interface Author {
  id: number;
  firstName: string;
  lastName: string;
}

export default function BookPage() {
  const params = useParams() as Record<string, string | undefined>;
  const bookId = params.id ?? params.bookId ?? null; // <— supports /books/[id] or /books/[bookId]

  const API_BASE = useMemo(
    () => process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080",
    []
  );

  const [book, setBook] = useState<Book | null>(null);
  const [author, setAuthor] = useState<Author | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatPrice = (price: number) => `${price.toFixed(2)} TL`;
  const formatGenre = (genre: string) =>
    genre ? genre.charAt(0) + genre.slice(1).toLowerCase() : "";

  useEffect(() => {
    // if the URL is wrong (no id), don't spin forever
    if (!bookId) {
      setError("No book id in URL.");
      setLoading(false);
      return;
    }

    const ctrl = new AbortController();

    (async () => {
      setLoading(true);
      setError(null);

      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      try {
        // fetch the book
        const r = await fetch(`${API_BASE}/books/${bookId}`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          signal: ctrl.signal,
        });
        if (!r.ok) {
          const body = await r.json().catch(() => ({}));
          throw new Error(body?.message || `Failed to load book (${r.status})`);
        }
        const b: Book = await r.json();
        setBook(b);

        // fetch author name (optional)
        try {
          const ra = await fetch(`${API_BASE}/authors/${b.authorId}`, {
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            signal: ctrl.signal,
          });
          if (ra.ok) setAuthor(await ra.json());
          else setAuthor(null);
        } catch {
          setAuthor(null);
        }
      } catch (e: any) {
        if (e?.name !== "AbortError") setError(e?.message || "Could not load book");
      } finally {
        setLoading(false);
      }
    })();

    return () => ctrl.abort();
  }, [API_BASE, bookId]);

  if (loading) {
    return (
      <>
        <div className="book-image-container" />
        <div className="book-container">
          <div className="book-primary-info">
            <h1>Loading…</h1>
            <h2>Loading…</h2>
            <h3>Loading…</h3>
          </div>
          <button className="add-to-cart-button" disabled>Loading…</button>
          <div className="book-secondary-info"><p>Loading…</p></div>
        </div>
      </>
    );
  }

  if (error || !book) {
    return (
      <>
        <div className="book-image-container" />
        <div className="book-container">
          <div className="book-primary-info">
            <h1>Book not found</h1>
            <h2>id: {bookId ?? "—"}</h2>
            <h3>{error ?? ""}</h3>
          </div>
        </div>
      </>
    );
  }

  const authorLabel = author
    ? `${author.firstName ?? ""} ${author.lastName ?? ""}`.trim()
    : `Author #${book.authorId}`;

  return (
    <>
      <div className="book-image-container" />
      <div className="book-container">
        <div className="book-primary-info">
          <h1>{book.title}</h1>
          <h2>{authorLabel}</h2>
          <h3>Publisher #{book.publisherId}</h3>
        </div>

        <button className="add-to-cart-button">
          Add to Cart — {formatPrice(book.price)}
        </button>

        <div className="book-secondary-info">
          <p>{book.pageNumber} pg.</p>
          <p>{book.format} • {book.language}</p>
          <p>{formatGenre(book.genre)}</p>
          <p>Published: {book.date}</p>
          <p>ISBN: {book.isbn}</p>
          <p>Stock: {book.stock}</p>
        </div>
      </div>
    </>
  );
}
