import { createContext, useContext, useState, useCallback } from "react";
import { type Profile } from "../types";

type AuthContextType = {
  profile: Profile;
  updateProfile: (profile: Profile) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
  profile: initialProfile,
  children,
}: {
  profile: Profile;
  children: React.ReactNode;
}) {
  const [profile, setProfile] = useState<Profile>(initialProfile);

  const updateProfile = useCallback((newProfile: Profile) => {
    setProfile({ ...newProfile }); // spread to ensure new reference
  }, []);

  return (
    <AuthContext.Provider value={{ profile, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthLayout");
  return context;
}
