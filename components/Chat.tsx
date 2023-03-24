import React from "react";
import Messages from "./Messages";
import Input from "./Input";
import { useSelectedUser } from "../context/ChatContext";
import { upperFirst } from "../utill/utils";
import Image from "next/image";

const Chat = () => {
  const { user, chatId } = useSelectedUser();

  return (
    <div className="chat">
      <div className="chatInfo">
        <span>{user?.displayName && upperFirst(user?.displayName!)}</span>
        <div className="chatIcons">
          <Image src="/img/cam.png" alt="" fill />
          <Image src="/img/add.png" alt="" fill />
          <Image src="/img/more.png" alt="" fill />
        </div>
      </div>
      {chatId ? <Messages /> : <div className="messages" />}

      <Input />
    </div>
  );
};

export default Chat;
