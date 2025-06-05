'use client';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  Zap,
  BarChart3,
  LineChart,
  Calculator,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight
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
  Select,
  Alert,
  LoadingSpinner
} from '@/components/ui';
import {
  EnhancedLineChart,
  EnhancedAreaChart,
  EnhancedBarChart,
  MarketGrowthChart
} from '@/components/charts';
import { useMarketData } from '@/hooks/useMarketData';
import { formatCurrency, formatPercentage, calculateCAGR } from '@/lib/utils';

// Move scenarios outside component to avoid dependency array issue
const scenarios = {
  conservative: { label: 'Conservative', modifier: 0.85, color: 'text-red-600' },
  base: { label: 'Base Case', modifier: 1.0, color: 'text-blue-600' },
  optimistic: { label: 'Optimistic', modifier: 1.15, color: 'text-green-600' }
};

const GrowthAnalysis = () => {
  const { data: marketData, loading, error } = useMarketData();
  const [selectedScenario, setSelectedScenario] = useState('base');
  const [selectedTimeframe, setSelectedTimeframe] = useState('full'); // full, short, long
  const [focusMetric, setFocusMetric] = useState('revenue'); // revenue, growth, penetration

  // Generate time series data for market growth
  const generateTimeSeriesData = (baseValue, cagr, startYear = 2024, endYear = 2032) => {
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

  // Calculate scenario-based projections - MOVED BEFORE EARLY RETURNS
  const getScenarioData = useMemo(() => {
    if (!marketData?.overview) return { cagr: 0, marketSize2032: 0, timeSeriesData: [], totalGrowth: 0 };
    
    const modifier = scenarios[selectedScenario].modifier;
    const baseCAGR = marketData.overview.cagr;
    const adjustedCAGR = baseCAGR * modifier;
    
    return {
      cagr: adjustedCAGR,
      marketSize2032: marketData.overview.marketSizeBase * Math.pow(1 + adjustedCAGR / 100, 8) * modifier,
      timeSeriesData: generateTimeSeriesData(marketData.overview.marketSizeBase, adjustedCAGR),
      totalGrowth: ((marketData.overview.marketSizeBase * Math.pow(1 + adjustedCAGR / 100, 8) * modifier - marketData.overview.marketSizeBase) / marketData.overview.marketSizeBase) * 100
    };
  }, [selectedScenario, marketData]); 

  // Calculate compound metrics - MOVED BEFORE EARLY RETURNS
  const cumulativeGrowth = useMemo(() => {
    return getScenarioData.timeSeriesData.map((point, index) => ({
      year: point.year,
      value: point.value,
      growth: index > 0 ? ((point.value - getScenarioData.timeSeriesData[0].value) / getScenarioData.timeSeriesData[0].value) * 100 : 0,
      yearOverYear: index > 0 ? ((point.value - getScenarioData.timeSeriesData[index - 1].value) / getScenarioData.timeSeriesData[index - 1].value) * 100 : 0
    }));
  }, [getScenarioData]);

  // Regional growth comparison using real data - MOVED BEFORE EARLY RETURNS
  const regionalGrowthData = useMemo(() => {
    if (!marketData?.regions) return [];
    
    return marketData.regions.map(region => {
      const startValue = (marketData.overview.marketSizeBase * region.marketShare2024) / 100;
      const endValue = (marketData.overview.marketSizeForecast * region.marketShare2032) / 100;
      const cagr = region.cagr;
      
      return {
        region: region.name,
        cagr,
        startValue,
        endValue,
        totalGrowth: ((endValue - startValue) / startValue) * 100,
        data: generateTimeSeriesData(startValue, cagr).map(point => ({ 
          ...point, 
          growth: ((point.value - startValue) / startValue) * 100 
        }))
      };
    });
  }, [marketData]);

  // Show loading state
  if (loading) {
    return (
      <DashboardLayout 
        title="Growth Analysis" 
        breadcrumb={['Dashboard', 'Growth Analysis']}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <LoadingSpinner size="lg" className="mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Loading Growth Analysis...
            </h3>
            <p className="text-gray-600">
              Processing market forecasting data
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
        title="Growth Analysis" 
        breadcrumb={['Dashboard', 'Growth Analysis']}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-600 mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Failed to Load Growth Data
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

  // Growth drivers analysis
  const growthDrivers = [
    {
      driver: 'Aging Population',
      impact: 'High',
      contribution: 28,
      trend: 'Increasing',
      description: 'Growing elderly population driving demand for aesthetic treatments',
      regions: ['North America', 'Europe', 'Asia Pacific']
    },
    {
      driver: 'Rising Disposable Income',
      impact: 'High',
      contribution: 24,
      trend: 'Increasing',
      description: 'Expanding middle class with higher spending power',
      regions: ['Asia Pacific', 'Latin America']
    },
    {
      driver: 'Aesthetic Consciousness',
      impact: 'Medium',
      contribution: 18,
      trend: 'Increasing',
      description: 'Growing awareness and acceptance of cosmetic procedures',
      regions: ['Global']
    },
    {
      driver: 'Technology Advancement',
      impact: 'Medium',
      contribution: 15,
      trend: 'Accelerating',
      description: 'Innovation in minimally invasive treatment methods',
      regions: ['North America', 'Europe']
    },
    {
      driver: 'Medical Tourism',
      impact: 'Medium',
      contribution: 10,
      trend: 'Growing',
      description: 'Cross-border treatment seeking affordable options',
      regions: ['Asia Pacific', 'Latin America']
    },
    {
      driver: 'Male Market Expansion',
      impact: 'Low',
      contribution: 5,
      trend: 'Emerging',
      description: 'Increasing male participation in aesthetic treatments',
      regions: ['North America', 'Europe']
    }
  ];

  // Market restraints
  const marketRestraints = [
    {
      restraint: 'High Treatment Costs',
      impact: 'High',
      severity: 25,
      mitigation: 'Insurance coverage expansion',
      regions: ['Global']
    },
    {
      restraint: 'Safety Concerns',
      impact: 'Medium',
      severity: 20,
      mitigation: 'Regulatory standardization',
      regions: ['Global']
    },
    {
      restraint: 'Skilled Professional Shortage',
      impact: 'Medium',
      severity: 18,
      mitigation: 'Training program development',
      regions: ['Asia Pacific', 'Latin America']
    },
    {
      restraint: 'Regulatory Hurdles',
      impact: 'Medium',
      severity: 15,
      mitigation: 'Streamlined approval processes',
      regions: ['Europe', 'Asia Pacific']
    }
  ];

  // Key growth insights
  const growthInsights = [
    {
      title: 'Market Acceleration',
      icon: Zap,
      content: `Market growth is accelerating with ${formatPercentage(getScenarioData.cagr)} CAGR in ${selectedScenario} scenario`,
      type: 'success'
    },
    {
      title: 'Regional Divergence',
      icon: Target,
      content: `Growth rates vary significantly across regions, with APAC leading at ${formatPercentage(regionalGrowthData.find(r => r.region === 'Asia Pacific')?.cagr || 0)}`,
      type: 'info'
    },
    {
      title: 'Market Maturity',
      icon: Activity,
      content: 'Market entering rapid growth phase with strong fundamentals supporting expansion',
      type: 'warning'
    }
  ];

  // Market trends from real data
  const marketTrends = marketData?.trends || [
    {
      trend: "Rising Demand for Non-Invasive Procedures",
      impact: "High",
      description: "Consumers increasingly prefer minimally invasive treatments with minimal downtime and natural-looking results",
      regions: ["North America", "Europe", "Asia Pacific"]
    },
    {
      trend: "Growing Male Market Segment",
      impact: "Medium",
      description: "Increasing acceptance of aesthetic treatments among male consumers, especially in urban areas",
      regions: ["North America", "Europe"]
    },
    {
      trend: "Technological Advancements in Delivery Systems",
      impact: "High", 
      description: "Development of new ingredients and delivery methods enhancing treatment efficacy and patient comfort",
      regions: ["Global"]
    },
    {
      trend: "Medical Tourism Growth",
      impact: "Medium",
      description: "Cross-border travel for affordable and high-quality aesthetic treatments driving regional markets",
      regions: ["Asia Pacific", "Latin America", "Middle East & Africa"]
    }
  ];


  return (
    <DashboardLayout 
      title="Growth Analysis" 
      breadcrumb={['Dashboard', 'Growth Analysis']}
    >
      <div className="space-y-6">
        {/* Header with Scenario Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
        >
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Market Growth Forecasting & Analysis
            </h2>
            <p className="text-gray-600">
              Comprehensive growth projections with scenario modeling and trend analysis
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Select 
              value={selectedScenario} 
              onChange={(e) => setSelectedScenario(e.target.value)}
              className="min-w-[150px]"
            >
              {Object.entries(scenarios).map(([key, scenario]) => (
                <option key={key} value={key}>{scenario.label}</option>
              ))}
            </Select>
            
            <Select 
              value={selectedTimeframe} 
              onChange={(e) => setSelectedTimeframe(e.target.value)}
            >
              <option value="full">Full Period (2024-2032)</option>
              <option value="short">Short Term (2024-2028)</option>
              <option value="long">Long Term (2028-2032)</option>
            </Select>
            
            <Button variant="outline" size="sm">
              <Calculator className="w-4 h-4 mr-2" />
              Model Builder
            </Button>
          </div>
        </motion.div>

        {/* Growth Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-4"
        >
          {growthInsights.map((insight, index) => (
            <Alert key={insight.title} variant={insight.type} className="p-4">
              <div className="flex items-start space-x-3">
                <insight.icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-sm mb-1">{insight.title}</h4>
                  <p className="text-sm">{insight.content}</p>
                </div>
              </div>
            </Alert>
          ))}
        </motion.div>

        {/* Scenario Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Projected CAGR',
              value: formatPercentage(getScenarioData.cagr),
              subtitle: `${scenarios[selectedScenario].label} scenario`,
              trend: getScenarioData.cagr,
              icon: TrendingUp
            },
            {
              title: 'Market Size 2032',
              value: formatCurrency(getScenarioData.marketSize2032),
              subtitle: 'Projected market value',
              trend: getScenarioData.cagr,
              icon: Target
            },
            {
              title: 'Total Growth',
              value: formatPercentage(getScenarioData.totalGrowth),
              subtitle: '2024-2032 cumulative',
              trend: getScenarioData.totalGrowth > 200 ? 12.5 : 8.2,
              icon: Activity
            },
            {
              title: 'Growth Confidence',
              value: selectedScenario === 'base' ? 'High' : selectedScenario === 'optimistic' ? 'Medium' : 'Very High',
              subtitle: 'Scenario probability',
              trend: selectedScenario === 'base' ? 8.5 : selectedScenario === 'optimistic' ? 6.2 : 9.1,
              icon: CheckCircle
            }
          ].map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <MetricCard {...metric} />
            </motion.div>
          ))}
        </div>

        {/* Main Growth Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Scenario-based Growth Projection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <MarketGrowthChart
              data={cumulativeGrowth}
              title={`Growth Projection - ${scenarios[selectedScenario].label}`}
              description="Market size evolution with growth rate overlay"
              height={400}
            />
          </motion.div>

          {/* Cumulative Growth Analysis */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <EnhancedAreaChart
              data={cumulativeGrowth}
              title="Cumulative Growth Analysis"
              description="Total growth accumulation over time"
              areas={['growth']}
              height={400}
              formatter={(value) => formatPercentage(value)}
            />
          </motion.div>
        </div>

        {/* Regional Growth Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <EnhancedBarChart
            data={regionalGrowthData.map(region => ({
              name: region.region.replace(' & ', ' &\n'),
              cagr: region.cagr,
              totalGrowth: region.totalGrowth
            }))}
            title="Regional Growth Rate Comparison"
            description="CAGR and total growth by geographic region"
            bars={['cagr', 'totalGrowth']}
            xKey="name"
            height={350}
            formatter={(value) => formatPercentage(value)}
          />
        </motion.div>

        {/* Growth Drivers & Restraints */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Growth Drivers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-green-700">
                  <TrendingUp className="w-5 h-5" />
                  <span>Growth Drivers</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {growthDrivers.map((driver, index) => (
                    <div key={driver.driver} className="border-l-4 border-green-500 pl-4 py-2">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm">{driver.driver}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant={driver.impact === 'High' ? 'success' : driver.impact === 'Medium' ? 'warning' : 'secondary'}
                          >
                            {driver.impact}
                          </Badge>
                          <span className="text-xs text-gray-500">{driver.contribution}%</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{driver.description}</p>
                      <div className="flex items-center justify-between">
                        <Progress value={driver.contribution} className="flex-1 mr-3" />
                        <div className="flex items-center space-x-1">
                          <ArrowUpRight className="w-3 h-3 text-green-600" />
                          <span className="text-xs text-green-600 font-medium">{driver.trend}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Market Restraints */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-red-700">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Market Restraints</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {marketRestraints.map((restraint, index) => (
                    <div key={restraint.restraint} className="border-l-4 border-red-500 pl-4 py-2">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm">{restraint.restraint}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant={restraint.impact === 'High' ? 'error' : restraint.impact === 'Medium' ? 'warning' : 'secondary'}
                          >
                            {restraint.impact}
                          </Badge>
                          <span className="text-xs text-gray-500">{restraint.severity}%</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">
                        <strong>Mitigation:</strong> {restraint.mitigation}
                      </p>
                      <div className="flex items-center justify-between">
                        <Progress value={restraint.severity} className="flex-1 mr-3 bg-red-100" />
                        <div className="flex items-center space-x-1">
                          <ArrowDownRight className="w-3 h-3 text-red-600" />
                          <span className="text-xs text-red-600 font-medium">Risk</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Market Trends Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="w-5 h-5" />
                <span>Market Trends & Opportunities</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {marketTrends.map((trend, index) => (
                  <div key={trend.trend} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">{trend.trend}</h4>
                      <Badge 
                        variant={trend.impact === 'High' ? 'success' : trend.impact === 'Medium' ? 'warning' : 'secondary'}
                      >
                        {trend.impact} Impact
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{trend.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {trend.regions.map(region => (
                        <Badge key={region} variant="outline" className="text-xs">
                          {region}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Growth Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card className="bg-gradient-to-r from-primary-50 to-secondary-50">
            <CardHeader>
              <CardTitle>Growth Analysis Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-2">
                    {formatPercentage(getScenarioData.cagr)}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">Projected CAGR</div>
                  <div className="text-xs text-gray-500">
                    {scenarios[selectedScenario].label} Scenario
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {formatCurrency(getScenarioData.marketSize2032)}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">Market Size 2032</div>
                  <div className="text-xs text-gray-500">
                    Projected Value
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {formatPercentage(getScenarioData.totalGrowth)}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">Total Growth</div>
                  <div className="text-xs text-gray-500">
                    2024-2032 Period
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-white rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Key Growth Conclusions</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Strong fundamentals support sustained growth trajectory</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Multiple growth drivers create diversified opportunity base</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Regional variance allows for targeted market strategies</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Technology advancement enables market expansion</span>
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

export default GrowthAnalysis;