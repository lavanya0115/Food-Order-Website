import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  supabase,
  isSupabaseConfigured,
} from "../lib/supabase";

const C = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState("customer");
  const [loading, setLoading] = useState(true);

  async function hydrate(s) {
    try {
      setSession(s);

      if (!s) {
        setProfile(null);
        setRole("customer");
        setLoading(false);
        return;
      }

      const profileResult = await supabase
        .from("profiles")
        .select("*")
        .eq("id", s.user.id)
        .maybeSingle();

      const roleResult = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", s.user.id)
        .maybeSingle();

      setProfile(profileResult?.data || null);
      setRole(roleResult?.data?.role || "customer");
    } catch (error) {
      console.error("Auth Error:", error);

      setProfile(null);
      setRole("customer");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth
      .getSession()
      .then(({ data }) => {
        hydrate(data.session);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        hydrate(session);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({
      session,
      user: session?.user,
      profile,
      role,
      loading,
      configured: isSupabaseConfigured,
      signOut: () => supabase?.auth.signOut(),
      refresh: () => hydrate(session),
    }),
    [session, profile, role, loading]
  );

  return (
    <C.Provider value={value}>
      {children}
    </C.Provider>
  );
}

export function useAuth() {
  return useContext(C);
}