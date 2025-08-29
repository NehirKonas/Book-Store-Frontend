

export default function RootLayout({children,}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      >
        <div className='header'>Header</div>
        {children}
      <div className='footer'>Footer</div>
      </body>
    </html>
  );
}
