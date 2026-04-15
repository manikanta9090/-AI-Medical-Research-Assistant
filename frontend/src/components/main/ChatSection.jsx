import React, { useEffect, useRef } from "react";
import { FileText, Lightbulb, MessageSquare, ChevronRight } from "lucide-react";

/* ===========================
   UI COMPONENTS
=========================== */

const OverviewCard = ({ content }) => (
  <div className="bg-white/5 border border-white/10 rounded-xl p-5">
    <div className="flex items-center gap-2 mb-3">
      <FileText className="w-5 h-5 text-blue-400" />
      <h3 className="text-lg font-semibold">Overview</h3>
    </div>
    <p className="text-gray-300">{content}</p>
  </div>
);

const InsightCard = ({ value }) => (
  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
    <div className="flex items-center gap-2 mb-2">
      <Lightbulb className="w-4 h-4 text-yellow-400" />
      <span className="text-sm text-gray-400">Insight</span>
    </div>
    <p className="text-white">{value}</p>
  </div>
);

const SummaryCard = ({ content }) => (
  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-5">
    <h3 className="font-semibold mb-2">Summary</h3>
    <p className="text-gray-300 text-sm">{content}</p>
  </div>
);

const SuggestionButton = ({ text }) => (
  <button className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-white/10">
    <ChevronRight className="w-4 h-4" />
    {text}
  </button>
);

/* ===========================
   STRUCTURED RESPONSE
=========================== */

const StructuredResponse = ({ data }) => {
  return (
    <div className="space-y-6 max-w-3xl">

      <OverviewCard content={data.overview} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.insights.map((item, i) => (
          <InsightCard key={i} value={item} />
        ))}
      </div>

      <SummaryCard content={data.summary} />

      <div className="flex flex-wrap gap-2">
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <MessageSquare className="w-4 h-4" />
          Suggested:
        </div>
        {data.suggestions.map((s, i) => (
          <SuggestionButton key={i} text={s} />
        ))}
      </div>

    </div>
  );
};

/* ===========================
   MESSAGE COMPONENTS
=========================== */

const UserMessage = ({ content }) => (
  <div className="flex justify-end">
    <div className="bg-blue-600 text-white px-4 py-2 rounded-xl max-w-[70%]">
      {content}
    </div>
  </div>
);

const AssistantMessage = ({ data }) => (
  <div className="flex justify-start">
    <StructuredResponse data={data} />
  </div>
);

/* ===========================
   MAIN CHAT SECTION
=========================== */

const ChatSection = ({ messages }) => {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const showWelcome = messages.length === 0;

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">

      {showWelcome && (
        <div className="text-center">
          <p className="text-xl font-semibold">CuraMind AI</p>
          <p className="text-gray-400 text-sm">
            AI Medical Research Assistant
          </p>
        </div>
      )}

      {messages.map((msg, index) => (
        <div key={index}>
          {msg.role === "user" ? (
            <UserMessage content={msg.content} />
          ) : msg.data ? (
            <AssistantMessage data={msg.data} />
          ) : null}
        </div>
      ))}

      <div ref={endRef} />
    </div>
  );
};

export default ChatSection;