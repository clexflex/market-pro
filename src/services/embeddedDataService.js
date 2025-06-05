// src/services/embeddedDataService.js
// Service for processing embedded CSV data at build time/runtime

import Papa from 'papaparse';

/**
 * Embedded Data Service for Market Research Dashboard
 * Processes CSV data that's embedded in the project
 */
class EmbeddedDataService {
  constructor() {
    this.processedData = null;
    this.isProcessed = false;
    this.processingPromise = null;
  }

  /**
   * Process embedded CSV data
   * @returns {Promise<Object>} Processed market data
   */
  async processEmbeddedData() {
    if (this.isProcessed && this.processedData) {
      return this.processedData;
    }

    if (this.processingPromise) {
      return this.processingPromise;
    }

    this.processingPromise = this._loadAndProcessData();
    return this.processingPromise;
  }

  /**
   * Load and process the embedded CSV data
   * @private
   */
  async _loadAndProcessData() {
    try {
      // Import the CSV data as text
      const csvText = await this._loadCSVText();
      
      // Parse CSV
      const parsedData = await this._parseCSV(csvText);
      
      // Transform to market data structure
      this.processedData = this._transformToMarketData(parsedData);
      this.isProcessed = true;
      
      return this.processedData;
    } catch (error) {
      console.error('Failed to process embedded data:', error);
      throw error;
    }
  }

  /**
   * Load CSV text from embedded file
   * @private
   */
  async _loadCSVText() {
    try {
      // For static builds, we'll need to import the CSV as text
      // This requires the CSV to be in the public directory or imported as text
      const response = await fetch('/data/market-data.csv');
      if (!response.ok) {
        throw new Error(`Failed to load CSV file: ${response.statusText}`);
      }
      return await response.text();
    } catch (error) {
      // Fallback: if public folder doesn't work, use inline data
      console.warn('Could not load from public folder, using inline data');
      return this._getInlineCSVData();
    }
  }

  /**
   * Inline CSV data as fallback
   * @private
   */
  _getInlineCSVData() {
    // This is your CSV data as a string - you can paste your entire CSV content here
    return `Region,Segment Type,Segment Name,Year,Value (USD Thousand)
Global,Type,Mesotherapy,2024,823932.7502
Global,Type,Mesotherapy,2025,909300.1651
Global,Type,Mesotherapy,2026,1005710.869
Global,Type,Mesotherapy,2027,1116087.708
Global,Type,Mesotherapy,2028,1244324.298
Global,Type,Mesotherapy,2029,1395762.42
Global,Type,Mesotherapy,2030,1577623.259
Global,Type,Mesotherapy,2031,1783182.137
Global,Type,Mesotherapy,2032,2015525.275
Global,Type,Micro-needle,2024,534317.2498
Global,Type,Micro-needle,2025,582873.2849
Global,Type,Micro-needle,2026,637172.0992
Global,Type,Micro-needle,2027,698805.1075
Global,Type,Micro-needle,2028,769880.0462
Global,Type,Micro-needle,2029,853278.0089
Global,Type,Micro-needle,2030,952862.0886
Global,Type,Micro-needle,2031,1063968.147
Global,Type,Micro-needle,2032,1187917.396
Global,Ingredient,Hyaluronic acid (HA),2024,862913.4863
Global,Ingredient,Hyaluronic acid (HA),2025,946025.0387
Global,Ingredient,Hyaluronic acid (HA),2026,1039404.953
Global,Ingredient,Hyaluronic acid (HA),2027,1145836.533
Global,Ingredient,Hyaluronic acid (HA),2028,1269015.929
Global,Ingredient,Hyaluronic acid (HA),2029,1414003.962
Global,Ingredient,Hyaluronic acid (HA),2030,1587612.764
Global,Ingredient,Hyaluronic acid (HA),2031,1782525.34
Global,Ingredient,Hyaluronic acid (HA),2032,2001352.599
Global,Ingredient,Polydeoxyribonucleotides (PDRN),2024,121057.4355
Global,Ingredient,Polydeoxyribonucleotides (PDRN),2025,134867.0682
Global,Ingredient,Polydeoxyribonucleotides (PDRN),2026,150582.0834
Global,Ingredient,Polydeoxyribonucleotides (PDRN),2027,168695.6959
Global,Ingredient,Polydeoxyribonucleotides (PDRN),2028,189867.3428
Global,Ingredient,Polydeoxyribonucleotides (PDRN),2029,215003.8493
Global,Ingredient,Polydeoxyribonucleotides (PDRN),2030,245337.9284
Global,Ingredient,Polydeoxyribonucleotides (PDRN),2031,279958.7272
Global,Ingredient,Polydeoxyribonucleotides (PDRN),2032,319473.9204
Global,Gender,Female,2024,1126722.013
Global,Gender,Female,2025,1234169.045
Global,Gender,Female,2026,1354809.935
Global,Gender,Female,2027,1492233.601
Global,Gender,Female,2028,1651203.797
Global,Gender,Female,2029,1838241.183
Global,Gender,Female,2030,2062117.556
Global,Gender,Female,2031,2313237.063
Global,Gender,Female,2032,2594909.143
Global,Gender,Male,2024,231527.9873
Global,Gender,Male,2025,258004.4047
Global,Gender,Male,2026,288073.0332
Global,Gender,Male,2027,322659.2138
Global,Gender,Male,2028,363000.547
Global,Gender,Male,2029,410799.2453
Global,Gender,Male,2030,468367.7921
Global,Gender,Male,2031,533913.2213
Global,Gender,Male,2032,608533.5278
North America,Country,US,2024,322251.8754
North America,Country,US,2025,350014.903
North America,Country,US,2026,381000.3224
North America,Country,US,2027,416122.4867
North America,Country,US,2028,456588.7642
North America,Country,US,2029,504046.3128
North America,Country,US,2030,560697.3387
North America,Country,US,2031,623715.5151
North America,Country,US,2032,693816.4619
North America,Country,Canada,2024,66486.58199
North America,Country,Canada,2025,71926.38886
North America,Country,Canada,2026,77981.25688
North America,Country,Canada,2027,84829.95563
North America,Country,Canada,2028,92707.83559
North America,Country,Canada,2029,101935.353
North America,Country,Canada,2030,112939.5494
North America,Country,Canada,2031,125131.6786
North America,Country,Canada,2032,138639.981
North America,Country,Mexico,2024,53915.21762
North America,Country,Mexico,2025,57792.99462
North America,Country,Mexico,2026,62075.33956
North America,Country,Mexico,2027,66888.37954
North America,Country,Mexico,2028,72396.78633
North America,Country,Mexico,2029,78823.56787
North America,Country,Mexico,2030,86463.09869
North America,Country,Mexico,2031,94826.25033
North America,Country,Mexico,2032,103979.4109`;
  }

  /**
   * Parse CSV using Papa Parse
   * @private
   */
  _parseCSV(csvText) {
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        transformHeader: (header) => header.trim(),
        transform: (value, header) => {
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
        error: (error) => reject(error)
      });
    });
  }

  /**
   * Transform CSV data to market data structure
   * @private
   */
  _transformToMarketData(csvData) {
    const groupedData = this._groupDataByCategory(csvData);
    const marketTotals = this._calculateMarketTotals(groupedData);
    
    return {
      overview: this._generateOverview(marketTotals),
      regions: this._transformRegions(groupedData, marketTotals),
      productTypes: this._transformProductTypes(groupedData, marketTotals),
      ingredients: this._transformIngredients(groupedData, marketTotals),
      gender: this._transformGender(groupedData, marketTotals),
      endUsers: this._transformEndUsers(groupedData, marketTotals),
      countries: this._transformCountries(groupedData),
      timeSeries: this._generateTimeSeries(groupedData),
      marketPlayers: this._generateMarketPlayers(),
      trends: this._generateMarketTrends(),
      metadata: {
        processedAt: new Date().toISOString(),
        totalRecords: csvData.length,
        dataSource: 'embedded-csv'
      }
    };
  }

  /**
   * Group CSV data by region, segment type, and segment name
   * @private
   */
  _groupDataByCategory(csvData) {
    const grouped = {};
    
    csvData.forEach(row => {
      const region = row.Region;
      const segmentType = row['Segment Type'];
      const segmentName = row['Segment Name'];
      const year = row.Year;
      const value = row['Value (USD Thousand)'] / 1000; // Convert to millions
      
      if (!grouped[region]) grouped[region] = {};
      if (!grouped[region][segmentType]) grouped[region][segmentType] = {};
      if (!grouped[region][segmentType][segmentName]) {
        grouped[region][segmentType][segmentName] = [];
      }
      
      grouped[region][segmentType][segmentName].push({ year, value });
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
   * @private
   */
  _calculateMarketTotals(groupedData) {
    const totals = {};
    
    if (groupedData.Global && groupedData.Global.Type) {
      let total2024 = 0;
      let total2032 = 0;
      
      Object.keys(groupedData.Global.Type).forEach(segmentName => {
        const timeSeries = groupedData.Global.Type[segmentName];
        const value2024 = timeSeries.find(d => d.year === 2024)?.value || 0;
        const value2032 = timeSeries.find(d => d.year === 2032)?.value || 0;
        
        total2024 += value2024;
        total2032 += value2032;
      });
      
      totals.global = {
        marketSize2024: total2024,
        marketSize2032: total2032,
        cagr: this._calculateCAGR(total2024, total2032, 8)
      };
    }
    
    return totals;
  }

  /**
   * Calculate CAGR
   * @private
   */
  _calculateCAGR(startValue, endValue, years) {
    if (startValue <= 0 || endValue <= 0 || years <= 0) return 0;
    return ((Math.pow(endValue / startValue, 1 / years) - 1) * 100);
  }

  /**
   * Calculate market share
   * @private
   */
  _calculateMarketShare(segmentValue, totalValue) {
    return totalValue > 0 ? (segmentValue / totalValue) * 100 : 0;
  }

  /**
   * Generate overview data
   * @private
   */
  _generateOverview(marketTotals) {
    const global = marketTotals.global || { marketSize2024: 0, marketSize2032: 0, cagr: 0 };
    
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
   * @private
   */
  _transformRegions(groupedData, marketTotals) {
    const regions = [];
    const globalTotal2024 = marketTotals.global?.marketSize2024 || 0;
    const globalTotal2032 = marketTotals.global?.marketSize2032 || 0;
    
    Object.keys(groupedData).forEach(regionName => {
      if (regionName === 'Global') return;
      
      const regionData = groupedData[regionName];
      let regionTotal2024 = 0;
      let regionTotal2032 = 0;
      
      // Calculate regional totals from Type data
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
          marketShare2024: this._calculateMarketShare(regionTotal2024, globalTotal2024),
          marketShare2032: this._calculateMarketShare(regionTotal2032, globalTotal2032),
          cagr: this._calculateCAGR(regionTotal2024, regionTotal2032, 8),
          keyMarkets: this._extractCountries(regionData),
          marketDrivers: this._getRegionalDrivers(regionName)
        });
      }
    });
    
    return regions;
  }

  /**
   * Transform product types
   * @private
   */
  _transformProductTypes(groupedData, marketTotals) {
    const productTypes = [];
    const globalData = groupedData.Global;
    const globalTotal2024 = marketTotals.global?.marketSize2024 || 0;
    const globalTotal2032 = marketTotals.global?.marketSize2032 || 0;
    
    if (globalData && globalData.Type) {
      Object.keys(globalData.Type).forEach(typeName => {
        const timeSeries = globalData.Type[typeName];
        const value2024 = timeSeries.find(d => d.year === 2024)?.value || 0;
        const value2032 = timeSeries.find(d => d.year === 2032)?.value || 0;
        
        productTypes.push({
          name: typeName,
          marketShare2024: this._calculateMarketShare(value2024, globalTotal2024),
          marketShare2032: this._calculateMarketShare(value2032, globalTotal2032),
          cagr: this._calculateCAGR(value2024, value2032, 8),
          description: this._getProductDescription(typeName),
          applications: this._getProductApplications(typeName)
        });
      });
    }
    
    return productTypes;
  }

  /**
   * Transform ingredients
   * @private
   */
  _transformIngredients(groupedData, marketTotals) {
    const ingredients = [];
    const globalData = groupedData.Global;
    const globalTotal2024 = marketTotals.global?.marketSize2024 || 0;
    const globalTotal2032 = marketTotals.global?.marketSize2032 || 0;
    
    if (globalData && globalData.Ingredient) {
      Object.keys(globalData.Ingredient).forEach(ingredientName => {
        const timeSeries = globalData.Ingredient[ingredientName];
        const value2024 = timeSeries.find(d => d.year === 2024)?.value || 0;
        const value2032 = timeSeries.find(d => d.year === 2032)?.value || 0;
        
        ingredients.push({
          name: ingredientName,
          marketShare2024: this._calculateMarketShare(value2024, globalTotal2024),
          marketShare2032: this._calculateMarketShare(value2032, globalTotal2032),
          cagr: this._calculateCAGR(value2024, value2032, 8),
          benefits: this._getIngredientBenefits(ingredientName)
        });
      });
    }
    
    return ingredients;
  }

  /**
   * Transform gender segments
   * @private
   */
  _transformGender(groupedData, marketTotals) {
    const genderSegments = [];
    const globalData = groupedData.Global;
    const globalTotal2024 = marketTotals.global?.marketSize2024 || 0;
    const globalTotal2032 = marketTotals.global?.marketSize2032 || 0;
    
    if (globalData && globalData.Gender) {
      Object.keys(globalData.Gender).forEach(genderName => {
        const timeSeries = globalData.Gender[genderName];
        const value2024 = timeSeries.find(d => d.year === 2024)?.value || 0;
        const value2032 = timeSeries.find(d => d.year === 2032)?.value || 0;
        
        genderSegments.push({
          name: genderName,
          marketShare2024: this._calculateMarketShare(value2024, globalTotal2024),
          marketShare2032: this._calculateMarketShare(value2032, globalTotal2032),
          cagr: this._calculateCAGR(value2024, value2032, 8),
          ageGroups: this._getAgeGroups(genderName)
        });
      });
    }
    
    return genderSegments;
  }

  /**
   * Transform end user segments
   * @private
   */
  _transformEndUsers(groupedData, marketTotals) {
    const endUsers = [];
    const globalTotal2024 = marketTotals.global?.marketSize2024 || 0;
    const globalTotal2032 = marketTotals.global?.marketSize2032 || 0;
    
    Object.keys(groupedData).forEach(regionName => {
      const regionData = groupedData[regionName];
      
      if (regionData['End User']) {
        Object.keys(regionData['End User']).forEach(endUserName => {
          const timeSeries = regionData['End User'][endUserName];
          const value2024 = timeSeries.find(d => d.year === 2024)?.value || 0;
          const value2032 = timeSeries.find(d => d.year === 2032)?.value || 0;
          
          if (!endUsers.find(eu => eu.name === endUserName)) {
            endUsers.push({
              name: endUserName,
              marketShare2024: this._calculateMarketShare(value2024, globalTotal2024),
              marketShare2032: this._calculateMarketShare(value2032, globalTotal2032),
              cagr: this._calculateCAGR(value2024, value2032, 8),
              characteristics: this._getEndUserCharacteristics(endUserName)
            });
          }
        });
      }
    });
    
    return endUsers;
  }

  /**
   * Transform country data
   * @private
   */
  _transformCountries(groupedData) {
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
            cagr: this._calculateCAGR(value2024, value2032, 8),
            population: this._getCountryPopulation(countryName),
            penetrationRate: this._getCountryPenetration(countryName),
            averageSpending: this._getCountrySpending(countryName)
          };
        });
      }
    });
    
    return countries;
  }

  /**
   * Generate time series data
   * @private
   */
  _generateTimeSeries(groupedData) {
    return groupedData;
  }

  // Helper methods for static data
  _extractCountries(regionData) {
    return regionData.Country ? Object.keys(regionData.Country) : [];
  }

  _getRegionalDrivers(regionName) {
    const drivers = {
      'North America': ['High disposable income', 'Advanced healthcare infrastructure'],
      'Europe': ['Aging population', 'Aesthetic consciousness'],
      'Asia Pacific': ['Growing middle class', 'Increasing beauty awareness'],
      'Latin America': ['Beauty culture', 'Medical tourism'],
      'Middle East & Africa': ['Medical tourism', 'High-income demographics']
    };
    return drivers[regionName] || ['Market expansion', 'Economic growth'];
  }

  _getProductDescription(typeName) {
    const descriptions = {
      'Mesotherapy': 'Injection of vitamins, minerals, and other nutrients directly into the skin',
      'Micro-needle': 'Minimally invasive skin treatment using fine needles to create micro-injuries'
    };
    return descriptions[typeName] || 'Advanced skin booster treatment';
  }

  _getProductApplications(typeName) {
    const applications = {
      'Mesotherapy': ['Facial rejuvenation', 'Body contouring', 'Hair restoration'],
      'Micro-needle': ['Scar reduction', 'Skin texture improvement', 'Anti-aging']
    };
    return applications[typeName] || ['Skin enhancement', 'Anti-aging'];
  }

  _getIngredientBenefits(ingredientName) {
    const benefits = {
      'Hyaluronic acid (HA)': ['Deep hydration', 'Volume restoration', 'Skin elasticity'],
      'Polydeoxyribonucleotides (PDRN)': ['Tissue regeneration', 'Anti-inflammatory', 'Wound healing'],
      'Poly-L-Lactic Acid (PLLA)/ Poly-D, L-Lactic Acid (PDLLA)': ['Collagen stimulation', 'Long-lasting results'],
      'Polycaprolactone (PCL)': ['Collagen synthesis', 'Skin tightening'],
      'Exosomes': ['Cellular regeneration', 'Advanced anti-aging']
    };
    return benefits[ingredientName] || ['Skin enhancement', 'Anti-aging benefits'];
  }

  _getAgeGroups(genderName) {
    return genderName === 'Female' ? ['25-35', '36-45', '46-55', '55+'] : ['30-40', '41-50', '50+'];
  }

  _getEndUserCharacteristics(endUserName) {
    const characteristics = {
      'Medspas': ['Luxury experience', 'Comprehensive services', 'High-end clientele'],
      'Dermatology Clinics': ['Medical expertise', 'Clinical setting', 'Insurance coverage']
    };
    return characteristics[endUserName] || ['Professional service', 'Quality treatment'];
  }

  _getCountryPopulation(countryName) {
    const populations = {
      'US': 331.9,
      'United States': 331.9,
      'Canada': 38.2,
      'Mexico': 128.9
    };
    return populations[countryName] || 50.0;
  }

  _getCountryPenetration(countryName) {
    const penetrations = {
      'US': 2.8,
      'United States': 2.8,
      'Canada': 3.2,
      'Mexico': 1.1
    };
    return penetrations[countryName] || 2.0;
  }

  _getCountrySpending(countryName) {
    const spending = {
      'US': 890,
      'United States': 890,
      'Canada': 1150,
      'Mexico': 650
    };
    return spending[countryName] || 750;
  }

  _generateMarketPlayers() {
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

  _generateMarketTrends() {
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
   * Get processed data
   */
  getProcessedData() {
    return this.processedData;
  }

  /**
   * Check if data is processed
   */
  isDataProcessed() {
    return this.isProcessed;
  }
}

// Export singleton instance
export const embeddedDataService = new EmbeddedDataService();

export default EmbeddedDataService;