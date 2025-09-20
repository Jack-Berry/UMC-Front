// src/components/ChatWindow.jsx
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessagesThunk, sendMessageThunk } from "../redux/messagesSlice";
import {
  connectSocket,
  joinThread,
  leaveThread,
  onNewMessage,
  offNewMessage,
} from "../realtime/socketClient";

const ChatWindow = ({ threadId }) => {
  const dispatch = useDispatch();

  const messages = useSelector(
    (state) => state.messages.messagesByThread[threadId] || []
  );
  const loading = useSelector((state) => state.messages.loadingMessages);

  // 🔹 Current logged-in user
  const currentUser = useSelector((state) => state.user.current);
  const userId = currentUser?.id;

  const [newText, setNewText] = useState("");
  const messagesEndRef = useRef();

  // Fetch initial messages
  useEffect(() => {
    if (threadId) {
      dispatch(fetchMessagesThunk(threadId));
    }
  }, [dispatch, threadId]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🔹 Setup socket listeners
  useEffect(() => {
    if (!threadId) return;
    connectSocket();
    joinThread(threadId);

    const handleIncoming = (msg) => {
      if (String(msg.conversationId) === String(threadId)) {
        // Push directly into Redux state by refetch or append
        dispatch({
          type: "messages/appendMessage",
          payload: { threadId, message: msg },
        });
      }
    };

    onNewMessage(handleIncoming);

    return () => {
      offNewMessage(handleIncoming);
      leaveThread(threadId);
    };
  }, [threadId, dispatch]);

  const handleSend = () => {
    if (!newText.trim()) return;
    dispatch(sendMessageThunk({ threadId, text: newText.trim() }));
    setNewText("");
  };

  return (
    <div className="chat-window-inner flex flex-col h-full bg-neutral-900 text-white">
      {/* Messages */}
      <div className="messages-list flex-grow overflow-auto p-2 space-y-2">
        {loading && <div className="text-gray-400">Loading…</div>}
        {messages.map((m) => (
          <div
            key={m.id}
            className={`message-item max-w-[75%] px-3 py-2 rounded-lg ${
              m.senderId === userId
                ? "ml-auto bg-blue-600 text-white text-right"
                : "mr-auto bg-gray-700 text-gray-100"
            }`}
          >
            <div className="text-sm">{m.text}</div>
            <div className="timestamp text-xs text-gray-400 mt-1">
              {new Date(m.createdAt).toLocaleTimeString()}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="send-controls p-2 border-t border-gray-700 bg-neutral-800">
        <textarea
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          className="w-full border rounded p-2 bg-neutral-700 text-white resize-none"
          rows={2}
          placeholder="Type your message…"
        />
        <button
          onClick={handleSend}
          className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded shadow"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
