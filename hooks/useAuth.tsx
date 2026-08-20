import { onAuthStateChanged, type User } from "firebase/auth";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { auth } from "@/firebase/config";
import { demoUser, isDemo, subscribeToDemo } from "@/services/demo/demoMode";

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
  const [demo, setDemo] = useState(isDemo());

  useEffect(
    () =>
      onAuthStateChanged(auth, (next) => {
        setUser(next);
        setReady(true);
      }),
    [],
  );

  // Entering or leaving the demo has to move the auth guard the same way a
  // real sign-in would.
  useEffect(() => subscribeToDemo(() => setDemo(isDemo())), []);

  const value = useMemo(
    () => ({
      user: demo ? (demoUser() as unknown as User) : user,
      ready: demo ? true : ready,
    }),
    [demo, user, ready],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
