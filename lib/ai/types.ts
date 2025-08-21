/**
 * Data Source Types for AI-powered data collection
 */
export interface DataSource {
  id: string;
  name: string;
  type: DataSourceType;
  url?: string;
  apiKey?: string;
  frequency: DataFrequency;
  reliability: number; // 0-1 scale
  lastUpdated?: Date;
  isActive: boolean;
}

export enum DataSourceType {
  SENSOR = 'sensor',
  SATELLITE = 'satellite',
  SOCIAL_MEDIA = 'social_media',
  ADMINISTRATIVE = 'administrative',
  API = 'api',
  MANUAL = 'manual'
}

export enum DataFrequency {
  REAL_TIME = 'real_time',
  HOURLY = 'hourly',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly'
}

/**
 * Data Quality Metrics
 */
export interface DataQuality {
  completeness: number; // 0-1 scale
  accuracy: number; // 0-1 scale
  consistency: number; // 0-1 scale
  timeliness: number; // 0-1 scale
  reliability: number; // 0-1 scale
  overallScore: number; // 0-1 scale
  aiEnhanced: boolean;
  confidence: number; // 0-1 scale for AI predictions
}

/**
 * Enhanced CPI Data with AI metadata
 */
export interface EnhancedCPIData {
  indicatorName: string;
  value: number | null;
  originalValue: number | null;
  isAIPredicted: boolean;
  isPredictedFromProxy: boolean;
  dataQuality: DataQuality;
  dataSources: DataSource[];
  lastUpdated: Date;
  metadata: {
    predictionMethod?: string;
    proxyIndicators?: string[];
    harmonizationApplied?: boolean;
    outlierDetected?: boolean;
  };
}

/**
 * Data Collection Configuration
 */
export interface DataCollectionConfig {
  sources: DataSource[];
  indicators: string[];
  harmonizationRules: HarmonizationRule[];
  predictionModels: PredictionModel[];
}

export interface HarmonizationRule {
  sourcePattern: string;
  targetFormat: string;
  conversionFunction: string;
  priority: number;
}

export interface PredictionModel {
  indicatorName: string;
  modelType: 'linear_regression' | 'random_forest' | 'neural_network';
  proxyIndicators: string[];
  accuracy: number;
  lastTrained: Date;
}