'use client'
import { createContext, use, useContext, useEffect, useState } from "react";
type Profile = {id:string,name:string}
const ProfileContext = createContext<any>(null);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
    const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);


    return (    
    <ProfileContext.Provider value={{ selectedProfile, setSelectedProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => useContext(ProfileContext);