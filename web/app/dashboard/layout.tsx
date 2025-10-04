'use client'
import type React from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardTopbar } from "@/components/dashboard/topbar"
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const { user, loading, fetchUser } = useAuth();
  const [pageLoading, setPageLoading] = useState(true);

  const router = useRouter();
    useEffect(() => {
          const checkUser = async () => {
      try {
        await fetchUser(); // refresh user from backend
      } finally {
        setPageLoading(false); // mark local loading complete
      }
    };
    checkUser();
// ✅ force re-fetch when Dashboard mounts
  }, []);

  useEffect(() => {

    if (!loading && !user && !pageLoading) {
      console.log("User not authenticated");
      router.push("/login"); // redirect if not logged in
    }
  }, [router, loading, user, pageLoading]);

  if (loading) return <p>Loading...</p>;
  if (!user) return null; // Prevent flicker before redirect
  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <div className="lg:pl-64">
        <DashboardTopbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
