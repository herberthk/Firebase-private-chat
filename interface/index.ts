import { Timestamp } from "firebase/firestore";
import { Dispatch } from "react";

export interface UserTypes {
    displayName?: string;
    uid?: string;
    photoURL?: string;

  }
  
  export interface RegistrationTypes {
    displayName: string;
    email: string;
    password: string;
    file: File;
  }
  
 export interface AuthContextTypes {
    currentUser?: UserTypes | null;
  }

type ChatActionKind = "CHANGE_USER" | 'RESET';

export interface ChatState {
  chatId?: string | null;
  user?: UserTypes;
  dispatch: (v: ChatAction) => void;
}

export interface ChatContextTypes {
  chatId?: string | null;
  user?: UserTypes;
  dispatch: Dispatch<ChatAction>;
}

// An interface for our actions
export interface ChatAction {
    type: ChatActionKind;
    payload?: {
        user?: UserTypes
        chatId?: string | null;
    }
     
  }
 

 export interface ChatsTypes {
    date: Timestamp
    userInfo: {
      photoURL: string;
      displayName: string;
      uid: string;
    };
    lastMessage: {
      text?: string;
    };
  }
  
 export interface MessageTypes {
    text: string;
    img: string;
    from: string;
    id: string;
    date:Timestamp
  }

//   export interface FirebaseError {
//     code: number;
//     message: string;
//     errors:{
//       domain: string;
//       message:string
//       reason:string
//     }[]
//   }