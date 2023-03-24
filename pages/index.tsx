import { GetServerSideProps } from "next";
import Chat from "../components/Chat";
import Sidebar from "../components/Sidebar";
import nookies from "nookies";
import Meta from "../components/Meta";

const Home = () => {
  return (
    <>
      <Meta />
      <div className="home">
        <div className="container">
          <Sidebar />
          <Chat />
        </div>
      </div>
    </>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = nookies.get(ctx);
  if (Object.keys(cookies).length) {
    const loggedIn = JSON.parse(cookies.loggedIn);
    if (!loggedIn) {
      ctx.res.writeHead(307, { Location: "/login" });
      ctx.res.end();
    }
  }
  return {
    props: {},
  };
};
