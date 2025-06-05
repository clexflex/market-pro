// src/utils/dataTransformation.js
// Advanced data transformation utilities for CSV processing

import Papa from 'papaparse';

/**
 * Data Transformation Utilities
 * Handles complex CSV data processing, validation, and transformation
 */
export class DataTransformer {
  constructor() {
    this.validationRules = {
      requiredColumns: ['Region', 'Segment Type', 'Segment Name', 'Year', 'Value (USD Thousand)'],
      dataTypes: {
        'Year': 'number',
        'Value (USD Thousand)': 'number'
      },
      valueRanges: {
        'Year': { min: 2020, max: 2035 },
        'Value (USD Thousand)': { min: 0, max: 10000000 }
      }
    };
  }

  /**
   * Process and validate CSV data
   * @param {Array} rawData - Raw CSV data from Papa Parse
   * @returns {Object} Processed and validated data
   */
  async processCSVData(rawData) {
    try {
      // Step 1: Validate structure
      this.validateDataStructure(rawData);
      
      // Step 2: Clean and normalize data
      const cleanedData = this.cleanData(rawData);
      
      // Step 3: Validate data quality
      const validationResults = this.validateDataQuality(cleanedData);
      
      // Step 4: Transform to market data structure
      const transformedData = this.transformToMarketData(cleanedData);
      
      // Step 5: Generate metadata
      const metadata = this.generateMetadata(cleanedData, validationResults);
      
      return {
        data: transformedData,
        metadata,
        validationResults,
        processedAt: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Data processing failed: ${error.message}`);
    }
  }

  /**
   * Validate CSV data structure
   */
  validateDataStructure(data) {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Invalid data format: Expected non-empty array');
    }

    const firstRow = data[0];
    const missingColumns = this.validationRules.requiredColumns.filter(
      col => !(col in firstRow)
    );

    if (missingColumns.length > 0) {
      throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
    }
  }

  /**
   * Clean and normalize data
   */
  cleanData(data) {
    return data.map((row, index) => {
      const cleanedRow = {};
      
      Object.keys(row).forEach(key => {
        const cleanKey = key.trim();
        let value = row[key];
        
        // Handle different data types
        if (this.validationRules.dataTypes[cleanKey] === 'number') {
          value = this.parseNumber(value);
        } else if (typeof value === 'string') {
          value = value.trim();
        }
        
        cleanedRow[cleanKey] = value;
        cleanedRow._originalIndex = index;
      });
      
      return cleanedRow;
    }).filter(row => this.isValidRow(row));
  }

  /**
   * Parse number with error handling
   */
  parseNumber(value) {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      // Remove commas and other formatting
      const cleaned = value.replace(/[,$\s]/g, '');
      const parsed = parseFloat(cleaned);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  }

  /**
   * Check if row has valid data
   */
  isValidRow(row) {
    return row.Region && 
           row['Segment Type'] && 
           row['Segment Name'] && 
           row.Year && 
           typeof row['Value (USD Thousand)'] === 'number';
  }

  /**
   * Validate data quality
   */
  validateDataQuality(data) {
    const results = {
      totalRows: data.length,
      validRows: 0,
      errors: [],
      warnings: [],
      quality: {
        completeness: 0,
        consistency: 0,
        accuracy: 0
      }
    };

    data.forEach((row, index) => {
      let isValid = true;
      
      // Check value ranges
      Object.keys(this.validationRules.valueRanges).forEach(column => {
        const value = row[column];
        const range = this.validationRules.valueRanges[column];
        
        if (value < range.min || value > range.max) {
          results.errors.push({
            row: index,
            column,
            value,
            message: `Value ${value} is outside expected range [${range.min}, ${range.max}]`
          });
          isValid = false;
        }
      });

      // Check for duplicate entries
      const duplicates = data.filter((otherRow, otherIndex) => 
        otherIndex !== index &&
        otherRow.Region === row.Region &&
        otherRow['Segment Type'] === row['Segment Type'] &&
        otherRow['Segment Name'] === row['Segment Name'] &&
        otherRow.Year === row.Year
      );

      if (duplicates.length > 0) {
        results.warnings.push({
          row: index,
          message: `Potential duplicate entry for ${row.Region} - ${row['Segment Name']} (${row.Year})`
        });
      }

      if (isValid) results.validRows++;
    });

    // Calculate quality metrics
    results.quality.completeness = (results.validRows / results.totalRows) * 100;
    results.quality.consistency = Math.max(0, 100 - (results.warnings.length / results.totalRows) * 100);
    results.quality.accuracy = Math.max(0, 100 - (results.errors.length / results.totalRows) * 100);

    return results;
  }

  /**
   * Transform cleaned data to market data structure
   */
  transformToMarketData(data) {
    const grouped = this.groupDataByHierarchy(data);
    const marketTotals = this.calculateMarketTotals(grouped);
    
    return {
      overview: this.generateOverview(marketTotals),
      regions: this.transformRegions(grouped, marketTotals),
      productTypes: this.transformProductTypes(grouped, marketTotals),
      ingredients: this.transformIngredients(grouped, marketTotals),
      gender: this.transformGender(grouped, marketTotals),
      endUsers: this.transformEndUsers(grouped, marketTotals),
      countries: this.transformCountries(grouped),
      timeSeries: this.generateTimeSeriesData(grouped),
      marketPlayers: this.getStaticMarketPlayers(),
      trends: this.getStaticMarketTrends()
    };
  }

  /**
   * Group data by hierarchical structure
   */
  groupDataByHierarchy(data) {
    const grouped = {};
    
    data.forEach(row => {
      const region = this.normalizeRegionName(row.Region);
      const segmentType = this.normalizeSegmentType(row['Segment Type']);
      const segmentName = this.normalizeSegmentName(row['Segment Name']);
      const year = parseInt(row.Year);
      const value = parseFloat(row['Value (USD Thousand)']) / 1000; // Convert to millions
      
      // Initialize nested structure
      if (!grouped[region]) grouped[region] = {};
      if (!grouped[region][segmentType]) grouped[region][segmentType] = {};
      if (!grouped[region][segmentType][segmentName]) {
        grouped[region][segmentType][segmentName] = [];
      }
      
      grouped[region][segmentType][segmentName].push({ year, value });
    });
    
    // Sort time series by year
    Object.keys(grouped).forEach(region => {
      Object.keys(grouped[region]).forEach(segmentType => {
        Object.keys(grouped[region][segmentType]).forEach(segmentName => {
          grouped[region][segmentType][segmentName].sort((a, b) => a.year - b.year);
        });
      });
    });
    
    return grouped;
  }

  /**
   * Normalize region names for consistency
   */
  normalizeRegionName(region) {
    const regionMap = {
      'North America': 'North America',
      'NA': 'North America',
      'Europe': 'Europe',
      'EU': 'Europe',
      'Asia Pacific': 'Asia Pacific',
      'APAC': 'Asia Pacific',
      'Asia-Pacific': 'Asia Pacific',
      'Latin America': 'Latin America',
      'LATAM': 'Latin America',
      'South America': 'Latin America',
      'Middle East & Africa': 'Middle East & Africa',
      'MEA': 'Middle East & Africa',
      'MENA': 'Middle East & Africa',
      'Global': 'Global'
    };
    
    return regionMap[region] || region;
  }

  /**
   * Normalize segment type names
   */
  normalizeSegmentType(segmentType) {
    const typeMap = {
      'Type': 'Type',
      'Product Type': 'Type',
      'Ingredient': 'Ingredient',
      'Active Ingredient': 'Ingredient',
      'Gender': 'Gender',
      'Demographics': 'Gender',
      'End User': 'End User',
      'Channel': 'End User',
      'Country': 'Country'
    };
    
    return typeMap[segmentType] || segmentType;
  }

  /**
   * Normalize segment names
   */
  normalizeSegmentName(segmentName) {
    // Handle common variations and abbreviations
    const nameMap = {
      'HA': 'Hyaluronic Acid (HA)',
      'Hyaluronic acid': 'Hyaluronic Acid (HA)',
      'PDRN': 'Polydeoxyribonucleotides (PDRN)',
      'PCL': 'Polycaprolactone (PCL)',
      'PLLA': 'Poly-L-Lactic Acid (PLLA)',
      'US': 'United States',
      'USA': 'United States',
      'UK': 'United Kingdom'
    };
    
    return nameMap[segmentName] || segmentName;
  }

  /**
   * Calculate market totals and key metrics
   */
  calculateMarketTotals(grouped) {
    const totals = {
      global: { marketSize2024: 0, marketSize2032: 0 },
      regional: {}
    };
    
    // Calculate global totals from product types
    if (grouped.Global && grouped.Global.Type) {
      Object.keys(grouped.Global.Type).forEach(productType => {
        const timeSeries = grouped.Global.Type[productType];
        const value2024 = timeSeries.find(d => d.year === 2024)?.value || 0;
        const value2032 = timeSeries.find(d => d.year === 2032)?.value || 0;
        
        totals.global.marketSize2024 += value2024;
        totals.global.marketSize2032 += value2032;
      });
    }
    
    totals.global.cagr = this.calculateCAGR(
      totals.global.marketSize2024, 
      totals.global.marketSize2032, 
      8
    );
    
    // Calculate regional totals
    Object.keys(grouped).forEach(region => {
      if (region === 'Global') return;
      
      let regionTotal2024 = 0;
      let regionTotal2032 = 0;
      
      if (grouped[region].Type) {
        Object.keys(grouped[region].Type).forEach(productType => {
          const timeSeries = grouped[region].Type[productType];
          regionTotal2024 += timeSeries.find(d => d.year === 2024)?.value || 0;
          regionTotal2032 += timeSeries.find(d => d.year === 2032)?.value || 0;
        });
      }
      
      totals.regional[region] = {
        marketSize2024: regionTotal2024,
        marketSize2032: regionTotal2032,
        cagr: this.calculateCAGR(regionTotal2024, regionTotal2032, 8)
      };
    });
    
    return totals;
  }

  /**
   * Calculate CAGR
   */
  calculateCAGR(startValue, endValue, years) {
    if (startValue <= 0 || endValue <= 0 || years <= 0) return 0;
    return ((Math.pow(endValue / startValue, 1 / years) - 1) * 100);
  }

  /**
   * Calculate market share
   */
  calculateMarketShare(segmentValue, totalValue) {
    return totalValue > 0 ? (segmentValue / totalValue) * 100 : 0;
  }

  /**
   * Generate overview data
   */
  generateOverview(totals) {
    return {
      marketName: "Global Skin Boosters Market",
      baseYear: 2024,
      forecastYear: 2032,
      cagr: totals.global.cagr,
      marketSizeBase: totals.global.marketSize2024,
      marketSizeForecast: totals.global.marketSize2032,
      keyDrivers: [
        "Rising awareness about aesthetic treatments",
        "Increasing disposable income in emerging markets",
        "Growing aging population globally",
        "Technological advancements in minimally invasive procedures"
      ],
      keyRestraints: [
        "High cost of treatments",
        "Risk of side effects and complications",
        "Lack of skilled professionals in developing regions"
      ]
    };
  }

  /**
   * Transform regional data
   */
  transformRegions(grouped, totals) {
    const regions = [];
    
    Object.keys(totals.regional).forEach(regionName => {
      const regionTotals = totals.regional[regionName];
      
      regions.push({
        name: regionName,
        marketShare2024: this.calculateMarketShare(
          regionTotals.marketSize2024, 
          totals.global.marketSize2024
        ),
        marketShare2032: this.calculateMarketShare(
          regionTotals.marketSize2032, 
          totals.global.marketSize2032
        ),
        cagr: regionTotals.cagr,
        keyMarkets: this.extractCountries(grouped[regionName]),
        marketDrivers: this.getRegionalDrivers(regionName)
      });
    });
    
    return regions.sort((a, b) => b.marketShare2032 - a.marketShare2032);
  }

  /**
   * Transform product types
   */
  transformProductTypes(grouped, totals) {
    const productTypes = [];
    
    if (grouped.Global && grouped.Global.Type) {
      Object.keys(grouped.Global.Type).forEach(typeName => {
        const timeSeries = grouped.Global.Type[typeName];
        const value2024 = timeSeries.find(d => d.year === 2024)?.value || 0;
        const value2032 = timeSeries.find(d => d.year === 2032)?.value || 0;
        
        productTypes.push({
          name: typeName,
          marketShare2024: this.calculateMarketShare(value2024, totals.global.marketSize2024),
          marketShare2032: this.calculateMarketShare(value2032, totals.global.marketSize2032),
          cagr: this.calculateCAGR(value2024, value2032, 8),
          description: this.getProductDescription(typeName),
          applications: this.getProductApplications(typeName)
        });
      });
    }
    
    return productTypes.sort((a, b) => b.marketShare2032 - a.marketShare2032);
  }

  /**
   * Transform ingredients
   */
  transformIngredients(grouped, totals) {
    const ingredients = [];
    
    if (grouped.Global && grouped.Global.Ingredient) {
      Object.keys(grouped.Global.Ingredient).forEach(ingredientName => {
        const timeSeries = grouped.Global.Ingredient[ingredientName];
        const value2024 = timeSeries.find(d => d.year === 2024)?.value || 0;
        const value2032 = timeSeries.find(d => d.year === 2032)?.value || 0;
        
        ingredients.push({
          name: ingredientName,
          marketShare2024: this.calculateMarketShare(value2024, totals.global.marketSize2024),
          marketShare2032: this.calculateMarketShare(value2032, totals.global.marketSize2032),
          cagr: this.calculateCAGR(value2024, value2032, 8),
          benefits: this.getIngredientBenefits(ingredientName)
        });
      });
    }
    
    return ingredients.sort((a, b) => b.marketShare2032 - a.marketShare2032);
  }

  /**
   * Transform gender segments
   */
  transformGender(grouped, totals) {
    const genderSegments = [];
    
    if (grouped.Global && grouped.Global.Gender) {
      Object.keys(grouped.Global.Gender).forEach(genderName => {
        const timeSeries = grouped.Global.Gender[genderName];
        const value2024 = timeSeries.find(d => d.year === 2024)?.value || 0;
        const value2032 = timeSeries.find(d => d.year === 2032)?.value || 0;
        
        genderSegments.push({
          name: genderName,
          marketShare2024: this.calculateMarketShare(value2024, totals.global.marketSize2024),
          marketShare2032: this.calculateMarketShare(value2032, totals.global.marketSize2032),
          cagr: this.calculateCAGR(value2024, value2032, 8),
          ageGroups: this.getAgeGroups(genderName)
        });
      });
    }
    
    return genderSegments;
  }

  /**
   * Transform end user segments
   */
  transformEndUsers(grouped, totals) {
    const endUsers = [];
    
    // Look for end user data in any region
    Object.keys(grouped).forEach(regionName => {
      if (grouped[regionName]['End User']) {
        Object.keys(grouped[regionName]['End User']).forEach(endUserName => {
          const timeSeries = grouped[regionName]['End User'][endUserName];
          const value2024 = timeSeries.find(d => d.year === 2024)?.value || 0;
          const value2032 = timeSeries.find(d => d.year === 2032)?.value || 0;
          
          // Avoid duplicates
          if (!endUsers.find(eu => eu.name === endUserName)) {
            endUsers.push({
              name: endUserName,
              marketShare2024: this.calculateMarketShare(value2024, totals.global.marketSize2024),
              marketShare2032: this.calculateMarketShare(value2032, totals.global.marketSize2032),
              cagr: this.calculateCAGR(value2024, value2032, 8),
              characteristics: this.getEndUserCharacteristics(endUserName)
            });
          }
        });
      }
    });
    
    return endUsers;
  }

  /**
   * Transform country data
   */
  transformCountries(grouped) {
    const countries = {};
    
    Object.keys(grouped).forEach(regionName => {
      if (grouped[regionName].Country) {
        Object.keys(grouped[regionName].Country).forEach(countryName => {
          const timeSeries = grouped[regionName].Country[countryName];
          const value2024 = timeSeries.find(d => d.year === 2024)?.value || 0;
          const value2032 = timeSeries.find(d => d.year === 2032)?.value || 0;
          
          countries[countryName] = {
            marketSize2024: value2024,
            marketSize2032: value2032,
            cagr: this.calculateCAGR(value2024, value2032, 8),
            population: this.getCountryPopulation(countryName),
            penetrationRate: this.getCountryPenetration(countryName),
            averageSpending: this.getCountrySpending(countryName)
          };
        });
      }
    });
    
    return countries;
  }

  /**
   * Generate time series data
   */
  generateTimeSeriesData(grouped) {
    return grouped;
  }

  /**
   * Generate processing metadata
   */
  generateMetadata(data, validationResults) {
    const regions = [...new Set(data.map(row => row.Region))];
    const segmentTypes = [...new Set(data.map(row => row['Segment Type']))];
    const years = [...new Set(data.map(row => row.Year))].sort();
    
    return {
      totalRecords: data.length,
      validRecords: validationResults.validRows,
      dataQuality: validationResults.quality,
      coverage: {
        regions: regions.length,
        segmentTypes: segmentTypes.length,
        yearRange: { start: Math.min(...years), end: Math.max(...years) },
        countries: this.countUniqueCountries(data)
      },
      processing: {
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      }
    };
  }

  /**
   * Count unique countries in data
   */
  countUniqueCountries(data) {
    const countries = new Set();
    data.forEach(row => {
      if (row['Segment Type'] === 'Country') {
        countries.add(row['Segment Name']);
      }
    });
    return countries.size;
  }

  // Helper methods for static data
  extractCountries(regionData) {
    return regionData?.Country ? Object.keys(regionData.Country) : [];
  }

  getRegionalDrivers(regionName) {
    const drivers = {
      'North America': ['High disposable income', 'Advanced healthcare infrastructure'],
      'Europe': ['Aging population', 'Aesthetic consciousness'],
      'Asia Pacific': ['Growing middle class', 'Increasing beauty awareness'],
      'Latin America': ['Beauty culture', 'Medical tourism'],
      'Middle East & Africa': ['Medical tourism', 'High-income demographics']
    };
    return drivers[regionName] || ['Market expansion', 'Economic growth'];
  }

  getProductDescription(typeName) {
    const descriptions = {
      'Mesotherapy': 'Injection of vitamins, minerals, and other nutrients directly into the skin',
      'Micro-needle': 'Minimally invasive skin treatment using fine needles to create micro-injuries'
    };
    return descriptions[typeName] || 'Advanced skin booster treatment';
  }

  getProductApplications(typeName) {
    const applications = {
      'Mesotherapy': ['Facial rejuvenation', 'Body contouring', 'Hair restoration'],
      'Micro-needle': ['Scar reduction', 'Skin texture improvement', 'Anti-aging']
    };
    return applications[typeName] || ['Skin enhancement', 'Anti-aging'];
  }

  getIngredientBenefits(ingredientName) {
    const benefits = {
      'Hyaluronic Acid (HA)': ['Deep hydration', 'Volume restoration', 'Skin elasticity'],
      'Polydeoxyribonucleotides (PDRN)': ['Tissue regeneration', 'Anti-inflammatory', 'Wound healing'],
      'Poly-L-Lactic Acid (PLLA)': ['Collagen stimulation', 'Long-lasting results'],
      'Polycaprolactone (PCL)': ['Collagen synthesis', 'Skin tightening'],
      'Exosomes': ['Cellular regeneration', 'Advanced anti-aging']
    };
    return benefits[ingredientName] || ['Skin enhancement', 'Anti-aging benefits'];
  }

  getAgeGroups(genderName) {
    return genderName === 'Female' ? ['25-35', '36-45', '46-55', '55+'] : ['30-40', '41-50', '50+'];
  }

  getEndUserCharacteristics(endUserName) {
    const characteristics = {
      'Medspas': ['Luxury experience', 'Comprehensive services', 'High-end clientele'],
      'Dermatology Clinics': ['Medical expertise', 'Clinical setting', 'Insurance coverage']
    };
    return characteristics[endUserName] || ['Professional service', 'Quality treatment'];
  }

  getCountryPopulation(countryName) {
    const populations = {
      'United States': 331.9,
      'US': 331.9,
      'Canada': 38.2,
      'Mexico': 128.9
    };
    return populations[countryName] || 50.0;
  }

  getCountryPenetration(countryName) {
    const penetrations = {
      'United States': 2.8,
      'US': 2.8,
      'Canada': 3.2,
      'Mexico': 1.1
    };
    return penetrations[countryName] || 2.0;
  }

  getCountrySpending(countryName) {
    const spending = {
      'United States': 890,
      'US': 890,
      'Canada': 1150,
      'Mexico': 650
    };
    return spending[countryName] || 750;
  }

  getStaticMarketPlayers() {
    return [
      {
        name: "Allergan Aesthetics (AbbVie)",
        marketShare: 18.5,
        headquarters: "Ireland",
        keyProducts: ["Juvederm", "Voluma", "Volbella", "Skinvive"],
        revenue2023: 4200
      },
      {
        name: "Galderma",
        marketShare: 15.2,
        headquarters: "Switzerland", 
        keyProducts: ["Restylane", "Emervel", "Sculptra", "Redensity"],
        revenue2023: 3800
      },
      {
        name: "Merz Pharma",
        marketShare: 12.8,
        headquarters: "Germany",
        keyProducts: ["Belotero", "Radiesse", "Ultherapy"],
        revenue2023: 2900
      },
      {
        name: "Sinclair Pharma",
        marketShare: 9.4,
        headquarters: "UK",
        keyProducts: ["Perfectha", "Sculptra", "Ellanse"],
        revenue2023: 1800
      },
      {
        name: "Others",
        marketShare: 44.1,
        headquarters: "Various",
        keyProducts: ["Various regional brands"],
        revenue2023: 8500
      }
    ];
  }

  getStaticMarketTrends() {
    return [
      {
        trend: "Rising Demand for Non-Invasive Procedures",
        impact: "High",
        description: "Consumers increasingly prefer minimally invasive treatments with minimal downtime",
        regions: ["North America", "Europe", "Asia Pacific"]
      },
      {
        trend: "Growing Male Market Segment",
        impact: "Medium",
        description: "Increasing acceptance of aesthetic treatments among male consumers",
        regions: ["North America", "Europe"]
      },
      {
        trend: "Technological Advancements",
        impact: "High", 
        description: "Development of new ingredients and delivery methods enhancing treatment efficacy",
        regions: ["Global"]
      },
      {
        trend: "Medical Tourism",
        impact: "Medium",
        description: "Cross-border travel for affordable and high-quality aesthetic treatments",
        regions: ["Asia Pacific", "Latin America", "Middle East & Africa"]
      }
    ];
  }
}

// Export singleton instance
export const dataTransformer = new DataTransformer();

// Export utility functions
export const {
  processCSVData,
  validateDataStructure,
  cleanData,
  validateDataQuality,
  transformToMarketData
} = dataTransformer;

export default DataTransformer;