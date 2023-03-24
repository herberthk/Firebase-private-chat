import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { onAuthStateChanged } from "firebase/auth";
import nookies from "nookies";
import { auth } from "../firebase/firebase";
import { AuthContextTypes, UserTypes } from "../interface";

const contextDefaults: AuthContextTypes = {
  currentUser: null,
};

const AuthContext = createContext<AuthContextTypes>(contextDefaults);

interface Props {
  children: ReactNode;
}

export const AuthContextProvider: FC<Props> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserTypes | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({
          displayName: user?.displayName!,
          uid: user?.uid,
          photoURL: user?.photoURL!,
        });
        nookies.destroy(null, "loggedIn");
        nookies.set(null, "loggedIn", JSON.stringify(true), { path: "/" });
      } else {
        setCurrentUser(null);
        nookies.destroy(null, "loggedIn");
        nookies.set(null, "loggedIn", JSON.stringify(false), { path: "/" });
      }
    });

    return () => unsub();
  }, [currentUser?.displayName]);

  console.log("currentUser", currentUser);
  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthData = () => useContext(AuthContext);
