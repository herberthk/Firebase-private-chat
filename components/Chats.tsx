import { doc, onSnapshot } from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import { useAuthData } from "../context/AuthContext";
import { useSelectedUser } from "../context/ChatContext";
import Image from "next/image";

import { db } from "../firebase/firebase";
import { ChatsTypes, UserTypes } from "../interface";

const Chats = () => {
  const [chats, setChats] = useState<ChatsTypes[]>([]);
  const { currentUser } = useAuthData();

  const { dispatch } = useSelectedUser();

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(
        doc(db, "userChats", currentUser?.uid!),
        (doc) => {
          if (doc.exists() && Object.keys(doc.data()).length) {
            const data = doc.data();
            const d = Object.entries(data).map((el) => {
              const res: ChatsTypes = el[1];
              return {
                date: res?.date,
                lastMessage: res?.lastMessage,
                userInfo: res?.userInfo,
              };
            });
            // console.log('data',d)
            setChats(d);
          }
        }
      );
      return () => unsub();
    };

    return getChats();
  }, [currentUser?.uid]);

  // const getData =async()=>{
  //   const docRef = doc(db, "userChats", currentUser?.uid!);
  //   const docSnap = await getDoc(docRef);
  //   if (docSnap.exists()) {
  //     console.log("Document data:", docSnap.data());
  //   } else {
  //     // doc.data() will be undefined in this case
  //     console.log("No such document!");
  //   }
  // }

  const handleSelect = useCallback((user: UserTypes) => {
    const combined =
      currentUser?.uid! > user?.uid!
        ? currentUser?.uid + user?.uid!
        : user?.uid! + currentUser?.uid;

    dispatch({
      type: "CHANGE_USER",
      payload: {
        chatId: combined,
        user,
      },
    });
  }, []);

  // console.log("chats", chats);
  return (
    <div className="chat">
      {chats.length > 0 &&
        chats
          ?.sort((a, b) => b?.date.seconds - a?.date.seconds)
          .map((chat, i) => (
            <div
              role="button"
              tabIndex={0}
              className="userChat"
              key={i + 1}
              onClick={() => handleSelect(chat?.userInfo)}
              onKeyDown={() => {}}
            >
              <Image
                src={chat?.userInfo?.photoURL}
                alt={chat?.userInfo?.displayName}
                fill
              />
              <div className="userChatInfo">
                <span>{chat?.userInfo?.displayName}</span>
                <p>{chat?.lastMessage?.text}</p>
              </div>
            </div>
          ))}
    </div>
  );
};

export default Chats;
