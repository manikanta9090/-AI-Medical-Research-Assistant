const axios = require('axios');

const ESEARCH_URL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi';
const EFETCH_URL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi';

async function searchPubMed(query, limit = 30) {
  try {
    const searchResponse = await axios.get(ESEARCH_URL, {
      params: {
        db: 'pubmed',
        term: query,
        retmax: limit,
        sort: 'relevance',
        retmode: 'json'
      }
    });

    if (!searchResponse.data || !searchResponse.data.esearchresult || !searchResponse.data.esearchresult.idlist) {
      return [];
    }

    const idList = searchResponse.data.esearchresult.idlist;
    
    if (idList.length === 0) {
      return [];
    }

    const fetchResponse = await axios.get(EFETCH_URL, {
      params: {
        db: 'pubmed',
        id: idList.join(','),
        retmode: 'xml',
        rettype: 'abstract'
      }
    });

    const articles = parsePubMedXML(fetchResponse.data);
    return articles;

  } catch (error) {
    console.error('PubMed API error:', error.message);
    return [];
  }
}

function parsePubMedXML(xmlString) {
  const articles = [];
  
  try {
    const PubmedArticleSet = xmlString.match(/<PubmedArticleSet>([\s\S]*?)<\/PubmedArticleSet>/);
    if (!PubmedArticleSet) return articles;

    const articleMatches = PubmedArticleSet[1].match(/<PubmedArticle>([\s\S]*?)<\/PubmedArticle>/g);
    
    if (!articleMatches) return articles;

    for (const articleXml of articleMatches) {
      const article = extractArticleData(articleXml);
      if (article) {
        articles.push(article);
      }
    }
  } catch (error) {
    console.error('XML parsing error:', error.message);
  }

  return articles;
}

function extractArticleData(articleXml) {
  try {
    const titleMatch = articleXml.match(/<ArticleTitle>([^<]+)<\/ArticleTitle>/);
    const title = titleMatch ? titleMatch[1].trim() : 'Untitled';

    const pubDateMatch = articleXml.match(/<PubDate>[\s\S]*?<Year>(\d{4})<\/Year>[\s\S]*?<\/PubDate>/);
    const year = pubDateMatch ? pubDateMatch[1] : 'N/A';

    const sourceMatch = articleXml.match(/<Journal>[\s\S]*?<Title>([^<]+)<\/Title>[\s\S]*?<\/Journal>/);
    const source = sourceMatch ? sourceMatch[1].trim() : 'PubMed';

    const abstractMatch = articleXml.match(/<Abstract>([\s\S]*?)<\/Abstract>/);
    let abstract = '';
    if (abstractMatch) {
      const abstractTexts = abstractMatch[1].match(/<AbstractText[^>]*>([^<]+)<\/AbstractText>/g);
      if (abstractTexts) {
        abstract = abstractTexts.map(t => t.replace(/<[^>]+>/g, '').trim()).join(' ').substring(0, 300);
      }
    }

    const pmidMatch = articleXml.match(/<PMID[^>]*>([^<]+)<\/PMID>/);
    const pmid = pmidMatch ? pmidMatch[1] : '';

    const doiMatch = articleXml.match(/<ELocationID[^>]*doi="([^"]+)"[^>]*>/);
    const doi = doiMatch ? doiMatch[1] : '';

    const authorsMatch = articleXml.match(/<AuthorList[^>]*>([\s\S]*?)<\/AuthorList>/);
    let authors = [];
    if (authorsMatch) {
      const authorNames = authorsMatch[1].match(/<LastName>([^<]+)<\/LastName>/g);
      if (authorNames) {
        authors = authorNames.map(a => a.replace(/<[^>]+>/g, '').trim()).slice(0, 3);
      }
    }

    return {
      id: pmid,
      title,
      year,
      source,
      url: doi ? `https://doi.org/${doi}` : `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`,
      authors,
      abstract: abstract.substring(0, 200),
      citationCount: 0
    };
  } catch (error) {
    return null;
  }
}

module.exports = {
  searchPubMed
};