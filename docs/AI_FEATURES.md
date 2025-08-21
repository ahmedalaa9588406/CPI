# AI-Powered Data Collection and Quality Enhancement

This document describes the AI-powered features added to the City Performance Index (CPI) system to improve data collection, integration, and quality.

## 🚀 Features Overview

### 1. Multi-Source Data Collection
- **Automated Collection**: Gather data from multiple sources including sensors, satellites, social media, and administrative records
- **Data Sources**: 
  - OpenAQ for air quality data
  - NASA Earth Data for satellite imagery
  - World Bank for economic indicators
  - OpenStreetMap for infrastructure data

### 2. Data Harmonization
- **Quality Assessment**: Automatic data quality scoring based on completeness, accuracy, consistency, timeliness, and reliability
- **Multi-Source Integration**: Combine data from different sources using weighted averages based on quality scores
- **Outlier Detection**: Identify and flag unusual data values
- **Standardization**: Normalize values to 0-100 scale for consistent CPI calculations

### 3. Missing Data Prediction
- **Machine Learning Models**: Linear regression, random forest, and neural network models for different indicators
- **Proxy-Based Estimation**: Use related indicators to predict missing values
- **Confidence Scoring**: Provide confidence levels for AI predictions
- **Available Models**:
  - PM2.5 concentration (based on CO2 emissions, population, monitoring stations)
  - Green area per capita (based on population, land use mix, urban density)
  - Life expectancy (based on health indicators)
  - Literacy rate (based on education indicators)
  - Maternal mortality (based on health system indicators)

## 🛠️ Technical Implementation

### API Endpoints

#### Data Collection
```
POST /api/ai/data-collection
```
Collect enhanced data for a specific indicator from multiple sources.

**Request:**
```json
{
  "indicatorName": "pm25_concentration",
  "cityLocation": { "lat": 40.7128, "lon": -74.0060 },
  "existingData": { "population": 8000000 }
}
```

#### Missing Data Prediction
```
POST /api/ai/missing-data
```
Predict missing indicator values using machine learning.

**Request:**
```json
{
  "missingIndicators": ["green_area_per_capita"],
  "availableData": {
    "population": 1000000,
    "land_use_mix": 0.7,
    "urban_density": 5000
  }
}
```

#### Data Sources
```
GET /api/ai/data-sources
```
Get information about available data sources.

### Components

#### AIEnhancementPanel
Reusable component that can be added to any calculation page to provide AI-powered enhancements.

```tsx
import { AIEnhancementPanel } from '@/components/ai';
import { useAIEnhancedCalculation } from '@/lib/hooks/useAIEnhancedCalculation';

const { aiData, getAIEnhancement, getAIPrediction } = useAIEnhancedCalculation('indicator_name');

<AIEnhancementPanel
  aiData={aiData}
  onGetAIEnhancement={getAIEnhancement}
  onGetAIPrediction={getAIPrediction}
  canPredict={true}
/>
```

#### DataQualityIndicators
Dashboard component showing overall data quality metrics and AI enhancement status.

```tsx
import { DataQualityIndicators } from '@/components/ai';

<DataQualityIndicators userId={userId} />
```

### Database Schema Extensions

New fields added to the `CalculationHistory` model:

```prisma
ai_data_quality_score  Float?     // Overall quality score (0-1)
ai_enhanced_fields     String[]   // List of AI-enhanced fields
data_sources_used      String?    // JSON object of data sources
prediction_confidence  Float?     // Confidence level for predictions
last_ai_update         DateTime?  // Last AI enhancement timestamp
```

## 🎯 Usage Examples

### 1. Enhance Existing Calculation Page

```tsx
// Add to any existing calculation page
const { aiData, getAIEnhancement } = useAIEnhancedCalculation('green_area_per_capita');

const handleAIEnhancement = async () => {
  const cityLocation = { lat: 40.7128, lon: -74.0060 };
  const existingData = { population: parseFloat(population) };
  await getAIEnhancement(cityLocation, existingData);
};

// Add the panel to your JSX
<AIEnhancementPanel aiData={aiData} onGetAIEnhancement={handleAIEnhancement} />
```

### 2. Get Data Quality Assessment

```javascript
// Assess data quality for multiple indicators
const response = await fetch('/api/ai/data-collection?indicators=pm25_concentration,green_area_per_capita&lat=40.7128&lon=-74.0060');
const dataQuality = await response.json();
```

### 3. Predict Missing Values

```javascript
// Predict missing indicators using available data
const response = await fetch('/api/ai/missing-data', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    missingIndicators: ['life_expectancy_at_birth'],
    availableData: {
      maternal_mortality: 50,
      under_five_mortality_rate: 10,
      vaccination_coverage: 85,
      physician_density: 2.5
    }
  })
});
const predictions = await response.json();
```

## 📊 Data Quality Metrics

The system provides comprehensive data quality assessment:

- **Completeness**: Percentage of available data fields
- **Accuracy**: Reliability of data sources (0-1 scale)
- **Consistency**: Agreement between multiple sources
- **Timeliness**: Recency of data updates
- **Reliability**: Overall trustworthiness of sources
- **AI Enhancement**: Whether data has been enhanced by AI
- **Confidence**: Confidence level for AI predictions/enhancements

## 🔍 Quality Indicators

Data quality is displayed with clear visual indicators:

- 🟢 **Excellent (90-100%)**: Very high quality with multiple reliable sources
- 🟡 **Good (80-89%)**: Good quality with reliable sources  
- 🟠 **Fair (70-79%)**: Acceptable but may benefit from additional sources
- 🔴 **Poor (50-69%)**: Limited quality, additional verification recommended
- ⚫ **Very Poor (<50%)**: Low quality, manual verification required

## 🧪 Testing

Run the validation script to test AI services:

```bash
node __tests__/validate-ai-services.mjs
```

This validates:
- Data collection service initialization
- Data harmonization algorithms
- Missing data prediction capabilities
- Data quality assessment functions

## 🔄 Integration with Existing System

The AI features are designed as enhancements that:

- ✅ **Preserve all existing functionality**
- ✅ **Add new capabilities without breaking changes**
- ✅ **Provide optional AI enhancements**
- ✅ **Maintain backward compatibility**
- ✅ **Offer clear data provenance**

Users can continue using the system as before, with AI features providing additional insights and data quality improvements when needed.

## 🚀 Future Enhancements

Potential areas for expansion:
- Real-time data streaming from IoT sensors
- Advanced ML models with continuous learning
- Social media sentiment analysis for quality of life indicators
- Satellite image processing for urban development metrics
- Integration with more external data APIs
- Custom prediction models trained on city-specific data