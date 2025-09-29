// src/realtime/SocketProvider.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getSocket,
  onNewMessage,
  offNewMessage,
  onPresenceUpdate,
  offPresenceUpdate,
} from "./socketClient";
import { appendMessage, incrementUnread } from "../redux/messagesSlice";
import { setPresence } from "../redux/friendsSlice";

export default function SocketProvider({ children }) {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.user.current);

  useEffect(() => {
    const socket = getSocket();

    // --- Messages ---
    const handleNewMessage = (msg) => {
      dispatch(
        appendMessage({
          threadId: msg.conversationId,
          message: msg,
          currentUserId: user?.id,
        })
      );
      if (String(msg.senderId) !== String(user?.id)) {
        dispatch(incrementUnread({ threadId: msg.conversationId }));
      }
    };

    onNewMessage(handleNewMessage);

    // --- Presence ---
    const handlePresence = (update) => {
      // update looks like: { userId: 7, online: true }
      dispatch(setPresence(update));
    };

    onPresenceUpdate(handlePresence);

    return () => {
      offNewMessage(handleNewMessage);
      offPresenceUpdate(handlePresence);
    };
  }, [dispatch, user?.id]);

  return children;
}
