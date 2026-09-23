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

  async function fetchAdminUser(userId: string): Promise<AdminUser | null> {
    const { data, error } = await supabase
      .from("admin_users")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    if (error) {
      console.error("Failed to fetch admin user:", error.message);
      return null;
    }
    return data;
  }

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(async ({ data: { session: s } }) => {
      if (!mounted) return;
      setSession(s);
      if (s) {
        const admin = await fetchAdminUser(s.user.id);
        if (mounted) {
          setAdminUser(admin);
        }
      }
      if (mounted) setInitializing(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      if (!mounted) return;
      setSession(s);
      if (!s) {
        setAdminUser(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function signIn(email: string, password: string): Promise<string | null> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return error.message;

    if (!data.session || !data.user) {
      return "Sign-in failed. Please try again.";
    }

    setSession(data.session);

    const admin = await fetchAdminUser(data.user.id);
    if (!admin) {
      await supabase.auth.signOut();
      setSession(null);
      return "Your account does not have admin access. Please create an account first.";
    }

    setAdminUser(admin);
    return null;
  }

  async function signUp(email: string, password: string, fullName: string): Promise<string | null> {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return error.message;

    if (!data.user) {
      return "Sign-up failed. Please try again.";
    }

    // signUp may or may not return a session immediately
    let sess: Session | null = data.session;
    if (!sess) {
      for (let i = 0; i < 20; i++) {
        const { data: sd } = await supabase.auth.getSession();
        if (sd.session) {
          sess = sd.session;
          break;
        }
        await new Promise((r) => setTimeout(r, 250));
      }
    }

    if (!sess) {
      return "Account created, but session could not start. Please sign in with your new credentials.";
    }

    setSession(sess);

    // Register in admin_users via SECURITY DEFINER function
    const { data: rpcResult, error: rpcError } = await supabase.rpc("register_admin_user", {
      p_full_name: fullName,
    });

    if (rpcError) {
      return "Account created, but admin registration failed: " + rpcError.message;
    }

    if (rpcResult === "not_authenticated") {
      return "Account created, but admin registration failed. Please sign in with your new credentials.";
    }

    const admin = await fetchAdminUser(data.user.id);
    if (!admin) {
      return "Account created, but could not load your admin profile. Please try signing in.";
    }

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
