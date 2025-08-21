import { DataSource, DataSourceType, DataFrequency, EnhancedCPIData, DataQuality } from './types';

/**
 * AI-powered data collection service for gathering data from multiple sources
 */
export class DataCollectionService {
  private dataSources: Map<string, DataSource> = new Map();
  
  constructor() {
    this.initializeDefaultSources();
  }

  /**
   * Initialize default data sources for common CPI indicators
   */
  private initializeDefaultSources(): void {
    const defaultSources: DataSource[] = [
      {
        id: 'openaq_air_quality',
        name: 'OpenAQ Air Quality',
        type: DataSourceType.API,
        url: 'https://api.openaq.org/v2',
        frequency: DataFrequency.HOURLY,
        reliability: 0.85,
        isActive: true
      },
      {
        id: 'world_bank_indicators',
        name: 'World Bank Indicators',
        type: DataSourceType.API,
        url: 'https://api.worldbank.org/v2',
        frequency: DataFrequency.YEARLY,
        reliability: 0.95,
        isActive: true
      },
      {
        id: 'nasa_satellite',
        name: 'NASA Earth Data',
        type: DataSourceType.SATELLITE,
        url: 'https://earthdata.nasa.gov/api',
        frequency: DataFrequency.DAILY,
        reliability: 0.90,
        isActive: true
      },
      {
        id: 'osm_infrastructure',
        name: 'OpenStreetMap Infrastructure',
        type: DataSourceType.API,
        url: 'https://overpass-api.de/api/interpreter',
        frequency: DataFrequency.DAILY,
        reliability: 0.80,
        isActive: true
      }
    ];

    defaultSources.forEach(source => {
      this.dataSources.set(source.id, source);
    });
  }

  /**
   * Add a new data source
   */
  addDataSource(source: DataSource): void {
    this.dataSources.set(source.id, source);
  }

  /**
   * Get all active data sources
   */
  getActiveSources(): DataSource[] {
    return Array.from(this.dataSources.values()).filter(source => source.isActive);
  }

  /**
   * Collect data for a specific CPI indicator from multiple sources
   */
  async collectIndicatorData(indicatorName: string, cityLocation?: { lat: number; lon: number }): Promise<EnhancedCPIData[]> {
    const relevantSources = this.getSourcesForIndicator(indicatorName);
    const collectedData: EnhancedCPIData[] = [];

    for (const source of relevantSources) {
      try {
        const data = await this.collectFromSource(source, indicatorName, cityLocation);
        if (data) {
          collectedData.push(data);
        }
      } catch (error) {
        console.warn(`Failed to collect data from ${source.name}:`, error);
      }
    }

    return collectedData;
  }

  /**
   * Get relevant data sources for a specific indicator
   */
  private getSourcesForIndicator(indicatorName: string): DataSource[] {
    const indicatorSourceMap: Record<string, string[]> = {
      'pm25_concentration': ['openaq_air_quality', 'nasa_satellite'],
      'co2_emissions': ['nasa_satellite', 'world_bank_indicators'],
      'green_area_per_capita': ['nasa_satellite', 'osm_infrastructure'],
      'number_of_monitoring_stations': ['openaq_air_quality'],
      'population': ['world_bank_indicators'],
      'gdp_per_capita': ['world_bank_indicators'],
      'life_expectancy_at_birth': ['world_bank_indicators'],
      'literacy_rate': ['world_bank_indicators']
    };

    const sourceIds = indicatorSourceMap[indicatorName] || [];
    return sourceIds.map(id => this.dataSources.get(id)).filter(Boolean) as DataSource[];
  }

  /**
   * Collect data from a specific source
   */
  private async collectFromSource(
    source: DataSource, 
    indicatorName: string, 
    cityLocation?: { lat: number; lon: number }
  ): Promise<EnhancedCPIData | null> {
    switch (source.type) {
      case DataSourceType.API:
        return this.collectFromAPI(source, indicatorName, cityLocation);
      case DataSourceType.SATELLITE:
        return this.collectFromSatellite(source, indicatorName, cityLocation);
      default:
        console.warn(`Data collection not implemented for source type: ${source.type}`);
        return null;
    }
  }

  /**
   * Collect data from API sources
   */
  private async collectFromAPI(
    source: DataSource, 
    indicatorName: string, 
    cityLocation?: { lat: number; lon: number }
  ): Promise<EnhancedCPIData | null> {
    // Simulate API data collection (in real implementation, this would make actual API calls)
    console.log(`Simulating API collection from ${source.name} for ${indicatorName}`, cityLocation ? `at ${cityLocation.lat}, ${cityLocation.lon}` : '');
    
    // Generate simulated data with quality metrics
    const value = this.generateSimulatedValue(indicatorName);
    const dataQuality = this.calculateDataQuality(source, value);

    return {
      indicatorName,
      value,
      originalValue: value,
      isAIPredicted: false,
      isPredictedFromProxy: false,
      dataQuality,
      dataSources: [source],
      lastUpdated: new Date(),
      metadata: {
        harmonizationApplied: false,
        outlierDetected: false
      }
    };
  }

  /**
   * Collect data from satellite sources
   */
  private async collectFromSatellite(
    source: DataSource, 
    indicatorName: string, 
    cityLocation?: { lat: number; lon: number }
  ): Promise<EnhancedCPIData | null> {
    console.log(`Simulating satellite data collection from ${source.name} for ${indicatorName}`);
    
    if (!cityLocation) {
      console.warn('City location required for satellite data collection');
      return null;
    }

    const value = this.generateSimulatedValue(indicatorName);
    const dataQuality = this.calculateDataQuality(source, value);

    return {
      indicatorName,
      value,
      originalValue: value,
      isAIPredicted: false,
      isPredictedFromProxy: false,
      dataQuality,
      dataSources: [source],
      lastUpdated: new Date(),
      metadata: {
        harmonizationApplied: true, // Satellite data often requires harmonization
        outlierDetected: false
      }
    };
  }

  /**
   * Generate simulated values for demonstration
   */
  private generateSimulatedValue(indicatorName: string): number {
    const valueRanges: Record<string, { min: number; max: number }> = {
      'pm25_concentration': { min: 5, max: 150 },
      'co2_emissions': { min: 1, max: 20 },
      'green_area_per_capita': { min: 0, max: 50 },
      'population': { min: 100000, max: 10000000 },
      'life_expectancy_at_birth': { min: 60, max: 85 },
      'literacy_rate': { min: 50, max: 100 }
    };

    const range = valueRanges[indicatorName] || { min: 0, max: 100 };
    return Math.random() * (range.max - range.min) + range.min;
  }

  /**
   * Calculate data quality metrics
   */
  private calculateDataQuality(source: DataSource, value: number | null): DataQuality {
    const completeness = value !== null ? 1.0 : 0.0;
    const accuracy = source.reliability;
    const consistency = 0.9; // Assume good consistency for now
    const timeliness = this.calculateTimeliness(source);
    const reliability = source.reliability;
    
    const overallScore = (completeness + accuracy + consistency + timeliness + reliability) / 5;

    return {
      completeness,
      accuracy,
      consistency,
      timeliness,
      reliability,
      overallScore,
      aiEnhanced: false,
      confidence: accuracy
    };
  }

  /**
   * Calculate timeliness based on data frequency and last update
   */
  private calculateTimeliness(source: DataSource): number {
    if (!source.lastUpdated) return 0.5; // Default for sources without update info
    
    const now = new Date();
    const hoursSinceUpdate = (now.getTime() - source.lastUpdated.getTime()) / (1000 * 60 * 60);
    
    switch (source.frequency) {
      case DataFrequency.REAL_TIME:
        return Math.max(0, 1 - hoursSinceUpdate / 1);
      case DataFrequency.HOURLY:
        return Math.max(0, 1 - hoursSinceUpdate / 24);
      case DataFrequency.DAILY:
        return Math.max(0, 1 - hoursSinceUpdate / (24 * 7));
      case DataFrequency.WEEKLY:
        return Math.max(0, 1 - hoursSinceUpdate / (24 * 30));
      case DataFrequency.MONTHLY:
        return Math.max(0, 1 - hoursSinceUpdate / (24 * 365));
      default:
        return 0.8; // Default timeliness for yearly data
    }
  }
}

export const dataCollectionService = new DataCollectionService();