import React, { useState, KeyboardEvent } from "react";
import { arrayUnion, doc, Timestamp, updateDoc } from "firebase/firestore";

import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../firebase/firebase";
import { useAuthData } from "../context/AuthContext";
import { useSelectedUser } from "../context/ChatContext";
import { toast } from "react-toastify";
import Image from "next/image";

const Input = () => {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const [text, setText] = useState("");
  const [img, setImg] = useState<File | null>(null);

  const { currentUser } = useAuthData();
  const { chatId, user } = useSelectedUser();

  const handleSend = async () => {
    if (!user || !chatId) return;
    let lastMessage = text;
    if (!text) {
      toast.error("Please type in the message to send", {
        closeOnClick: true,
        progress: undefined,
      });
      return;
    }
    if (text.length > 30) {
      lastMessage = text.slice(0, 30) + "...";
    }
    if (!text && img) {
      lastMessage = "Photo";
    }

    try {
      if (img) {
        const storageRef = ref(storage, uuid());

        const uploadTask = uploadBytesResumable(storageRef, img);

        uploadTask.on(
          "state_changed",
          (snap) => {
            const percentage =
              Math.round(snap.bytesTransferred / snap.totalBytes) * 100;
            setProgress(percentage);
          },
          (error) => {
            setError(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(
              async (downloadURL) => {
                await updateDoc(doc(db, "chats", chatId!), {
                  messages: arrayUnion({
                    id: uuid(),
                    text,
                    to: user?.uid,
                    from: currentUser?.uid,
                    date: Timestamp.now(),
                    img: downloadURL,
                  }),
                });
              }
            );
          }
        );
      } else {
        await updateDoc(doc(db, "chats", chatId!), {
          messages: arrayUnion({
            id: uuid(),
            text,
            to: user?.uid,
            from: currentUser?.uid,
            date: Timestamp.now(),
          }),
        });
      }

      await updateDoc(doc(db, "userChats", currentUser?.uid!), {
        [chatId + ".lastMessage"]: {
          text: lastMessage,
        },
        [chatId + ".date"]: Timestamp.now(),
      });

      await updateDoc(doc(db, "userChats", user?.uid!), {
        [chatId + ".lastMessage"]: {
          text: lastMessage,
        },
        [chatId + ".date"]: Timestamp.now(),
      });

      setText("");
      setImg(null);
    } catch (error) {}
  };

  const handleKey = (event: KeyboardEvent<HTMLInputElement>) => {
    event.code === "Enter" && handleSend();
  };
  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type something..."
        onChange={(e) => setText(e.target.value)}
        value={text}
        onKeyDown={handleKey}
      />
      <div className="send">
        <Image src="/img/attach.png" alt="" fill />
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={(e) => {
            if (!e.target.files || e.target.files.length === 0) {
              return;
            }
            setImg(e.target.files[0]);
          }}
        />
        <label htmlFor="file">
          <Image src="/img/img.png" alt="" fill />
        </label>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Input;
