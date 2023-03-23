/* eslint-disable indent */
import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useMemo,
  useReducer,
} from "react";
import { ChatAction, ChatContextTypes, ChatState } from "../interface";
import { useAuthData } from "./AuthContext";

const INITIAL_STATE: ChatState = {
  chatId: null,
  user: {},
  dispatch: () => {},
};

export const ChatContext = createContext<ChatContextTypes>(INITIAL_STATE);

interface Props {
  children: ReactNode;
}

export const ChatContextProvider: FC<Props> = ({ children }) => {

  const chatReducer = (state: ChatState, action?: ChatAction) => {
    switch (action?.type) {
      case "CHANGE_USER":
        return {
          ...state,
          user: action?.payload?.user,
          // chatId: currentUser?.uid + payload.uid,
         chatId: action?.payload?.chatId
        };
      case 'RESET':
        return{
          ...state,
          user: {},
          chatId: null,
        }
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);
  // console.log("chat state", state);
  const memoizedValues = useMemo(
    () => ({ dispatch, chatId: state.chatId, user: state.user }),
    [state]
  );

  return (
    <ChatContext.Provider value={memoizedValues}>
      {children}
    </ChatContext.Provider>
  );
};

export const useSelectedUser = () => useContext(ChatContext)

