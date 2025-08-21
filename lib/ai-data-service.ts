/**
 * AI-powered data collection and quality improvement service
 * Addresses data collection challenges from multiple sources and data gap filling
 */

import prisma from './prisma';

// Types for different data sources
export interface DataSource {
  type: 'sensor' | 'satellite' | 'social_media' | 'administrative' | 'api';
  name: string;
  url?: string;
  confidence: number; // 0-1 reliability score
}

export interface DataPoint {
  indicator: string;
  value: number;
  timestamp: Date;
  source: DataSource;
  metadata?: Record<string, unknown>;
}

export interface PredictionResult {
  predictedValue: number;
  confidence: number;
  method: string;
  basedOn: string[];
}

/**
 * AI Data Integration Service
 * Handles data collection from multiple sources with quality validation
 */
export class AIDataService {
  private readonly CONFIDENCE_THRESHOLD = 0.7;
  private readonly correlationMatrix = new Map<string, Map<string, number>>();

  constructor() {
    this.initializeCorrelationMatrix();
  }

  /**
   * Initialize correlation matrix for indicator relationships
   * Based on typical urban indicator correlations
   */
  private initializeCorrelationMatrix() {
    const correlations = {
      // Economic indicators correlations
      'city_product_per_capita': {
        'mean_household_income': 0.85,
        'literacy_rate': 0.75,
        'internet_access': 0.80,
        'life_expectancy_at_birth': 0.70
      },
      'mean_household_income': {
        'city_product_per_capita': 0.85,
        'education': 0.72,
        'health': 0.68
      },
      // Environmental indicators
      'pm25_concentration': {
        'co2_emissions': 0.65,
        'share_of_renewable_energy': -0.60,
        'health': -0.55
      },
      'waste_water_treatment': {
        'health': 0.70,
        'water_quality': 0.85
      },
      // Social indicators
      'literacy_rate': {
        'city_product_per_capita': 0.75,
        'women_in_local_government': 0.60,
        'internet_access': 0.65
      },
      'life_expectancy_at_birth': {
        'city_product_per_capita': 0.70,
        'pm25_concentration': -0.55,
        'physician_density': 0.80
      }
    };

    for (const [indicator, relations] of Object.entries(correlations)) {
      this.correlationMatrix.set(indicator, new Map(Object.entries(relations)));
    }
  }

  /**
   * Predict missing indicator values using correlation-based ML approach
   */
  async predictMissingValue(
    targetIndicator: string,
    userId: string,
    availableData?: Record<string, number>
  ): Promise<PredictionResult | null> {
    try {
      // Get user's existing data if not provided
      let userData = availableData;
      if (!userData) {
        const userRecord = await prisma.calculationHistory.findFirst({
          where: { userId }
        });
        userData = this.extractIndicatorValues(userRecord);
      }

      if (!userData || Object.keys(userData).length === 0) {
        return null;
      }

      const correlations = this.correlationMatrix.get(targetIndicator);
      if (!correlations) {
        return this.fallbackPrediction(targetIndicator, userData);
      }

      let weightedSum = 0;
      let totalWeight = 0;
      const usedIndicators: string[] = [];

      // Calculate weighted prediction based on correlations
      for (const [relatedIndicator, correlation] of correlations.entries()) {
        if (userData[relatedIndicator] !== undefined && userData[relatedIndicator] !== null) {
          const weight = Math.abs(correlation);
          weightedSum += userData[relatedIndicator] * correlation * weight;
          totalWeight += weight;
          usedIndicators.push(relatedIndicator);
        }
      }

      if (totalWeight === 0) {
        return this.fallbackPrediction(targetIndicator, userData);
      }

      const predictedValue = Math.max(0, weightedSum / totalWeight);
      const confidence = Math.min(0.95, totalWeight / correlations.size);

      return {
        predictedValue,
        confidence,
        method: 'correlation-based',
        basedOn: usedIndicators
      };
    } catch (error) {
      console.error('Error predicting missing value:', error);
      return null;
    }
  }

  /**
   * Fallback prediction using simple statistical methods
   */
  private fallbackPrediction(
    targetIndicator: string,
    userData: Record<string, number>
  ): PredictionResult | null {
    const values = Object.values(userData).filter(v => v !== null && v !== undefined && v > 0);
    
    if (values.length === 0) {
      return null;
    }

    // Use median as a conservative estimate
    const sortedValues = values.sort((a, b) => a - b);
    const median = sortedValues[Math.floor(sortedValues.length / 2)];
    
    return {
      predictedValue: median,
      confidence: 0.3, // Low confidence for fallback
      method: 'median-fallback',
      basedOn: ['available_indicators_median']
    };
  }

  /**
   * Extract indicator values from database record
   */
  private extractIndicatorValues(record: Record<string, unknown> | null): Record<string, number> {
    if (!record) return {};

    const indicators: Record<string, number> = {};
    
    // Extract all numeric indicator values
    for (const [key, value] of Object.entries(record)) {
      if (typeof value === 'number' && value > 0 && !key.includes('comment')) {
        indicators[key] = value;
      }
    }

    return indicators;
  }

  /**
   * Validate data quality using statistical analysis
   */
  validateDataQuality(dataPoints: DataPoint[]): {
    isValid: boolean;
    quality: number;
    issues: string[];
    recommendations: string[];
  } {
    const issues: string[] = [];
    const recommendations: string[] = [];
    let qualityScore = 1.0;

    // Check for outliers using IQR method
    const values = dataPoints.map(dp => dp.value);
    if (values.length > 3) {
      const sorted = values.sort((a, b) => a - b);
      const q1 = sorted[Math.floor(sorted.length * 0.25)];
      const q3 = sorted[Math.floor(sorted.length * 0.75)];
      const iqr = q3 - q1;
      const lowerBound = q1 - 1.5 * iqr;
      const upperBound = q3 + 1.5 * iqr;

      const outliers = values.filter(v => v < lowerBound || v > upperBound);
      if (outliers.length > 0) {
        issues.push(`Found ${outliers.length} potential outliers`);
        qualityScore -= 0.1;
        recommendations.push('Review outlier values for accuracy');
      }
    }

    // Check data source reliability
    const lowConfidenceSources = dataPoints.filter(dp => dp.source.confidence < this.CONFIDENCE_THRESHOLD);
    if (lowConfidenceSources.length > 0) {
      issues.push(`${lowConfidenceSources.length} data points from low-confidence sources`);
      qualityScore -= 0.2;
      recommendations.push('Verify data from low-confidence sources');
    }

    // Check for missing recent data
    const recentDataCutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days
    const recentData = dataPoints.filter(dp => dp.timestamp > recentDataCutoff);
    if (recentData.length === 0) {
      issues.push('No recent data available');
      qualityScore -= 0.3;
      recommendations.push('Update with recent data sources');
    }

    return {
      isValid: qualityScore > 0.5,
      quality: Math.max(0, qualityScore),
      issues,
      recommendations
    };
  }

  /**
   * Harmonize data from multiple sources using weighted averaging
   */
  harmonizeMultiSourceData(dataPoints: DataPoint[]): {
    harmonizedValue: number;
    confidence: number;
    sources: string[];
  } {
    if (dataPoints.length === 0) {
      throw new Error('No data points to harmonize');
    }

    if (dataPoints.length === 1) {
      return {
        harmonizedValue: dataPoints[0].value,
        confidence: dataPoints[0].source.confidence,
        sources: [dataPoints[0].source.name]
      };
    }

    // Weight by source confidence and recency
    let weightedSum = 0;
    let totalWeight = 0;
    const sources: string[] = [];

    for (const dataPoint of dataPoints) {
      // Recency weight (more recent = higher weight)
      const daysSince = (Date.now() - dataPoint.timestamp.getTime()) / (1000 * 60 * 60 * 24);
      const recencyWeight = Math.exp(-daysSince / 30); // Exponential decay over 30 days

      const weight = dataPoint.source.confidence * recencyWeight;
      weightedSum += dataPoint.value * weight;
      totalWeight += weight;
      sources.push(dataPoint.source.name);
    }

    const harmonizedValue = weightedSum / totalWeight;
    const confidence = Math.min(0.95, totalWeight / dataPoints.length);

    return {
      harmonizedValue,
      confidence,
      sources: [...new Set(sources)] // Remove duplicates
    };
  }

  /**
   * Simulate data collection from external sources
   * In a real implementation, this would integrate with actual APIs
   */
  async collectExternalData(
    indicator: string,
    location: { lat: number; lng: number; city: string }
  ): Promise<DataPoint[]> {
    // Simulate different data sources
    const mockSources: DataSource[] = [
      {
        type: 'sensor',
        name: 'Environmental Monitoring Network',
        confidence: 0.9
      },
      {
        type: 'satellite',
        name: 'Earth Observation Satellite',
        confidence: 0.85
      },
      {
        type: 'administrative',
        name: 'Government Statistics Portal',
        confidence: 0.95
      },
      {
        type: 'api',
        name: 'Open Data Initiative',
        confidence: 0.8
      }
    ];

    const dataPoints: DataPoint[] = [];

    // Simulate collecting data from different sources
    for (const source of mockSources) {
      // Add some realistic variance and noise
      const baseValue = this.getIndicatorBaseValue(indicator);
      const variance = baseValue * 0.1 * (1 - source.confidence);
      const value = Math.max(0, baseValue + (Math.random() - 0.5) * variance);

      dataPoints.push({
        indicator,
        value,
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Within last week
        source,
        metadata: {
          location,
          collectionMethod: 'automated'
        }
      });
    }

    return dataPoints;
  }

  /**
   * Get realistic base values for different indicators for simulation
   */
  private getIndicatorBaseValue(indicator: string): number {
    const baselines: Record<string, number> = {
      'pm25_concentration': 25, // μg/m³
      'co2_emissions': 5.5, // tons per capita
      'waste_water_treatment': 75, // percentage
      'literacy_rate': 85, // percentage
      'life_expectancy_at_birth': 72, // years
      'city_product_per_capita': 15000, // USD
      'mean_household_income': 35000, // USD
      'share_of_renewable_energy': 25, // percentage
      'internet_access': 70, // percentage
      'physician_density': 2.5 // per 1000 population
    };

    return baselines[indicator] || 50;
  }
}

// Export singleton instance
export const aiDataService = new AIDataService();