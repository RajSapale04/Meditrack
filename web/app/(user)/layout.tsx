"use client";
import { AuthProvider } from "@/context/AuthContext"
import { ProfileProvider } from "@/context/ProfileContext";



export default function GroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ProfileProvider>

        {children}
      </ProfileProvider>
    </AuthProvider>
  );
}
