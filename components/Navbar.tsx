import { useAuthData } from "../context/AuthContext";
import nookies from "nookies";
import { auth } from "../firebase/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";
import { upperFirst } from "../utill/utils";
import { useSelectedUser } from "../context/ChatContext";

const LogoOutIcon = ()=>(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="logout">
<path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
</svg>
)

const Navbar = () => {
  const router = useRouter();
  const { currentUser } = useAuthData();
  const { dispatch } = useSelectedUser()
  
  const signOutUser = async () => {
    try {
      await signOut(auth);
      dispatch({type:'RESET'})
      router.push('/login')
      nookies.destroy(null, "loggedIn");
      nookies.set(null, "loggedIn", JSON.stringify(false), {path: '/'});
    
    } catch (error) {
     
    }
  };
  
  return (
    <div className="navbar">
      <span className="logo">Firebase Chat</span>
      <div className="user">
        <img src={currentUser?.photoURL!} alt="" />
        <span>{currentUser?.displayName ? upperFirst(currentUser?.displayName!): 'User'}</span>
        <button title="Log out" onClick={() => signOutUser()}><LogoOutIcon/></button>
      </div>
    </div>
  );
};

export default Navbar;
