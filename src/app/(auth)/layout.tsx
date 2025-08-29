"use client";
import { useState } from "react";
import Link from "next/link";
// app/layout.tsx
import "./globals.css"; // relative path
import { usePathname } from "next/navigation";
const navLinks = [
  { name: "Register", href: "/register" },
  { name: "Login", href: "/login" },
  { name: "Forgot Password", href: "/forgot-password" },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathName = usePathname();
  const [input,setInput] = useState("");
  return (
    <html lang="en">
      <body>
        <div>
          <input value={input} onChange={(e)=>setInput(e.target.value)} />
        </div>
        <div>
          {navLinks.map((link) => {
            const isActive = pathName == link.href || (pathName.startsWith(link.href) && link.href!= "/")
            return(
            <Link href={link.href} key={link.name}>
              {link.name}
            </Link>
          );
          })}
          {children}
          <div className="footer">Footer</div>
        </div>
      </body>
    </html>
  );
}
