// src/app/dashboard/data-management/page.js
'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Database,
  Upload,
  Download,
  RefreshCw,
  Settings,
  TrendingUp,
  BarChart3,
  Globe,
  Package,
  Users,
  Calendar,
  AlertCircle,
  CheckCircle,
  Info,
  Zap
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import CSVDataManager from '@/components/data/CSVDataManager';
import { 
  MetricCard, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  Badge,
  Button,
  Alert,
  Separator
} from '@/components/ui';
import { 
  EnhancedLineChart,
  EnhancedBarChart,
  MarketShareDonut
} from '@/components/charts';
import { csvDataService } from '@/services/csvDataService';
import { formatCurrency, formatPercentage, formatNumber } from '@/lib/utils';

const DataManagementPage = () => {
  const [currentData, setCurrentData] = useState(null);
  const [dataSource, setDataSource] = useState('static'); // 'static' or 'csv'
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [lastSync, setLastSync] = useState(null);

  // Sample data for preview
  const [previewData, setPreviewData] = useState({
    overview: {
      totalRecords: 4500,
      regions: 6,
      countries: 25,
      segments: 44,
      timeRange: '2024-2032'
    },
    recentActivity: [
      { action: 'Data Update', timestamp: new Date(Date.now() - 1000 * 60 * 30), status: 'success' },
      { action: 'CSV Upload', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), status: 'success' },
      { action: 'Data Validation', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), status: 'success' },
      { action: 'Backup Created', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), status: 'info' }
    ]
  });

  // Handle data update from CSV manager
  const handleDataUpdate = (newData) => {
    setCurrentData(newData);
    setDataSource('csv');
    setLastSync(new Date());
    
    // Update preview data
    setPreviewData(prev => ({
      ...prev,
      recentActivity: [
        { action: 'CSV Data Loaded', timestamp: new Date(), status: 'success' },
        ...prev.recentActivity.slice(0, 3)
      ]
    }));
  };

  // Toggle live mode
  const toggleLiveMode = () => {
    setIsLiveMode(!isLiveMode);
    if (!isLiveMode) {
      setLastSync(new Date());
    }
  };

  // Sample chart data
  const dataGrowthChart = [
    { year: 2020, records: 2800 },
    { year: 2021, records: 3200 },
    { year: 2022, records: 3800 },
    { year: 2023, records: 4200 },
    { year: 2024, records: 4500 }
  ];

  const dataSourceDistribution = [
    { name: 'CSV Uploads', value: 65, records: 2925 },
    { name: 'Static Data', value: 25, records: 1125 },
    { name: 'API Feeds', value: 10, records: 450 }
  ];

  const regionCoverage = [
    { name: 'North America', coverage: 100, countries: 3 },
    { name: 'Europe', coverage: 85, countries: 8 },
    { name: 'Asia Pacific', coverage: 75, countries: 6 },
    { name: 'Latin America', coverage: 60, countries: 4 },
    { name: 'MEA', coverage: 45, countries: 4 }
  ];

  return (
    <DashboardLayout 
      title="Data Management" 
      breadcrumb={['Dashboard', 'Data Management']}
    >
      <div className="space-y-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
        >
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Market Data Management
            </h2>
            <p className="text-gray-600">
              Upload, manage, and analyze your market research data with real-time processing
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button 
              variant={isLiveMode ? "default" : "outline"} 
              onClick={toggleLiveMode}
            >
              <Zap className="w-4 h-4 mr-2" />
              {isLiveMode ? 'Live Mode On' : 'Enable Live Mode'}
            </Button>
            
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </motion.div>

        {/* Status Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4"
        >
          <Alert variant="info">
            <Info className="w-4 h-4" />
            <div>
              <h4 className="font-semibold">Data Source Status</h4>
              <p className="text-sm">
                Currently using {dataSource === 'csv' ? 'uploaded CSV data' : 'static mock data'}. 
                {lastSync && ` Last synced: ${lastSync.toLocaleTimeString()}`}
              </p>
            </div>
          </Alert>

          {isLiveMode && (
            <Alert variant="success">
              <CheckCircle className="w-4 h-4" />
              <div>
                <h4 className="font-semibold">Live Mode Active</h4>
                <p className="text-sm">
                  Data will be automatically refreshed and dashboard will update in real-time
                </p>
              </div>
            </Alert>
          )}
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Total Records',
              value: formatNumber(previewData.overview.totalRecords),
              subtitle: 'Data points processed',
              trend: 12.5,
              icon: Database
            },
            {
              title: 'Global Coverage',
              value: `${previewData.overview.regions} Regions`,
              subtitle: `${previewData.overview.countries} countries`,
              trend: 8.2,
              icon: Globe
            },
            {
              title: 'Market Segments',
              value: previewData.overview.segments.toString(),
              subtitle: 'Unique segments tracked',
              trend: 15.3,
              icon: Package
            },
            {
              title: 'Time Range',
              value: previewData.overview.timeRange,
              subtitle: 'Forecast period',
              trend: 0,
              icon: Calendar
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

        {/* CSV Data Manager Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <CSVDataManager onDataUpdate={handleDataUpdate} />
        </motion.div>

        {/* Data Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Data Growth Over Time */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <EnhancedLineChart
              data={dataGrowthChart}
              title="Data Volume Growth"
              description="Historical data collection growth"
              lines={['records']}
              xKey="year"
              height={300}
              formatter={(value) => formatNumber(value)}
            />
          </motion.div>

          {/* Data Source Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <MarketShareDonut
              data={dataSourceDistribution}
              title="Data Source Distribution"
              description="Breakdown by data source type"
              height={300}
            />
          </motion.div>
        </div>

        {/* Regional Coverage Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="w-5 h-5" />
                <span>Regional Data Coverage</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {regionCoverage.map((region, index) => (
                  <div key={region.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Globe className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{region.name}</h4>
                        <p className="text-sm text-gray-600">{region.countries} countries covered</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900">{region.coverage}%</div>
                        <div className="text-sm text-gray-600">Coverage</div>
                      </div>
                      <div className="w-24">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary-600 transition-all duration-300"
                            style={{ width: `${region.coverage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Recent Activity</span>
                {isLiveMode && (
                  <Badge variant="success" className="ml-auto">
                    Live
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {previewData.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {activity.status === 'success' && <CheckCircle className="w-5 h-5 text-green-600" />}
                      {activity.status === 'info' && <Info className="w-5 h-5 text-blue-600" />}
                      {activity.status === 'warning' && <AlertCircle className="w-5 h-5 text-yellow-600" />}
                      <div>
                        <span className="font-medium text-gray-900">{activity.action}</span>
                        <p className="text-sm text-gray-600">
                          {activity.timestamp.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Badge 
                      variant={activity.status === 'success' ? 'success' : activity.status === 'warning' ? 'warning' : 'secondary'}
                    >
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Showing {previewData.recentActivity.length} recent activities
                </span>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Data Quality Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="bg-gradient-to-r from-primary-50 to-secondary-50">
            <CardHeader>
              <CardTitle>Data Quality & Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">98.5%</div>
                  <div className="text-sm text-gray-600 mb-2">Data Completeness</div>
                  <div className="text-xs text-gray-500">
                    Excellent data coverage across all segments
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">15min</div>
                  <div className="text-sm text-gray-600 mb-2">Processing Time</div>
                  <div className="text-xs text-gray-500">
                    Average time to process CSV files
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">99.2%</div>
                  <div className="text-sm text-gray-600 mb-2">Data Accuracy</div>
                  <div className="text-xs text-gray-500">
                    High confidence in data validation
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-white rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Next Steps</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Upload additional regional data for MEA and South America</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Configure automated data refresh schedules</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Set up data quality monitoring alerts</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Enable real-time dashboard updates</span>
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

export default DataManagementPage;