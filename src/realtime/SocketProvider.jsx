import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSocket, onNewMessage, offNewMessage } from "./socketClient";
import { appendMessage, incrementUnread } from "../redux/messagesSlice";

export default function SocketProvider({ children }) {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.user.current);

  useEffect(() => {
    const socket = getSocket();

    const handleNewMessage = (msg) => {
      dispatch(
        appendMessage({
          threadId: msg.conversationId,
          message: msg,
          currentUserId: user?.id,
        })
      );

      // ✅ Only increment unread if it’s from another user
      if (String(msg.senderId) !== String(user?.id)) {
        dispatch(incrementUnread({ threadId: msg.conversationId }));
      }
    };

    onNewMessage(handleNewMessage);
    return () => offNewMessage(handleNewMessage);
  }, [dispatch, user?.id]);

  return children;
}
