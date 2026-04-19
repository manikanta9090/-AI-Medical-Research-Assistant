import { useEffect, useRef } from "react";
import {
  UserBubble,
  AssistantBubble,
  StreamingBubble,
  LoadingBubble,
} from "./MessageBubble";

export default function ChatSection({ messages = [], loading }) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  if (!Array.isArray(messages)) return null;

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      {messages.length === 0 && (
        <p className="text-gray-400 text-center">
          Start a conversation
        </p>
      )}

      {messages.map((msg, index) => {
        if (!msg) return null;

        if (msg.role === "user") {
          return <UserBubble key={index} content={msg.content} />;
        }

        if (msg.role === "assistant" && msg.content && !msg.data) {
          return <StreamingBubble key={index} content={msg.content} />;
        }

        if (msg.role === "assistant" && msg.data) {
          return <AssistantBubble key={index} data={msg.data} />;
        }

        if (msg.role === "assistant" && msg.content && msg.data) {
          return <StreamingBubble key={index} content={msg.content} />;
        }

        return null;
      })}

      {loading && <LoadingBubble />}

      <div ref={endRef} />
    </div>
  );
}