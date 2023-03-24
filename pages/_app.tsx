import "../styles/globals.scss";
import "react-toastify/dist/ReactToastify.min.css";
import type { AppProps } from "next/app";
import { AuthContextProvider } from "../context/AuthContext";
import { ChatContextProvider } from "../context/ChatContext";
import { ToastContainer } from "react-toastify";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthContextProvider>
      <ChatContextProvider>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        <Component {...pageProps} />
      </ChatContextProvider>
    </AuthContextProvider>
  );
}
