"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

interface Book {
  id: number;
  title: string;
  authorId: number;
  authorName: string; 
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

export default function DashboardPage() {
  const router = useRouter();
  const API_BASE = useMemo(
  () => (process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080").replace(/\/+$/, ""),
  []
);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch books function (only /books/allBooks)
  const fetchBooks = async (signal?: AbortSignal) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    try {
      const res = await fetch(`${API_BASE}/api/books/allBooks`, {   // <— add /api
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      signal,
    });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(
          errData?.message || `Failed to fetch books (${res.status})`
        );
      }

      const data: Book[] = await res.json();
      setBooks(data);
      setError(null);
    } catch (e: any) {
      if (e?.name !== "AbortError") {
        setError(e?.message || "Could not load books");

        // Fallback to placeholder data so the UI still shows something
        const placeholder: Book[] = Array.from({ length: 8 }, (_, i) => ({
          id: 31,
          title: `Could not load books`,
          authorId:31,
          authorName: `Could not load books`, 
          price: 99 + i * 5,
          format: "Could not load books",
          language: "Could not load books",
          genre: "Could not load books",
          date: "2024-01-01",
          pageNumber: 31,
          isbn: `978-${i + 1}-123-456-7`,
          stock: 0,
          publisherId: 0,
        }));
        setBooks(placeholder);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setError(null);
        await fetchBooks(controller.signal);
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [API_BASE]);

  // Helpers
  const formatPrice = (price: number): string => `${price.toFixed(2)} TL`;
  const formatGenre = (genre: string): string =>
    genre.charAt(0) + genre.slice(1).toLowerCase();

  // Loading state
  if (loading) {
    return (
      <>
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="book-card" style={{ opacity: 0.7 }}>
            {/* <div className="book-cover"></div> */}
            <div className="book-image">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  color: "#999",
                }}
              >
                Loading...
              </div>
            </div>
            <div className="book-info">
              <h3 className="book-title">Loading...</h3>
              <p className="book-author">Loading...</p>
            </div>
            <div className="book-price">
              <p className="bookPrice">-- TL</p>
            </div>
          </div>
        ))}
      </>
    );
  }

  // Error state with retry option
  if (error && books.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "50px",
          gap: "20px",
        }}
      >
        <p style={{ color: "#ef4444", fontSize: "16px", textAlign: "center" }}>
          {error}
        </p>
        <button
          onClick={() => {
            setLoading(true);
            fetchBooks().finally(() => setLoading(false));
          }}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4a90e2",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Warning if using fallback data */}
      {error && books.length > 0 && (
        <div
          style={{
            backgroundColor: "#fff3cd",
            color: "#856404",
            padding: "10px",
            margin: "10px",
            borderRadius: "5px",
            border: "1px solid #ffeaa7",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span>⚠️ Using placeholder data - API connection failed: {error}</span>
          <button
            onClick={() => {
              setLoading(true);
              fetchBooks().finally(() => setLoading(false));
            }}
            style={{
              padding: "5px 10px",
              backgroundColor: "#4a90e2",
              color: "white",
              border: "none",
              borderRadius: "3px",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Render books */}
      {books.map((book) => (
        <div key={book.id} className="book-card" onClick={()=> router.replace(`/books/${encodeURIComponent(book.id)}`)} >
          <div className="book-cover"></div>

          <div className="book-image">
            <p>missing image</p>
          </div>

          <div className="book-info">
            <h3 className="book-title" title={book.title}>
              {book.title.length > 25
                ? `${book.title.substring(0, 25)}...`
                : book.title}
            </h3>
            <p className="book-author">Author #{book.authorId}</p>
          </div>

          <div className="book-price">
            <p className="bookPrice">{formatPrice(book.price)}</p>
          </div>
        </div>
      ))}
    </>
  );
}
