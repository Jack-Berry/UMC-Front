// src/api/messages.js
import apiFetch from "./apiClient";

// Fetch all conversation threads
export function fetchThreads() {
  return apiFetch("/api/conversations", {
    method: "GET",
  });
}

// Fetch messages in a conversation
export function fetchMessages(conversationId) {
  return apiFetch(`/api/conversations/${conversationId}/messages`, {
    method: "GET",
  });
}

// Send a message
export function sendMessage(conversationId, text) {
  return apiFetch(`/api/conversations/${conversationId}/messages`, {
    method: "POST",
    body: { text },
  });
}
