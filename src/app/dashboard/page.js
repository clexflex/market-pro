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
  Progress 
} from '@/components/ui';
import {
  EnhancedLineChart,
  EnhancedAreaChart,
  EnhancedBarChart,
  MarketShareDonut,
  MarketGrowthChart
} from '@/components/charts';
import { 
  marketData, 
  regionalMarketData, 
  productTypeData, 
  ingredientData,
  generateTimeSeriesData 
} from '@/data/marketData';
import { formatCurrency, formatPercentage, calculateCAGR } from '@/lib/utils';

const ExecutiveSummary = () => {
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [selectedMetric]);

  // Calculate key metrics
  const currentYear = 2024;
  const forecastYear = 2032;
  const globalMarketSize2024 = marketData.overview.marketSizeBase;
  const globalMarketSize2032 = marketData.overview.marketSizeForecast;
  const marketCAGR = marketData.overview.cagr;
  
  // Regional data for 2032
  const regionalData2032 = marketData.regions.map(region => ({
    name: region.name,
    value: (globalMarketSize2032 * region.marketShare2032) / 100,
    share: region.marketShare2032,
    cagr: region.cagr
  })).sort((a, b) => b.value - a.value);

  // Product type data
  const productTypeData2032 = marketData.productTypes.map(product => ({
    name: product.name,
    value: (globalMarketSize2032 * product.marketShare2032) / 100,
    share: product.marketShare2032
  }));

  // Ingredient data
  const ingredientData2032 = marketData.ingredients.map(ingredient => ({
    name: ingredient.name,
    value: (globalMarketSize2032 * ingredient.marketShare2032) / 100,
    share: ingredient.marketShare2032
  })).slice(0, 5); // Top 5 ingredients

  // Generate market trend data
  const marketTrendData = generateTimeSeriesData(globalMarketSize2024, marketCAGR);

  // Key insights calculations
  const totalGrowth = ((globalMarketSize2032 - globalMarketSize2024) / globalMarketSize2024) * 100;
  const leadingRegion = regionalData2032[0];
  const fastestGrowingRegion = marketData.regions.reduce((a, b) => a.cagr > b.cagr ? a : b);

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
      trend: leadingRegion.cagr,
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
      items: [
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
              <h2 className="text-2xl font-bold mb-2">Global Skin Boosters Market</h2>
              <p className="text-primary-100 mb-4">
                Comprehensive market analysis and forecasting for {currentYear}-{forecastYear}
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span className="font-medium">Market Research Report</span>
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
                <p className="text-primary-100 text-sm">Report Date</p>
                <p className="font-semibold">December 2024</p>
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
                    {marketData.regions.length}
                  </div>
                  <div className="text-sm text-gray-600">Key Regions</div>
                  <Progress value={75} className="mt-2" />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {marketData.marketPlayers.length - 1}+
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
                    • <strong>Mesotherapy</strong> leads product category with {formatPercentage(productTypeData2032[0].share)} share
                  </div>
                  <div>
                    • <strong>Hyaluronic Acid</strong> dominates ingredient segment with {formatPercentage(ingredientData2032[0].share)} share
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