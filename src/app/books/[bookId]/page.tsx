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
  bookImageUrl: string;
}

interface Author {
  id: number;
  firstName: string;
  lastName: string;
}

export default function BookPage() {
  const params = useParams() as Record<string, string | undefined>;
  const bookId = params.id ?? params.bookId ?? null;

  const API_BASE = useMemo(
    () => process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080",
    []
  );

  const [book, setBook] = useState<Book | null>(null);
  const [author, setAuthor] = useState<Author | null>(null);
  const [authorName, setAuthorName] = useState<string | null>(null);
  const [publisherName, setPublisherName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatPrice = (price: number) => `${price.toFixed(2)} TL`;
  const formatGenre = (genre: string) =>
    genre ? genre.charAt(0) + genre.slice(1).toLowerCase() : "";

  const fetchAuthorNameById = async (
    id: number,
    headers: Record<string, string>,
    signal?: AbortSignal
  ): Promise<string | null> => {
    try {
      const r = await fetch(`${API_BASE}/api/books/authors/${id}/name`, {
        method: "GET",
        headers: { ...headers, Accept: "text/plain" },
        signal,
      });
      if (!r.ok) return null;
      const txt = (await r.text()).trim();
      return txt.length ? txt : null;
    } catch {
      return null;
    }
  };

  const fetchPublisherNameById = async (
    id: number,
    headers: Record<string, string>,
    signal?: AbortSignal
  ): Promise<string | null> => {
    try {
      const r = await fetch(`${API_BASE}/api/books/publishers/${id}/name`, {
        method: "GET",
        headers: { ...headers, Accept: "text/plain" },
        signal,
      });
      if (!r.ok) return null;
      const txt = (await r.text()).trim();
      return txt.length ? txt : null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
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
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      try {
        const r = await fetch(`${API_BASE}/api/books/${bookId}`, {
          headers,
          signal: ctrl.signal,
        });
        if (!r.ok) {
          const body = await r.json().catch(() => ({}));
          throw new Error(
            body?.message || `Failed to load book (${r.status})`
          );
        }
        const b: Book = await r.json();
        setBook(b);

        const [name, pubName] = await Promise.all([
          fetchAuthorNameById(b.authorId, headers, ctrl.signal),
          fetchPublisherNameById(b.publisherId, headers, ctrl.signal),
        ]);

        if (name) {
          setAuthorName(name);
          setAuthor(null);
        } else {
          try {
            const ra = await fetch(`${API_BASE}/authors/${b.authorId}`, {
              headers,
              signal: ctrl.signal,
            });
            if (ra.ok) setAuthor(await ra.json());
            else setAuthor(null);
          } catch {
            setAuthor(null);
          }
        }

        setPublisherName(pubName ?? null);
      } catch (e: any) {
        if (e?.name !== "AbortError") {
          setError(e?.message || "Could not load book");
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => ctrl.abort();
  }, [API_BASE, bookId]);

  const labelFromJson =
    author ? `${author.firstName ?? ""} ${author.lastName ?? ""}`.trim() : "";
  const authorLabel =
    (authorName && authorName.trim()) ||
    (labelFromJson || `Author #${book?.authorId}`);
  const publisherLabel =
    (publisherName && publisherName.trim()) || `Publisher #${book?.publisherId}`;

  return (
    <div className="page">
      <div className="book-image-container">
        {loading ? (
          <p>Loading book image…</p>
        ) : book ? (
          <div className="book-image">
            <img src={book.bookImageUrl} alt={book.title} />
          </div>
        ) : (
          <p>Book not found</p>
        )}
      </div>

      <div className="book-container">
        <div className="book-primary-info">
          <h1>{book ? book.title : "Loading…"}</h1>
          <h2>{authorLabel}</h2>
          <h3>{publisherLabel}</h3>
        </div>

        <button className="add-to-cart-button" disabled={!book}>
          Add to Cart — {book ? formatPrice(book.price) : "..."}
        </button>

        {book && (
          <div className="book-secondary-info">
            <p className="book-secondary-info-bold">
              Pages: {book.pageNumber}
            </p>
            <p className="book-secondary-info-bold">
              Genre: {formatGenre(book.genre)}
            </p>
            <p className="book-secondary-info-bold">
              Language: {formatGenre(book.language)}
            </p>
            <p>Format: {formatGenre(book.format)}</p>
            <p>{book.pageNumber} pg.</p>
            <p>
              {book.format} • {book.language}
            </p>
            <p>{formatGenre(book.genre)}</p>
            <p>Published: {book.date}</p>
            <p>ISBN: {book.isbn}</p>
            <p>Stock: {book.stock}</p>
          </div>
        )}
      </div>
    </div>
  );
}
