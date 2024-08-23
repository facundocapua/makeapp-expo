import { getCalendar } from "@/lib/google/calendar";
import { CALENDAR_NAME } from "@/lib/google/utils";
import { GoogleSignin, User } from "@react-native-google-signin/google-signin";
import { useContext, createContext, useState } from "react";

export type ExtendedUser = User & {
  accessToken: string;
  calendarId: string;
};

type SessionContext = {
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  setSession: (session: ExtendedUser) => void;
  session: ExtendedUser | null;
  isLoading: boolean;
};

const AuthContext = createContext<SessionContext>({
  signIn: () => Promise.resolve(),
  signOut: () => Promise.resolve(),
  setSession: (session: ExtendedUser) => {},
  session: null,
  isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

type Props = {
  children: React.ReactNode;
};

export function SessionProvider({ children }: Props) {
  const [session, setSession] = useState<ExtendedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const signIn = async () => {
    try {
      const userInfo = await GoogleSignin.signInSilently();
      const { accessToken } = await GoogleSignin.getTokens();
      const calendar = await getCalendar({
        name: CALENDAR_NAME,
        accessToken,
      });
      const calendarId = calendar.id;

      setSession({ ...userInfo, accessToken, calendarId });
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut: async () => {
          setSession(null);
        },
        setSession,
        session,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
