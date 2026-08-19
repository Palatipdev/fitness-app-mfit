import { onAuthStateChanged, type User } from "firebase/auth";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { auth } from "@/firebase/config";

type AuthContextValue = {
  user: User | null;
  /** False until Firebase has restored (or ruled out) a persisted session. */
  ready: boolean;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  ready: false,
});

/**
 * One auth listener for the whole app. Screens previously each registered their
 * own `onAuthStateChanged` and raced each other to redirect.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [ready, setReady] = useState(false);

  useEffect(
    () =>
      onAuthStateChanged(auth, (next) => {
        setUser(next);
        setReady(true);
      }),
    [],
  );

  const value = useMemo(() => ({ user, ready }), [user, ready]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
