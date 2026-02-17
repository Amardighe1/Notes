import { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getDeviceId } from "@/lib/device-id";
import type { User, Session } from "@supabase/supabase-js";

export type UserRole = "admin" | "student";

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  department: string | null;
  semester: string | null;
  is_verified: boolean | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  role: UserRole | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string, department?: string, semester?: string) => Promise<{ error: string | null; confirmEmail?: boolean }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const profileFetchedRef = useRef<string | null>(null);

  const fetchProfile = useCallback(async (userId: string, fallbackUser?: User) => {
    // Skip duplicate fetch for same user
    if (profileFetchedRef.current === userId) return;
    profileFetchedRef.current = userId;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, full_name, role, department, semester, is_verified")
        .eq("id", userId)
        .single();

      if (!error && data) {
        setProfile(data as Profile);
        setRole(data.role === "admin" ? "admin" : "student");
        return;
      }
    } catch {
      // Profile table query failed
    }

    // Fallback: use auth user metadata
    const meta = fallbackUser?.user_metadata;
    if (meta) {
      setProfile({
        id: userId,
        email: fallbackUser?.email || "",
        full_name: meta.full_name || null,
        role: meta.role || "student",
        department: meta.department || null,
        semester: meta.semester || null,
        is_verified: null,
      });
      setRole(meta.role === "admin" ? "admin" : "student");
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    // Set up auth listener FIRST (Supabase best practice)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        if (!mounted) return;
        setSession(newSession);
        setUser(newSession?.user ?? null);
        if (newSession?.user) {
          // Defer to avoid Supabase internal deadlock
          setTimeout(() => {
            if (mounted) fetchProfile(newSession.user.id, newSession.user);
          }, 0);
        } else {
          setProfile(null);
          setRole(null);
          profileFetchedRef.current = null;
        }
        setLoading(false);
      }
    );

    // THEN get initial session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (!mounted) return;
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession?.user) {
        fetchProfile(currentSession.user.id, currentSession.user);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signIn = useCallback(async (email: string, password: string): Promise<{ error: string | null }> => {
    profileFetchedRef.current = null; // Reset so profile refetches after login
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };

    // Device verification — skip for admin accounts
    const userId = data.user?.id;
    if (userId) {
      try {
        const { data: prof } = await supabase
          .from("profiles")
          .select("device_id, role")
          .eq("id", userId)
          .single();

        // Only enforce device check for students, not admins
        if (prof && prof.role !== "admin") {
          const currentDeviceId = await getDeviceId();

          if (prof.device_id && prof.device_id !== currentDeviceId) {
            // Different device — sign out immediately and block
            await supabase.auth.signOut();
            return { error: "This account is already registered on another device. Please contact admin to reset." };
          }

          // First login after migration or device reset — bind this device
          if (!prof.device_id) {
            await supabase
              .from("profiles")
              .update({ device_id: currentDeviceId })
              .eq("id", userId);
          }
        }
      } catch {
        // If profile fetch fails, allow login (don't lock out on network errors)
      }
    }

    return { error: null };
  }, []);

  const signUp = useCallback(async (
    email: string,
    password: string,
    fullName: string,
    department?: string,
    semester?: string
  ): Promise<{ error: string | null; confirmEmail?: boolean }> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: "student",
          department: department || null,
          semester: semester || null,
        },
      },
    });
    if (error) return { error: error.message };

    if (data.user) {
      const deviceId = await getDeviceId();
      await supabase.from("profiles").upsert({
        id: data.user.id,
        email,
        full_name: fullName,
        role: "student",
        department: department || null,
        semester: semester || null,
        device_id: deviceId,
      });
    }
    if (data.user && !data.session) {
      return { error: null, confirmEmail: true };
    }
    return { error: null };
  }, []);

  const handleSignOut = useCallback(async () => {
    profileFetchedRef.current = null;
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setRole(null);
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo<AuthContextType>(() => ({
    user, session, profile, role, loading,
    signIn, signUp, signOut: handleSignOut,
  }), [user, session, profile, role, loading, signIn, signUp, handleSignOut]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
