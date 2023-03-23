import { useState, MouseEvent } from "react";
import Link from "next/link";
import styles from "./form.module.scss";
import { useRouter } from "next/router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { FirebaseError } from "firebase/app";
import { toast } from "react-toastify";



const LoginComp = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setErr] = useState<string | null>(null);
 
  const logInUser = async (event:MouseEvent<HTMLButtonElement, globalThis.MouseEvent>):Promise<void> => {
    event?.preventDefault()
    if (!email || !password) {
      alert("Please enter required fields");
      return;
    }
   
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/')
    } catch (err) {
      const error = err as FirebaseError
      if (error.code === 'auth/user-not-found') {
        toast.error("Wrong credentials, try again", {
          closeOnClick: true,
          progress: undefined,
        });
      }
      // console.log(error.code);
      // setErr(getErrorMessage(error));
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className={styles.formContainer}>
      <div className={styles.formWrapper}>
        <div className={styles.header}>
        <span className={styles.logo}>Private Chat</span>
        </div>
        
        <form>
          <>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              placeholder="email"
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
              type="password"
              placeholder="password"
            />
            {
              loading ?  <button>
              Please wait...
            </button>:  <button disabled={!email || !password} onClick={logInUser}>
              Sign in
            </button>
            }
          </>
          <p>
          You don&apos;t have an account? <Link href="/register">Register</Link>
        </p>
        </form>
      
      </div>
    </div>
  );
};

export default LoginComp;


