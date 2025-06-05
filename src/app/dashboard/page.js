// src/app/dashboard/page.js
'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Globe,
  Users,
  DollarSign,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Target,
  Zap,
  Award
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  MetricCard, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  Badge,
  Button,
  Progress,
  LoadingSpinner
} from '@/components/ui';
import {
  EnhancedLineChart,
  EnhancedAreaChart,
  EnhancedBarChart,
  MarketShareDonut,
  MarketGrowthChart
} from '@/components/charts';
import { useMarketData } from '@/hooks/useMarketData';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import { generateTimeSeriesData } from '@/data/marketData';

const ExecutiveSummary = () => {
  const { data: marketData, loading, error } = useMarketData();
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [selectedMetric]);

  // Show loading state
  if (loading) {
    return (
      <DashboardLayout 
        title="Executive Summary" 
        breadcrumb={['Dashboard', 'Executive Summary']}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <LoadingSpinner size="lg" className="mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Loading Market Data...
            </h3>
            <p className="text-gray-600">
              Processing comprehensive market research data
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Show error state
  if (error) {
    return (
      <DashboardLayout 
        title="Executive Summary" 
        breadcrumb={['Dashboard', 'Executive Summary']}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-600 mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Failed to Load Data
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Extract data from marketData
  const overview = marketData?.overview || {};
  const regions = marketData?.regions || [];
  const productTypes = marketData?.productTypes || [];
  const ingredients = marketData?.ingredients || [];

  // Calculate key metrics
  const currentYear = 2024;
  const forecastYear = 2032;
  const globalMarketSize2024 = overview.marketSizeBase || 0;
  const globalMarketSize2032 = overview.marketSizeForecast || 0;
  const marketCAGR = overview.cagr || 0;
  
  // Regional data for 2032
  const regionalData2032 = regions.map(region => ({
    name: region.name,
    value: (globalMarketSize2032 * region.marketShare2032) / 100,
    share: region.marketShare2032,
    cagr: region.cagr
  })).sort((a, b) => b.value - a.value);

  // Product type data
  const productTypeData2032 = productTypes.map(product => ({
    name: product.name,
    value: (globalMarketSize2032 * product.marketShare2032) / 100,
    share: product.marketShare2032
  }));

  // Ingredient data
  const ingredientData2032 = ingredients.slice(0, 5).map(ingredient => ({
    name: ingredient.name,
    value: (globalMarketSize2032 * ingredient.marketShare2032) / 100,
    share: ingredient.marketShare2032
  }));

  // Generate market trend data
  const marketTrendData = generateTimeSeriesData(globalMarketSize2024, marketCAGR);

  // Key insights calculations
  const totalGrowth = globalMarketSize2024 > 0 ? ((globalMarketSize2032 - globalMarketSize2024) / globalMarketSize2024) * 100 : 0;
  const leadingRegion = regionalData2032[0] || { name: 'N/A', share: 0, cagr: 0 };
  const fastestGrowingRegion = regions.reduce((a, b) => (a.cagr || 0) > (b.cagr || 0) ? a : b, { name: 'N/A', cagr: 0 });

  const keyMetrics = [
    {
      title: 'Market Size 2032',
      value: formatCurrency(globalMarketSize2032),
      subtitle: 'Global market value',
      trend: marketCAGR,
      icon: DollarSign,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'CAGR (2024-2032)',
      value: formatPercentage(marketCAGR),
      subtitle: 'Compound Annual Growth Rate',
      trend: marketCAGR > 10 ? 5.2 : -2.1,
      icon: TrendingUp,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Leading Region',
      value: leadingRegion.name,
      subtitle: `${formatPercentage(leadingRegion.share)} market share`,
      trend: leadingRegion.cagr || 0,
      icon: Globe,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Total Growth',
      value: formatPercentage(totalGrowth),
      subtitle: '2024-2032 period',
      trend: totalGrowth > 100 ? 8.3 : 3.1,
      icon: Activity,
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const marketHighlights = [
    {
      title: 'Market Drivers',
      icon: Zap,
      items: overview.keyDrivers || [
        'Rising aesthetic consciousness among consumers',
        'Increasing disposable income in emerging markets',
        'Technological advancements in treatment methods',
        'Growing aging population globally'
      ],
      color: 'bg-blue-50 border-blue-200'
    },
    {
      title: 'Growth Opportunities',
      icon: Target,
      items: [
        'Male consumer segment expansion',
        'Asia-Pacific market penetration',
        'New ingredient development',
        'Medical tourism growth'
      ],
      color: 'bg-green-50 border-green-200'
    },
    {
      title: 'Key Success Factors',
      icon: Award,
      items: [
        'Product innovation and safety',
        'Strategic regional partnerships',
        'Regulatory compliance',
        'Brand positioning and marketing'
      ],
      color: 'bg-purple-50 border-purple-200'
    }
  ];

  return (
    <DashboardLayout 
      title="Executive Summary" 
      breadcrumb={['Dashboard', 'Executive Summary']}
    >
      <div className="space-y-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl p-6 text-white"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">{overview.marketName || 'Global Skin Boosters Market'}</h2>
              <p className="text-primary-100 mb-4">
                Real-time market analysis and forecasting for {currentYear}-{forecastYear}
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span className="font-medium">Live Data Dashboard</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="w-5 h-5" />
                  <span>Global Coverage</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Multi-Segment Analysis</span>
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="text-right">
                <p className="text-primary-100 text-sm">Data Status</p>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <p className="font-semibold text-green-200">Live & Current</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {keyMetrics.map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <MetricCard
                title={metric.title}
                value={metric.value}
                subtitle={metric.subtitle}
                trend={metric.trend}
                icon={metric.icon}
                className="h-full"
              />
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Market Growth Trend */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <EnhancedLineChart
              data={marketTrendData}
              title="Market Growth Trajectory"
              description={`Global market size from ${currentYear} to ${forecastYear}`}
              lines={['value']}
              height={350}
              formatter={(value) => formatCurrency(value)}
            />
          </motion.div>

          {/* Regional Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <MarketShareDonut
              data={regionalData2032}
              title="Regional Market Share 2032"
              description="Market distribution by geographic regions"
              height={350}
            />
          </motion.div>
        </div>

        {/* Secondary Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Product Type Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <EnhancedBarChart
              data={productTypeData2032}
              title="Product Type Breakdown"
              description="Market share by product categories"
              bars={['value']}
              xKey="name"
              height={300}
              formatter={(value) => formatCurrency(value)}
            />
          </motion.div>

          {/* Top Ingredients */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <EnhancedBarChart
              data={ingredientData2032}
              title="Leading Ingredients"
              description="Top 5 ingredients by market value"
              bars={['value']}
              xKey="name"
              height={300}
              horizontal={true}
              formatter={(value) => formatCurrency(value)}
            />
          </motion.div>
        </div>

        {/* Market Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {marketHighlights.map((highlight, index) => (
            <Card key={highlight.title} className={highlight.color}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <highlight.icon className="w-5 h-5" />
                  <span>{highlight.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {highlight.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start space-x-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-current rounded-full mt-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Market Performance Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Market Performance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">
                    {formatCurrency(globalMarketSize2032)}
                  </div>
                  <div className="text-sm text-gray-600">Market Size 2032</div>
                  <Progress value={100} className="mt-2" />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {formatPercentage(marketCAGR)}
                  </div>
                  <div className="text-sm text-gray-600">CAGR 2024-32</div>
                  <Progress value={marketCAGR * 8.5} className="mt-2" />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {regions.length}
                  </div>
                  <div className="text-sm text-gray-600">Key Regions</div>
                  <Progress value={75} className="mt-2" />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {marketData?.marketPlayers?.length || 0}+
                  </div>
                  <div className="text-sm text-gray-600">Market Players</div>
                  <Progress value={60} className="mt-2" />
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Key Takeaways</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    • <strong>{leadingRegion.name}</strong> dominates with {formatPercentage(leadingRegion.share)} market share
                  </div>
                  <div>
                    • <strong>{fastestGrowingRegion.name}</strong> shows fastest growth at {formatPercentage(fastestGrowingRegion.cagr)} CAGR
                  </div>
                  <div>
                    • <strong>{productTypes[0]?.name || 'Leading Product'}</strong> leads product category with {formatPercentage(productTypes[0]?.marketShare2032 || 0)} share
                  </div>
                  <div>
                    • <strong>{ingredients[0]?.name || 'Leading Ingredient'}</strong> dominates ingredient segment with {formatPercentage(ingredients[0]?.marketShare2032 || 0)} share
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default ExecutiveSummary;