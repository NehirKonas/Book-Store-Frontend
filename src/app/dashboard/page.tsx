"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

interface Book {
  id: number;
  title: string;
  authorId: number;
  authorName?: string;
  price: number;
  format: string;
  language: string;
  genre: string;
  date: string;
  pageNumber: number;
  isbn: string;
  stock: number;
  publisherId: number;
  bookImageUrl: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const API_BASE = useMemo(
    () =>
      (process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080").replace(
        /\/+$/,
        ""
      ),
    []
  );

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- fetch a single author name by id (text/plain) ---
  const fetchAuthorName = async (
    authorId: number,
    headers: Record<string, string>,
    signal?: AbortSignal
  ): Promise<string | null> => {
    try {
      const res = await fetch(
        `${API_BASE}/api/books/authors/${authorId}/name`,
        { method: "GET", headers: { ...headers, Accept: "text/plain" }, signal }
      );
      if (!res.ok) return null;
      const name = (await res.text()).trim();
      return name.length ? name : null;
    } catch {
      return null;
    }
  };

  // --- main fetch (calls fetchAuthorName for each book) ---
  const fetchBooks = async (signal?: AbortSignal) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    try {
      // 1) get books (no names)
      const res = await fetch(`${API_BASE}/api/books/allBooks`, {
        method: "GET",
        headers,
        signal,
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(
          errData?.message ||
            `Failed to fetch books (${res.status} ${res.statusText})`
        );
      }
      const data: Book[] = await res.json();

      // 2) fetch the author name for each book’s authorId
      const withNames: Book[] = await Promise.all(
        data.map(async (b) => {
          const name = await fetchAuthorName(b.authorId, headers, signal);
          return { ...b, authorName: name ?? `Author #${b.authorId}` };
        })
      );

      setBooks(withNames);
      setError(null);
    } catch (e: any) {
      if (e?.name !== "AbortError") {
        setError(e?.message || "Could not load books");
        setBooks([]);
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

  const formatPrice = (price: number): string => `${price.toFixed(2)} TL`;
  const formatGenre = (genre: string): string =>
    genre.charAt(0) + genre.slice(1).toLowerCase();

  if (loading) {
    return (
      <>
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="book-card" style={{ opacity: 0.7 }}>
            <div className="book-cover" />
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
          <span>⚠ {error}</span>
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

      {books.map((book) => (
        <div
          key={book.id}
          className="book-card"
          onClick={() =>
            router.replace(`/books/${encodeURIComponent(book.id)}`)
          }
        >
          <div className="book-cover" />
          <div className="book-image">
            <img src={book.bookImageUrl} />
          </div>

          <div className="book-info">
            <h3 className="book-title" title={book.title}>
              {book.title.length > 25
                ? `${book.title.substring(0, 25)}...`
                : book.title}
            </h3>
            <p className="book-author">{book.authorName}</p>
          </div>

          <div className="book-price">
            <p className="bookPrice">{formatPrice(book.price)}</p>
          </div>
        </div>
      ))}
    </>
  );
}
