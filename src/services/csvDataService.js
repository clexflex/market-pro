// src/services/csvDataService.js
// Modern CSV integration service using Papa Parse and real-time data processing

import Papa from 'papaparse';

/**
 * CSV Data Service for Market Research Dashboard
 * Handles real-time CSV data processing and transformation
 */
class CSVDataService {
  constructor() {
    this.csvData = [];
    this.processedData = {};
    this.isLoading = false;
    this.lastUpdated = null;
  }

  /**
   * Load CSV data from file or URL
   * @param {string|File} source - CSV file path, URL, or File object
   * @returns {Promise<Object>} Processed market data
   */
  async loadCSVData(source) {
    this.isLoading = true;
    
    try {
      const csvData = await this.parseCSV(source);
      this.csvData = csvData;
      this.processedData = this.transformCSVToMarketData(csvData);
      this.lastUpdated = new Date();
      this.isLoading = false;
      
      return this.processedData;
    } catch (error) {
      this.isLoading = false;
      throw new Error(`Failed to load CSV data: ${error.message}`);
    }
  }

  /**
   * Parse CSV using Papa Parse
   * @param {string|File} source - CSV source
   * @returns {Promise<Array>} Parsed CSV data
   */
  parseCSV(source) {
    return new Promise((resolve, reject) => {
      const config = {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        transformHeader: (header) => {
          // Clean and normalize headers
          return header.trim().replace(/[^\w\s]/gi, '').replace(/\s+/g, ' ');
        },
        transform: (value, header) => {
          // Transform specific columns
          if (header === 'Year') {
            return parseInt(value);
          }
          if (header.includes('Value')) {
            return parseFloat(value) || 0;
          }
          return typeof value === 'string' ? value.trim() : value;
        },
        complete: (results) => {
          if (results.errors.length > 0) {
            console.warn('CSV parsing warnings:', results.errors);
          }
          resolve(results.data);
        },
        error: (error) => {
          reject(error);
        }
      };

      if (typeof source === 'string') {
        // Load from URL or file path
        Papa.parse(source, { ...config, download: true });
      } else {
        // Load from File object
        Papa.parse(source, config);
      }
    });
  }

  /**
   * Transform CSV data to market data structure
   * @param {Array} csvData - Raw CSV data
   * @returns {Object} Transformed market data
   */
  transformCSVToMarketData(csvData) {
    // Group data by categories
    const groupedData = this.groupDataByCategory(csvData);
    
    // Calculate totals and shares
    const marketTotals = this.calculateMarketTotals(groupedData);
    
    // Transform to dashboard format
    return {
      overview: this.generateOverview(marketTotals),
      regions: this.transformRegions(groupedData, marketTotals),
      productTypes: this.transformProductTypes(groupedData, marketTotals),
      ingredients: this.transformIngredients(groupedData, marketTotals),
      gender: this.transformGender(groupedData, marketTotals),
      endUsers: this.transformEndUsers(groupedData, marketTotals),
      countries: this.transformCountries(groupedData),
      timeSeries: this.generateTimeSeries(groupedData),
      marketPlayers: this.generateMarketPlayers(), // Static data - could be enhanced
      trends: this.generateMarketTrends()
    };
  }

  /**
   * Group CSV data by region, segment type, and segment name
   */
  groupDataByCategory(csvData) {
    const grouped = {};
    
    csvData.forEach(row => {
      const region = row.Region;
      const segmentType = row['Segment Type'];
      const segmentName = row['Segment Name'];
      const year = row.Year;
      const value = row['Value USD Thousand'] / 1000; // Convert to millions
      
      if (!grouped[region]) grouped[region] = {};
      if (!grouped[region][segmentType]) grouped[region][segmentType] = {};
      if (!grouped[region][segmentType][segmentName]) {
        grouped[region][segmentType][segmentName] = [];
      }
      
      grouped[region][segmentType][segmentName].push({
        year,
        value
      });
    });
    
    // Sort time series data by year
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
   * Calculate market totals and CAGR
   */
  calculateMarketTotals(groupedData) {
    const totals = {};
    
    Object.keys(groupedData).forEach(region => {
      if (region === 'Global') {
        const globalData = groupedData[region];
        
        // Calculate total global market by summing all segments
        let total2024 = 0;
        let total2032 = 0;
        
        Object.keys(globalData).forEach(segmentType => {
          Object.keys(globalData[segmentType]).forEach(segmentName => {
            const timeSeries = globalData[segmentType][segmentName];
            const value2024 = timeSeries.find(d => d.year === 2024)?.value || 0;
            const value2032 = timeSeries.find(d => d.year === 2032)?.value || 0;
            
            if (segmentType === 'Type') { // Use main product types for total
              total2024 += value2024;
              total2032 += value2032;
            }
          });
        });
        
        totals.global = {
          marketSize2024: total2024,
          marketSize2032: total2032,
          cagr: this.calculateCAGR(total2024, total2032, 8)
        };
      }
    });
    
    return totals;
  }

  /**
   * Calculate CAGR (Compound Annual Growth Rate)
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
  generateOverview(marketTotals) {
    const global = marketTotals.global;
    
    return {
      marketName: "Global Skin Boosters Market",
      baseYear: 2024,
      forecastYear: 2032,
      cagr: global.cagr,
      marketSizeBase: global.marketSize2024,
      marketSizeForecast: global.marketSize2032,
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
  transformRegions(groupedData, marketTotals) {
    const regions = [];
    const globalTotal2024 = marketTotals.global.marketSize2024;
    const globalTotal2032 = marketTotals.global.marketSize2032;
    
    Object.keys(groupedData).forEach(regionName => {
      if (regionName === 'Global') return;
      
      const regionData = groupedData[regionName];
      
      // Calculate regional totals
      let regionTotal2024 = 0;
      let regionTotal2032 = 0;
      
      if (regionData.Type) {
        Object.keys(regionData.Type).forEach(segmentName => {
          const timeSeries = regionData.Type[segmentName];
          regionTotal2024 += timeSeries.find(d => d.year === 2024)?.value || 0;
          regionTotal2032 += timeSeries.find(d => d.year === 2032)?.value || 0;
        });
      }
      
      if (regionTotal2024 > 0 || regionTotal2032 > 0) {
        regions.push({
          name: regionName,
          marketShare2024: this.calculateMarketShare(regionTotal2024, globalTotal2024),
          marketShare2032: this.calculateMarketShare(regionTotal2032, globalTotal2032),
          cagr: this.calculateCAGR(regionTotal2024, regionTotal2032, 8),
          keyMarkets: this.extractCountries(regionData),
          marketDrivers: this.getRegionalDrivers(regionName)
        });
      }
    });
    
    return regions;
  }

  /**
   * Transform product types
   */
  transformProductTypes(groupedData, marketTotals) {
    const productTypes = [];
    const globalData = groupedData.Global;
    const globalTotal2024 = marketTotals.global.marketSize2024;
    const globalTotal2032 = marketTotals.global.marketSize2032;
    
    if (globalData.Type) {
      Object.keys(globalData.Type).forEach(typeName => {
        const timeSeries = globalData.Type[typeName];
        const value2024 = timeSeries.find(d => d.year === 2024)?.value || 0;
        const value2032 = timeSeries.find(d => d.year === 2032)?.value || 0;
        
        productTypes.push({
          name: typeName,
          marketShare2024: this.calculateMarketShare(value2024, globalTotal2024),
          marketShare2032: this.calculateMarketShare(value2032, globalTotal2032),
          cagr: this.calculateCAGR(value2024, value2032, 8),
          description: this.getProductDescription(typeName),
          applications: this.getProductApplications(typeName)
        });
      });
    }
    
    return productTypes;
  }

  /**
   * Transform ingredients
   */
  transformIngredients(groupedData, marketTotals) {
    const ingredients = [];
    const globalData = groupedData.Global;
    const globalTotal2024 = marketTotals.global.marketSize2024;
    const globalTotal2032 = marketTotals.global.marketSize2032;
    
    if (globalData.Ingredient) {
      Object.keys(globalData.Ingredient).forEach(ingredientName => {
        const timeSeries = globalData.Ingredient[ingredientName];
        const value2024 = timeSeries.find(d => d.year === 2024)?.value || 0;
        const value2032 = timeSeries.find(d => d.year === 2032)?.value || 0;
        
        ingredients.push({
          name: ingredientName,
          marketShare2024: this.calculateMarketShare(value2024, globalTotal2024),
          marketShare2032: this.calculateMarketShare(value2032, globalTotal2032),
          cagr: this.calculateCAGR(value2024, value2032, 8),
          benefits: this.getIngredientBenefits(ingredientName)
        });
      });
    }
    
    return ingredients;
  }

  /**
   * Transform gender segments
   */
  transformGender(groupedData, marketTotals) {
    const genderSegments = [];
    const globalData = groupedData.Global;
    const globalTotal2024 = marketTotals.global.marketSize2024;
    const globalTotal2032 = marketTotals.global.marketSize2032;
    
    if (globalData.Gender) {
      Object.keys(globalData.Gender).forEach(genderName => {
        const timeSeries = globalData.Gender[genderName];
        const value2024 = timeSeries.find(d => d.year === 2024)?.value || 0;
        const value2032 = timeSeries.find(d => d.year === 2032)?.value || 0;
        
        genderSegments.push({
          name: genderName,
          marketShare2024: this.calculateMarketShare(value2024, globalTotal2024),
          marketShare2032: this.calculateMarketShare(value2032, globalTotal2032),
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
  transformEndUsers(groupedData, marketTotals) {
    const endUsers = [];
    
    // Use North America data for end users (as available in CSV)
    Object.keys(groupedData).forEach(regionName => {
      const regionData = groupedData[regionName];
      
      if (regionData['End User']) {
        Object.keys(regionData['End User']).forEach(endUserName => {
          const timeSeries = regionData['End User'][endUserName];
          const value2024 = timeSeries.find(d => d.year === 2024)?.value || 0;
          const value2032 = timeSeries.find(d => d.year === 2032)?.value || 0;
          
          // Avoid duplicates
          if (!endUsers.find(eu => eu.name === endUserName)) {
            endUsers.push({
              name: endUserName,
              marketShare2024: this.calculateMarketShare(value2024, marketTotals.global.marketSize2024),
              marketShare2032: this.calculateMarketShare(value2032, marketTotals.global.marketSize2032),
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
  transformCountries(groupedData) {
    const countries = {};
    
    Object.keys(groupedData).forEach(regionName => {
      const regionData = groupedData[regionName];
      
      if (regionData.Country) {
        Object.keys(regionData.Country).forEach(countryName => {
          const timeSeries = regionData.Country[countryName];
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
   * Generate time series data for charts
   */
  generateTimeSeries(groupedData) {
    const timeSeries = {};
    
    Object.keys(groupedData).forEach(regionName => {
      timeSeries[regionName] = {};
      
      Object.keys(groupedData[regionName]).forEach(segmentType => {
        timeSeries[regionName][segmentType] = {};
        
        Object.keys(groupedData[regionName][segmentType]).forEach(segmentName => {
          timeSeries[regionName][segmentType][segmentName] = 
            groupedData[regionName][segmentType][segmentName];
        });
      });
    });
    
    return timeSeries;
  }

  // Helper methods for static data
  extractCountries(regionData) {
    if (regionData.Country) {
      return Object.keys(regionData.Country);
    }
    return [];
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
      'Hyaluronic acid (HA)': ['Deep hydration', 'Volume restoration', 'Skin elasticity'],
      'Polydeoxyribonucleotides (PDRN)': ['Tissue regeneration', 'Anti-inflammatory', 'Wound healing'],
      'Poly-L-Lactic Acid (PLLA)/ Poly-D, L-Lactic Acid (PDLLA)': ['Collagen stimulation', 'Long-lasting results'],
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
      'US': 331.9,
      'Canada': 38.2,
      'Mexico': 128.9
    };
    return populations[countryName] || 50.0;
  }

  getCountryPenetration(countryName) {
    const penetrations = {
      'US': 2.8,
      'Canada': 3.2,
      'Mexico': 1.1
    };
    return penetrations[countryName] || 2.0;
  }

  getCountrySpending(countryName) {
    const spending = {
      'US': 890,
      'Canada': 1150,
      'Mexico': 650
    };
    return spending[countryName] || 750;
  }

  generateMarketPlayers() {
    // Static market players data - could be enhanced with CSV integration
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

  generateMarketTrends() {
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

  /**
   * Get current processed data
   */
  getProcessedData() {
    return this.processedData;
  }

  /**
   * Get loading status
   */
  isDataLoading() {
    return this.isLoading;
  }

  /**
   * Get last update timestamp
   */
  getLastUpdated() {
    return this.lastUpdated;
  }

  /**
   * Refresh data from source
   */
  async refreshData(source) {
    return await this.loadCSVData(source);
  }
}

// Export singleton instance
export const csvDataService = new CSVDataService();

// React Hook for using CSV data in components
export const useCSVData = () => {
  const [data, setData] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [lastUpdated, setLastUpdated] = React.useState(null);

  const loadData = async (source) => {
    try {
      setLoading(true);
      setError(null);
      const processedData = await csvDataService.loadCSVData(source);
      setData(processedData);
      setLastUpdated(csvDataService.getLastUpdated());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async (source) => {
    await loadData(source);
  };

  return {
    data,
    loading,
    error,
    lastUpdated,
    loadData,
    refreshData
  };
};

export default CSVDataService;