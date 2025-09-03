import Link from "next/link";

export default function Page() {
  return (
    <main className="min-h-screen grid place-items-center">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-semibold">Home</h1>
        <p>
          Open the dashboard page at{" "}
          <Link href="/dashboard" className="underline font-medium">
            dashboard
          </Link>
        </p>
      </div>
    </main>
  );
}
