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
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      if (s) fetchAdminUser(s.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
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

    return () => subscription.unsubscribe();
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
    if (data.user) {
      await supabase.rpc("promote_first_admin");
      const { data: existing } = await supabase
        .from("admin_users")
        .select("id")
        .eq("id", data.user.id)
        .maybeSingle();
      if (!existing) {
        const { error: insertError } = await supabase.from("admin_users").insert({
          id: data.user.id,
          email,
          full_name: fullName,
          role: "editor",
        });
        if (insertError) return insertError.message;
      } else {
        await supabase.from("admin_users").update({ full_name: fullName }).eq("id", data.user.id);
      }
    }
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
