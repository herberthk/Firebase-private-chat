import { useAuthData } from "../context/AuthContext";
import nookies from "nookies";
import { auth } from "../firebase/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";
import { upperFirst } from "../utill/utils";
import { useSelectedUser } from "../context/ChatContext";
import Image from "next/image";
import { LogoOutIcon } from "./Icons";

const Navbar = () => {
  const router = useRouter();
  const { currentUser } = useAuthData();
  const { dispatch } = useSelectedUser();

  const signOutUser = async () => {
    try {
      await signOut(auth);
      dispatch({ type: "RESET" });
      router.push("/login");
      nookies.destroy(null, "loggedIn");
      nookies.set(null, "loggedIn", JSON.stringify(false), { path: "/" });
    } catch (error) {}
  };

  return (
    <div className="navbar">
      <span className="logo">Firebase Chat</span>
      <div className="user">
        <Image
          src={currentUser?.photoURL!}
          alt={currentUser?.displayName!}
          fill
        />
        <span>
          {currentUser?.displayName
            ? upperFirst(currentUser?.displayName!)
            : "User"}
        </span>
        <button title="Log out" onClick={() => signOutUser()}>
          <LogoOutIcon />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
