import { useState, MouseEvent } from "react";
import Link from "next/link";
import styles from "./form.module.scss";
import { useRouter } from "next/router";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { getErrorMessage } from "../utill/types";
import { auth, db, storage } from "../firebase/firebase"; 
import Image from "next/image";
import { toast } from "react-toastify";
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "../utill/constants";

const PhotoIcon = ()=>(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{width: '30px', height: '30px'}} className="w-6 h-6">
<path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
</svg>
)
const RegisterComp = () => {
  const [displayName, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setErr] = useState<string | null>(null);
  const [file, setFile] = useState<Blob | null>(null);

  const router = useRouter();

  const registerUser = async (event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    event?.preventDefault()
      if (!file) {
        toast.error("Display photo is required", {
          closeOnClick: true,
          progress: undefined,
        });
        return
      }
      const name = displayName.toLowerCase()
    setLoading(true);
    //Create a unique image name
    const date = new Date().getTime();
    const storageRef = ref(storage, `${name + date}`);
    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await uploadBytesResumable(storageRef, file).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            //Update profile
            await updateProfile(res.user, {
              displayName: name,
              photoURL: downloadURL,
            });
            //create user on firestore
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName: name,
              email: email,
              photoURL: downloadURL,
            });

            //create empty user chats on firestore
            await setDoc(doc(db, "userChats", res.user.uid), {});
            router.push('/')
          } catch (error) {
            // console.log(err);
            setErr(getErrorMessage(error));
            
          } finally {
            setLoading(false);
        
          }
        });
      });
    } catch (error) {
      setErr(getErrorMessage(error));
     
    } finally {
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
              value={displayName}
              onChange={(e) => setName(e.target.value)}
              required
              type="text"
              placeholder="display name"
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              placeholder="email"
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
              placeholder="password"
            />
            <input
              onChange={(e) => {
                if (!e.target.files || e.target.files.length === 0) {
                  return;
                }
                if (!ACCEPTED_IMAGE_TYPES.includes(e.target.files[0].type)) {
                  toast.error("upload valid image", {
                    closeOnClick: true,
                    progress: undefined,
                  });
                 
                  e.target.value = "";
                  return;
                }
                // File size should not exceed 500kb
                if (e.target.files[0].size > MAX_FILE_SIZE) {
                  toast.error("Uploaded image is too large", {
                    closeOnClick: true,
                    progress: undefined,
                  });
                  toast.info("Uploaded image shouldn't exceed 1mb", {
                    closeOnClick: true,
                    progress: undefined,
                  });
                  e.target.value = "";
                  return;
                }
                setFile(e.target.files[0]);
                e.target.value = "";
              }}
              required
              style={{ display: "none" }}
              accept="image/*"
              type="file"
              id="file"
            />
            <div className={styles.avatar}>
              {
                file && <Image src={URL.createObjectURL(file)} width={40} height={40} alt="pic" />
              }
              
            <label htmlFor="file">
             <PhotoIcon/>
              <span>Add display photo</span>
            </label>
            </div>

           {
            loading ?  <button >
            Please wait...
          </button>:  <button onClick={registerUser} disabled={ !email || !password || !displayName}>
              Sign up
            </button>
           }
          
            
          </>
          <p>
          You do have an account? <Link href="/login">Login</Link>
        </p>
        </form>
        
      </div>
    </div>
  );
};

export default RegisterComp;
