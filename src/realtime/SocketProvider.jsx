// src/realtime/SocketProvider.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { onNewMessage, offNewMessage } from "./socketClient";
import { appendMessage } from "../redux/messagesSlice";

export default function SocketProvider({ children }) {
  const dispatch = useDispatch();
  const activeThread = useSelector((s) => s.messages.activeThread);

  useEffect(() => {
    const handler = (msg) => {
      dispatch(appendMessage({ threadId: msg.conversationId, message: msg }));

      // 🔹 Later: add unread badge support
      if (String(activeThread) !== String(msg.conversationId)) {
        // dispatch(markUnread(msg.conversationId));
      }
    };

    onNewMessage(handler);
    return () => offNewMessage(handler);
  }, [dispatch, activeThread]);

  return children;
}
