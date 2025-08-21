// AI Services for CPI Data Collection and Quality Enhancement
export * from './types';
export { dataCollectionService, DataCollectionService } from './dataCollection';
export { dataHarmonizationService, DataHarmonizationService } from './dataHarmonization';
export { missingDataPredictionService, MissingDataPredictionService } from './missingDataPrediction';

/**
 * Main AI service orchestrator
 */
import { dataCollectionService } from './dataCollection';
import { dataHarmonizationService } from './dataHarmonization';
import { missingDataPredictionService } from './missingDataPrediction';
import { EnhancedCPIData } from './types';

export class AIDataService {
  /**
   * Get enhanced CPI data with AI-powered collection, harmonization, and prediction
   */
  async getEnhancedIndicatorData(
    indicatorName: string,
    cityLocation?: { lat: number; lon: number },
    existingData?: Record<string, number | null>
  ): Promise<EnhancedCPIData | null> {
    try {
      // Step 1: Try to collect data from multiple sources
      const collectedData = await dataCollectionService.collectIndicatorData(indicatorName, cityLocation);
      
      if (collectedData.length > 0) {
        // Step 2: Harmonize data from multiple sources
        const harmonizedData = dataHarmonizationService.harmonizeIndicatorData(collectedData);
        
        if (harmonizedData) {
          // Step 3: Validate and clean the data
          return dataHarmonizationService.validateAndClean(harmonizedData);
        }
      }

      // Step 4: If no data collected, try to predict using proxy indicators
      if (existingData) {
        const predictedData = await missingDataPredictionService.predictMissingValue(indicatorName, existingData);
        return predictedData;
      }

      return null;
    } catch (error) {
      console.error(`Failed to get enhanced data for ${indicatorName}:`, error);
      return null;
    }
  }

  /**
   * Get data quality assessment for multiple indicators
   */
  async assessDataQuality(indicators: string[], cityLocation?: { lat: number; lon: number }): Promise<Record<string, EnhancedCPIData | null>> {
    const results: Record<string, EnhancedCPIData | null> = {};

    for (const indicator of indicators) {
      results[indicator] = await this.getEnhancedIndicatorData(indicator, cityLocation);
    }

    return results;
  }

  /**
   * Fill missing data using AI prediction
   */
  async fillMissingData(
    missingIndicators: string[],
    availableData: Record<string, number | null>
  ): Promise<Record<string, EnhancedCPIData | null>> {
    return missingDataPredictionService.predictMissingIndicators(missingIndicators, availableData);
  }

  /**
   * Get comprehensive data sources information
   */
  getDataSources() {
    return dataCollectionService.getActiveSources();
  }

  /**
   * Get available prediction models
   */
  getPredictionModels() {
    return missingDataPredictionService.getAvailableModels();
  }
}

export const aiDataService = new AIDataService();