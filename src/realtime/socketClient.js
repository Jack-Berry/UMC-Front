// src/realtime/socketClient.js
import { io } from "socket.io-client";

const API_BASE =
  (import.meta.env.VITE_API_URL &&
    import.meta.env.VITE_API_URL.replace(/\/+$/, "")) ||
  "http://localhost:5000";

// Singleton socket instance
let socket;

export function connectSocket() {
  if (!socket) {
    socket = io(API_BASE, {
      transports: ["polling"], // prefer WS
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 500,
      // not enforced server-side yet, but future-proof:
      auth: { token: localStorage.getItem("accessToken") || "" },
    });

    socket.on("connect", () => console.log("socket connected:", socket.id));
    socket.on("disconnect", (reason) =>
      console.log("socket disconnected:", reason)
    );
    socket.on("connect_error", (err) =>
      console.warn("socket connect error:", err?.message || err)
    );
  }
  return socket;
}

export function getSocket() {
  return socket || connectSocket();
}

export function joinThread(threadId) {
  getSocket().emit("joinThread", String(threadId));
}

export function leaveThread(threadId) {
  getSocket().emit("leaveThread", String(threadId));
}

export function onNewMessage(handler) {
  getSocket().on("newMessage", handler);
}

export function offNewMessage(handler) {
  getSocket().off("newMessage", handler);
}

export function onPresenceUpdate(handler) {
  getSocket().on("presenceUpdate", handler);
}

export function offPresenceUpdate(handler) {
  getSocket().off("presenceUpdate", handler);
}

// Optional: ask backend for full presence map
export function requestPresence(ids = []) {
  getSocket().emit("requestPresence", { ids });
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = undefined;
  }
}
