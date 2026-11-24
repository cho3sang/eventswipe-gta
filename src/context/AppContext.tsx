import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";
import {
  continueAsDemoUser as continueAsDemoUserService,
  getCurrentSupabaseProfile,
  loginWithEmail as loginWithEmailService,
  logout as logoutService
} from "../services/authService";
import { dataMode, eventProvider } from "../services/eventProvider";
import { UserProfile } from "../types";

type LoginInput = {
  email: string;
  password: string;
  name: string;
  city: string;
};

type AppContextValue = {
  currentUser: UserProfile | null;
  isBooting: boolean;
  dataMode: string;
  refreshKey: number;
  loginWithEmail(input: LoginInput): Promise<void>;
  continueAsDemoUser(): Promise<void>;
  logout(): Promise<void>;
  refreshAppData(): void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: PropsWithChildren) {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isBooting, setIsBooting] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    getCurrentSupabaseProfile()
      .then((profile) => {
        if (isMounted && profile) {
          setCurrentUser(profile);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsBooting(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      currentUser,
      isBooting,
      dataMode,
      refreshKey,
      async loginWithEmail(input) {
        const user = await loginWithEmailService(input);
        setCurrentUser(user);
        setRefreshKey((key) => key + 1);
      },
      async continueAsDemoUser() {
        const user = await continueAsDemoUserService();
        setCurrentUser(user);
        setRefreshKey((key) => key + 1);
      },
      async logout() {
        await logoutService();
        setCurrentUser(null);
      },
      refreshAppData() {
        setRefreshKey((key) => key + 1);
      }
    }),
    [currentUser, isBooting, refreshKey]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useApp must be used inside AppProvider.");
  }

  return context;
}

export { eventProvider };
