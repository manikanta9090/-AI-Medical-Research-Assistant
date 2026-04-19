import { BookOpen, FlaskConical, ExternalLink } from "lucide-react";

const PublicationCard = ({ pub }) => {
  if (!pub) return null;
  return (
    <a 
      href={pub.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="block p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors group"
    >
      <div className="flex items-start gap-3">
        <BookOpen className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white text-sm break-words group-hover:text-blue-400 transition-colors">
            {pub.title}
          </h3>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-gray-400 bg-gray-800/50 px-2 py-0.5 rounded">
              {pub.year || 'N/A'}
            </span>
            <span className="text-xs text-gray-500 truncate">
              {pub.source}
            </span>
          </div>
        </div>
        <ExternalLink className="w-4 h-4 text-gray-500 flex-shrink-0" />
      </div>
    </a>
  );
};

const TrialCard = ({ trial }) => {
  if (!trial) return null;
  
  const statusColors = {
    'RECRUITING': 'bg-green-500/20 text-green-400 border-green-500/30',
    'ACTIVE_NOT_RECRUITING': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'COMPLETED': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    'TERMINATED': 'bg-red-500/20 text-red-400 border-red-500/30',
    'UNKNOWN': 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  };
  
  return (
    <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
      <div className="flex items-start gap-3">
        <FlaskConical className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white text-sm break-words">
            {trial.title}
          </h3>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className={`text-xs px-2 py-0.5 rounded border ${statusColors[trial.status] || statusColors.UNKNOWN}`}>
              {trial.status || 'Unknown'}
            </span>
            <span className="text-xs text-gray-500">
              {trial.location || 'Location N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ResearchPanel({ data }) {
  const publications = data?.publications || [];
  const trials = data?.trials || [];
  
  const hasPublications = publications.length > 0;
  const hasTrials = trials.length > 0;
  
  if (!hasPublications && !hasTrials) {
    return (
      <div className="h-full flex flex-col overflow-hidden">
        <div className="flex-shrink-0 p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Research</h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-400 text-sm">No research data yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-shrink-0 p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white">Research</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {hasPublications && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-semibold text-gray-300">
                Publications ({publications.length})
              </h3>
            </div>
            <div className="space-y-2">
              {publications.map((pub, index) => (
                <PublicationCard key={index} pub={pub} />
              ))}
            </div>
          </div>
        )}

        {hasTrials && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-orange-400" />
              <h3 className="text-sm font-semibold text-gray-300">
                Clinical Trials ({trials.length})
              </h3>
            </div>
            <div className="space-y-2">
              {trials.map((trial, index) => (
                <TrialCard key={index} trial={trial} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}