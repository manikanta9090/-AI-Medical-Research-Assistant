const diseaseSynonyms = {
  'diabetes': ['type 2 diabetes', 'type 1 diabetes', 'diabetes mellitus', 'hyperglycemia'],
  'cancer': ['oncology', 'malignant', 'carcinoma', 'tumor', 'neoplasm'],
  'depression': ['major depressive disorder', 'MDD', 'mental health', 'mood disorder'],
  'anxiety': ['anxiety disorder', 'GAD', 'panic disorder', 'stress'],
  'alzheimer': ['AD', 'dementia', 'cognitive decline', 'neurodegenerative'],
  'parkinson': ['PD', 'movement disorder', 'neurodegenerative disease'],
  'heart': ['cardiovascular', 'cardiac', 'coronary artery disease', 'heart disease'],
  'hypertension': ['high blood pressure', 'elevated blood pressure', 'BP'],
  'asthma': ['bronchial asthma', 'respiratory', 'airway inflammation'],
  'arthritis': ['rheumatoid arthritis', 'osteoarthritis', 'joint inflammation'],
  'hiv': ['HIV/AIDS', 'human immunodeficiency virus', 'AIDS'],
  'tb': ['tuberculosis', 'pulmonary tuberculosis'],
  'covid': ['COVID-19', 'SARS-CoV-2', 'coronavirus'],
  'flu': ['influenza', 'seasonal flu', 'viral infection'],
  'pneumonia': ['lung infection', 'respiratory infection'],
  'stroke': ['cerebrovascular accident', 'CVA', 'brain attack'],
  'epilepsy': ['seizure disorder', 'epileptic'],
  'ms': ['multiple sclerosis', 'demyelinating disease'],
  'lupus': ['systemic lupus erythematosus', 'SLE', 'autoimmune'],
  'thyroid': ['hypothyroidism', 'hyperthyroidism', 'thyroid disease']
};

function extractDiseaseTerms(userInput) {
  const inputLower = userInput.toLowerCase();
  const foundDiseases = [];
  
  for (const [disease, synonyms] of Object.entries(diseaseSynonyms)) {
    if (inputLower.includes(disease)) {
      foundDiseases.push(disease);
    }
    for (const synonym of synonyms) {
      if (inputLower.includes(synonym)) {
        if (!foundDiseases.includes(disease)) {
          foundDiseases.push(disease);
        }
      }
    }
  }
  
  return foundDiseases;
}

function expandQuery(userInput, disease = null) {
  const expandedTerms = [userInput];
  
  const extractedDiseases = disease ? [disease] : extractDiseaseTerms(userInput);
  
  if (extractedDiseases.length > 0) {
    for (const disease of extractedDiseases) {
      const synonyms = diseaseSynonyms[disease] || [];
      expandedTerms.push(...synonyms.slice(0, 2));
    }
  }
  
  const uniqueTerms = [...new Set(expandedTerms.filter(term => term && term.length > 1))];
  
  return uniqueTerms.join(' OR ');
}

function getSearchTerms(userInput, disease = null) {
  const primaryQuery = expandQuery(userInput, disease);
  
  const medicalSuffix = `${userInput} medical research clinical trials`;
  const researchSuffix = `${userInput} treatment therapy efficacy`;
  
  return {
    primary: primaryQuery,
    medical: medicalSuffix,
    research: researchSuffix
  };
}

module.exports = {
  expandQuery,
  getSearchTerms,
  extractDiseaseTerms
};