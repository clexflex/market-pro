// src/components/data/CSVDataManager.js
'use client';
import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  FileText,
  Download,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Database,
  Settings,
  BarChart3,
  TrendingUp,
  Calendar,
  Users
} from 'lucide-react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  Button,
  Alert,
  Progress,
  Badge,
  Separator
} from '@/components/ui';
import { csvDataService } from '@/services/csvDataService';
import { formatCurrency, formatPercentage, formatNumber } from '@/lib/utils';

const CSVDataManager = ({ onDataUpdate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [dataStats, setDataStats] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Check for existing data on component mount
  useEffect(() => {
    const existingData = csvDataService.getProcessedData();
    if (existingData && Object.keys(existingData).length > 0) {
      setDataStats(generateDataStats(existingData));
      setLastUpdated(csvDataService.getLastUpdated());
    }
  }, []);

  // Handle file upload and processing
const handleFileUpload = useCallback(async (file) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Process the CSV file
      const processedData = await csvDataService.loadCSVData(file);
      
      // Complete progress
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Generate statistics
      const stats = generateDataStats(processedData);
      setDataStats(stats);
      setLastUpdated(new Date());
      
      // Update parent component
      if (onDataUpdate) {
        onDataUpdate(processedData);
      }
      
      setSuccess(`Successfully processed ${stats.totalRecords} records from ${file.name}`);
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(null), 5000);
      
    } catch (err) {
      setError(`Failed to process CSV file: ${err.message}`);
    } finally {
      setIsLoading(false);
      setTimeout(() => setUploadProgress(0), 2000);
    }
  }, [onDataUpdate]);

  // Handle file drop
const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const csvFile = files.find(file => 
      file.type === 'text/csv' || 
      file.name.toLowerCase().endsWith('.csv')
    );
    
    if (csvFile) {
      handleFileUpload(csvFile);
    } else {
      setError('Please upload a valid CSV file');
    }
}, [handleFileUpload]);

  // Handle drag over
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  // Handle drag leave
  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  

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
      lastProcessed: new Date()
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
    setIsLoading(true);
    setError(null);
    
    try {
      // This would refresh from the original source
      // For now, we'll just simulate a refresh
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Data refreshed successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to refresh data');
    } finally {
      setIsLoading(false);
    }
  };

  // Export current data
  const handleExport = () => {
    const data = csvDataService.getProcessedData();
    if (!data) {
      setError('No data available to export');
      return;
    }

    // Create exportable data structure
    const exportData = {
      metadata: {
        exportDate: new Date().toISOString(),
        dataSource: 'CSV Upload',
        lastUpdated: lastUpdated?.toISOString()
      },
      overview: data.overview,
      regions: data.regions,
      productTypes: data.productTypes,
      ingredients: data.ingredients,
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

    setSuccess('Data exported successfully');
    setTimeout(() => setSuccess(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="w-5 h-5" />
            <span>CSV Data Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* File Upload Area */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
              isDragOver 
                ? 'border-primary-500 bg-primary-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isLoading}
            />
            
            <div className="space-y-4">
              <div className="flex justify-center">
                {isLoading ? (
                  <RefreshCw className="w-12 h-12 text-primary-600 animate-spin" />
                ) : (
                  <Upload className="w-12 h-12 text-gray-400" />
                )}
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {isLoading ? 'Processing CSV Data...' : 'Upload Market Data CSV'}
                </h3>
                <p className="text-gray-600">
                  Drag and drop your CSV file here, or click to browse
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Supports CSV files with Region, Segment Type, Segment Name, Year, and Value columns
                </p>
              </div>
              
              {isLoading && uploadProgress > 0 && (
                <div className="w-full max-w-md mx-auto">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-sm text-gray-600 mt-2">{uploadProgress}% complete</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-6">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isLoading || !dataStats}
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
            
            <Button variant="outline" disabled>
              <Settings className="w-4 h-4 mr-2" />
              Configure
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Status Messages */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Alert variant="error">
              <AlertCircle className="w-4 h-4" />
              <div>
                <h4 className="font-semibold">Error</h4>
                <p>{error}</p>
              </div>
            </Alert>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Alert variant="success">
              <CheckCircle className="w-4 h-4" />
              <div>
                <h4 className="font-semibold">Success</h4>
                <p>{success}</p>
              </div>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

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
                <span>Data Overview</span>
                {lastUpdated && (
                  <Badge variant="secondary" className="ml-auto">
                    Updated {lastUpdated.toLocaleTimeString()}
                  </Badge>
                )}
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
                  <div className="text-sm text-blue-600">Total Records</div>
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
                  <Users className="w-8 h-8 text-orange-600 mx-auto mb-2" />
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
    </div>
  );
};

export default CSVDataManager;