'use client'
import type React from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardTopbar } from "@/components/dashboard/topbar"
import { useProfile } from "@/context/ProfileContext"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {

    const { selectedProfile } = useProfile();
    // const [pageLoading, setPageLoading] = useState(true);
  
    const router = useRouter();
  //     useEffect(() => {
  //       const checkProfile = async () => {
  //       try {
  //          // refresh user from backend
  //       } finally {
  //         setPageLoading(false); // mark local loading complete
  //       }
  //     };
  //     checkProfile();
  // // ✅ force re-fetch when Dashboard mounts
  //   }, []);
  
    useEffect(() => {

      if (!selectedProfile) {
        console.log("profile not selected");
        router.push("/profiles"); // redirect if not logged in
      }
    }, [router, selectedProfile]);

    // if (pageLoading) return <p>Loading...</p>;
    if (!selectedProfile) return null;

 // Prevent flicker before redirect
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
