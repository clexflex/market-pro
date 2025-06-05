// Comprehensive Market Research Data - Skin Boosters Market
// This represents a typical market research report with granular segmentation

export const marketData = {
  // Market Overview
  overview: {
    marketName: "Global Skin Boosters Market",
    baseYear: 2024,
    forecastYear: 2032,
    cagr: 11.8,
    marketSizeBase: 1358.25, // USD Million
    marketSizeForecast: 3203.45, // USD Million
    keyDrivers: [
      "Rising awareness about aesthetic treatments",
      "Increasing disposable income",
      "Growing aging population",
      "Technological advancements in minimally invasive procedures"
    ],
    keyRestraints: [
      "High cost of treatments",
      "Risk of side effects",
      "Lack of skilled professionals in developing regions"
    ]
  },

  // Regional Data
  regions: [
    {
      name: "North America",
      countries: ["United States", "Canada", "Mexico"],
      marketShare2024: 32.5,
      marketShare2032: 35.2,
      cagr: 12.4,
      keyMarkets: ["United States", "Canada"],
      marketDrivers: ["High disposable income", "Advanced healthcare infrastructure"]
    },
    {
      name: "Europe",
      countries: ["Germany", "France", "UK", "Italy", "Spain", "Rest of Europe"],
      marketShare2024: 28.7,
      marketShare2032: 27.8,
      cagr: 11.2,
      keyMarkets: ["Germany", "France", "UK"],
      marketDrivers: ["Aging population", "Aesthetic consciousness"]
    },
    {
      name: "Asia Pacific",
      countries: ["China", "Japan", "India", "South Korea", "Australia", "Rest of APAC"],
      marketShare2024: 25.1,
      marketShare2032: 26.8,
      cagr: 12.8,
      keyMarkets: ["China", "Japan", "South Korea"],
      marketDrivers: ["Growing middle class", "Increasing beauty awareness"]
    },
    {
      name: "Latin America",
      countries: ["Brazil", "Argentina", "Colombia", "Rest of LATAM"],
      marketShare2024: 8.4,
      marketShare2032: 6.9,
      cagr: 9.8,
      keyMarkets: ["Brazil", "Argentina"],
      marketDrivers: ["Beauty culture", "Medical tourism"]
    },
    {
      name: "Middle East & Africa",
      countries: ["UAE", "Saudi Arabia", "South Africa", "Rest of MEA"],
      marketShare2024: 5.3,
      marketShare2032: 3.3,
      cagr: 7.2,
      keyMarkets: ["UAE", "Saudi Arabia"],
      marketDrivers: ["Medical tourism", "High-income demographics"]
    }
  ],

  // Product Type Segmentation
  productTypes: [
    {
      name: "Mesotherapy",
      description: "Injection of vitamins, minerals, and other nutrients",
      marketShare2024: 60.7,
      marketShare2032: 62.9,
      cagr: 12.2,
      applications: ["Facial rejuvenation", "Body contouring", "Hair restoration"]
    },
    {
      name: "Micro-needling",
      description: "Minimally invasive skin treatment using fine needles",
      marketShare2024: 39.3,
      marketShare2032: 37.1,
      cagr: 11.2,
      applications: ["Scar reduction", "Skin texture improvement", "Anti-aging"]
    }
  ],

  // Ingredient Segmentation
  ingredients: [
    {
      name: "Hyaluronic Acid (HA)",
      marketShare2024: 63.5,
      marketShare2032: 62.5,
      cagr: 11.6,
      benefits: ["Hydration", "Volume restoration", "Skin elasticity"]
    },
    {
      name: "Polydeoxyribonucleotides (PDRN)",
      marketShare2024: 8.9,
      marketShare2032: 10.0,
      cagr: 13.8,
      benefits: ["Tissue regeneration", "Anti-inflammatory", "Wound healing"]
    },
    {
      name: "Poly-L-Lactic Acid (PLLA)",
      marketShare2024: 18.1,
      marketShare2032: 18.7,
      cagr: 12.0,
      benefits: ["Collagen stimulation", "Volume restoration", "Long-lasting results"]
    },
    {
      name: "Polycaprolactone (PCL)",
      marketShare2024: 6.8,
      marketShare2032: 6.6,
      cagr: 11.4,
      benefits: ["Collagen synthesis", "Skin tightening", "Natural degradation"]
    },
    {
      name: "Exosomes",
      marketShare2024: 2.6,
      marketShare2032: 2.3,
      cagr: 10.1,
      benefits: ["Cellular regeneration", "Anti-aging", "Skin repair"]
    }
  ],

  // Gender Segmentation
  gender: [
    {
      name: "Female",
      marketShare2024: 83.0,
      marketShare2032: 81.0,
      cagr: 11.5,
      ageGroups: ["25-35", "36-45", "46-55", "55+"]
    },
    {
      name: "Male",
      marketShare2024: 17.0,
      marketShare2032: 19.0,
      cagr: 13.2,
      ageGroups: ["30-40", "41-50", "50+"]
    }
  ],

  // End User Segmentation
  endUsers: [
    {
      name: "Medspas",
      marketShare2024: 59.4,
      marketShare2032: 61.2,
      cagr: 12.1,
      characteristics: ["Luxury experience", "Comprehensive services", "High-end clientele"]
    },
    {
      name: "Dermatology Clinics",
      marketShare2024: 40.6,
      marketShare2032: 38.8,
      cagr: 11.4,
      characteristics: ["Medical expertise", "Clinical setting", "Insurance coverage"]
    }
  ],

  // Competitive Landscape
  marketPlayers: [
    {
      name: "Allergan Aesthetics",
      marketShare: 18.5,
      headquarters: "Ireland",
      keyProducts: ["Juvederm", "Voluma", "Volbella"],
      revenue2023: 4200 // Million USD
    },
    {
      name: "Galderma",
      marketShare: 15.2,
      headquarters: "Switzerland", 
      keyProducts: ["Restylane", "Emervel", "Sculptra"],
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
  ]
};

// Time Series Data Generation Function
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

// Regional Market Size Data
export const regionalMarketData = {
  "North America": generateTimeSeriesData(441.43, 12.4),
  "Europe": generateTimeSeriesData(389.72, 11.2),
  "Asia Pacific": generateTimeSeriesData(340.82, 12.8),
  "Latin America": generateTimeSeriesData(114.09, 9.8),
  "Middle East & Africa": generateTimeSeriesData(71.94, 7.2)
};

// Product Type Market Data
export const productTypeData = {
  "Mesotherapy": generateTimeSeriesData(823.93, 12.2),
  "Micro-needling": generateTimeSeriesData(534.32, 11.2)
};

// Ingredient Market Data
export const ingredientData = {
  "Hyaluronic Acid (HA)": generateTimeSeriesData(862.91, 11.6),
  "Polydeoxyribonucleotides (PDRN)": generateTimeSeriesData(121.06, 13.8),
  "Poly-L-Lactic Acid (PLLA)": generateTimeSeriesData(246.50, 12.0),
  "Polycaprolactone (PCL)": generateTimeSeriesData(92.94, 11.4),
  "Exosomes": generateTimeSeriesData(34.84, 10.1)
};

// Country-wise detailed data
export const countryData = {
  "United States": {
    marketSize2024: 322.25,
    marketSize2032: 693.82,
    cagr: 12.5,
    population: 331.9, // Million
    penetrationRate: 2.8, // %
    averageSpending: 890 // USD per treatment
  },
  "Germany": {
    marketSize2024: 89.45,
    marketSize2032: 186.23,
    cagr: 11.0,
    population: 83.2,
    penetrationRate: 3.1,
    averageSpending: 1200
  },
  "China": {
    marketSize2024: 145.67,
    marketSize2032: 385.92,
    cagr: 14.2,
    population: 1412.0,
    penetrationRate: 0.9,
    averageSpending: 650
  },
  "Japan": {
    marketSize2024: 98.34,
    marketSize2032: 198.45,
    cagr: 10.5,
    population: 125.8,
    penetrationRate: 4.2,
    averageSpending: 1450
  },
  "United Kingdom": {
    marketSize2024: 67.89,
    marketSize2032: 142.56,
    cagr: 11.3,
    population: 67.5,
    penetrationRate: 2.9,
    averageSpending: 1150
  }
};

// Market Trends and Insights
export const marketTrends = [
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

// Export all data
export default {
  marketData,
  regionalMarketData,
  productTypeData,
  ingredientData,
  countryData,
  marketTrends,
  generateTimeSeriesData
};