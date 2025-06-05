'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Globe,
  MapPin,
  TrendingUp,
  Users,
  DollarSign,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
  Eye,
  Star
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
  Alert
} from '@/components/ui';
import {
  EnhancedLineChart,
  EnhancedAreaChart,
  EnhancedBarChart,
  MarketShareDonut,
  RegionalComparisonChart
} from '@/components/charts';
import { 
  marketData, 
  regionalMarketData, 
  countryData,
  generateTimeSeriesData 
} from '@/data/marketData';
import { formatCurrency, formatPercentage, calculateCAGR, analyzeRegionalPerformance } from '@/lib/utils';

const RegionalAnalysis = () => {
  const [selectedRegion, setSelectedRegion] = useState('North America');
  const [selectedYear, setSelectedYear] = useState('2032');
  const [viewMode, setViewMode] = useState('overview'); // overview, detailed, comparison

  // Analyze regional performance
  const regionalAnalysis = analyzeRegionalPerformance(regionalMarketData);
  
  // Current region data
  const currentRegionInfo = marketData.regions.find(r => r.name === selectedRegion);
  const currentRegionData = regionalMarketData[selectedRegion] || [];
  
  // Calculate regional metrics
  const regionSize2024 = currentRegionData[0]?.value || 0;
  const regionSize2032 = currentRegionData[currentRegionData.length - 1]?.value || 0;
  const regionCAGR = calculateCAGR(regionSize2024, regionSize2032, 8);
  const regionGrowth = ((regionSize2032 - regionSize2024) / regionSize2024) * 100;

  // Market share data for selected year
  const yearIndex = selectedYear === '2024' ? 0 : selectedYear === '2032' ? 8 : 4;
  const regionalShareData = regionalAnalysis.regions.map(region => ({
    name: region.region,
    value: region.data[yearIndex]?.value || 0,
    share: ((region.data[yearIndex]?.value || 0) / regionalAnalysis.totalMarket) * 100
  })).sort((a, b) => b.value - a.value);

  // Top performing countries (if region is selected)
  const countryPerformance = Object.entries(countryData)
    .filter(([country, data]) => {
      // Filter countries by region (simplified mapping)
      const regionCountryMap = {
        'North America': ['United States', 'Canada', 'Mexico'],
        'Europe': ['Germany', 'United Kingdom', 'France'],
        'Asia Pacific': ['China', 'Japan', 'South Korea'],
        'Latin America': ['Brazil', 'Argentina'],
        'Middle East & Africa': ['UAE', 'Saudi Arabia', 'South Africa']
      };
      return regionCountryMap[selectedRegion]?.includes(country) || selectedRegion === 'Global';
    })
    .map(([country, data]) => ({
      country,
      marketSize2024: data.marketSize2024,
      marketSize2032: data.marketSize2032,
      cagr: data.cagr,
      penetration: data.penetrationRate,
      avgSpending: data.averageSpending
    }))
    .sort((a, b) => b.marketSize2032 - a.marketSize2032);

  // Regional insights
  const regionalInsights = [
    {
      title: 'Market Leadership',
      icon: Star,
      content: `${regionalAnalysis.largest.region} leads the global market with ${formatCurrency(regionalAnalysis.largest.endValue)} in ${selectedYear}`,
      type: 'success'
    },
    {
      title: 'Fastest Growth',
      icon: TrendingUp,
      content: `${regionalAnalysis.fastestGrowing.region} shows the highest growth rate at ${formatPercentage(regionalAnalysis.fastestGrowing.cagr)} CAGR`,
      type: 'info'
    },
    {
      title: 'Market Opportunity',
      icon: Eye,
      content: `${currentRegionInfo?.name} presents significant opportunities with ${formatPercentage(regionCAGR)} projected growth`,
      type: 'warning'
    }
  ];

  return (
    <DashboardLayout 
      title="Regional Analysis" 
      breadcrumb={['Dashboard', 'Regional Analysis']}
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
              Geographic Market Analysis
            </h2>
            <p className="text-gray-600">
              Regional performance, trends, and growth opportunities across global markets
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Select 
              value={selectedRegion} 
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="min-w-[200px]"
            >
              <option value="Global">Global Overview</option>
              {marketData.regions.map(region => (
                <option key={region.name} value={region.name}>
                  {region.name}
                </option>
              ))}
            </Select>
            
            <Select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="2024">2024</option>
              <option value="2028">2028</option>
              <option value="2032">2032</option>
            </Select>
            
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </motion.div>

        {/* Regional Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-4"
        >
          {regionalInsights.map((insight, index) => (
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

        {/* Key Regional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: `${selectedRegion} Market Size`,
              value: formatCurrency(regionSize2032),
              subtitle: `${selectedYear} projection`,
              trend: regionCAGR,
              icon: DollarSign
            },
            {
              title: 'Regional CAGR',
              value: formatPercentage(regionCAGR),
              subtitle: '2024-2032 period',
              trend: regionCAGR > 10 ? 5.2 : 2.1,
              icon: TrendingUp
            },
            {
              title: 'Market Share',
              value: formatPercentage(currentRegionInfo?.marketShare2032 || 0),
              subtitle: 'Global market share',
              trend: 3.1,
              icon: Globe
            },
            {
              title: 'Growth Rate',
              value: formatPercentage(regionGrowth),
              subtitle: 'Total growth 2024-32',
              trend: regionGrowth > 100 ? 8.5 : 4.2,
              icon: BarChart3
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

        {/* Main Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Regional Comparison Over Time */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <RegionalComparisonChart
              data={regionalMarketData}
              title="Regional Market Evolution"
              description="Market size progression across all regions"
              height={400}
            />
          </motion.div>

          {/* Regional Market Share */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <MarketShareDonut
              data={regionalShareData}
              title={`Regional Distribution ${selectedYear}`}
              description="Market share by geographic region"
              height={400}
            />
          </motion.div>
        </div>

        {/* Country Performance Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>Country Performance Analysis</span>
                <Badge variant="secondary">{selectedRegion}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold">Country</th>
                      <th className="text-right py-3 px-4 font-semibold">Market Size 2024</th>
                      <th className="text-right py-3 px-4 font-semibold">Market Size 2032</th>
                      <th className="text-right py-3 px-4 font-semibold">CAGR</th>
                      <th className="text-right py-3 px-4 font-semibold">Penetration</th>
                      <th className="text-right py-3 px-4 font-semibold">Avg Spending</th>
                    </tr>
                  </thead>
                  <tbody>
                    {countryPerformance.slice(0, 10).map((country, index) => (
                      <tr key={country.country} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-4 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-sm flex items-center justify-center text-white text-xs font-bold">
                              {index + 1}
                            </div>
                            <span className="font-medium">{country.country}</span>
                          </div>
                        </td>
                        <td className="text-right py-3 px-4">{formatCurrency(country.marketSize2024)}</td>
                        <td className="text-right py-3 px-4 font-semibold">{formatCurrency(country.marketSize2032)}</td>
                        <td className="text-right py-3 px-4">
                          <Badge 
                            variant={country.cagr > 12 ? "success" : country.cagr > 8 ? "warning" : "secondary"}
                          >
                            {formatPercentage(country.cagr)}
                          </Badge>
                        </td>
                        <td className="text-right py-3 px-4">{formatPercentage(country.penetration)}</td>
                        <td className="text-right py-3 px-4">${country.avgSpending.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Regional Growth Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Growth Rate Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <EnhancedBarChart
              data={regionalAnalysis.regions.map(region => ({
                name: region.region.replace(' & ', ' &\n'),
                cagr: region.cagr,
                growth: region.growth
              }))}
              title="Regional Growth Comparison"
              description="CAGR and absolute growth by region"
              bars={['cagr']}
              xKey="name"
              height={350}
              formatter={(value) => formatPercentage(value)}
            />
          </motion.div>

          {/* Market Evolution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <EnhancedAreaChart
              data={currentRegionData}
              title={`${selectedRegion} Market Evolution`}
              description="Historical and projected market development"
              areas={['value']}
              height={350}
              formatter={(value) => formatCurrency(value)}
            />
          </motion.div>
        </div>

        {/* Regional Strategic Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Strategic Regional Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Market Leaders */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-primary-600">Market Leaders</h4>
                  {regionalAnalysis.regions
                    .sort((a, b) => b.endValue - a.endValue)
                    .slice(0, 3)
                    .map((region, index) => (
                      <div key={region.region} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                            index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-400'
                          }`}>
                            {index + 1}
                          </div>
                          <span className="font-medium">{region.region}</span>
                        </div>
                        <span className="text-sm font-semibold">{formatCurrency(region.endValue)}</span>
                      </div>
                    ))}
                </div>

                {/* Growth Champions */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-green-600">Growth Champions</h4>
                  {regionalAnalysis.regions
                    .sort((a, b) => b.cagr - a.cagr)
                    .slice(0, 3)
                    .map((region, index) => (
                      <div key={region.region} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <TrendingUp className="w-5 h-5 text-green-600" />
                          <span className="font-medium">{region.region}</span>
                        </div>
                        <span className="text-sm font-semibold text-green-700">{formatPercentage(region.cagr)}</span>
                      </div>
                    ))}
                </div>

                {/* Key Opportunities */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-purple-600">Key Opportunities</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <h5 className="font-medium text-sm mb-1">Emerging Markets</h5>
                      <p className="text-xs text-gray-600">High growth potential in APAC and LATAM regions</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h5 className="font-medium text-sm mb-1">Market Penetration</h5>
                      <p className="text-xs text-gray-600">Low penetration rates indicate expansion opportunities</p>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <h5 className="font-medium text-sm mb-1">Premium Segments</h5>
                      <p className="text-xs text-gray-600">Growing demand for advanced treatment options</p>
                    </div>
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

export default RegionalAnalysis;