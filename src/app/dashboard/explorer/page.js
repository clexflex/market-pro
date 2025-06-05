'use client';
import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Database,
  Search,
  Filter,
  Download,
  Eye,
  BarChart3,
  Table,
  Settings,
  RefreshCw,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  Grid,
  List,
  SlidersHorizontal
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  Badge,
  Button,
  Input,
  Select,
  Progress,
  Separator,
  LoadingSpinner
} from '@/components/ui';
import { useMarketData } from '@/hooks/useMarketData';
import { formatCurrency, formatPercentage, downloadCSV, debounce } from '@/lib/utils';

const DataExplorer = () => {
  const { data: marketData, loading, error } = useMarketData();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [sortField, setSortField] = useState('marketSize2032');
  const [sortDirection, setSortDirection] = useState('desc');
  const [viewMode, setViewMode] = useState('table'); // table, grid, insights
  
  // Filters
  const [filters, setFilters] = useState({
    region: 'all',
    segmentType: 'all',
    marketSize: 'all',
    growthRate: 'all',
    year: '2032'
  });

  // Show loading state
  if (loading) {
    return (
      <DashboardLayout 
        title="Data Explorer" 
        breadcrumb={['Dashboard', 'Data Explorer']}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <LoadingSpinner size="lg" className="mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Loading Data Explorer...
            </h3>
            <p className="text-gray-600">
              Processing comprehensive dataset
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
        title="Data Explorer" 
        breadcrumb={['Dashboard', 'Data Explorer']}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-600 mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Failed to Load Data
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

  // Generate comprehensive dataset from market data
  const generateDataset = useMemo(() => {
    if (!marketData) return [];
    
    const dataset = [];
    
    // Add regional data
    if (marketData.regions) {
      marketData.regions.forEach((region, index) => {
        const size2024 = (marketData.overview.marketSizeBase * region.marketShare2024) / 100;
        const size2032 = (marketData.overview.marketSizeForecast * region.marketShare2032) / 100;
        
        dataset.push({
          id: `region-${region.name}`,
          type: 'Region',
          name: region.name,
          segment: 'Geographic',
          marketSize2024: size2024,
          marketSize2032: size2032,
          marketShare2024: region.marketShare2024,
          marketShare2032: region.marketShare2032,
          cagr: region.cagr,
          growth: size2024 > 0 ? ((size2032 - size2024) / size2024) * 100 : 0,
          keyMarkets: region.keyMarkets?.join(', ') || '',
          drivers: region.marketDrivers?.join(', ') || ''
        });
      });
    }

    // Add product type data
    if (marketData.productTypes) {
      marketData.productTypes.forEach((product) => {
        const size2024 = (marketData.overview.marketSizeBase * product.marketShare2024) / 100;
        const size2032 = (marketData.overview.marketSizeForecast * product.marketShare2032) / 100;
        
        dataset.push({
          id: `product-${product.name}`,
          type: 'Product Type',
          name: product.name,
          segment: 'Product',
          marketSize2024: size2024,
          marketSize2032: size2032,
          marketShare2024: product.marketShare2024,
          marketShare2032: product.marketShare2032,
          cagr: product.cagr,
          growth: ((size2032 - size2024) / size2024) * 100,
          applications: product.applications?.join(', ') || '',
          description: product.description || ''
        });
      });
    }

    // Add ingredient data
    if (marketData.ingredients) {
      marketData.ingredients.forEach((ingredient) => {
        const size2024 = (marketData.overview.marketSizeBase * ingredient.marketShare2024) / 100;
        const size2032 = (marketData.overview.marketSizeForecast * ingredient.marketShare2032) / 100;
        
        dataset.push({
          id: `ingredient-${ingredient.name}`,
          type: 'Ingredient',
          name: ingredient.name,
          segment: 'Ingredient',
          marketSize2024: size2024,
          marketSize2032: size2032,
          marketShare2024: ingredient.marketShare2024,
          marketShare2032: ingredient.marketShare2032,
          cagr: ingredient.cagr,
          growth: ((size2032 - size2024) / size2024) * 100,
          benefits: ingredient.benefits?.join(', ') || ''
        });
      });
    }

    // Add gender segment data
    if (marketData.gender) {
      marketData.gender.forEach((gender) => {
        const size2024 = (marketData.overview.marketSizeBase * gender.marketShare2024) / 100;
        const size2032 = (marketData.overview.marketSizeForecast * gender.marketShare2032) / 100;
        
        dataset.push({
          id: `gender-${gender.name}`,
          type: 'Demographics',
          name: gender.name,
          segment: 'Gender',
          marketSize2024: size2024,
          marketSize2032: size2032,
          marketShare2024: gender.marketShare2024,
          marketShare2032: gender.marketShare2032,
          cagr: gender.cagr,
          growth: ((size2032 - size2024) / size2024) * 100,
          ageGroups: gender.ageGroups?.join(', ') || ''
        });
      });
    }

    // Add end user data
    if (marketData.endUsers) {
      marketData.endUsers.forEach((endUser) => {
        const size2024 = (marketData.overview.marketSizeBase * endUser.marketShare2024) / 100;
        const size2032 = (marketData.overview.marketSizeForecast * endUser.marketShare2032) / 100;
        
        dataset.push({
          id: `enduser-${endUser.name}`,
          type: 'End User',
          name: endUser.name,
          segment: 'Channel',
          marketSize2024: size2024,
          marketSize2032: size2032,
          marketShare2024: endUser.marketShare2024,
          marketShare2032: endUser.marketShare2032,
          cagr: endUser.cagr,
          growth: ((size2032 - size2024) / size2024) * 100,
          characteristics: endUser.characteristics?.join(', ') || ''
        });
      });
    }

    // Add country data
    if (marketData.countries) {
      Object.entries(marketData.countries).forEach(([country, data]) => {
        dataset.push({
          id: `country-${country}`,
          type: 'Country',
          name: country,
          segment: 'Geographic',
          marketSize2024: data.marketSize2024,
          marketSize2032: data.marketSize2032,
          marketShare2024: (data.marketSize2024 / marketData.overview.marketSizeBase) * 100,
          marketShare2032: (data.marketSize2032 / marketData.overview.marketSizeForecast) * 100,
          cagr: data.cagr,
          growth: ((data.marketSize2032 - data.marketSize2024) / data.marketSize2024) * 100,
          population: data.population,
          penetrationRate: data.penetrationRate,
          avgSpending: data.averageSpending
        });
      });
    }

    return dataset;
  }, [marketData]);

  // Apply filters and search
  const filteredData = useMemo(() => {
    let filtered = [...generateDataset];

    // Apply search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchLower) ||
        item.type.toLowerCase().includes(searchLower) ||
        item.segment.toLowerCase().includes(searchLower) ||
        (item.keyMarkets && item.keyMarkets.toLowerCase().includes(searchLower)) ||
        (item.drivers && item.drivers.toLowerCase().includes(searchLower)) ||
        (item.applications && item.applications.toLowerCase().includes(searchLower)) ||
        (item.benefits && item.benefits.toLowerCase().includes(searchLower))
      );
    }

    // Apply filters
    if (filters.segmentType !== 'all') {
      filtered = filtered.filter(item => item.type === filters.segmentType);
    }

    if (filters.marketSize !== 'all') {
      const sizeKey = filters.year === '2024' ? 'marketSize2024' : 'marketSize2032';
      switch (filters.marketSize) {
        case 'large':
          filtered = filtered.filter(item => item[sizeKey] >= 500);
          break;
        case 'medium':
          filtered = filtered.filter(item => item[sizeKey] >= 100 && item[sizeKey] < 500);
          break;
        case 'small':
          filtered = filtered.filter(item => item[sizeKey] < 100);
          break;
      }
    }

    if (filters.growthRate !== 'all') {
      switch (filters.growthRate) {
        case 'high':
          filtered = filtered.filter(item => item.cagr >= 12);
          break;
        case 'medium':
          filtered = filtered.filter(item => item.cagr >= 8 && item.cagr < 12);
          break;
        case 'low':
          filtered = filtered.filter(item => item.cagr < 8);
          break;
      }
    }

    return filtered;
  }, [generateDataset, searchTerm, filters]);

  // Apply sorting
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }, [filteredData, sortField, sortDirection]);

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Handle filter change
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
    setCurrentPage(1);
  };

  // Export data
  const handleExport = () => {
    const exportData = sortedData.map(item => ({
      'Type': item.type,
      'Name': item.name,
      'Segment': item.segment,
      'Market Size 2024 (USD M)': item.marketSize2024.toFixed(2),
      'Market Size 2032 (USD M)': item.marketSize2032.toFixed(2),
      'Market Share 2024 (%)': item.marketShare2024.toFixed(2),
      'Market Share 2032 (%)': item.marketShare2032.toFixed(2),
      'CAGR (%)': item.cagr.toFixed(2),
      'Growth (%)': item.growth.toFixed(2)
    }));
    
    downloadCSV(exportData, 'market-data-analysis');
  };

  // Summary statistics
  const summaryStats = useMemo(() => {
    const totalMarketSize = sortedData.reduce((sum, item) => sum + item.marketSize2032, 0);
    const averageCAGR = sortedData.reduce((sum, item) => sum + item.cagr, 0) / sortedData.length;
    const highGrowthSegments = sortedData.filter(item => item.cagr >= 12).length;
    
    return {
      totalRecords: sortedData.length,
      totalMarketSize,
      averageCAGR,
      highGrowthSegments,
      topPerformer: sortedData.reduce((max, item) => 
        item.marketSize2032 > max.marketSize2032 ? item : max, sortedData[0] || {}
      )
    };
  }, [sortedData]);

  const debouncedSearch = debounce((value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, 300);

  return (
    <DashboardLayout 
      title="Data Explorer" 
      breadcrumb={['Dashboard', 'Data Explorer']}
    >
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
        >
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Interactive Data Explorer
            </h2>
            <p className="text-gray-600">
              Comprehensive dataset with advanced filtering, search, and export capabilities
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('table')}
              >
                <Table className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'insights' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('insights')}
              >
                <BarChart3 className="w-4 h-4" />
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export ({sortedData.length})
            </Button>
          </div>
        </motion.div>

        {/* Summary Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary-600">{summaryStats.totalRecords}</div>
              <div className="text-sm text-gray-600">Total Records</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{formatCurrency(summaryStats.totalMarketSize)}</div>
              <div className="text-sm text-gray-600">Combined Market Size</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{formatPercentage(summaryStats.averageCAGR || 0)}</div>
              <div className="text-sm text-gray-600">Average CAGR</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{summaryStats.highGrowthSegments}</div>
              <div className="text-sm text-gray-600">High Growth Segments</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <SlidersHorizontal className="w-5 h-5" />
                <span>Filters & Search</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                {/* Search */}
                <div className="lg:col-span-2">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search across all fields..."
                      className="pl-9"
                      onChange={(e) => debouncedSearch(e.target.value)}
                    />
                  </div>
                </div>
                
                {/* Segment Type Filter */}
                <Select 
                  value={filters.segmentType} 
                  onChange={(e) => handleFilterChange('segmentType', e.target.value)}
                >
                  <option value="all">All Segment Types</option>
                  <option value="Region">Regions</option>
                  <option value="Country">Countries</option>
                  <option value="Product Type">Product Types</option>
                  <option value="Ingredient">Ingredients</option>
                  <option value="Demographics">Demographics</option>
                  <option value="End User">End Users</option>
                </Select>

                {/* Market Size Filter */}
                <Select 
                  value={filters.marketSize} 
                  onChange={(e) => handleFilterChange('marketSize', e.target.value)}
                >
                  <option value="all">All Market Sizes</option>
                  <option value="large">Large (≥$500M)</option>
                  <option value="medium">Medium ($100M-$500M)</option>
                  <option value="small">Small (&lt;$100M)</option>
                </Select>

                {/* Growth Rate Filter */}
                <Select 
                  value={filters.growthRate} 
                  onChange={(e) => handleFilterChange('growthRate', e.target.value)}
                >
                  <option value="all">All Growth Rates</option>
                  <option value="high">High (≥12% CAGR)</option>
                  <option value="medium">Medium (8%-12% CAGR)</option>
                  <option value="low">Low (&lt;8% CAGR)</option>
                </Select>

                {/* Year Filter */}
                <Select 
                  value={filters.year} 
                  onChange={(e) => handleFilterChange('year', e.target.value)}
                >
                  <option value="2024">2024 Data</option>
                  <option value="2032">2032 Projections</option>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Data Display */}
        {viewMode === 'table' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Table className="w-5 h-5" />
                    <span>Data Table</span>
                    <Badge variant="secondary">{sortedData.length} records</Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Rows per page:</span>
                    <Select 
                      value={itemsPerPage} 
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="w-20"
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </Select>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        {[
                          { key: 'type', label: 'Type' },
                          { key: 'name', label: 'Name' },
                          { key: 'segment', label: 'Segment' },
                          { key: 'marketSize2024', label: '2024 Size (USD M)' },
                          { key: 'marketSize2032', label: '2032 Size (USD M)' },
                          { key: 'marketShare2032', label: 'Market Share (%)' },
                          { key: 'cagr', label: 'CAGR (%)' },
                          { key: 'growth', label: 'Growth (%)' }
                        ].map(column => (
                          <th 
                            key={column.key}
                            className="text-left py-3 px-4 font-semibold cursor-pointer hover:bg-gray-50"
                            onClick={() => handleSort(column.key)}
                          >
                            <div className="flex items-center space-x-1">
                              <span>{column.label}</span>
                              <ArrowUpDown className="w-3 h-3" />
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedData.map((item, index) => (
                        <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <Badge 
                              variant={
                                item.type === 'Region' ? 'default' :
                                item.type === 'Country' ? 'secondary' :
                                item.type === 'Product Type' ? 'success' :
                                item.type === 'Ingredient' ? 'warning' :
                                'outline'
                              }
                              className="text-xs"
                            >
                              {item.type}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 font-medium">{item.name}</td>
                          <td className="py-3 px-4 text-gray-600">{item.segment}</td>
                          <td className="py-3 px-4 text-right">{item.marketSize2024.toFixed(1)}</td>
                          <td className="py-3 px-4 text-right font-semibold">{item.marketSize2032.toFixed(1)}</td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Progress value={item.marketShare2032} className="w-12 h-2" />
                              <span>{item.marketShare2032.toFixed(1)}%</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Badge 
                              variant={item.cagr >= 12 ? 'success' : item.cagr >= 8 ? 'warning' : 'secondary'}
                            >
                              {item.cagr.toFixed(1)}%
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-right">{item.growth.toFixed(1)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-600">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} results
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-sm">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Grid View */}
        {viewMode === 'grid' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {paginatedData.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="outline" className="text-xs">
                      {item.type}
                    </Badge>
                    <Badge 
                      variant={item.cagr >= 12 ? 'success' : item.cagr >= 8 ? 'warning' : 'secondary'}
                      className="text-xs"
                    >
                      {item.cagr.toFixed(1)}% CAGR
                    </Badge>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{item.name}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">2032 Size:</span>
                      <span className="font-semibold">{formatCurrency(item.marketSize2032)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Market Share:</span>
                      <span>{item.marketShare2032.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Growth:</span>
                      <span>{item.growth.toFixed(1)}%</span>
                    </div>
                  </div>
                  <Progress value={item.marketShare2032} className="mt-3" />
                </CardContent>
              </Card>
            ))}
          </motion.div>
        )}

        {/* Insights View */}
        {viewMode === 'insights' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Data Insights & Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Top Performer</h4>
                    <p className="text-sm text-blue-800 mb-1">{summaryStats.topPerformer?.name}</p>
                    <p className="text-xs text-blue-600">{formatCurrency(summaryStats.topPerformer?.marketSize2032 || 0)} market size</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">Growth Leaders</h4>
                    <p className="text-sm text-green-800 mb-1">{summaryStats.highGrowthSegments} segments</p>
                    <p className="text-xs text-green-600">With ≥12% CAGR</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-purple-900 mb-2">Market Coverage</h4>
                    <p className="text-sm text-purple-800 mb-1">{summaryStats.totalRecords} data points</p>
                    <p className="text-xs text-purple-600">Comprehensive analysis</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DataExplorer;