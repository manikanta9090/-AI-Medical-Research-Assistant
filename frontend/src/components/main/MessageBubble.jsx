import { FileText, Lightbulb, ChevronRight, BookOpen, FlaskConical } from "lucide-react";

const OverviewCard = ({ content }) => {
  if (!content) return null;
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <FileText className="w-4 h-4 text-blue-400" />
        <h3 className="text-sm font-semibold text-white">Overview</h3>
      </div>
      <p className="text-gray-300 text-sm break-words">{content}</p>
    </div>
  );
};

const InsightCard = ({ value }) => {
  if (!value) return null;
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-3">
      <div className="flex items-center gap-2 mb-1">
        <Lightbulb className="w-3 h-3 text-yellow-400" />
        <span className="text-xs text-gray-400">Insight</span>
      </div>
      <p className="text-white text-sm break-words">{value}</p>
    </div>
  );
};

const SummaryCard = ({ content }) => {
  if (!content) return null;
  return (
    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
      <h3 className="text-xs font-semibold text-gray-300 mb-1">Summary</h3>
      <p className="text-gray-400 text-xs break-words">{content}</p>
    </div>
  );
};

const SuggestionButton = ({ text }) => {
  if (!text) return null;
  return (
    <button className="flex items-center gap-1 px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-xs hover:bg-white/10 text-gray-300 break-words max-w-full">
      <ChevronRight className="w-3 h-3 flex-shrink-0" />
      <span className="truncate">{text}</span>
    </button>
  );
};

const PublicationItem = ({ pub }) => {
  if (!pub) return null;
  return (
    <a 
      href={pub.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="block p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
    >
      <p className="text-white text-xs font-medium truncate">{pub.title}</p>
      <p className="text-gray-500 text-xs mt-1">
        {pub.year} • {pub.source}
      </p>
    </a>
  );
};

const TrialItem = ({ trial }) => {
  if (!trial) return null;
  
  const statusColors = {
    'RECRUITING': 'bg-green-500/20 text-green-400',
    'ACTIVE_NOT_RECRUITING': 'bg-blue-500/20 text-blue-400',
    'COMPLETED': 'bg-gray-500/20 text-gray-400',
    'TERMINATED': 'bg-red-500/20 text-red-400',
    'UNKNOWN': 'bg-gray-500/20 text-gray-400'
  };
  
  return (
    <div className="p-2 bg-white/5 border border-white/10 rounded-lg">
      <p className="text-white text-xs font-medium truncate">{trial.title}</p>
      <div className="flex items-center gap-2 mt-1">
        <span className={`text-xs px-1.5 py-0.5 rounded ${statusColors[trial.status] || statusColors.UNKNOWN}`}>
          {trial.status || 'Unknown'}
        </span>
        <span className="text-gray-500 text-xs truncate">
          {trial.location || 'Location N/A'}
        </span>
      </div>
    </div>
  );
};

const PublicationsSection = ({ publications }) => {
  if (!publications || publications.length === 0) return null;
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-purple-400" />
        <span className="text-xs text-gray-400">Publications ({publications.length})</span>
      </div>
      <div className="grid grid-cols-1 gap-2">
        {publications.slice(0, 5).map((pub, i) => (
          <PublicationItem key={i} pub={pub} />
        ))}
      </div>
    </div>
  );
};

const TrialsSection = ({ trials }) => {
  if (!trials || trials.length === 0) return null;
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <FlaskConical className="w-4 h-4 text-orange-400" />
        <span className="text-xs text-gray-400">Clinical Trials ({trials.length})</span>
      </div>
      <div className="grid grid-cols-1 gap-2">
        {trials.slice(0, 3).map((trial, i) => (
          <TrialItem key={i} trial={trial} />
        ))}
      </div>
    </div>
  );
};

const StructuredResponse = ({ data }) => {
  if (!data || typeof data !== "object") {
    return (
      <div className="bg-white/5 border border-white/10 rounded-xl p-4 max-w-[90%] sm:max-w-xl">
        <p className="text-gray-400 text-sm">No response data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-w-[90%] sm:max-w-xl">
      {data.overview && <OverviewCard content={data.overview} />}
      
      {data.insights && Array.isArray(data.insights) && data.insights.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {data.insights.map((item, i) => (
            <InsightCard key={i} value={item} />
          ))}
        </div>
      )}

      {data.summary && <SummaryCard content={data.summary} />}

      {data.publications && data.publications.length > 0 && (
        <PublicationsSection publications={data.publications} />
      )}

      {data.trials && data.trials.length > 0 && (
        <TrialsSection trials={data.trials} />
      )}

      {data.suggestions && Array.isArray(data.suggestions) && data.suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-gray-500">Suggested:</span>
          {data.suggestions.map((s, i) => (
            <SuggestionButton key={i} text={s} />
          ))}
        </div>
      )}
    </div>
  );
};

export const StreamingBubble = ({ content }) => {
  return (
    <div className="flex justify-start">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 max-w-[90%] sm:max-w-xl">
        <p className="text-gray-300 text-sm whitespace-pre-wrap break-words">
          {content || ""}
        </p>
        <span className="inline-block w-2 h-4 bg-blue-400 animate-pulse ml-0.5" />
      </div>
    </div>
  );
};

export const UserBubble = ({ content }) => {
  return (
    <div className="flex justify-end">
      <div className="bg-blue-600 text-white px-4 py-2.5 rounded-2xl max-w-[70%] text-sm shadow-sm break-words">
        {content || ""}
      </div>
    </div>
  );
};

export const AssistantBubble = ({ data }) => {
  return (
    <div className="flex justify-start">
      <StructuredResponse data={data} />
    </div>
  );
};

export const LoadingBubble = () => (
  <div className="flex justify-start">
    <div className="bg-gray-800/50 border border-gray-700 px-4 py-3 rounded-2xl">
      <div className="flex items-center gap-2">
        <span className="text-gray-400 text-sm">Thinking</span>
        <span className="flex gap-1">
          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </span>
      </div>
    </div>
  </div>
);