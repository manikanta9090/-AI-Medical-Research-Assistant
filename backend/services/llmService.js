const axios = require('axios');

async function generateStructuredResponse(userQuery, publications, trials) {
  const publicationsText = publications
    .slice(0, 8)
    .map((pub, i) => `${i + 1}. "${pub.title}" (${pub.year}) - ${pub.source}`)
    .join('\n');

  const trialsText = trials
    .slice(0, 5)
    .map((trial, i) => `${i + 1}. "${trial.title}" - Status: ${trial.status}, Location: ${trial.location}`)
    .join('\n');

  const hasPublications = publications.length > 0;
  const hasTrials = trials.length > 0;

  const prompt = `You are a medical research assistant. Based on the user's query and retrieved research data, provide a structured response.

USER QUERY: ${userQuery}

${hasPublications ? `RETRIEVED PUBLICATIONS:\n${publicationsText}\n` : 'No publications found for this query.\n'}
${hasTrials ? `RETRIEVED CLINICAL TRIALS:\n${trialsText}\n` : 'No clinical trials found for this query.\n'}

Generate a response in JSON format with exactly this structure:
{
  "overview": "A 2-3 sentence summary of the research landscape for this query based on the retrieved data. If no data was found, provide a general overview based on your knowledge.",
  "insights": ["4-5 key findings or insights from the publications and trials. Each insight should be 1-2 sentences."],
  "summary": "A brief conclusion (1-2 sentences) about the current state of research in this area.",
  "suggestions": ["3-4 actionable next steps or areas for further research."]
}

IMPORTANT:
- Use the retrieved publications and trials to inform your response
- If no data was found, still provide helpful information based on your knowledge
- Keep insights grounded in the actual data when available
- Make insights actionable and specific to the query
- Output ONLY valid JSON, no other text`;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openrouter/auto',
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1500
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:5173',
          'X-Title': 'CuraMind AI'
        }
      }
    );

    const responseText = response.data.choices[0]?.message?.content || '';
    
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          overview: parsed.overview || 'No overview available',
          insights: Array.isArray(parsed.insights) ? parsed.insights : [],
          summary: parsed.summary || 'No summary available',
          suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : []
        };
      } catch (parseError) {
        console.error('JSON parse error:', parseError.message);
        return generateFallbackResponse(userQuery, publications, trials);
      }
    }
    
    return generateFallbackResponse(userQuery, publications, trials);

  } catch (error) {
    console.error('LLM API error:', error.message);
    return generateFallbackResponse(userQuery, publications, trials);
  }
}

function generateFallbackResponse(userQuery, publications, trials) {
  const pubCount = publications.length;
  const trialCount = trials.length;
  
  let overview = `Found ${pubCount} publication(s) and ${trialCount} clinical trial(s) related to "${userQuery}".`;
  
  if (pubCount === 0 && trialCount === 0) {
    overview = `No specific research data was found for "${userQuery}". However, this remains an active area of medical research.`;
  }

  const insights = [];
  
  if (publications.length > 0) {
    insights.push(`Retrieved ${publications.length} publication(s) from medical databases.`);
    const recentPubs = publications.filter(p => p.year && p.year >= new Date().getFullYear() - 2);
    if (recentPubs.length > 0) {
      insights.push(`${recentPubs.length} publication(s) from the last 2 years indicate active research in this area.`);
    }
  }
  
  if (trials.length > 0) {
    const recruitingTrials = trials.filter(t => t.status === 'RECRUITING');
    insights.push(`Found ${trials.length} clinical trial(s), ${recruitingTrials.length} currently recruiting participants.`);
  }

  if (insights.length === 0) {
    insights.push('Consider refining your search terms for more specific results.');
    insights.push('This topic may be emerging or have limited publicly available research.');
  }

  const summary = pubCount > 0 || trialCount > 0 
    ? `Research data indicates this is an active area with ${pubCount + trialCount} relevant sources.`
    : 'This medical topic requires more specific search terms for targeted results.';

  const suggestions = [
    'Try adding specific conditions or treatments to your query',
    'Search for specific drug names or medical procedures',
    'Explore related terms or synonyms',
    'Check clinicaltrials.gov directly for trial details'
  ];

  return {
    overview,
    insights: insights.slice(0, 4),
    summary,
    suggestions: suggestions.slice(0, 4)
  };
}

module.exports = {
  generateStructuredResponse
};