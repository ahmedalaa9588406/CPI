import { EnhancedCPIData, DataQuality } from './types';

/**
 * Data harmonization service for integrating data from multiple sources
 */
export class DataHarmonizationService {
  
  /**
   * Harmonize data from multiple sources for the same indicator
   */
  harmonizeIndicatorData(dataPoints: EnhancedCPIData[]): EnhancedCPIData | null {
    if (dataPoints.length === 0) return null;
    if (dataPoints.length === 1) return dataPoints[0];

    // Filter out null values
    const validDataPoints = dataPoints.filter(dp => dp.value !== null);
    if (validDataPoints.length === 0) return null;

    // Calculate weighted average based on data quality
    const harmonizedValue = this.calculateWeightedAverage(validDataPoints);
    const harmonizedQuality = this.aggregateDataQuality(validDataPoints);
    const allSources = dataPoints.flatMap(dp => dp.dataSources);

    return {
      indicatorName: dataPoints[0].indicatorName,
      value: harmonizedValue,
      originalValue: validDataPoints[0].value, // Keep first valid original value
      isAIPredicted: false,
      isPredictedFromProxy: false,
      dataQuality: harmonizedQuality,
      dataSources: allSources,
      lastUpdated: new Date(),
      metadata: {
        harmonizationApplied: true,
        outlierDetected: this.detectOutliers(validDataPoints),
        predictionMethod: 'weighted_average_harmonization'
      }
    };
  }

  /**
   * Calculate weighted average based on data quality scores
   */
  private calculateWeightedAverage(dataPoints: EnhancedCPIData[]): number {
    let weightedSum = 0;
    let totalWeight = 0;

    for (const dp of dataPoints) {
      if (dp.value !== null) {
        const weight = dp.dataQuality.overallScore;
        weightedSum += dp.value * weight;
        totalWeight += weight;
      }
    }

    return totalWeight > 0 ? weightedSum / totalWeight : 0;
  }

  /**
   * Aggregate data quality metrics from multiple sources
   */
  private aggregateDataQuality(dataPoints: EnhancedCPIData[]): DataQuality {
    const qualities = dataPoints.map(dp => dp.dataQuality);
    
    // Calculate averages weighted by reliability
    let completeness = 0, accuracy = 0, consistency = 0, timeliness = 0, reliability = 0;
    let totalWeight = 0;

    for (const quality of qualities) {
      const weight = quality.reliability;
      completeness += quality.completeness * weight;
      accuracy += quality.accuracy * weight;
      consistency += quality.consistency * weight;
      timeliness += quality.timeliness * weight;
      reliability += quality.reliability * weight;
      totalWeight += weight;
    }

    if (totalWeight > 0) {
      completeness /= totalWeight;
      accuracy /= totalWeight;
      consistency /= totalWeight;
      timeliness /= totalWeight;
      reliability /= totalWeight;
    }

    const overallScore = (completeness + accuracy + consistency + timeliness + reliability) / 5;

    return {
      completeness,
      accuracy,
      consistency,
      timeliness,
      reliability,
      overallScore,
      aiEnhanced: true,
      confidence: overallScore
    };
  }

  /**
   * Detect outliers in the data using statistical methods
   */
  private detectOutliers(dataPoints: EnhancedCPIData[]): boolean {
    if (dataPoints.length < 3) return false;

    const values = dataPoints.map(dp => dp.value).filter(v => v !== null) as number[];
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);

    // Use 2 standard deviations as outlier threshold
    const threshold = 2 * stdDev;
    
    for (const value of values) {
      if (Math.abs(value - mean) > threshold) {
        return true;
      }
    }

    return false;
  }

  /**
   * Normalize data to a standard scale (0-100) for CPI indicators
   */
  normalizeToStandardScale(
    value: number, 
    indicatorName: string, 
    minBenchmark?: number, 
    maxBenchmark?: number
  ): number {
    // Get benchmark values for common indicators
    const benchmarks = this.getIndicatorBenchmarks(indicatorName);
    const min = minBenchmark ?? benchmarks.min;
    const max = maxBenchmark ?? benchmarks.max;

    if (min === max) return 50; // Default middle value if no range

    // Handle inverse indicators (lower is better)
    const isInverseIndicator = this.isInverseIndicator(indicatorName);
    
    if (isInverseIndicator) {
      // For inverse indicators, lower values get higher scores
      if (value <= min) return 100;
      if (value >= max) return 0;
      return 100 * (1 - (value - min) / (max - min));
    } else {
      // For normal indicators, higher values get higher scores
      if (value >= max) return 100;
      if (value <= min) return 0;
      return 100 * (value - min) / (max - min);
    }
  }

  /**
   * Get benchmark values for normalization
   */
  private getIndicatorBenchmarks(indicatorName: string): { min: number; max: number } {
    const benchmarks: Record<string, { min: number; max: number }> = {
      'pm25_concentration': { min: 5, max: 150 },
      'co2_emissions': { min: 1, max: 20 },
      'green_area_per_capita': { min: 0, max: 50 },
      'life_expectancy_at_birth': { min: 40, max: 85 },
      'literacy_rate': { min: 0, max: 100 },
      'maternal_mortality': { min: 1, max: 1100 },
      'under_five_mortality_rate': { min: 2.2, max: 181.6 },
      'number_of_monitoring_stations': { min: 0, max: 100 }
    };

    return benchmarks[indicatorName] || { min: 0, max: 100 };
  }

  /**
   * Check if an indicator is inverse (lower values are better)
   */
  private isInverseIndicator(indicatorName: string): boolean {
    const inverseIndicators = [
      'pm25_concentration',
      'co2_emissions',
      'maternal_mortality',
      'under_five_mortality_rate',
      'homicide_rate',
      'theft_rate',
      'unemployment_rate',
      'poverty_rate'
    ];

    return inverseIndicators.includes(indicatorName);
  }

  /**
   * Validate and clean data values
   */
  validateAndClean(data: EnhancedCPIData): EnhancedCPIData {
    let cleanedValue = data.value;
    let qualityScore = data.dataQuality.overallScore;

    // Remove obvious outliers or invalid values
    if (cleanedValue !== null) {
      const benchmarks = this.getIndicatorBenchmarks(data.indicatorName);
      const range = benchmarks.max - benchmarks.min;
      const extremeMin = benchmarks.min - range * 2;
      const extremeMax = benchmarks.max + range * 2;

      if (cleanedValue < extremeMin || cleanedValue > extremeMax) {
        console.warn(`Extreme outlier detected for ${data.indicatorName}: ${cleanedValue}`);
        cleanedValue = null;
        qualityScore *= 0.5; // Reduce quality score for outliers
      }

      // Check for negative values where they shouldn't exist
      const shouldBePositive = [
        'green_area_per_capita',
        'life_expectancy_at_birth',
        'literacy_rate',
        'population'
      ];

      if (shouldBePositive.includes(data.indicatorName) && cleanedValue !== null && cleanedValue < 0) {
        console.warn(`Negative value detected for ${data.indicatorName}: ${cleanedValue}`);
        cleanedValue = null;
        qualityScore *= 0.3;
      }
    }

    return {
      ...data,
      value: cleanedValue,
      dataQuality: {
        ...data.dataQuality,
        overallScore: qualityScore,
        aiEnhanced: true
      },
      metadata: {
        ...data.metadata,
        outlierDetected: cleanedValue !== data.value
      }
    };
  }
}

export const dataHarmonizationService = new DataHarmonizationService();