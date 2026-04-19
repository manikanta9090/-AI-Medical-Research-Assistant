const express = require('express');
const router = express.Router();
require('dotenv').config();

const { getSearchTerms, expandQuery } = require('../utils/queryExpander');
const { searchOpenAlex } = require('../services/openalexService');
const { searchPubMed } = require('../services/pubmedService');
const { searchClinicalTrials } = require('../services/clinicalTrialsService');
const { combineAndDeduplicate } = require('../services/rankingService');
const { generateStructuredResponse } = require('../services/llmService');

router.post('/chat', async (req, res) => {
  try {
    const { message, disease } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log('=== Processing query:', message);

    const searchTerms = getSearchTerms(message, disease);
    console.log('Search terms:', searchTerms);

    const [openalexPubs, pubmedPubs, trials] = await Promise.all([
      searchOpenAlex(searchTerms.primary, 50).catch(err => {
        console.error('OpenAlex error:', err.message);
        return [];
      }),
      searchPubMed(searchTerms.primary, 30).catch(err => {
        console.error('PubMed error:', err.message);
        return [];
      }),
      searchClinicalTrials(message, 20).catch(err => {
        console.error('ClinicalTrials error:', err.message);
        return [];
      })
    ]);

    console.log('Results: OpenAlex:', openalexPubs.length, 'PubMed:', pubmedPubs.length, 'Trials:', trials.length);

    const allPublications = [...openalexPubs, ...pubmedPubs];
    const { publications: rankedPublications, trials: rankedTrials } = combineAndDeduplicate(
      allPublications,
      trials,
      message
    );

    // FILTER TO TOP 6-8
    const topPublications = rankedPublications.slice(0, 8);
    const topTrials = rankedTrials.slice(0, 5);

    console.log('Ranked: Publications:', rankedPublications.length, 'Trials:', rankedTrials.length);
    console.log('Top results: Publications:', topPublications.length, 'Trials:', topTrials.length);

    // UPDATE OVERVIEW WITH COUNT
    const overviewText = `Found ${allPublications.length} publications and ${trials.length} clinical trials. Showing top ${topPublications.length} publications and ${topTrials.length} trials.`;

    const llmResponse = await generateStructuredResponse(
      message,
      topPublications,
      topTrials
    );

    const response = {
      overview: llmResponse.overview || overviewText,
      insights: llmResponse.insights,
      summary: llmResponse.summary,
      suggestions: llmResponse.suggestions,
      publications: topPublications.map(pub => ({
        title: pub.title,
        year: pub.year,
        source: pub.source,
        url: pub.url
      })),
      trials: topTrials.map(trial => ({
        title: trial.title,
        status: trial.status,
        location: trial.location || trial.country
      }))
    };

    console.log('=== Response generated successfully');
    res.json(response);

  } catch (error) {
    console.error('Chat route error:', error.message);
    res.json({
      overview: "Unable to process request",
      insights: ["Technical issue occurred"],
      summary: "Please try again",
      suggestions: ["Retry the request"],
      publications: [],
      trials: []
    });
  }
});

router.post('/search', async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const [openalexPubs, pubmedPubs, trials] = await Promise.all([
      searchOpenAlex(query, 15),
      searchPubMed(query, 15),
      searchClinicalTrials(query, 10)
    ]);

    const allPublications = [...openalexPubs, ...pubmedPubs];
    const { publications, trials: rankedTrials } = combineAndDeduplicate(
      allPublications,
      trials,
      query
    );

    res.json({
      publications: publications.map(pub => ({
        title: pub.title,
        year: pub.year,
        source: pub.source,
        url: pub.url
      })),
      trials: rankedTrials.map(trial => ({
        title: trial.title,
        status: trial.status,
        location: trial.location
      }))
    });

  } catch (error) {
    console.error('Search error:', error.message);
    res.status(500).json({ error: 'Search failed' });
  }
});

module.exports = router;