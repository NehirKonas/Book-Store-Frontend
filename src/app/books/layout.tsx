import React from "react";
import "./book.css";

export default function BookLayout({ children }: { children: React.ReactNode }) {
  // This wraps every page under this route with the flex container styled in .page
  return <div className="page">{children}</div>;
}
