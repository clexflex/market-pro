// src/data/marketData.js
// Market data now powered by real CSV data

import { embeddedDataService } from '../services/embeddedDataService';

// Initialize the data processing
let marketDataPromise = null;
let cachedMarketData = null;

/**
 * Get market data - processes embedded CSV on first call
 */
export const getMarketData = async () => {
  if (cachedMarketData) {
    return cachedMarketData;
  }

  if (!marketDataPromise) {
    marketDataPromise = embeddedDataService.processEmbeddedData();
  }

  cachedMarketData = await marketDataPromise;
  return cachedMarketData;
};

/**
 * Synchronous getter for market data (returns null if not loaded)
 */
export const getMarketDataSync = () => {
  return cachedMarketData;
};

/**
 * Check if market data is loaded
 */
export const isMarketDataLoaded = () => {
  return cachedMarketData !== null;
};

// For backward compatibility, export a default market data structure
// This will be populated with real data once processed
export const marketData = {
  // Overview will be populated with real data
  overview: {
    marketName: "Global Skin Boosters Market",
    baseYear: 2024,
    forecastYear: 2032,
    cagr: 0, // Will be calculated from real data
    marketSizeBase: 0, // Will be populated from real data
    marketSizeForecast: 0, // Will be populated from real data
    keyDrivers: [
      "Rising awareness about aesthetic treatments",
      "Increasing disposable income in emerging markets",
      "Growing aging population globally",
      "Technological advancements in minimally invasive procedures",
      "Expansion of medical tourism industry"
    ],
    keyRestraints: [
      "High cost of treatments",
      "Risk of side effects and complications",
      "Lack of skilled professionals in developing regions",
      "Regulatory compliance challenges"
    ]
  },

  // Regional data will be populated from CSV
  regions: [],
  
  // Product types will be populated from CSV
  productTypes: [],
  
  // Ingredients will be populated from CSV
  ingredients: [],
  
  // Gender segments will be populated from CSV
  gender: [],
  
  // End users will be populated from CSV
  endUsers: [],
  
  // Market players (static data)
  marketPlayers: [
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
      keyProducts: ["Belotero", "Radiesse", "Ultherapy", "Neocollagenesis"],
      revenue2023: 2900
    },
    {
      name: "Sinclair Pharma",
      marketShare: 9.4,
      headquarters: "UK",
      keyProducts: ["Perfectha", "Sculptra", "Ellanse", "Harmony"],
      revenue2023: 1800
    },
    {
      name: "Revance Therapeutics",
      marketShare: 6.8,
      headquarters: "United States",
      keyProducts: ["RHA Collection", "Opul", "DaxibotulinumtoxinA"],
      revenue2023: 1200
    },
    {
      name: "Others",
      marketShare: 31.3,
      headquarters: "Various",
      keyProducts: ["Various regional and emerging brands"],
      revenue2023: 7600
    }
  ]
};

// Initialize market data on module load
getMarketData().then(data => {
  // Update the marketData object with real data
  Object.assign(marketData, data);
}).catch(error => {
  console.error('Failed to load market data:', error);
});

// Time Series Data Generation Function - Enhanced
export const generateTimeSeriesData = (baseValue, cagr, startYear = 2024, endYear = 2032) => {
  const data = [];
  for (let year = startYear; year <= endYear; year++) {
    const value = baseValue * Math.pow(1 + cagr / 100, year - startYear);
    data.push({
      year,
      value: Math.round(value * 100) / 100
    });
  }
  return data;
};

// Regional Market Size Data - Will be populated from real CSV data
export let regionalMarketData = {};

// Product Type Market Data - Will be populated from real CSV data
export let productTypeData = {};

// Ingredient Market Data - Will be populated from real CSV data
export let ingredientData = {};

// Country-wise detailed data - Will be populated from real CSV data
export let countryData = {};

// Market Trends and Insights - Enhanced
export const marketTrends = [
  {
    trend: "Rising Demand for Non-Invasive Procedures",
    impact: "High",
    description: "Consumers increasingly prefer minimally invasive treatments with minimal downtime and natural-looking results",
    regions: ["North America", "Europe", "Asia Pacific"],
    growthDriver: true
  },
  {
    trend: "Growing Male Market Segment",
    impact: "Medium",
    description: "Increasing acceptance of aesthetic treatments among male consumers, especially in urban areas",
    regions: ["North America", "Europe"],
    growthDriver: true
  },
  {
    trend: "Technological Advancements in Delivery Systems",
    impact: "High", 
    description: "Development of new ingredients and delivery methods enhancing treatment efficacy and patient comfort",
    regions: ["Global"],
    growthDriver: true
  },
  {
    trend: "Medical Tourism Growth",
    impact: "Medium",
    description: "Cross-border travel for affordable and high-quality aesthetic treatments driving regional markets",
    regions: ["Asia Pacific", "Latin America", "Middle East & Africa"],
    growthDriver: true
  },
  {
    trend: "Regulatory Harmonization",
    impact: "Medium",
    description: "Standardization of safety protocols and regulatory requirements across regions",
    regions: ["Global"],
    growthDriver: false
  },
  {
    trend: "Personalized Treatment Approaches",
    impact: "High",
    description: "Customized treatment plans based on individual skin characteristics and desired outcomes",
    regions: ["North America", "Europe"],
    growthDriver: true
  }
];

// Update exported data objects when real data is loaded
getMarketData().then(data => {
  if (data.timeSeries) {
    // Update regional market data
    Object.keys(data.timeSeries).forEach(region => {
      if (data.timeSeries[region].Type) {
        const regionTypeData = data.timeSeries[region].Type;
        const years = [2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032];
        
        regionalMarketData[region] = years.map(year => {
          let totalValue = 0;
          Object.keys(regionTypeData).forEach(type => {
            const yearData = regionTypeData[type].find(d => d.year === year);
            if (yearData) totalValue += yearData.value;
          });
          return { year, value: totalValue };
        });
      }
    });

    // Update product type data
    if (data.timeSeries.Global && data.timeSeries.Global.Type) {
      productTypeData = data.timeSeries.Global.Type;
    }

    // Update ingredient data
    if (data.timeSeries.Global && data.timeSeries.Global.Ingredient) {
      ingredientData = data.timeSeries.Global.Ingredient;
    }

    // Update country data
    countryData = data.countries || {};
  }
}).catch(error => {
  console.error('Failed to update derived data:', error);
});

export default marketData;