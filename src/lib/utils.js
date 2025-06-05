import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Format currency values
export const formatCurrency = (value, options = {}) => {
  const {
    currency = 'USD',
    minimumFractionDigits = 1,
    maximumFractionDigits = 1,
    notation = 'standard'
  } = options;

  if (value >= 1000) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      notation: 'compact',
      minimumFractionDigits,
      maximumFractionDigits
    }).format(value * 1000000).replace('$', '$') + 'M';
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits
  }).format(value * 1000000);
};

// Format percentage values
export const formatPercentage = (value, decimals = 1) => {
  return `${Number(value).toFixed(decimals)}%`;
};

// Format large numbers
export const formatNumber = (num) => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num?.toString();
};

// Calculate CAGR
export const calculateCAGR = (startValue, endValue, years) => {
  if (startValue <= 0 || endValue <= 0 || years <= 0) return 0;
  return ((Math.pow(endValue / startValue, 1 / years) - 1) * 100);
};

// Generate color palette for charts
export const getChartColors = (count) => {
  const baseColors = [
    '#3B82F6', // Blue
    '#EC4899', // Pink
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#06B6D4', // Cyan
    '#84CC16', // Lime
    '#F97316', // Orange
    '#6366F1', // Indigo
  ];
  
  if (count <= baseColors.length) {
    return baseColors.slice(0, count);
  }
  
  // Generate additional colors if needed
  const additionalColors = [];
  for (let i = baseColors.length; i < count; i++) {
    const hue = (i * 137.508) % 360; // Golden angle for better distribution
    additionalColors.push(`hsl(${hue}, 70%, 50%)`);
  }
  
  return [...baseColors, ...additionalColors];
};

// Debounce function for search inputs
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Generate random data for demo purposes
export const generateDemoData = (length, min = 0, max = 100) => {
  return Array.from({ length }, () => 
    Math.floor(Math.random() * (max - min + 1)) + min
  );
};

// Date formatting utilities
export const formatDate = (date, format = 'short') => {
  const options = {
    short: { year: 'numeric', month: 'short' },
    long: { year: 'numeric', month: 'long', day: 'numeric' },
    year: { year: 'numeric' }
  };
  
  return new Intl.DateTimeFormat('en-US', options[format]).format(new Date(date));
};

// Download data as CSV
export const downloadCSV = (data, filename = 'market-data') => {
  if (!data || data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape commas and quotes in CSV
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Get trend indicator
export const getTrendIndicator = (currentValue, previousValue) => {
  if (currentValue > previousValue) {
    return { direction: 'up', color: 'text-green-600', icon: '↗' };
  } else if (currentValue < previousValue) {
    return { direction: 'down', color: 'text-red-600', icon: '↘' };
  }
  return { direction: 'stable', color: 'text-gray-600', icon: '→' };
};

// Market segment analysis helpers
export const getMarketSegmentInsights = (data) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const segments = data.map(item => ({
    ...item,
    percentage: (item.value / total) * 100,
    isLeader: item.value === Math.max(...data.map(d => d.value))
  }));
  
  return {
    segments,
    leader: segments.find(s => s.isLeader),
    total,
    concentration: Math.max(...segments.map(s => s.percentage)) // Market concentration
  };
};

// Regional performance analysis
export const analyzeRegionalPerformance = (regionalData) => {
  const regions = Object.entries(regionalData).map(([region, data]) => {
    const startValue = data[0]?.value || 0;
    const endValue = data[data.length - 1]?.value || 0;
    const cagr = calculateCAGR(startValue, endValue, data.length - 1);
    
    return {
      region,
      startValue,
      endValue,
      cagr,
      growth: endValue - startValue,
      data
    };
  });
  
  return {
    regions,
    fastestGrowing: regions.reduce((a, b) => a.cagr > b.cagr ? a : b),
    largest: regions.reduce((a, b) => a.endValue > b.endValue ? a : b),
    totalMarket: regions.reduce((sum, r) => sum + r.endValue, 0)
  };
};

export default {
  cn,
  formatCurrency,
  formatPercentage,
  formatNumber,
  calculateCAGR,
  getChartColors,
  debounce,
  generateDemoData,
  formatDate,
  downloadCSV,
  getTrendIndicator,
  getMarketSegmentInsights,
  analyzeRegionalPerformance
};