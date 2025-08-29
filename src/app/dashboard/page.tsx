"use client";

export default function DashboardPage() {
  // Temporary placeholder books
  const placeholderBooks = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    title: `Book Title ${i + 1}`,
    author: `Author ${i + 1}`,
  }));

  return (
    <>
      {placeholderBooks.map((book) => (
        <div key={book.id} className="book-card">
          <div className="book-cover"></div>
          <h3 className="book-title">{book.title}</h3>
          <p className="book-author">{book.author}</p>
        </div>
      ))}
    </>
  );
}
