'use client';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Trophy,
  Target,
  TrendingUp,
  Building2,
  MapPin,
  DollarSign,
  BarChart3,
  PieChart,
  Zap,
  Award,
  Crown,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
  Package,
  Briefcase
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
  MarketShareDonut
} from '@/components/charts';
import { 
  marketData,
  generateTimeSeriesData 
} from '@/data/marketData';
import { formatCurrency, formatPercentage, formatNumber } from '@/lib/utils';

const CompetitiveAnalysis = () => {
  const [selectedView, setSelectedView] = useState('overview'); // overview, detailed, positioning
  const [selectedMetric, setSelectedMetric] = useState('marketShare'); // marketShare, revenue, growth
  const [timeframe, setTimeframe] = useState('current'); // current, historical, projected

  // Enhanced competitive data with more details
  const competitiveData = useMemo(() => {
    const players = marketData.marketPlayers.map((player, index) => {
      const baseRevenue = player.revenue2023;
      const marketShare = player.marketShare;
      
      // Generate growth data
      const historicalData = generateTimeSeriesData(baseRevenue * 0.75, 8.5 + (index * 1.2));
      const projectedData = generateTimeSeriesData(baseRevenue, 7.2 + (index * 0.8), 2024, 2027);
      
      return {
        ...player,
        id: `player-${index}`,
        rank: index + 1,
        marketPosition: index === 0 ? 'Leader' : index <= 2 ? 'Challenger' : index <= 4 ? 'Follower' : 'Niche',
        growthRate: 7.2 + (index * 0.8),
        historicalRevenue: historicalData,
        projectedRevenue: projectedData,
        // Additional competitive intelligence
        geographicPresence: {
          'North America': index <= 2 ? 'Strong' : index <= 4 ? 'Moderate' : 'Limited',
          'Europe': index === 0 || index === 2 ? 'Strong' : index <= 3 ? 'Moderate' : 'Limited',
          'Asia Pacific': index === 0 || index === 4 ? 'Strong' : 'Moderate',
          'Latin America': index <= 1 ? 'Moderate' : 'Limited',
          'MEA': index === 0 ? 'Moderate' : 'Limited'
        },
        competitiveStrengths: index === 0 ? 
          ['Global brand recognition', 'Extensive R&D', 'Strong distribution network', 'Product portfolio breadth'] :
          index === 1 ? 
          ['Innovation leadership', 'Premium positioning', 'Scientific expertise', 'Regulatory expertise'] :
          index === 2 ?
          ['Cost-effective solutions', 'Market access', 'Local partnerships', 'Operational efficiency'] :
          ['Specialized focus', 'Niche expertise', 'Agility', 'Customer relationships'],
        marketFocus: index <= 2 ? 'Premium' : index <= 4 ? 'Mid-market' : 'Specialized',
        threatLevel: index <= 2 ? 'High' : index <= 4 ? 'Medium' : 'Low'
      };
    });

    return players;
  }, []);

  // Market concentration analysis
  const marketConcentration = useMemo(() => {
    const top3Share = competitiveData.slice(0, 3).reduce((sum, player) => sum + player.marketShare, 0);
    const top5Share = competitiveData.slice(0, 5).reduce((sum, player) => sum + player.marketShare, 0);
    const hhi = competitiveData.reduce((sum, player) => sum + Math.pow(player.marketShare, 2), 0);
    
    return {
      top3Share,
      top5Share,
      hhi,
      concentration: hhi > 2500 ? 'Highly Concentrated' : hhi > 1500 ? 'Moderately Concentrated' : 'Competitive'
    };
  }, [competitiveData]);

  // Competitive positioning data
  const positioningData = competitiveData.map(player => ({
    name: player.name,
    marketShare: player.marketShare,
    growthRate: player.growthRate,
    revenue: player.revenue2023,
    position: player.marketPosition
  }));

  // Geographic presence analysis
  const geographicAnalysis = useMemo(() => {
    const regions = ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'MEA'];
    return regions.map(region => {
      const strongPlayers = competitiveData.filter(p => p.geographicPresence[region] === 'Strong').length;
      const moderatePlayers = competitiveData.filter(p => p.geographicPresence[region] === 'Moderate').length;
      const limitedPlayers = competitiveData.filter(p => p.geographicPresence[region] === 'Limited').length;
      
      return {
        region,
        strong: strongPlayers,
        moderate: moderatePlayers,
        limited: limitedPlayers,
        competitionLevel: strongPlayers >= 3 ? 'Intense' : strongPlayers >= 2 ? 'High' : strongPlayers >= 1 ? 'Moderate' : 'Low'
      };
    });
  }, [competitiveData]);

  // Competitive insights
  const competitiveInsights = [
    {
      title: 'Market Leadership',
      icon: Crown,
      content: `${competitiveData[0]?.name} dominates with ${formatPercentage(competitiveData[0]?.marketShare)} market share`,
      type: 'success'
    },
    {
      title: 'Market Concentration',
      icon: Target,
      content: `Top 3 players control ${formatPercentage(marketConcentration.top3Share)} of the market - ${marketConcentration.concentration.toLowerCase()}`,
      type: 'info'
    },
    {
      title: 'Growth Opportunity',
      icon: TrendingUp,
      content: `${formatPercentage(100 - marketConcentration.top5Share)} market share available for emerging players`,
      type: 'warning'
    }
  ];

  return (
    <DashboardLayout 
      title="Competitive Analysis" 
      breadcrumb={['Dashboard', 'Competitive Analysis']}
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
              Competitive Landscape Analysis
            </h2>
            <p className="text-gray-600">
              Comprehensive analysis of market players, positioning, and competitive dynamics
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Select 
              value={selectedView} 
              onChange={(e) => setSelectedView(e.target.value)}
              className="min-w-[150px]"
            >
              <option value="overview">Market Overview</option>
              <option value="detailed">Detailed Analysis</option>
              <option value="positioning">Competitive Positioning</option>
            </Select>
            
            <Select 
              value={selectedMetric} 
              onChange={(e) => setSelectedMetric(e.target.value)}
            >
              <option value="marketShare">Market Share</option>
              <option value="revenue">Revenue</option>
              <option value="growth">Growth Rate</option>
            </Select>
            
            <Button variant="outline" size="sm">
              <Briefcase className="w-4 h-4 mr-2" />
              Strategy Report
            </Button>
          </div>
        </motion.div>

        {/* Competitive Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-4"
        >
          {competitiveInsights.map((insight, index) => (
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

        {/* Market Concentration Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Market Leader',
              value: competitiveData[0]?.name || 'N/A',
              subtitle: `${formatPercentage(competitiveData[0]?.marketShare || 0)} market share`,
              trend: competitiveData[0]?.growthRate || 0,
              icon: Crown
            },
            {
              title: 'Top 3 Concentration',
              value: formatPercentage(marketConcentration.top3Share),
              subtitle: 'Combined market share',
              trend: 5.2,
              icon: Target
            },
            {
              title: 'Market Players',
              value: competitiveData.length.toString(),
              subtitle: 'Major competitors analyzed',
              trend: 2.1,
              icon: Users
            },
            {
              title: 'Competition Level',
              value: marketConcentration.concentration,
              subtitle: `HHI: ${Math.round(marketConcentration.hhi)}`,
              trend: marketConcentration.hhi > 2000 ? -1.5 : 3.2,
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

        {/* Main Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Market Share Distribution */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <MarketShareDonut
              data={competitiveData.map(player => ({
                name: player.name,
                value: player.marketShare,
                revenue: player.revenue2023
              }))}
              title="Market Share Distribution"
              description="Current competitive landscape"
              height={400}
            />
          </motion.div>

          {/* Revenue Comparison */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <EnhancedBarChart
              data={competitiveData.slice(0, 8).map(player => ({
                name: player.name.length > 12 ? player.name.substring(0, 12) + '...' : player.name,
                revenue: player.revenue2023,
                marketShare: player.marketShare
              }))}
              title="Revenue Comparison (2023)"
              description="Market players by revenue size"
              bars={['revenue']}
              xKey="name"
              height={400}
              formatter={(value) => formatNumber(value)}
            />
          </motion.div>
        </div>

        {/* Competitive Positioning Matrix */}
        {selectedView === 'positioning' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>Competitive Positioning Matrix</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {['Leader', 'Challenger', 'Follower', 'Niche'].map(position => {
                    const playersInPosition = competitiveData.filter(p => p.marketPosition === position);
                    const positionColor = {
                      'Leader': 'bg-green-50 border-green-200',
                      'Challenger': 'bg-blue-50 border-blue-200',
                      'Follower': 'bg-yellow-50 border-yellow-200',
                      'Niche': 'bg-purple-50 border-purple-200'
                    };
                    
                    return (
                      <div key={position} className={`p-4 rounded-lg border ${positionColor[position]}`}>
                        <h4 className="font-semibold mb-3">{position}s</h4>
                        <div className="space-y-2">
                          {playersInPosition.map(player => (
                            <div key={player.id} className="flex items-center justify-between p-2 bg-white rounded">
                              <div>
                                <span className="font-medium text-sm">{player.name}</span>
                                <p className="text-xs text-gray-500">{formatPercentage(player.marketShare)}</p>
                              </div>
                              <Badge 
                                variant={player.threatLevel === 'High' ? 'error' : player.threatLevel === 'Medium' ? 'warning' : 'secondary'}
                                className="text-xs"
                              >
                                {player.threatLevel}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Detailed Player Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="w-5 h-5" />
                <span>Competitive Player Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold">Rank</th>
                      <th className="text-left py-3 px-4 font-semibold">Company</th>
                      <th className="text-left py-3 px-4 font-semibold">Headquarters</th>
                      <th className="text-right py-3 px-4 font-semibold">Market Share</th>
                      <th className="text-right py-3 px-4 font-semibold">Revenue (2023)</th>
                      <th className="text-right py-3 px-4 font-semibold">Growth Rate</th>
                      <th className="text-center py-3 px-4 font-semibold">Position</th>
                      <th className="text-center py-3 px-4 font-semibold">Threat Level</th>
                      <th className="text-left py-3 px-4 font-semibold">Key Products</th>
                    </tr>
                  </thead>
                  <tbody>
                    {competitiveData.map((player, index) => (
                      <tr key={player.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                              index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-400' : 'bg-blue-500'
                            }`}>
                              {player.rank}
                            </div>
                            {index < 3 && <Trophy className="w-4 h-4 text-yellow-500" />}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <span className="font-medium">{player.name}</span>
                            {index === 0 && <Crown className="w-4 h-4 text-yellow-500 inline ml-1" />}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            <span>{player.headquarters}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Progress value={player.marketShare} className="w-16 h-2" />
                            <span className="font-semibold">{formatPercentage(player.marketShare)}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right font-semibold">
                          ${formatNumber(player.revenue2023)}M
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Badge 
                            variant={player.growthRate >= 8 ? 'success' : player.growthRate >= 5 ? 'warning' : 'secondary'}
                          >
                            {formatPercentage(player.growthRate)}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge 
                            variant={
                              player.marketPosition === 'Leader' ? 'success' :
                              player.marketPosition === 'Challenger' ? 'warning' :
                              player.marketPosition === 'Follower' ? 'secondary' : 'outline'
                            }
                          >
                            {player.marketPosition}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge 
                            variant={player.threatLevel === 'High' ? 'error' : player.threatLevel === 'Medium' ? 'warning' : 'secondary'}
                          >
                            {player.threatLevel}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {player.keyProducts.slice(0, 2).map(product => (
                              <Badge key={product} variant="outline" className="text-xs">
                                {product}
                              </Badge>
                            ))}
                            {player.keyProducts.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{player.keyProducts.length - 2}
                              </Badge>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Geographic Presence Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="w-5 h-5" />
                <span>Geographic Presence & Competition Intensity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {geographicAnalysis.map(region => (
                  <div key={region.region} className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-3">{region.region}</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Strong Presence:</span>
                        <Badge variant="success">{region.strong}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Moderate Presence:</span>
                        <Badge variant="warning">{region.moderate}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Limited Presence:</span>
                        <Badge variant="secondary">{region.limited}</Badge>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Competition Level:</span>
                        <Badge 
                          variant={
                            region.competitionLevel === 'Intense' ? 'error' :
                            region.competitionLevel === 'High' ? 'warning' :
                            region.competitionLevel === 'Moderate' ? 'secondary' : 'outline'
                          }
                        >
                          {region.competitionLevel}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Strategic Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="bg-gradient-to-r from-primary-50 to-secondary-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>Strategic Competitive Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-primary-700">Market Opportunities</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-white rounded-lg">
                      <h5 className="font-medium text-sm mb-1">Emerging Markets</h5>
                      <p className="text-xs text-gray-600">
                        {formatPercentage(100 - marketConcentration.top5Share)} of market share remains available for new entrants
                      </p>
                    </div>
                    <div className="p-3 bg-white rounded-lg">
                      <h5 className="font-medium text-sm mb-1">Geographic Expansion</h5>
                      <p className="text-xs text-gray-600">
                        Asia Pacific and Latin America show lower competition intensity
                      </p>
                    </div>
                    <div className="p-3 bg-white rounded-lg">
                      <h5 className="font-medium text-sm mb-1">Innovation Focus</h5>
                      <p className="text-xs text-gray-600">
                        Technology advancement creates differentiation opportunities
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-green-700">Competitive Threats</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-white rounded-lg">
                      <h5 className="font-medium text-sm mb-1">Market Consolidation</h5>
                      <p className="text-xs text-gray-600">
                        Top 3 players control {formatPercentage(marketConcentration.top3Share)} indicating high concentration
                      </p>
                    </div>
                    <div className="p-3 bg-white rounded-lg">
                      <h5 className="font-medium text-sm mb-1">Brand Dominance</h5>
                      <p className="text-xs text-gray-600">
                        {competitiveData[0]?.name} has established strong market leadership position
                      </p>
                    </div>
                    <div className="p-3 bg-white rounded-lg">
                      <h5 className="font-medium text-sm mb-1">Barrier to Entry</h5>
                      <p className="text-xs text-gray-600">
                        High R&D costs and regulatory requirements create entry barriers
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-purple-700">Strategic Recommendations</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-white rounded-lg">
                      <h5 className="font-medium text-sm mb-1">Differentiation Strategy</h5>
                      <p className="text-xs text-gray-600">
                        Focus on unique value propositions to compete with established players
                      </p>
                    </div>
                    <div className="p-3 bg-white rounded-lg">
                      <h5 className="font-medium text-sm mb-1">Partnership Approach</h5>
                      <p className="text-xs text-gray-600">
                        Strategic alliances can accelerate market entry and growth
                      </p>
                    </div>
                    <div className="p-3 bg-white rounded-lg">
                      <h5 className="font-medium text-sm mb-1">Niche Market Focus</h5>
                      <p className="text-xs text-gray-600">
                        Specialized segments offer lower competition and higher margins
                      </p>
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

export default CompetitiveAnalysis;