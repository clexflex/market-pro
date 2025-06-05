// src/components/data/CSVDataManager.js
'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Database,
  FileText,
  Download,
  RefreshCw,
  CheckCircle,
  Info,
  BarChart3,
  TrendingUp,
  Calendar,
  Users,
  Globe,
  Package
} from 'lucide-react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  Button,
  Alert,
  Badge,
  Separator
} from '@/components/ui';
import { useMarketData } from '@/hooks/useMarketData';
import { formatCurrency, formatPercentage, formatNumber } from '@/lib/utils';

const CSVDataManager = ({ onDataUpdate }) => {
  const { data: marketData, loading, error, refreshData, isLoaded } = useMarketData();
  const [dataStats, setDataStats] = useState(null);

  // Generate statistics from market data
  useEffect(() => {
    if (marketData && isLoaded) {
      const stats = generateDataStats(marketData);
      setDataStats(stats);
      
      // Notify parent component of data availability
      if (onDataUpdate) {
        onDataUpdate(marketData);
      }
    }
  }, [marketData, isLoaded, onDataUpdate]);

  // Generate statistics from processed data
  const generateDataStats = (data) => {
    if (!data || !data.overview) return null;

    const stats = {
      totalRecords: 0,
      regions: data.regions?.length || 0,
      countries: Object.keys(data.countries || {}).length,
      productTypes: data.productTypes?.length || 0,
      ingredients: data.ingredients?.length || 0,
      marketSize2024: data.overview?.marketSizeBase || 0,
      marketSize2032: data.overview?.marketSizeForecast || 0,
      cagr: data.overview?.cagr || 0,
      yearRange: '2024-2032',
      lastProcessed: new Date(),
      dataSource: data.metadata?.dataSource || 'embedded-csv'
    };

    // Calculate total records from time series data
    if (data.timeSeries) {
      Object.keys(data.timeSeries).forEach(region => {
        Object.keys(data.timeSeries[region]).forEach(segmentType => {
          Object.keys(data.timeSeries[region][segmentType]).forEach(segmentName => {
            stats.totalRecords += data.timeSeries[region][segmentType][segmentName].length;
          });
        });
      });
    }

    return stats;
  };

  // Handle data refresh
  const handleRefresh = async () => {
    try {
      await refreshData();
    } catch (err) {
      console.error('Failed to refresh data:', err);
    }
  };

  // Export current data
  const handleExport = () => {
    if (!marketData) {
      return;
    }

    // Create exportable data structure
    const exportData = {
      metadata: {
        exportDate: new Date().toISOString(),
        dataSource: 'Embedded CSV Data',
        lastUpdated: dataStats?.lastProcessed?.toISOString()
      },
      overview: marketData.overview,
      regions: marketData.regions,
      productTypes: marketData.productTypes,
      ingredients: marketData.ingredients,
      statistics: dataStats
    };

    // Download as JSON
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `market-data-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Data Status Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="w-5 h-5" />
            <span>Market Data Status</span>
            {isLoaded && (
              <Badge variant="success" className="ml-auto">
                Live Data Active
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Data Source Information */}
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-6 mb-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Embedded Market Research Data
                </h3>
                <p className="text-gray-600 mb-3">
                  This dashboard is powered by real market research data that&lsquo;s embedded directly 
                  in the application. No upload required - the data is always current and ready.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">CSV-Powered</Badge>
                  <Badge variant="secondary">Real-Time Processing</Badge>
                  <Badge variant="secondary">Comprehensive Coverage</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <RefreshCw className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Processing Market Data...
              </h3>
              <p className="text-gray-600">
                Loading and analyzing comprehensive market research data
              </p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <Alert variant="error" className="mb-6">
              <div>
                <h4 className="font-semibold">Data Processing Error</h4>
                <p>{error}</p>
              </div>
            </Alert>
          )}

          {/* Success State */}
          {isLoaded && !loading && (
            <Alert variant="success" className="mb-6">
              <CheckCircle className="w-4 h-4" />
              <div>
                <h4 className="font-semibold">Data Successfully Loaded</h4>
                <p>Market research data is active and all dashboard components are operational.</p>
              </div>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
            
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={!dataStats}
            >
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Statistics */}
      {dataStats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Data Overview & Metrics</span>
                <Badge variant="secondary" className="ml-auto">
                  Processed {dataStats.lastProcessed.toLocaleTimeString()}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Records */}
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-700">
                    {formatNumber(dataStats.totalRecords)}
                  </div>
                  <div className="text-sm text-blue-600">Data Points</div>
                </div>

                {/* Market Size */}
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-700">
                    {formatCurrency(dataStats.marketSize2032)}
                  </div>
                  <div className="text-sm text-green-600">Market Size 2032</div>
                </div>

                {/* CAGR */}
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <BarChart3 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-700">
                    {formatPercentage(dataStats.cagr)}
                  </div>
                  <div className="text-sm text-purple-600">CAGR 2024-32</div>
                </div>

                {/* Geographic Coverage */}
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <Globe className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-orange-700">
                    {dataStats.regions}
                  </div>
                  <div className="text-sm text-orange-600">Regions Covered</div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Detailed Breakdown */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Countries:</span>
                  <span className="font-semibold">{dataStats.countries}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Product Types:</span>
                  <span className="font-semibold">{dataStats.productTypes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ingredients:</span>
                  <span className="font-semibold">{dataStats.ingredients}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time Range:</span>
                  <span className="font-semibold">{dataStats.yearRange}</span>
                </div>
              </div>

              {/* Market Growth Summary */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Market Growth Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Base Year (2024)</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {formatCurrency(dataStats.marketSize2024)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Forecast Year (2032)</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {formatCurrency(dataStats.marketSize2032)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Total Growth</div>
                    <div className="text-lg font-semibold text-green-600">
                      {formatPercentage(
                        ((dataStats.marketSize2032 - dataStats.marketSize2024) / dataStats.marketSize2024) * 100
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Data Sources Information */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle>Data Source Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Data Coverage</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4 text-blue-600" />
                  <span>Global and regional market data</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>Comprehensive segment analysis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>8-year forecast period (2024-2032)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span>Real market research insights</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Technical Details</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div>
                  <strong>Data Format:</strong> CSV processed to JSON
                </div>
                <div>
                  <strong>Processing:</strong> Real-time on application load
                </div>
                <div>
                  <strong>Storage:</strong> In-memory with caching
                </div>
                <div>
                  <strong>Updates:</strong> Embedded with application builds
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CSVDataManager;