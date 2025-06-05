// src/hooks/useMarketData.js
'use client';
import { useState, useEffect } from 'react';
import { getMarketData, getMarketDataSync, isMarketDataLoaded } from '@/data/marketData';

/**
 * React Hook for Market Data
 * Provides loading state and real-time data updates
 */
export const useMarketData = () => {
  const [data, setData] = useState(getMarketDataSync());
  const [loading, setLoading] = useState(!isMarketDataLoaded());
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isMarketDataLoaded()) {
      getMarketData()
        .then(marketData => {
          setData(marketData);
          setLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const refreshData = async () => {
    setLoading(true);
    setError(null);
    try {
      const marketData = await getMarketData();
      setData(marketData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { 
    data, 
    loading, 
    error, 
    refreshData,
    isLoaded: isMarketDataLoaded()
  };
};

export default useMarketData;