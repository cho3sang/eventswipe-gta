import { defaultDemoUser, eventProvider } from "./eventProvider";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import { UserProfile } from "../types";

type LoginInput = {
  email: string;
  password: string;
  name: string;
  city: string;
};

export async function continueAsDemoUser() {
  await eventProvider.upsertUser?.(defaultDemoUser);
  return defaultDemoUser;
}

export async function loginWithEmail(input: LoginInput) {
  if (!isSupabaseConfigured || !supabase) {
    const localUser: UserProfile = {
      ...defaultDemoUser,
      name: input.name.trim() || defaultDemoUser.name,
      city: input.city.trim() || defaultDemoUser.city
    };

    await eventProvider.upsertUser?.(localUser);
    return localUser;
  }

  const email = input.email.trim();
  const password = input.password;

  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  const signIn = await supabase.auth.signInWithPassword({ email, password });
  const authUser =
    signIn.data.user ??
    (
      await supabase.auth.signUp({
        email,
        password
      })
    ).data.user;

  if (!authUser) {
    throw signIn.error ?? new Error("Unable to sign in or create the demo account.");
  }

  const existingProfile = await eventProvider.getUserById?.(authUser.id);
  const fallbackName = input.name.trim() || email.split("@")[0] || "Toronto User";
  const fallbackCity = input.city.trim() || "Toronto";
  const profile: UserProfile = {
    id: authUser.id,
    name: existingProfile?.name ?? fallbackName,
    avatar_url: existingProfile?.avatar_url ?? null,
    city: existingProfile?.city ?? fallbackCity,
    age: existingProfile?.age ?? null,
    created_at: existingProfile?.created_at ?? new Date().toISOString()
  };

  return eventProvider.upsertUser?.(profile) ?? profile;
}

export async function getCurrentSupabaseProfile() {
  if (!isSupabaseConfigured || !supabase) {
    return null;
  }

  const { data } = await supabase.auth.getSession();
  const user = data.session?.user;

  if (!user) {
    return null;
  }

  return eventProvider.getUserById?.(user.id) ?? null;
}

export async function logout() {
  if (isSupabaseConfigured && supabase) {
    await supabase.auth.signOut();
  }
}
