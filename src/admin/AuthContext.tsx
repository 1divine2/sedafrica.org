import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabase";
import type { AdminUser } from "./types";
import type { Session } from "@supabase/supabase-js";

interface AuthState {
  session: Session | null;
  adminUser: AdminUser | null;
  initializing: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string, fullName: string) => Promise<string | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  session: null,
  adminUser: null,
  initializing: true,
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
  const [initializing, setInitializing] = useState(true);

  async function loadAdminProfile(): Promise<AdminUser | null> {
    const { data, error } = await supabase.rpc("get_my_admin_profile");
    if (error) {
      console.error("loadAdminProfile error:", error.message);
      return null;
    }
    if (data && typeof data === "object" && "id" in data) {
      return data as AdminUser;
    }
    return null;
  }

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(async ({ data: { session: s } }) => {
      if (!mounted) return;
      setSession(s);
      if (s) {
        const admin = await loadAdminProfile();
        if (mounted) setAdminUser(admin);
      }
      if (mounted) setInitializing(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      if (!mounted) return;
      setSession(s);
      if (!s) setAdminUser(null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function signIn(email: string, password: string): Promise<string | null> {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return error.message;

    const admin = await loadAdminProfile();
    if (!admin) {
      await supabase.auth.signOut();
      return "Your account does not have admin access. Please create an account using the Create Account tab.";
    }

    setSession((await supabase.auth.getSession()).data.session);
    setAdminUser(admin);
    return null;
  }

  async function signUp(email: string, password: string, fullName: string): Promise<string | null> {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return error.message;
    if (!data.user) return "Sign-up failed. Please try again.";

    let sess: Session | null = data.session;
    if (!sess) {
      for (let i = 0; i < 20; i++) {
        const { data: sd } = await supabase.auth.getSession();
        if (sd.session) { sess = sd.session; break; }
        await new Promise((r) => setTimeout(r, 250));
      }
    }

    if (!sess) {
      return "Account created, but session could not start. Please sign in with your new credentials.";
    }

    setSession(sess);

    const { data: rpcResult, error: rpcError } = await supabase.rpc("register_admin_user", {
      p_full_name: fullName,
    });

    if (rpcError) return "Account created, but admin setup failed: " + rpcError.message + ". Please try signing in.";

    if (rpcResult && typeof rpcResult === "object" && "error" in rpcResult) {
      return "Account created, but admin setup failed. Please try signing in with your new credentials.";
    }

    if (rpcResult && typeof rpcResult === "object" && "id" in rpcResult) {
      setAdminUser(rpcResult as AdminUser);
      return null;
    }

    const admin = await loadAdminProfile();
    if (!admin) return "Account created. Please sign in with your new credentials.";

    setAdminUser(admin);
    return null;
  }

  async function signOut() {
    await supabase.auth.signOut();
    setSession(null);
    setAdminUser(null);
  }

  return (
    <AuthContext.Provider value={{ session, adminUser, initializing, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
