
'use client';

import { useState } from 'react';
import { Product } from '@/types/stock';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line,
  Area,
  AreaChart
} from 'recharts';
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Activity } from 'lucide-react';

interface InteractiveChartsProps {
  products: Product[];
}

type ChartType = 'bar' | 'pie' | 'line' | 'area';

export function InteractiveCharts({ products }: InteractiveChartsProps) {
  const [activeChart, setActiveChart] = useState<ChartType>('bar');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hoveredData, setHoveredData] = useState<any>(null);

  // Données pour le graphique en barres
  const quantityData = products
    .filter(product => !selectedCategory || product.category === selectedCategory)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 8)
    .map(product => ({
      name: product.name.length > 12 ? product.name.substring(0, 12) + '...' : product.name,
      quantity: product.quantity,
      value: product.quantity * product.price,
      category: product.category,
    }));

  // Données pour le graphique camembert
  const categoryData = products.reduce((acc, product) => {
    const existing = acc.find(item => item.name === product.category);
    if (existing) {
      existing.value += 1;
      existing.totalValue += product.quantity * product.price;
    } else {
      acc.push({ 
        name: product.category, 
        value: 1,
        totalValue: product.quantity * product.price,
        color: getCategoryColor(product.category)
      });
    }
    return acc;
  }, [] as { name: string; value: number; totalValue: number; color: string }[]);

  // Données pour l'évolution temporelle
  const evolutionData = [
    { month: 'Jan', stock: 45, prediction: 50 },
    { month: 'Fév', stock: 52, prediction: 55 },
    { month: 'Mar', stock: 48, prediction: 52 },
    { month: 'Avr', stock: 61, prediction: 58 },
    { month: 'Mai', stock: 55, prediction: 60 },
    { month: 'Juin', stock: products.reduce((sum, p) => sum + p.quantity, 0), prediction: 65 },
  ];

  function getCategoryColor(category: string): string {
    const colors = {
      'Électronique': '#4F46E5',
      'Vêtements': '#22D3EE', 
      'Alimentation': '#A78BFA',
      'Maison': '#10B981',
      'Sport': '#F59E0B',
      'Livres': '#EF4444',
    };
    return colors[category as keyof typeof colors] || '#6B7280';
  }

  const chartTypes = [
    { type: 'bar' as ChartType, icon: BarChart3, label: 'Barres', color: 'from-blue-500 to-cyan-500' },
    { type: 'pie' as ChartType, icon: PieChartIcon, label: 'Secteurs', color: 'from-purple-500 to-pink-500' },
    { type: 'line' as ChartType, icon: TrendingUp, label: 'Tendance', color: 'from-emerald-500 to-teal-500' },
    { type: 'area' as ChartType, icon: Activity, label: 'Surface', color: 'from-orange-500 to-red-500' },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-xl p-4 shadow-2xl">
          <p className="text-gray-300 text-sm mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <p className="text-white font-medium">
                {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
              </p>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    const chartProps = {
      width: "100%",
      height: 400,
      data: activeChart === 'pie' ? categoryData : activeChart === 'bar' ? quantityData : evolutionData,
    };

    switch (activeChart) {
      case 'bar':
        return (
          <BarChart {...chartProps}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.9}/>
                <stop offset="95%" stopColor="#22D3EE" stopOpacity={0.3}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.3} />
            <XAxis dataKey="name" tick={{ fill: '#E0E0E0', fontSize: 12 }} />
            <YAxis tick={{ fill: '#E0E0E0', fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="quantity" 
              fill="url(#barGradient)" 
              radius={[8, 8, 0, 0]}
              onMouseEnter={(data) => setHoveredData(data)}
              onMouseLeave={() => setHoveredData(null)}
            />
          </BarChart>
        );

      case 'pie':
        return (
          <PieChart {...chartProps}>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              onMouseEnter={(data) => setHoveredData(data)}
              onMouseLeave={() => setHoveredData(null)}
            >
              {categoryData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  stroke={hoveredData?.name === entry.name ? '#FFFFFF' : 'transparent'}
                  strokeWidth={hoveredData?.name === entry.name ? 3 : 0}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        );

      case 'line':
        return (
          <LineChart {...chartProps}>
            <defs>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#22D3EE" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.3} />
            <XAxis dataKey="month" tick={{ fill: '#E0E0E0', fontSize: 12 }} />
            <YAxis tick={{ fill: '#E0E0E0', fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="stock" 
              stroke="url(#lineGradient)"
              strokeWidth={4}
              dot={{ fill: '#10B981', strokeWidth: 3, r: 6 }}
              activeDot={{ r: 10, stroke: '#10B981', strokeWidth: 3, fill: '#FFFFFF' }}
            />
            <Line 
              type="monotone" 
              dataKey="prediction" 
              stroke="#A78BFA"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: '#A78BFA', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart {...chartProps}>
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#A78BFA" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#A78BFA" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.3} />
            <XAxis dataKey="month" tick={{ fill: '#E0E0E0', fontSize: 12 }} />
            <YAxis tick={{ fill: '#E0E0E0', fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="stock"
              stroke="#A78BFA"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#areaGradient)"
            />
          </AreaChart>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Sélecteur de type de graphique */}
      <div className="flex flex-wrap gap-3">
        {chartTypes.map((chart) => {
          const Icon = chart.icon;
          return (
            <button
              key={chart.type}
              onClick={() => setActiveChart(chart.type)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 ${
                activeChart === chart.type
                  ? `bg-gradient-to-r ${chart.color} text-white shadow-lg scale-105`
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="font-medium">{chart.label}</span>
            </button>
          );
        })}
      </div>

      {/* Filtres pour les catégories */}
      {activeChart === 'bar' && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-200 ${
              !selectedCategory
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Toutes
          </button>
          {Array.from(new Set(products.map(p => p.category))).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Container du graphique */}
      <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">
            Analyse {chartTypes.find(c => c.type === activeChart)?.label}
          </h3>
          {hoveredData && (
            <div className="text-sm text-gray-300 bg-gray-800/50 px-3 py-1.5 rounded-lg">
              Survol: {hoveredData.name || hoveredData.category}
            </div>
          )}
        </div>
        
        <ResponsiveContainer width="100%" height={400}>
          {renderChart()}
        </ResponsiveContainer>
        
        {/* Légende interactive */}
        {activeChart === 'pie' && (
          <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-gray-700">
            {categoryData.map((entry, index) => (
              <div 
                key={entry.name}
                className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform"
                onClick={() => setSelectedCategory(entry.name)}
              >
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-gray-300 text-sm">{entry.name}</span>
                <span className="text-gray-500 text-xs">({entry.value})</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
