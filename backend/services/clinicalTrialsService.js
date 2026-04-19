const axios = require('axios');

const CLINICALTRIALS_API_BASE = 'https://clinicaltrials.gov/api/v2/studies';

async function searchClinicalTrials(query, limit = 20) {
  try {
    const response = await axios.get(CLINICALTRIALS_API_BASE, {
      params: {
        'query.cond': query,
        pageSize: limit,
        format: 'json'
      }
    });

    if (!response.data || !response.data.studies) {
      return [];
    }

    return response.data.studies.map(study => {
      const protocolSection = study.protocolSection || {};
      const identificationModule = protocolSection.identificationModule || {};
      const statusModule = protocolSection.statusModule || {};
      const contactsLocationsModule = protocolSection.contactsLocationsModule || {};
      const elligibilityModule = protocolSection.elligibilityModule || {};

      const location = (contactsLocationsModule.locations || []).find(loc => loc.city) || {};
      const conditions = identificationModule.conditions || [];
      const interventions = protocolSection.interventionModule?.interventions || [];

      return {
        id: identificationModule.nctId || '',
        title: identificationModule.briefTitle || identificationModule.officialTitle || 'Untitled Trial',
        status: statusModule.overallStatus || 'Unknown',
        phase: identificationModule.phase || [],
        conditions: conditions.slice(0, 3),
        interventions: interventions.map(i => `${i.type}: ${i.name}`).slice(0, 2),
        location: location.city ? `${location.city}, ${location.state || ''}`.trim() : 'Not specified',
        country: location.country || 'Unknown',
        url: `https://clinicaltrials.gov/study/${identificationModule.nctId}`,
        enrollment: statusModule.enrollment || 'Unknown',
        startDate: statusModule.startDateStruct?.date || 'TBD',
        completionDate: statusModule.completionDateStruct?.date || 'TBD'
      };
    }).filter(trial => trial.title !== 'Untitled Trial');

  } catch (error) {
    console.error('ClinicalTrials API error:', error.message);
    return [];
  }
}

async function getTrialDetails(nctId) {
  try {
    const response = await axios.get(`${CLINICALTRIALS_API_BASE}/${nctId}`, {
      params: {
        format: 'json'
      }
    });

    if (!response.data) {
      return null;
    }

    const study = response.data;
    const protocolSection = study.protocolSection || {};
    const identificationModule = protocolSection.identificationModule || {};
    const statusModule = protocolSection.statusModule || {};
    const descriptionModule = protocolSection.descriptionModule || {};
    const armsInterventionsModule = protocolSection.armsInterventionsModule || {};
    const outcomeMeasuresModule = protocolSection.outcomeMeasuresModule || [];

    return {
      id: identificationModule.nctId,
      title: identificationModule.briefTitle,
      status: statusModule.overallStatus,
      phase: identificationModule.phase,
      conditions: identificationModule.conditions,
      interventions: armsInterventionsModule.arms?.map(a => a.label),
      outcomeMeasures: outcomeMeasuresModule.map(o => o.title),
      description: descriptionModule.briefSummary,
      url: `https://clinicaltrials.gov/study/${identificationModule.nctId}`
    };
  } catch (error) {
    console.error('ClinicalTrials getDetails error:', error.message);
    return null;
  }
}

module.exports = {
  searchClinicalTrials,
  getTrialDetails
};