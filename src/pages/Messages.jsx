// src/pages/Messages.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMessages,
  fetchThreads,
  sendMessage,
  setActiveThread,
  appendMessage,
} from "../redux/messagesSlice";
import {
  connectSocket,
  joinThread,
  leaveThread,
  onNewMessage,
  offNewMessage,
} from "../realtime/socketClient";

export default function Messages() {
  const dispatch = useDispatch();
  const { threads, activeThread } = useSelector((s) => s.messages);
  const user = useSelector((s) => s.user.current);
  const [text, setText] = useState("");

  const currentThread = threads.find((t) => t.id === activeThread);

  // 🔹 Fetch all threads on mount (so refresh works)
  useEffect(() => {
    dispatch(fetchThreads());
  }, [dispatch]);

  // 🔹 Handle socket + message sync
  useEffect(() => {
    if (activeThread) {
      dispatch(fetchMessages(activeThread));

      connectSocket();
      joinThread(activeThread);

      const handleIncoming = (msg) => {
        if (String(msg.conversationId) === String(activeThread)) {
          dispatch(appendMessage({ threadId: activeThread, message: msg }));
        }
      };

      onNewMessage(handleIncoming);

      return () => {
        offNewMessage(handleIncoming);
        leaveThread(activeThread);
      };
    }
  }, [activeThread, dispatch]);

  const handleSend = () => {
    if (text.trim()) {
      dispatch(sendMessage({ threadId: activeThread, text }));
      setText("");
    }
  };

  return (
    <div className="flex flex-col h-full bg-neutral-900 text-white p-4">
      {/* Thread Selector */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {threads.map((t) => (
          <button
            key={t.id}
            onClick={() => dispatch(setActiveThread(t.id))}
            className={`px-3 py-1 rounded ${
              activeThread === t.id
                ? "bg-brand-600 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            Thread {t.id}
          </button>
        ))}
      </div>

      {/* Chat Window */}
      <div className="flex-1 overflow-y-auto border border-gray-700 rounded p-2 mb-3 bg-neutral-800">
        {currentThread ? (
          currentThread.messages.length > 0 ? (
            currentThread.messages.map((m) => (
              <div
                key={m.id}
                className={`mb-2 p-2 rounded max-w-[70%] ${
                  m.senderId === user?.id
                    ? "bg-brand-600 ml-auto text-right"
                    : "bg-gray-700"
                }`}
              >
                <p className="text-sm">{m.text}</p>
                <span className="block text-xs text-gray-400">
                  {m.createdAt
                    ? new Date(m.createdAt).toLocaleTimeString()
                    : ""}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No messages yet.</p>
          )
        ) : (
          <p className="text-gray-400">Select a thread to start chatting.</p>
        )}
      </div>

      {/* Input */}
      {currentThread && (
        <div className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 rounded px-3 py-2 bg-gray-700 text-white focus:outline-none"
            placeholder="Type a message..."
          />
          <button
            onClick={handleSend}
            className="bg-brand-600 hover:bg-brand-500 px-4 py-2 rounded"
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
}
