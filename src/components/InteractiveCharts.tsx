
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

  // Données pour graphique en secteurs - Couleurs bleu uniquement
  const categoryData = products.reduce((acc, product) => {
    const existing = acc.find(item => item.name === product.category);
    if (existing) {
      existing.value += product.quantity;
      existing.totalValue += product.quantity * product.price;
    } else {
      acc.push({
        name: product.category,
        value: product.quantity,
        totalValue: product.quantity * product.price
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

  // Palette de couleurs bleu uniquement
  const BLUE_COLORS = ['#1E40AF', '#3B82F6', '#60A5FA', '#93C5FD', '#DBEAFE', '#EFF6FF'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/95 border border-blue-500/30 rounded-xl p-4 shadow-2xl backdrop-blur-sm">
          <p className="text-white font-semibold text-sm mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-blue-200 text-sm">
              <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></span>
              {entry.dataKey}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const chartButtons = [
    { id: 'bar', label: 'Barres', icon: '📊' },
    { id: 'pie', label: 'Secteurs', icon: '🔵' },
    { id: 'line', label: 'Ligne', icon: '📈' },
    { id: 'area', label: 'Zone', icon: '📉' }
  ];

  return (
    <div className="bg-black/90 border border-blue-500/20 rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
      {/* En-tête */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">Visualisations Dynamiques</h3>
        <p className="text-blue-200/70">Explorez vos données interactivement</p>
      </div>

      {/* Sélecteur de graphiques */}
      <div className="flex flex-wrap gap-4 mb-8">
        {chartButtons.map((button) => (
          <button
            key={button.id}
            onClick={() => setActiveChart(button.id)}
            className={`group relative flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 font-medium border ${
              activeChart === button.id
                ? 'bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-500/25 scale-105'
                : 'bg-white/5 text-blue-200 border-blue-500/20 hover:bg-blue-500/10 hover:border-blue-400/40 hover:text-white'
            }`}
          >
            <span className="text-lg filter drop-shadow-lg">{button.icon}</span>
            <span className="font-semibold">{button.label}</span>
            {activeChart === button.id && (
              <div className="absolute inset-0 bg-blue-400/20 rounded-xl blur-xl -z-10"></div>
            )}
          </button>
        ))}
      </div>

      {/* Conteneur du graphique */}
      <div className="relative bg-black/50 rounded-xl p-6 border border-blue-500/10">
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            {activeChart === 'bar' && (
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#1E40AF" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E40AF" opacity={0.3} />
                <XAxis 
                  dataKey="name" 
                  stroke="#93C5FD" 
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tick={{ fill: '#93C5FD' }}
                />
                <YAxis stroke="#93C5FD" fontSize={12} tick={{ fill: '#93C5FD' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="quantity" 
                  fill="url(#barGradient)"
                  radius={[6, 6, 0, 0]}
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
                  innerRadius={80}
                  outerRadius={140}
                  paddingAngle={2}
                  dataKey="value"
                  onMouseEnter={(data) => setHoveredData(data)}
                  onMouseLeave={() => setHoveredData(null)}
                >
                  {categoryData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={BLUE_COLORS[index % BLUE_COLORS.length]}
                      stroke="#000000"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ color: '#93C5FD', fontSize: '14px' }}
                  formatter={(value) => <span style={{ color: '#E5E7EB' }}>{value}</span>}
                />
              </PieChart>
            )}

            {activeChart === 'line' && (
              <LineChart data={timeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E40AF" opacity={0.3} />
                <XAxis dataKey="month" stroke="#93C5FD" fontSize={12} tick={{ fill: '#93C5FD' }} />
                <YAxis stroke="#93C5FD" fontSize={12} tick={{ fill: '#93C5FD' }} />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="stock" 
                  stroke="#3B82F6"
                  strokeWidth={4}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 8 }}
                  activeDot={{ r: 10, stroke: '#60A5FA', strokeWidth: 3, fill: '#1E40AF' }}
                />
              </LineChart>
            )}

            {activeChart === 'area' && (
              <AreaChart data={timeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#1E40AF" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E40AF" opacity={0.3} />
                <XAxis dataKey="month" stroke="#93C5FD" fontSize={12} tick={{ fill: '#93C5FD' }} />
                <YAxis stroke="#93C5FD" fontSize={12} tick={{ fill: '#93C5FD' }} />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3B82F6"
                  strokeWidth={3}
                  fill="url(#areaGradient)"
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Informations sur survol */}
        {hoveredData && (
          <div className="absolute top-6 right-6 bg-black/95 border border-blue-500/50 rounded-xl p-4 shadow-2xl max-w-xs">
            <p className="text-white text-sm font-semibold mb-2">Détails</p>
            <div className="text-blue-200 text-xs space-y-1">
              {Object.entries(hoveredData).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="capitalize">{key}:</span>
                  <span className="font-medium">{typeof value === 'number' ? value.toLocaleString() : String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
