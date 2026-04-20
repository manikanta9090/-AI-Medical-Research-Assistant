import { useState } from "react";
import InputBar from "@/components/common/InputBar";
import ChatSection from "./ChatSection";

export default function MainPanel({ 
  messages, 
  setMessages, 
  setConversations,
  activeChatId,
  setResearchData, 
  updateTitle, 
  updateContext,
  patientContext,
  isNewChat 
}) {
  const [loading, setLoading] = useState(false);

  const handleSend = async (input) => {
    if (!input.trim()) return;

    // Auto-title for new chat
    if (isNewChat && updateTitle) {
      const title = input.length > 25 ? input.substring(0, 25) + "..." : input;
      updateTitle(title);
    }

    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || "https://your-backend.onrender.com/api";
      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      const formattedText = `
Overview:
${data.overview || ""}

Insights:
${(data.insights || []).map(i => "- " + i).join("\n")}

Summary:
${data.summary || ""}

Suggestions:
${(data.suggestions || []).map(s => "- " + s).join("\n")}
`;

      // UPDATE ACTIVE CONVERSATION
      setConversations((prev) =>
        prev.map((chat) => {
          if (chat.id === activeChatId) {
            return {
              ...chat,
              messages: [
                ...(Array.isArray(chat.messages) ? chat.messages : []),
                { role: "user", content: input },
                { role: "assistant", content: formattedText },
              ],
            };
          }
          return chat;
        })
      );

      // KEEP RESEARCH PANEL WORKING
      setResearchData({
        publications: data.publications || [],
        trials: data.trials || [],
      });

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full text-white">

      <div className="h-14 flex items-center px-4 border-b border-gray-700">
        <h1 className="text-sm text-gray-400">
          AI Medical Research Assistant
        </h1>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        <ChatSection messages={messages} loading={loading} />
      </div>

      <InputBar onSend={handleSend} disabled={loading} />

    </div>
  );
}