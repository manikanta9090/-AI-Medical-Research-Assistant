import InputBar from "@/components/common/InputBar";
import ChatSection from "./ChatSection";

export default function MainPanel({ messages, setMessages, setResearchData }) {
  const handleSend = async (input) => {
    setMessages((prev) => [...prev, { role: "user", content: input }]);

    // TEMP: Dummy structured response
    const dummyResponse = {
      overview: `Research results for "${input}"`,
      insights: [
        "Immunotherapy improves survival",
        "Targeted therapy is effective",
      ],
      summary: "Latest studies show strong progress.",
      suggestions: ["More trials", "New drugs"],
    };

    // Add assistant message
    setMessages((prev) => [
      ...prev,
      { role: "assistant", data: dummyResponse },
    ]);

    // 🔥 THIS IS IMPORTANT
    setResearchData([
      {
        title: "Sample Research Paper",
        year: 2024,
        summary: "Important findings on treatment",
      },
    ]);
  };

  return (
    <div className="flex flex-col h-full">

      <div className="flex-1 overflow-hidden">
        <ChatSection messages={messages} />
      </div>

      <InputBar onSend={handleSend} />
    </div>
  );
}