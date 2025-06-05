// src/hooks/useRealTimeData.js
'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { csvDataService } from '@/services/csvDataService';
import { dataTransformer } from '@/utils/dataTransformation';

/**
 * Real-time Data Synchronization Hook
 * Manages data loading, validation, and real-time updates
 */
export const useRealTimeData = (options = {}) => {
  const {
    autoRefresh = false,
    refreshInterval = 300000, // 5 minutes
    enableValidation = true,
    enableCaching = true,
    onDataUpdate = null,
    onError = null
  } = options;

  // State management
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [validationResults, setValidationResults] = useState(null);
  const [dataSource, setDataSource] = useState('static');
  const [syncStatus, setSyncStatus] = useState('idle'); // 'idle', 'syncing', 'error', 'success'

  // Refs for cleanup
  const refreshIntervalRef = useRef(null);
  const abortControllerRef = useRef(null);

  /**
   * Load data from CSV file or URL
   */
  const loadData = useCallback(async (source, sourceType = 'file') => {
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    
    try {
      setIsLoading(true);
      setError(null);
      setSyncStatus('syncing');

      let processedData;
      
      if (sourceType === 'csv' || sourceType === 'file') {
        // Process CSV data
        const rawData = await csvDataService.loadCSVData(source);
        
        if (enableValidation) {
          const transformationResult = await dataTransformer.processCSVData(
            csvDataService.csvData || []
          );
          processedData = transformationResult.data;
          setValidationResults(transformationResult.validationResults);
        } else {
          processedData = rawData;
        }
      } else {
        // Handle other data sources (API, etc.)
        processedData = source;
      }

      setData(processedData);
      setDataSource(sourceType);
      setLastUpdated(new Date());
      setSyncStatus('success');

      // Cache data if enabled
      if (enableCaching && typeof window !== 'undefined') {
        try {
          const cacheData = {
            data: processedData,
            timestamp: new Date().toISOString(),
            source: sourceType
          };
          sessionStorage.setItem('marketDataCache', JSON.stringify(cacheData));
        } catch (cacheError) {
          console.warn('Failed to cache data:', cacheError);
        }
      }

      // Trigger callback
      if (onDataUpdate) {
        onDataUpdate(processedData, validationResults);
      }

      return processedData;

    } catch (err) {
      if (err.name !== 'AbortError') {
        const errorMessage = `Failed to load data: ${err.message}`;
        setError(errorMessage);
        setSyncStatus('error');
        
        if (onError) {
          onError(err);
        }
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [enableValidation, enableCaching, onDataUpdate, onError]);

  /**
   * Refresh current data source
   */
  const refreshData = useCallback(async () => {
    if (!data || isLoading) return;

    try {
      setSyncStatus('syncing');
      
      // Get cached source information
      const existingData = csvDataService.getProcessedData();
      if (existingData && Object.keys(existingData).length > 0) {
        await loadData(existingData, dataSource);
      } else {
        throw new Error('No data source available for refresh');
      }
    } catch (err) {
      console.error('Failed to refresh data:', err);
      setSyncStatus('error');
    }
  }, [data, isLoading, dataSource, loadData]);

  /**
   * Load cached data on mount
   */
  const loadCachedData = useCallback(() => {
    if (!enableCaching || typeof window === 'undefined') return false;

    try {
      const cached = sessionStorage.getItem('marketDataCache');
      if (cached) {
        const cacheData = JSON.parse(cached);
        const cacheAge = Date.now() - new Date(cacheData.timestamp).getTime();
        
        // Use cached data if less than 1 hour old
        if (cacheAge < 3600000) {
          setData(cacheData.data);
          setDataSource(cacheData.source);
          setLastUpdated(new Date(cacheData.timestamp));
          setSyncStatus('success');
          return true;
        }
      }
    } catch (err) {
      console.warn('Failed to load cached data:', err);
    }
    
    return false;
  }, [enableCaching]);

  /**
   * Setup auto-refresh
   */
  useEffect(() => {
    if (autoRefresh && data && refreshInterval > 0) {
      refreshIntervalRef.current = setInterval(() => {
        refreshData();
      }, refreshInterval);

      return () => {
        if (refreshIntervalRef.current) {
          clearInterval(refreshIntervalRef.current);
        }
      };
    }
  }, [autoRefresh, data, refreshInterval, refreshData]);

  /**
   * Load cached data on mount
   */
  useEffect(() => {
    loadCachedData();
  }, [loadCachedData]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  /**
   * Get data statistics
   */
  const getDataStats = useCallback(() => {
    if (!data) return null;

    return {
      totalRecords: calculateTotalRecords(data),
      regions: data.regions?.length || 0,
      countries: Object.keys(data.countries || {}).length,
      lastUpdated,
      dataSource,
      validationResults,
      syncStatus
    };
  }, [data, lastUpdated, dataSource, validationResults, syncStatus]);

  /**
   * Clear data and cache
   */
  const clearData = useCallback(() => {
    setData(null);
    setError(null);
    setValidationResults(null);
    setLastUpdated(null);
    setDataSource('static');
    setSyncStatus('idle');
    
    if (enableCaching && typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem('marketDataCache');
      } catch (err) {
        console.warn('Failed to clear cache:', err);
      }
    }
  }, [enableCaching]);

  /**
   * Export current data
   */
  const exportData = useCallback((format = 'json') => {
    if (!data) {
      throw new Error('No data available to export');
    }

    const exportData = {
      metadata: {
        exportDate: new Date().toISOString(),
        dataSource,
        lastUpdated: lastUpdated?.toISOString(),
        validationResults
      },
      data
    };

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      return blob;
    } else if (format === 'csv') {
      // Convert to CSV format
      const csvData = convertToCSV(data);
      const blob = new Blob([csvData], { type: 'text/csv' });
      return blob;
    }

    throw new Error(`Unsupported export format: ${format}`);
  }, [data, dataSource, lastUpdated, validationResults]);

  /**
   * Set up data polling for specific endpoints
   */
  const startPolling = useCallback((source, interval = 60000) => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
    }

    const poll = async () => {
      try {
        await loadData(source, 'api');
      } catch (err) {
        console.error('Polling error:', err);
      }
    };

    // Initial load
    poll();

    // Set up interval
    refreshIntervalRef.current = setInterval(poll, interval);
  }, [loadData]);

  /**
   * Stop polling
   */
  const stopPolling = useCallback(() => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }
  }, []);

  return {
    // Data state
    data,
    isLoading,
    error,
    lastUpdated,
    validationResults,
    dataSource,
    syncStatus,

    // Actions
    loadData,
    refreshData,
    clearData,
    exportData,

    // Polling
    startPolling,
    stopPolling,

    // Utilities
    getDataStats
  };
};

/**
 * Hook for data validation monitoring
 */
export const useDataValidation = (data) => {
  const [validationStatus, setValidationStatus] = useState('pending');
  const [validationErrors, setValidationErrors] = useState([]);
  const [validationWarnings, setValidationWarnings] = useState([]);

  useEffect(() => {
    if (!data) {
      setValidationStatus('pending');
      return;
    }

    const validateData = async () => {
      try {
        setValidationStatus('validating');
        
        // Perform basic validation checks
        const errors = [];
        const warnings = [];

        // Check data completeness
        if (!data.overview) {
          errors.push('Missing overview data');
        }

        if (!data.regions || data.regions.length === 0) {
          warnings.push('No regional data available');
        }

        if (!data.productTypes || data.productTypes.length === 0) {
          warnings.push('No product type data available');
        }

        // Check for data consistency
        if (data.overview && data.regions) {
          const totalRegionalShare = data.regions.reduce(
            (sum, region) => sum + (region.marketShare2032 || 0), 0
          );
          
          if (Math.abs(totalRegionalShare - 100) > 5) {
            warnings.push(`Regional market shares sum to ${totalRegionalShare.toFixed(1)}%, expected ~100%`);
          }
        }

        setValidationErrors(errors);
        setValidationWarnings(warnings);
        setValidationStatus(errors.length > 0 ? 'failed' : 'passed');

      } catch (err) {
        setValidationStatus('error');
        setValidationErrors([err.message]);
      }
    };

    validateData();
  }, [data]);

  return {
    validationStatus,
    validationErrors,
    validationWarnings,
    isValid: validationStatus === 'passed',
    hasErrors: validationErrors.length > 0,
    hasWarnings: validationWarnings.length > 0
  };
};

/**
 * Hook for data transformation monitoring
 */
export const useDataTransformation = () => {
  const [transformationStatus, setTransformationStatus] = useState('idle');
  const [transformationProgress, setTransformationProgress] = useState(0);

  const transformData = useCallback(async (rawData, options = {}) => {
    try {
      setTransformationStatus('processing');
      setTransformationProgress(0);

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setTransformationProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      const result = await dataTransformer.processCSVData(rawData);

      clearInterval(progressInterval);
      setTransformationProgress(100);
      setTransformationStatus('completed');

      return result;
    } catch (err) {
      setTransformationStatus('failed');
      throw err;
    }
  }, []);

  return {
    transformationStatus,
    transformationProgress,
    transformData
  };
};

// Utility functions
function calculateTotalRecords(data) {
  if (!data || !data.timeSeries) return 0;
  
  let total = 0;
  Object.keys(data.timeSeries).forEach(region => {
    Object.keys(data.timeSeries[region]).forEach(segmentType => {
      Object.keys(data.timeSeries[region][segmentType]).forEach(segmentName => {
        total += data.timeSeries[region][segmentType][segmentName].length;
      });
    });
  });
  
  return total;
}

function convertToCSV(data) {
  const headers = ['Region', 'Segment Type', 'Segment Name', 'Year', 'Value (USD Million)'];
  const rows = [headers.join(',')];
  
  if (data.timeSeries) {
    Object.keys(data.timeSeries).forEach(region => {
      Object.keys(data.timeSeries[region]).forEach(segmentType => {
        Object.keys(data.timeSeries[region][segmentType]).forEach(segmentName => {
          data.timeSeries[region][segmentType][segmentName].forEach(point => {
            rows.push([
              region,
              segmentType,
              segmentName,
              point.year,
              point.value
            ].join(','));
          });
        });
      });
    });
  }
  
  return rows.join('\n');
}

export default useRealTimeData;