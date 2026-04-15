import { useState } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import MainPanel from "../components/main/MainPanel";
import ResearchPanel from "../components/research/ResearchPanel";

const Home = () => {
  const [messages, setMessages] = useState([]);
  const [researchData, setResearchData] = useState([]);

  return (
    <div className="flex h-screen bg-black text-white">

      <div className="w-64 border-r border-gray-700">
        <Sidebar />
      </div>

      <div className="flex-1">
        <MainPanel
          messages={messages}
          setMessages={setMessages}
          setResearchData={setResearchData}
        />
      </div>

      <div className="w-80 border-l border-gray-700">
        <ResearchPanel data={researchData} />
      </div>

    </div>
  );
};

export default Home;