import { GetServerSideProps } from "next";
import LoginComp from "../components/Login";
import { useAuthData } from "../context/AuthContext";
import nookies, { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const Login = () => {
 
  
  return <LoginComp />;
};

export default Login;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = nookies.get(ctx);
  if (Object.keys(cookies).length) {
    const loggedIn = JSON.parse(cookies.loggedIn) 
    if (loggedIn) {
      ctx.res.writeHead(307, { Location: '/' })
        ctx.res.end()
    }
  }
  return {
    props:{
      
    }
  }
};