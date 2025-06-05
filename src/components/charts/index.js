'use client';
import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ComposedChart
} from 'recharts';
import { ChartContainer } from '@/components/ui';
import { formatCurrency, formatPercentage, getChartColors } from '@/lib/utils';

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label, formatter }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="font-medium text-gray-900 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-600">{entry.dataKey}:</span>
            <span className="text-sm font-medium text-gray-900">
              {formatter ? formatter(entry.value, entry.dataKey) : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Enhanced Line Chart
export const EnhancedLineChart = ({ 
  data, 
  title, 
  description,
  lines = [],
  xKey = 'year',
  height = 300,
  showGrid = true,
  showLegend = true,
  formatter = (value) => formatCurrency(value),
  className,
  ...props
}) => {
  const colors = getChartColors(lines.length);
  
  return (
    <ChartContainer title={title} description={description} className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
          <XAxis 
            dataKey={xKey} 
            stroke="#666" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#666" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => formatter(value).replace('$', '$').replace('M', 'M')}
          />
          <Tooltip content={<CustomTooltip formatter={formatter} />} />
          {showLegend && <Legend />}
          {lines.map((lineKey, index) => (
            <Line
              key={lineKey}
              type="monotone"
              dataKey={lineKey}
              stroke={colors[index]}
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

// Enhanced Area Chart
export const EnhancedAreaChart = ({ 
  data, 
  title, 
  description,
  areas = [],
  xKey = 'year',
  height = 300,
  stacked = false,
  formatter = (value) => formatCurrency(value),
  className,
  ...props
}) => {
  const colors = getChartColors(areas.length);
  
  return (
    <ChartContainer title={title} description={description} className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey={xKey} 
            stroke="#666" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#666" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => formatter(value).replace('$', '$').replace('M', 'M')}
          />
          <Tooltip content={<CustomTooltip formatter={formatter} />} />
          <Legend />
          {areas.map((areaKey, index) => (
            <Area
              key={areaKey}
              type="monotone"
              dataKey={areaKey}
              stackId={stacked ? "1" : undefined}
              stroke={colors[index]}
              fill={colors[index]}
              fillOpacity={0.6}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

// Enhanced Bar Chart
export const EnhancedBarChart = ({ 
  data, 
  title, 
  description,
  bars = [],
  xKey = 'name',
  height = 300,
  horizontal = false,
  formatter = (value) => formatCurrency(value),
  className,
  ...props
}) => {
  const colors = getChartColors(bars.length);
  
  return (
    <ChartContainer title={title} description={description} className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart 
          data={data} 
          layout={horizontal ? 'horizontal' : 'vertical'}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          {horizontal ? (
            <>
              <XAxis 
                type="number" 
                stroke="#666" 
                fontSize={12}
                tickFormatter={(value) => formatter(value).replace('$', '$').replace('M', 'M')}
              />
              <YAxis type="category" dataKey={xKey} stroke="#666" fontSize={12} />
            </>
          ) : (
            <>
              <XAxis 
                dataKey={xKey} 
                stroke="#666" 
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                stroke="#666" 
                fontSize={12}
                tickFormatter={(value) => formatter(value).replace('$', '$').replace('M', 'M')}
              />
            </>
          )}
          <Tooltip content={<CustomTooltip formatter={formatter} />} />
          <Legend />
          {bars.map((barKey, index) => (
            <Bar
              key={barKey}
              dataKey={barKey}
              fill={colors[index]}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

// Enhanced Pie Chart
export const EnhancedPieChart = ({ 
  data, 
  title, 
  description,
  dataKey = 'value',
  nameKey = 'name',
  height = 300,
  showLabels = true,
  formatter = (value) => formatCurrency(value),
  className,
  ...props
}) => {
  const colors = getChartColors(data.length);
  
  const renderLabel = ({ name, percent }) => {
    return showLabels ? `${name} ${(percent * 100).toFixed(1)}%` : '';
  };
  
  return (
    <ChartContainer title={title} description={description} className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey={dataKey}
            nameKey={nameKey}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip formatter={formatter} />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

// Market Growth Chart (Composed Chart)
export const MarketGrowthChart = ({ 
  data, 
  title = "Market Growth Analysis",
  description,
  valueKey = 'value',
  growthKey = 'growth',
  height = 350,
  className,
  ...props
}) => {
  return (
    <ChartContainer title={title} description={description} className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="year" 
            stroke="#666" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            yAxisId="left"
            stroke="#666" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}M`}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            stroke="#666" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar 
            yAxisId="left"
            dataKey={valueKey} 
            fill="#3B82F6" 
            name="Market Value (USD M)"
            radius={[4, 4, 0, 0]}
          />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey={growthKey} 
            stroke="#EC4899" 
            strokeWidth={3}
            dot={{ r: 5 }}
            name="Growth Rate (%)"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

// Regional Comparison Chart
export const RegionalComparisonChart = ({ 
  data, 
  title = "Regional Market Comparison",
  description,
  height = 400,
  className,
  ...props
}) => {
  const regions = Object.keys(data);
  const years = data[regions[0]]?.map(d => d.year) || [];
  const colors = getChartColors(regions.length);
  
  // Transform data for multi-line chart
  const chartData = years.map(year => {
    const yearData = { year };
    regions.forEach(region => {
      const regionYearData = data[region]?.find(d => d.year === year);
      yearData[region] = regionYearData?.value || 0;
    });
    return yearData;
  });
  
  return (
    <ChartContainer title={title} description={description} className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="year" 
            stroke="#666" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#666" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}M`}
          />
          <Tooltip content={<CustomTooltip formatter={(value) => formatCurrency(value)} />} />
          <Legend />
          {regions.map((region, index) => (
            <Line
              key={region}
              type="monotone"
              dataKey={region}
              stroke={colors[index]}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

// Market Share Donut Chart
export const MarketShareDonut = ({ 
  data, 
  title = "Market Share Analysis",
  description,
  height = 300,
  innerRadius = 60,
  className,
  ...props
}) => {
  const colors = getChartColors(data.length);
  
  const renderLabel = ({ name, percent }) => {
    return `${name}: ${(percent * 100).toFixed(1)}%`;
  };
  
  return (
    <ChartContainer title={title} description={description} className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderLabel}
            outerRadius={100}
            innerRadius={innerRadius}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip formatter={(value) => formatPercentage(value)} />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

// Export all chart components
export {
  EnhancedLineChart,
  EnhancedAreaChart,
  EnhancedBarChart,
  EnhancedPieChart,
  MarketGrowthChart,
  RegionalComparisonChart,
  MarketShareDonut,
  CustomTooltip
};

export default {
  EnhancedLineChart,
  EnhancedAreaChart,
  EnhancedBarChart,
  EnhancedPieChart,
  MarketGrowthChart,
  RegionalComparisonChart,
  MarketShareDonut
};