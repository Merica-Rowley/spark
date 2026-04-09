import { createContext, useContext } from "react";
import { type Profile } from "../types";

type AuthContextType = {
  profile: Profile;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
  profile,
  children,
}: {
  profile: Profile;
  children: React.ReactNode;
}) {
  return (
    <AuthContext.Provider value={{ profile }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthLayout");
  return context;
}
