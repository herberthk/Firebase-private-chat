import classNames from "classnames";
import { FC, useEffect, useRef } from "react";
import { useAuthData } from "../context/AuthContext";
import { useSelectedUser } from "../context/ChatContext";
import TimeAgo from "react-timeago";
import { MessageTypes } from "../interface";
import Image from "next/image";

const Message: FC<MessageTypes> = ({ date, text, img, from }) => {
  const { currentUser } = useAuthData();
  const { user } = useSelectedUser();

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [text]);

  const imgSrc =
    from === currentUser?.uid ? currentUser?.photoURL! : user?.photoURL!;

  return (
    <div
      ref={ref}
      className={classNames("message", from === currentUser?.uid && "owner")}
    >
      <div className="messageInfo">
        <Image src={imgSrc} alt={from} fill />
      </div>
      <div className="messageContent">
        <p>{text}</p>
        {img && <Image src={img} alt="" fill />}
        <span>
          {" "}
          <TimeAgo date={date.toDate()} />
        </span>
      </div>
    </div>
  );
};

export default Message;
