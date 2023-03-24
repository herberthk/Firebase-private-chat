import React, { KeyboardEvent, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { useAuthData } from "../context/AuthContext";
import { db } from "../firebase/firebase";
import { upperFirst } from "../utill/utils";
import { useSelectedUser } from "../context/ChatContext";
import { UserTypes } from "../interface";
import { toast } from "react-toastify";
import Image from "next/image";

const Search = () => {
  const [username, setUsername] = useState("");
  const [selected, setSelected] = useState(false);
  const [user, setUser] = useState<UserTypes | null>();
  const { dispatch, chatId } = useSelectedUser();

  const { currentUser } = useAuthData();

  const handleSearch = async () => {
    if (!username) return;
    setUser(null);
    const q = query(
      collection(db, "users"),
      where("displayName", "==", username.toLowerCase()),
      where("displayName", "!=", currentUser?.displayName?.toLowerCase())
    );

    try {
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        toast.error("Sorry, user not found", {
          closeOnClick: true,
          progress: undefined,
          position: "top-center",
        });
      }
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const user = {
          displayName: data.displayName,
          photoURL: data.photoURL,
          uid: data.uid,
        };
        setUser(user);
      });
    } catch (err) {
      console.log("err", err);
    }
  };

  const handleKey = (event: KeyboardEvent<HTMLInputElement>) => {
    event.code === "Enter" && handleSearch();
  };

  // const keyPress = debounce(()=>{
  //     console.log('keyPress')
  //   },10000)

  const handleSelect = async () => {
    const combinedId =
      currentUser?.uid! > user?.uid!
        ? currentUser?.uid + user?.uid!
        : user?.uid! + currentUser?.uid;

    dispatch({
      type: "CHANGE_USER",
      payload: {
        chatId: combinedId,
        user: user!,
      },
    });

    // console.log("Selected user", user);
    setUser(null);
    setUsername("");
    //
    // check whether the group(chats in firestore) exists, if not create

    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      setSelected(true);

      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        //create user chats
        await updateDoc(doc(db, "userChats", currentUser?.uid!), {
          [combinedId + ".userInfo"]: {
            uid: user?.uid,
            displayName: user?.displayName,
            photoURL: user?.photoURL,
          },
          [combinedId + ".date"]: Timestamp.now(),
        });

        await updateDoc(doc(db, "userChats", user?.uid!), {
          [combinedId + ".userInfo"]: {
            uid: currentUser!.uid,
            displayName: currentUser!.displayName,
            photoURL: currentUser?.photoURL,
          },
          [combinedId + ".date"]: Timestamp.now(),
        });
      }
      setUser(null);
      setUsername("");
    } catch (err) {
    } finally {
      setUser(null);
      setUsername("");
    }
  };

  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          placeholder="Find a user"
          onKeyDown={handleKey}
          // onKeyUp={keyPress}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
      </div>
      {user && !selected && (
        <div
          className="userChat"
          role="button"
          tabIndex={0}
          onClick={handleSelect}
          onKeyDown={() => {}}
        >
          <Image fill src={user.photoURL!} alt="" />
          <div className="userChatInfo">
            <span>{upperFirst(user?.displayName)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
