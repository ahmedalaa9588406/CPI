/**
 * Manual validation script for AI services
 * Run with: node --loader ts-node/esm validate-ai-services.mjs
 */

import { DataCollectionService } from '../lib/ai/dataCollection.js';
import { DataHarmonizationService } from '../lib/ai/dataHarmonization.js';
import { MissingDataPredictionService } from '../lib/ai/missingDataPrediction.js';

// Validation results
const results = {
  dataCollection: { passed: 0, failed: 0, tests: [] },
  dataHarmonization: { passed: 0, failed: 0, tests: [] },
  missingDataPrediction: { passed: 0, failed: 0, tests: [] }
};

function assert(condition, message) {
  if (condition) {
    return { passed: true, message };
  } else {
    throw new Error(message);
  }
}

function runTest(testName, testFn, category) {
  try {
    testFn();
    results[category].passed++;
    results[category].tests.push({ name: testName, status: 'PASSED' });
    console.log(`✅ ${testName}`);
  } catch (error) {
    results[category].failed++;
    results[category].tests.push({ name: testName, status: 'FAILED', error: error.message });
    console.log(`❌ ${testName}: ${error.message}`);
  }
}

// Data Collection Service Tests
console.log('\n🔍 Testing Data Collection Service...');

runTest('Should initialize with default data sources', () => {
  const service = new DataCollectionService();
  const sources = service.getActiveSources();
  assert(sources.length > 0, 'Should have active data sources');
  assert(sources.some(s => s.type === 'api'), 'Should have API data sources');
}, 'dataCollection');

runTest('Should add new data source', () => {
  const service = new DataCollectionService();
  const initialCount = service.getActiveSources().length;
  service.addDataSource({
    id: 'test_source',
    name: 'Test Source',
    type: 'api',
    frequency: 'daily',
    reliability: 0.8,
    isActive: true
  });
  const newCount = service.getActiveSources().length;
  assert(newCount === initialCount + 1, 'Should add one more data source');
}, 'dataCollection');

// Data Harmonization Service Tests
console.log('\n🔧 Testing Data Harmonization Service...');

runTest('Should harmonize multiple data points', () => {
  const service = new DataHarmonizationService();
  const dataPoints = [
    {
      indicatorName: 'test_indicator',
      value: 10,
      originalValue: 10,
      isAIPredicted: false,
      isPredictedFromProxy: false,
      dataQuality: { overallScore: 0.8, aiEnhanced: false, confidence: 0.8 },
      dataSources: [],
      lastUpdated: new Date(),
      metadata: {}
    },
    {
      indicatorName: 'test_indicator',
      value: 20,
      originalValue: 20,
      isAIPredicted: false,
      isPredictedFromProxy: false,
      dataQuality: { overallScore: 0.9, aiEnhanced: false, confidence: 0.9 },
      dataSources: [],
      lastUpdated: new Date(),
      metadata: {}
    }
  ];
  
  const result = service.harmonizeIndicatorData(dataPoints);
  assert(result !== null, 'Should return harmonized data');
  assert(result.value > 10 && result.value < 20, 'Should be weighted average');
  assert(result.dataQuality.aiEnhanced === true, 'Should mark as AI enhanced');
}, 'dataHarmonization');

runTest('Should normalize values to standard scale', () => {
  const service = new DataHarmonizationService();
  const normalizedHigh = service.normalizeToStandardScale(100, 'literacy_rate');
  const normalizedMid = service.normalizeToStandardScale(50, 'literacy_rate');
  const normalizedLow = service.normalizeToStandardScale(0, 'literacy_rate');
  
  assert(normalizedHigh === 100, 'High value should normalize to 100');
  assert(normalizedMid === 50, 'Mid value should normalize to 50');
  assert(normalizedLow === 0, 'Low value should normalize to 0');
}, 'dataHarmonization');

// Missing Data Prediction Service Tests
console.log('\n🤖 Testing Missing Data Prediction Service...');

runTest('Should get available prediction models', () => {
  const service = new MissingDataPredictionService();
  const models = service.getAvailableModels();
  assert(models.length > 0, 'Should have prediction models');
  assert(models.some(m => m.indicatorName === 'pm25_concentration'), 'Should have PM2.5 model');
}, 'missingDataPrediction');

runTest('Should check prediction capability', () => {
  const service = new MissingDataPredictionService();
  const availableData = {
    co2_emissions: 10,
    population: 1000000,
    number_of_monitoring_stations: 5
  };
  
  const canPredict = service.canPredict('pm25_concentration', availableData);
  assert(canPredict === true, 'Should be able to predict PM2.5 with proxy data');
  
  const cannotPredict = service.canPredict('unknown_indicator', availableData);
  assert(cannotPredict === false, 'Should not predict unknown indicators');
}, 'missingDataPrediction');

// Print Summary
console.log('\n📊 Test Summary:');
console.log('================');

Object.entries(results).forEach(([category, result]) => {
  const total = result.passed + result.failed;
  const percentage = total > 0 ? ((result.passed / total) * 100).toFixed(1) : 0;
  console.log(`${category}: ${result.passed}/${total} passed (${percentage}%)`);
});

const totalPassed = Object.values(results).reduce((sum, r) => sum + r.passed, 0);
const totalTests = Object.values(results).reduce((sum, r) => sum + r.passed + r.failed, 0);
const overallPercentage = totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(1) : 0;

console.log(`\nOverall: ${totalPassed}/${totalTests} tests passed (${overallPercentage}%)`);

if (totalPassed === totalTests) {
  console.log('\n🎉 All tests passed! AI services are working correctly.');
} else {
  console.log('\n⚠️  Some tests failed. Please review the implementation.');
  process.exit(1);
}