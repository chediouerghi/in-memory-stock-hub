
import { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Area, AreaChart, Legend
} from 'recharts';
import { Product } from '@/types/stock';

interface InteractiveChartsProps {
  products: Product[];
}

export function InteractiveCharts({ products }: InteractiveChartsProps) {
  const [activeChart, setActiveChart] = useState('bar');
  const [hoveredData, setHoveredData] = useState<any>(null);

  // Données pour graphique en barres
  const barData = products.map(product => ({
    name: product.name.length > 15 ? product.name.substring(0, 15) + '...' : product.name,
    quantity: product.quantity,
    value: product.quantity * product.price,
    category: product.category
  }));

  // Données pour graphique en secteurs
  const categoryData = products.reduce((acc, product) => {
    const existing = acc.find(item => item.name === product.category);
    if (existing) {
      existing.value += product.quantity;
      existing.totalValue += product.quantity * product.price;
    } else {
      acc.push({
        name: product.category,
        value: product.quantity,
        totalValue: product.quantity * product.price,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`
      });
    }
    return acc;
  }, [] as any[]);

  // Données pour graphique en ligne (évolution simulée)
  const timeData = [
    { month: 'Jan', stock: 150, value: 45000 },
    { month: 'Fév', stock: 180, value: 52000 },
    { month: 'Mar', stock: 220, value: 68000 },
    { month: 'Avr', stock: 195, value: 58000 },
    { month: 'Mai', stock: 250, value: 75000 },
    { month: 'Juin', stock: products.reduce((sum, p) => sum + p.quantity, 0), value: products.reduce((sum, p) => sum + (p.quantity * p.price), 0) }
  ];

  const COLORS = ['#4F46E5', '#22D3EE', '#A78BFA', '#F59E0B', '#EF4444', '#10B981'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg p-4 shadow-2xl">
          <p className="text-white font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-gray-300">
              <span style={{ color: entry.color }}>●</span> {entry.dataKey}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const chartButtons = [
    { id: 'bar', label: 'Quantités', icon: '📊' },
    { id: 'pie', label: 'Catégories', icon: '🥧' },
    { id: 'line', label: 'Évolution', icon: '📈' },
    { id: 'area', label: 'Tendances', icon: '🌊' }
  ];

  return (
    <div className="chart-container">
      {/* Sélecteur de graphiques */}
      <div className="flex flex-wrap gap-3 mb-6">
        {chartButtons.map((button) => (
          <button
            key={button.id}
            onClick={() => setActiveChart(button.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
              activeChart === button.id
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white'
            }`}
          >
            <span className="text-lg">{button.icon}</span>
            {button.label}
          </button>
        ))}
      </div>

      {/* Conteneur du graphique */}
      <div className="relative">
        <div className="h-80 md:h-96">
          <ResponsiveContainer width="100%" height="100%">
            {activeChart === 'bar' && (
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4F46E5" />
                    <stop offset="100%" stopColor="#22D3EE" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="name" 
                  stroke="#9CA3AF" 
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="quantity" 
                  fill="url(#barGradient)"
                  radius={[4, 4, 0, 0]}
                  onMouseEnter={(data) => setHoveredData(data)}
                  onMouseLeave={() => setHoveredData(null)}
                />
              </BarChart>
            )}

            {activeChart === 'pie' && (
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  onMouseEnter={(data) => setHoveredData(data)}
                  onMouseLeave={() => setHoveredData(null)}
                >
                  {categoryData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]}
                      stroke="#1F2937"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ color: '#9CA3AF' }}
                  formatter={(value) => <span style={{ color: '#E5E7EB' }}>{value}</span>}
                />
              </PieChart>
            )}

            {activeChart === 'line' && (
              <LineChart data={timeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="stock" 
                  stroke="#4F46E5"
                  strokeWidth={3}
                  dot={{ fill: '#4F46E5', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: '#22D3EE', strokeWidth: 2 }}
                />
              </LineChart>
            )}

            {activeChart === 'area' && (
              <AreaChart data={timeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#A78BFA" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#A78BFA" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#A78BFA"
                  strokeWidth={2}
                  fill="url(#areaGradient)"
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Informations sur survol */}
        {hoveredData && (
          <div className="absolute top-4 right-4 bg-gray-900/95 border border-gray-700 rounded-lg p-3 shadow-xl">
            <p className="text-white text-sm font-medium">Élément sélectionné</p>
            <p className="text-gray-300 text-xs">{JSON.stringify(hoveredData, null, 2)}</p>
          </div>
        )}
      </div>
    </div>
  );
}
