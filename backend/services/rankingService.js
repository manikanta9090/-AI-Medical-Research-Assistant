function rankPublications(publications, query) {
  const queryTerms = query.toLowerCase().split(/\s+/);
  
  const scored = publications.map(pub => {
    let score = 0;
    const titleLower = (pub.title || '').toLowerCase();
    const sourceLower = (pub.source || '').toLowerCase();
    
    for (const term of queryTerms) {
      if (titleLower.includes(term)) {
        score += 10;
      }
      if (sourceLower.includes(term)) {
        score += 2;
      }
    }
    
    if (pub.citationCount && pub.citationCount > 0) {
      score += Math.min(Math.log10(pub.citationCount + 1) * 2, 10);
    }
    
    if (pub.year && !isNaN(pub.year) && pub.year >= new Date().getFullYear() - 3) {
      score += 3;
    }
    
    return { ...pub, relevanceScore: score };
  });
  
  return scored
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 8);
}

function rankTrials(trials, query) {
  const queryTerms = query.toLowerCase().split(/\s+/);
  
  const statusPriority = {
    'RECRUITING': 4,
    'ACTIVE_NOT_RECRUITING': 3,
    'COMPLETED': 2,
    'TERMINATED': 1,
    'UNKNOWN': 0
  };
  
  const scored = trials.map(trial => {
    let score = 0;
    const titleLower = (trial.title || '').toLowerCase();
    
    for (const term of queryTerms) {
      if (titleLower.includes(term)) {
        score += 10;
      }
    }
    
    score += statusPriority[trial.status] || 0;
    
    return { ...trial, relevanceScore: score };
  });
  
  return scored
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 5);
}

function combineAndDeduplicate(publications, trials, query) {
  const rankedPubs = rankPublications(publications, query);
  const rankedTrials = rankTrials(trials, query);
  
  const pubTitles = new Set();
  const uniquePublications = rankedPubs.filter(pub => {
    const normalizedTitle = pub.title.toLowerCase().trim();
    if (pubTitles.has(normalizedTitle)) {
      return false;
    }
    pubTitles.add(normalizedTitle);
    return true;
  });
  
  return {
    publications: uniquePublications,
    trials: rankedTrials
  };
}

module.exports = {
  rankPublications,
  rankTrials,
  combineAndDeduplicate
};