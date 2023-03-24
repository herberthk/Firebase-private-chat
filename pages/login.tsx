import { GetServerSideProps } from "next";
import LoginComp from "../components/Login";
import nookies from "nookies";
import Meta from "../components/Meta";

const Login = () => {
  return (
    <>
      <Meta title="Login to private live chat" />
      <LoginComp />
    </>
  );
};

export default Login;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = nookies.get(ctx);
  if (Object.keys(cookies).length) {
    const loggedIn = JSON.parse(cookies.loggedIn);
    if (loggedIn) {
      ctx.res.writeHead(307, { Location: "/" });
      ctx.res.end();
    }
  }
  return {
    props: {},
  };
};
