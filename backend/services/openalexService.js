const axios = require('axios');

const OPENALEX_API_BASE = 'https://api.openalex.org/works';

async function searchOpenAlex(query, limit = 50) {
  try {
    const response = await axios.get(OPENALEX_API_BASE, {
      params: {
        search: query,
        per_page: limit,
        sort: 'relevance_score:desc'
      },
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.data || !response.data.results) {
      return [];
    }

    return response.data.results.map(work => ({
      id: work.id,
      title: work.title || 'Untitled',
      year: work.publication_year || work.created_date?.split('-')[0] || 'N/A',
      source: work.host_venue?.display_name || work.primary_location?.source?.display_name || 'OpenAlex',
      url: work.doi || work.id || '',
      authors: work.authhips?.map(a => a.author?.display_name).filter(Boolean).slice(0, 3) || [],
      abstract: work.abstract_inverted_index ? null : work.biblio?.first_page,
      citationCount: work.cited_by_count || 0,
      relevanceScore: work.relevance_score || 0
    })).filter(work => work.title !== 'Untitled');

  } catch (error) {
    console.error('OpenAlex API error:', error.message);
    return [];
  }
}

async function getPaperDetails(workId) {
  try {
    const response = await axios.get(`${OPENALEX_API_BASE}/${workId}`, {
      headers: {
        'Accept': 'application/json'
      }
    });

    const work = response.data;
    return {
      id: work.id,
      title: work.title,
      year: work.publication_year,
      source: work.host_venue?.display_name || 'OpenAlex',
      url: work.doi,
      authors: work.authhips?.map(a => a.author?.display_name).filter(Boolean),
      abstract: work.abstract,
      citationCount: work.cited_by_count
    };
  } catch (error) {
    console.error('OpenAlex getDetails error:', error.message);
    return null;
  }
}

module.exports = {
  searchOpenAlex,
  getPaperDetails
};