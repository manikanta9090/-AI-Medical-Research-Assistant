import { useState, useEffect } from "react";
import MainPanel from "../components/main/MainPanel";
import ResearchPanel from "../components/research/ResearchPanel";
import Sidebar from "../components/sidebar/Sidebar";

const STORAGE_KEY = "curamind-conversations";

const createNewChat = () => ({
  id: Date.now().toString(),
  title: "New Chat",
  messages: [],
  context: ""
});

export default function Home() {
  const [conversations, setConversations] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [researchData, setResearchData] = useState({});
  const [patientContext, setPatientContext] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) {
          setConversations(parsed);
          setCurrentChatId(parsed[0].id);
        } else {
          const newChat = createNewChat();
          setConversations([newChat]);
          setCurrentChatId(newChat.id);
        }
      } catch (e) {
        const newChat = createNewChat();
        setConversations([newChat]);
        setCurrentChatId(newChat.id);
      }
    } else {
      const newChat = createNewChat();
      setConversations([newChat]);
      setCurrentChatId(newChat.id);
    }
  }, []);

  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    }
  }, [conversations]);

  const currentConversation = conversations.find(c => c.id === currentChatId);
  const messages = currentConversation?.messages || [];

  const handleNewChat = () => {
    const newChat = createNewChat();
    setConversations(prev => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
    setResearchData({});
  };

  const handleSelectChat = (chatId) => {
    setCurrentChatId(chatId);
    const chat = conversations.find(c => c.id === chatId);
    setResearchData({});
  };

  const updateCurrentMessages = (newMessages) => {
    setConversations(prev => 
      prev.map(chat => 
        chat.id === currentChatId 
          ? { ...chat, messages: newMessages }
          : chat
      )
    );
  };

  const updateChatTitle = (title) => {
    setConversations(prev => 
      prev.map(chat => 
        chat.id === currentChatId 
          ? { ...chat, title } 
          : chat
      )
    );
  };

  const updateContext = (context) => {
    setConversations(prev => 
      prev.map(chat => 
        chat.id === currentChatId 
          ? { ...chat, context } 
          : chat
      )
    );
  };

  const handlePatientContextSave = (context) => {
    setPatientContext(context);
  };

  return (
    <div className="flex h-screen w-screen bg-black overflow-hidden">
      {/* Sidebar */}
      <div className="w-[250px] flex-shrink-0 h-full overflow-hidden border-r border-gray-700">
        <Sidebar 
          conversations={conversations}
          currentChatId={currentChatId}
          onNewChat={handleNewChat}
          onSelectChat={handleSelectChat}
          onContextSave={handlePatientContextSave}
        />
      </div>

      {/* Main Chat Panel */}
      <div className="flex-1 h-full min-w-0 flex flex-col overflow-hidden">
        <MainPanel
          messages={messages}
          setMessages={updateCurrentMessages}
          setConversations={setConversations}
          activeChatId={currentChatId}
          setResearchData={setResearchData}
          updateTitle={updateChatTitle}
          updateContext={updateContext}
          patientContext={patientContext}
          isNewChat={messages.length === 0}
        />
      </div>

      {/* Research Panel */}
      <div className="w-80 flex-shrink-0 h-full overflow-hidden border-l border-gray-700">
        <ResearchPanel data={researchData} />
      </div>
    </div>
  );
}