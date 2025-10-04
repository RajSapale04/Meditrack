"use client";
import {  useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";



export default function GroupLayout({ children }: { children: React.ReactNode }) {
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
  if (!user) return null;
  
    return (
        <div>       
      {children}
      </div>
  );
}
