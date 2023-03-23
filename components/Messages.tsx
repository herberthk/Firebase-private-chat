import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useSelectedUser } from "../context/ChatContext";
import { db } from "../firebase/firebase";
import { MessageTypes } from "../interface";
import Message from "./Message";

const Messages = () => {
  const [messages, setMessages] = useState<MessageTypes[]>([]);
  const { chatId,user } = useSelectedUser()
 
  // console.log('chatId',chatId)
  // console.log('user', user)
  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId!), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });

    return () => {
      unSub();
    };
  }, [chatId]);

  // console.log("Message", messages);

  return (
    <div className="messages scroller">
      {messages.map((m) => (
        <Message {...m} key={m.id} />
      ))}
    </div>
  );
};

export default Messages;
