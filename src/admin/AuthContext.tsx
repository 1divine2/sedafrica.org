import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabase";
import type { AdminUser } from "./types";
import type { Session } from "@supabase/supabase-js";

interface AuthState {
  session: Session | null;
  adminUser: AdminUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string, fullName: string) => Promise<string | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  session: null,
  adminUser: null,
  loading: true,
  signIn: async () => null,
  signUp: async () => null,
  signOut: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (!mounted) return;
      setSession(s);
      if (s) fetchAdminUser(s.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      if (!mounted) return;
      setSession(s);
      if (s) {
        (async () => {
          await fetchAdminUser(s.user.id);
        })();
      } else {
        setAdminUser(null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function fetchAdminUser(userId: string) {
    const { data } = await supabase
      .from("admin_users")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    setAdminUser(data);
    setLoading(false);
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return error.message;
    return null;
  }

  async function signUp(email: string, password: string, fullName: string) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return error.message;

    if (!data.user) return "Sign-up failed. Please try again.";

    // Wait briefly for the session to propagate
    let retries = 0;
    while (retries < 10) {
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session) break;
      await new Promise((r) => setTimeout(r, 300));
      retries++;
    }

    // Use the SECURITY DEFINER function to register in admin_users
    const { data: result, error: rpcError } = await supabase.rpc("register_admin_user", {
      p_full_name: fullName,
    });

    if (rpcError) return rpcError.message;

    if (result === "not_authenticated") {
      return "Session could not be established. Please try signing in with the account you just created.";
    }

    // Refresh admin user data
    await fetchAdminUser(data.user.id);

    return null;
  }

  async function signOut() {
    await supabase.auth.signOut();
    setSession(null);
    setAdminUser(null);
  }

  return (
    <AuthContext.Provider value={{ session, adminUser, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
