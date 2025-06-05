'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  PieChart,
  Layers,
  Users,
  Package,
  Target,
  TrendingUp,
  BarChart3,
  Filter,
  Download,
  Eye,
  Star,
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
  Select,
  Alert,
  Separator
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
  productTypeData,
  ingredientData,
  generateTimeSeriesData 
} from '@/data/marketData';
import { formatCurrency, formatPercentage, calculateCAGR, getMarketSegmentInsights } from '@/lib/utils';

const MarketSegments = () => {
  const [selectedSegmentType, setSelectedSegmentType] = useState('productType');
  const [selectedTimeframe, setSelectedTimeframe] = useState('2032');
  const [viewMode, setViewMode] = useState('overview'); // overview, detailed, trends

  // Calculate segment data based on selection
  const getSegmentData = () => {
    const baseYear = 2024;
    const forecastYear = 2032;
    const totalMarket = marketData.overview.marketSizeForecast;

    switch (selectedSegmentType) {
      case 'productType':
        return marketData.productTypes.map(product => ({
          ...product,
          value2024: (marketData.overview.marketSizeBase * product.marketShare2024) / 100,
          value2032: (totalMarket * product.marketShare2032) / 100,
          timeSeriesData: generateTimeSeriesData(
            (marketData.overview.marketSizeBase * product.marketShare2024) / 100,
            product.cagr
          )
        }));
      
      case 'ingredient':
        return marketData.ingredients.map(ingredient => ({
          ...ingredient,
          value2024: (marketData.overview.marketSizeBase * ingredient.marketShare2024) / 100,
          value2032: (totalMarket * ingredient.marketShare2032) / 100,
          timeSeriesData: generateTimeSeriesData(
            (marketData.overview.marketSizeBase * ingredient.marketShare2024) / 100,
            ingredient.cagr
          )
        }));
      
      case 'gender':
        return marketData.gender.map(gender => ({
          ...gender,
          value2024: (marketData.overview.marketSizeBase * gender.marketShare2024) / 100,
          value2032: (totalMarket * gender.marketShare2032) / 100,
          cagr: gender.cagr,
          timeSeriesData: generateTimeSeriesData(
            (marketData.overview.marketSizeBase * gender.marketShare2024) / 100,
            gender.cagr
          )
        }));
      
      case 'endUser':
        return marketData.endUsers.map(endUser => ({
          ...endUser,
          value2024: (marketData.overview.marketSizeBase * endUser.marketShare2024) / 100,
          value2032: (totalMarket * endUser.marketShare2032) / 100,
          cagr: endUser.cagr,
          timeSeriesData: generateTimeSeriesData(
            (marketData.overview.marketSizeBase * endUser.marketShare2024) / 100,
            endUser.cagr
          )
        }));
      
      default:
        return [];
    }
  };

  const segmentData = getSegmentData();
  const selectedYearValue = selectedTimeframe === '2024' ? 'value2024' : 'value2032';
  
  // Prepare chart data
  const pieChartData = segmentData.map(segment => ({
    name: segment.name,
    value: segment[selectedYearValue],
    share: selectedTimeframe === '2024' ? segment.marketShare2024 : segment.marketShare2032
  }));

  const barChartData = segmentData.map(segment => ({
    name: segment.name.length > 15 ? segment.name.substring(0, 15) + '...' : segment.name,
    fullName: segment.name,
    value2024: segment.value2024,
    value2032: segment.value2032,
    cagr: segment.cagr
  }));

  // Get insights
  const segmentInsights = getMarketSegmentInsights(
    segmentData.map(s => ({ name: s.name, value: s[selectedYearValue] }))
  );

  // Calculate key metrics
  const totalSegmentValue = segmentData.reduce((sum, segment) => sum + segment[selectedYearValue], 0);
  const leadingSegment = segmentData.reduce((a, b) => 
    a[selectedYearValue] > b[selectedYearValue] ? a : b
  );
  const fastestGrowingSegment = segmentData.reduce((a, b) => a.cagr > b.cagr ? a : b);
  const averageCAGR = segmentData.reduce((sum, segment) => sum + segment.cagr, 0) / segmentData.length;

  // Segment type configurations
  const segmentTypes = {
    productType: { 
      label: 'Product Types', 
      icon: Package, 
      description: 'Treatment method segmentation',
      color: 'from-blue-500 to-blue-600' 
    },
    ingredient: { 
      label: 'Active Ingredients', 
      icon: Layers, 
      description: 'Key ingredient analysis',
      color: 'from-green-500 to-green-600' 
    },
    gender: { 
      label: 'Demographics', 
      icon: Users, 
      description: 'Consumer demographic breakdown',
      color: 'from-purple-500 to-purple-600' 
    },
    endUser: { 
      label: 'End Users', 
      icon: Target, 
      description: 'Distribution channel analysis',
      color: 'from-orange-500 to-orange-600' 
    }
  };

  const currentSegmentType = segmentTypes[selectedSegmentType];

  return (
    <DashboardLayout 
      title="Market Segments" 
      breadcrumb={['Dashboard', 'Market Segments']}
    >
      <div className="space-y-6">
        {/* Header with Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
        >
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Granular Market Segmentation
            </h2>
            <p className="text-gray-600">
              Deep dive into market segments with detailed performance analysis and growth opportunities
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Select 
              value={selectedSegmentType} 
              onChange={(e) => setSelectedSegmentType(e.target.value)}
              className="min-w-[180px]"
            >
              {Object.entries(segmentTypes).map(([key, type]) => (
                <option key={key} value={key}>{type.label}</option>
              ))}
            </Select>
            
            <Select 
              value={selectedTimeframe} 
              onChange={(e) => setSelectedTimeframe(e.target.value)}
            >
              <option value="2024">2024 Baseline</option>
              <option value="2032">2032 Forecast</option>
            </Select>
            
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Analysis
            </Button>
          </div>
        </motion.div>

        {/* Segment Type Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`bg-gradient-to-r ${currentSegmentType.color} rounded-xl p-6 text-white`}
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <currentSegmentType.icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">{currentSegmentType.label} Analysis</h3>
              <p className="text-white text-opacity-90">{currentSegmentType.description}</p>
            </div>
          </div>
        </motion.div>

        {/* Key Segment Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Leading Segment',
              value: leadingSegment.name,
              subtitle: `${formatPercentage(leadingSegment.marketShare2032 || leadingSegment.marketShare2024)} market share`,
              trend: leadingSegment.cagr,
              icon: Star
            },
            {
              title: 'Fastest Growing',
              value: fastestGrowingSegment.name,
              subtitle: `${formatPercentage(fastestGrowingSegment.cagr)} CAGR`,
              trend: fastestGrowingSegment.cagr,
              icon: TrendingUp
            },
            {
              title: 'Total Segment Value',
              value: formatCurrency(totalSegmentValue),
              subtitle: `${selectedTimeframe} market size`,
              trend: averageCAGR,
              icon: BarChart3
            },
            {
              title: 'Average Growth',
              value: formatPercentage(averageCAGR),
              subtitle: 'Segment CAGR average',
              trend: averageCAGR > 10 ? 5.2 : 2.1,
              icon: TrendingUp
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

        {/* Main Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Market Share Distribution */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <MarketShareDonut
              data={pieChartData}
              title={`${currentSegmentType.label} Distribution ${selectedTimeframe}`}
              description="Market share by segment"
              height={400}
            />
          </motion.div>

          {/* Segment Comparison */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <EnhancedBarChart
              data={barChartData}
              title="Segment Size Comparison"
              description="2024 vs 2032 segment values"
              bars={['value2024', 'value2032']}
              xKey="name"
              height={400}
              formatter={(value) => formatCurrency(value)}
            />
          </motion.div>
        </div>

        {/* Segment Evolution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <EnhancedLineChart
            data={segmentData[0]?.timeSeriesData || []}
            title={`${leadingSegment.name} Evolution`}
            description="Market size progression over forecast period"
            lines={['value']}
            height={350}
            formatter={(value) => formatCurrency(value)}
          />
        </motion.div>

        {/* Detailed Segment Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="w-5 h-5" />
                <span>Segment Performance Matrix</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold">Segment</th>
                      <th className="text-right py-3 px-4 font-semibold">2024 Size</th>
                      <th className="text-right py-3 px-4 font-semibold">2032 Size</th>
                      <th className="text-right py-3 px-4 font-semibold">Market Share</th>
                      <th className="text-right py-3 px-4 font-semibold">CAGR</th>
                      <th className="text-right py-3 px-4 font-semibold">Growth</th>
                      <th className="text-center py-3 px-4 font-semibold">Performance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {segmentData
                      .sort((a, b) => b[selectedYearValue] - a[selectedYearValue])
                      .map((segment, index) => {
                        const growth = ((segment.value2032 - segment.value2024) / segment.value2024) * 100;
                        const performance = segment.cagr > averageCAGR ? 'High' : segment.cagr > 8 ? 'Medium' : 'Low';
                        
                        return (
                          <tr key={segment.name} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-2">
                                <div className="w-6 h-4 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-sm flex items-center justify-center text-white text-xs font-bold">
                                  {index + 1}
                                </div>
                                <div>
                                  <span className="font-medium">{segment.name}</span>
                                  {segment.description && (
                                    <p className="text-xs text-gray-500 mt-0.5">{segment.description}</p>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="text-right py-3 px-4">{formatCurrency(segment.value2024)}</td>
                            <td className="text-right py-3 px-4 font-semibold">{formatCurrency(segment.value2032)}</td>
                            <td className="text-right py-3 px-4">
                              <div className="flex items-center justify-end space-x-2">
                                <Progress 
                                  value={segment.marketShare2032 || segment.marketShare2024} 
                                  className="w-16 h-2" 
                                />
                                <span>{formatPercentage(segment.marketShare2032 || segment.marketShare2024)}</span>
                              </div>
                            </td>
                            <td className="text-right py-3 px-4">
                              <Badge 
                                variant={segment.cagr > 15 ? "success" : segment.cagr > 10 ? "warning" : "secondary"}
                              >
                                {formatPercentage(segment.cagr)}
                              </Badge>
                            </td>
                            <td className="text-right py-3 px-4">{formatPercentage(growth)}</td>
                            <td className="text-center py-3 px-4">
                              <Badge 
                                variant={performance === 'High' ? "success" : performance === 'Medium' ? "warning" : "secondary"}
                              >
                                {performance}
                              </Badge>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Segment Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Market Leaders */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-blue-700">
                  <Award className="w-5 h-5" />
                  <span>Market Leaders</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {segmentData
                    .sort((a, b) => b[selectedYearValue] - a[selectedYearValue])
                    .slice(0, 3)
                    .map((segment, index) => (
                      <div key={segment.name} className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                            index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-400'
                          }`}>
                            {index + 1}
                          </div>
                          <span className="font-medium text-sm">{segment.name}</span>
                        </div>
                        <span className="text-xs font-semibold text-blue-700">
                          {formatPercentage(segment.marketShare2032 || segment.marketShare2024)}
                        </span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Growth Champions */}
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-green-700">
                  <Zap className="w-5 h-5" />
                  <span>Growth Champions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {segmentData
                    .sort((a, b) => b.cagr - a.cagr)
                    .slice(0, 3)
                    .map((segment, index) => (
                      <div key={segment.name} className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          <span className="font-medium text-sm">{segment.name}</span>
                        </div>
                        <span className="text-xs font-semibold text-green-700">
                          {formatPercentage(segment.cagr)}
                        </span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Strategic Insights */}
            <Card className="bg-purple-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-purple-700">
                  <Eye className="w-5 h-5" />
                  <span>Strategic Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded-lg">
                    <h5 className="font-semibold text-sm text-purple-700 mb-1">Market Concentration</h5>
                    <p className="text-xs text-gray-600">
                      Top 3 segments control {formatPercentage(
                        segmentData
                          .sort((a, b) => b[selectedYearValue] - a[selectedYearValue])
                          .slice(0, 3)
                          .reduce((sum, s) => sum + (s.marketShare2032 || s.marketShare2024), 0)
                      )} of the market
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-lg">
                    <h5 className="font-semibold text-sm text-purple-700 mb-1">Growth Opportunity</h5>
                    <p className="text-xs text-gray-600">
                      Emerging segments show {formatPercentage(fastestGrowingSegment.cagr)} growth potential
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-lg">
                    <h5 className="font-semibold text-sm text-purple-700 mb-1">Market Dynamics</h5>
                    <p className="text-xs text-gray-600">
                      Segment diversification indicates healthy market competition
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default MarketSegments;