import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import nookies, { parseCookies } from "nookies";
import { useEffect } from "react";
import RegisterComp from "../components/Register";

const Register = () => {
 
  return <RegisterComp />;
};

export default Register;

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
