// components/ProtectedPage.tsx
"use client";
import { useAuth } from "@/hooks/useAuth";
import { ReactNode } from "react";

interface ProtectedPageProps {
  children: ReactNode;
  requiredCustomerId: string;
  pageTitle?: string;
}

export default function ProtectedPage({ 
  children, 
  requiredCustomerId, 
  pageTitle = "Loading..." 
}: ProtectedPageProps) {
  const { isAuthorized, isLoading } = useAuth(requiredCustomerId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-lg">{pageTitle}</div>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Will redirect via the hook
  }

  return <>{children}</>;
}

// Usage example:
// In your page: app/profile/[customerId]/page.tsx
/*
import ProtectedPage from "@/components/ProtectedPage";

export default function ProfilePage({ params }: { params: { customerId: string } }) {
  return (
    <ProtectedPage 
      requiredCustomerId={params.customerId}
      pageTitle="Loading Profile..."
    >
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        <p>Welcome, Customer ID: {params.customerId}</p>
      </div>
    </ProtectedPage>
  );
}
*/