import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Product } from '@/types/stock';

interface InteractiveChartsProps {
  products?: Product[];
}

const salesData = [
  { month: 'Jan', ventes: 4500, stock: 85 },
  { month: 'Fév', ventes: 5200, stock: 78 },
  { month: 'Mar', ventes: 4800, stock: 92 },
  { month: 'Avr', ventes: 6100, stock: 67 },
  { month: 'Mai', ventes: 5800, stock: 88 },
  { month: 'Jun', ventes: 7200, stock: 73 },
];

const categoryData = [
  { name: 'Électronique', value: 35, color: '#3B82F6' },
  { name: 'Vêtements', value: 25, color: '#60A5FA' },
  { name: 'Alimentaire', value: 20, color: '#93C5FD' },
  { name: 'Mobilier', value: 20, color: '#DBEAFE' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/95 border border-blue-500/30 rounded-xl p-4 shadow-2xl backdrop-blur-xl">
        <p className="text-white font-semibold mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-blue-300" style={{ color: entry.color }}>
            {entry.dataKey}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function InteractiveCharts({ products }: InteractiveChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Graphique des ventes */}
      <div className="modern-card">
        <h3 className="text-2xl font-bold text-white mb-8 text-glow">Évolution des Ventes</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(59, 130, 246, 0.1)" />
              <XAxis 
                dataKey="month" 
                stroke="#93C5FD"
                tick={{ fill: '#93C5FD', fontSize: 12 }}
              />
              <YAxis 
                stroke="#93C5FD"
                tick={{ fill: '#93C5FD', fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="ventes" 
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, fill: '#60A5FA', stroke: '#ffffff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Graphique des stocks */}
      <div className="modern-card">
        <h3 className="text-2xl font-bold text-white mb-8 text-glow">Niveaux de Stock</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(59, 130, 246, 0.1)" />
              <XAxis 
                dataKey="month" 
                stroke="#93C5FD"
                tick={{ fill: '#93C5FD', fontSize: 12 }}
              />
              <YAxis 
                stroke="#93C5FD"
                tick={{ fill: '#93C5FD', fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="stock" 
                fill="url(#stockGradient)"
                radius={[4, 4, 0, 0]}
              />
              <defs>
                <linearGradient id="stockGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#1E40AF" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Répartition par catégories */}
      <div className="modern-card lg:col-span-2">
        <h3 className="text-2xl font-bold text-white mb-8 text-glow">Répartition par Catégories</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={2}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap justify-center gap-6 mt-6">
          {categoryData.map((entry, index) => (
            <div key={index} className="flex items-center gap-3">
              <div 
                className="w-4 h-4 rounded-full border border-blue-500/30" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-blue-200 font-medium">{entry.name}: {entry.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
