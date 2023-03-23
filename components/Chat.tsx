import React from "react";
import Messages from "./Messages";
import Input from "./Input";
import { useSelectedUser } from "../context/ChatContext";
import { upperFirst } from "../utill/utils";

const Chat = () => {
  const { user,chatId } = useSelectedUser()

  return (
    <div className="chat">
      <div className="chatInfo">
        <span>
           {user?.displayName && upperFirst(user?.displayName!)}
          </span>
        <div className="chatIcons">
          <img src="/img/cam.png" alt="" />
          <img src="/img/add.png" alt="" />
          <img src="/img/more.png" alt="" />
        </div>
      </div>
      {
        chatId? <Messages /> : <div className="messages" />
      }
      
      <Input />
    </div>
  );
};

export default Chat;
