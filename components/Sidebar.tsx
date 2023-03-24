import React from "react";
import Navbar from "./Navbar";
import Search from "./Search";
import Chats from "./Chats";
import { useAuthData } from "../context/AuthContext";

const Sidebar = () => {
  const { currentUser } = useAuthData();
  return (
    <div className="sidebar">
      <Navbar />
      <Search />
      {currentUser && <Chats />}
    </div>
  );
};

export default Sidebar;
