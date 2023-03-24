import { GetServerSideProps } from "next";
import nookies from "nookies";
import Meta from "../components/Meta";
import RegisterComp from "../components/Register";

const Register = () => {
  return (
    <>
      <Meta title="Signup for private live chat" />
      <RegisterComp />
    </>
  );
};

export default Register;

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
