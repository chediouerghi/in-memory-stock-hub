
'use client';

import { Product } from '@/types/stock';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface StockChartsProps {
  products: Product[];
}

export function StockCharts({ products }: StockChartsProps) {
  // Données pour le graphique en barres des quantités
  const quantityData = products
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 8)
    .map(product => ({
      name: product.name.length > 15 ? product.name.substring(0, 15) + '...' : product.name,
      quantity: product.quantity,
      minQuantity: product.minQuantity,
    }));

  // Données pour le graphique camembert des catégories
  const categoryData = products.reduce((acc, product) => {
    const existing = acc.find(item => item.name === product.category);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: product.category, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // Données simulées pour l'évolution du stock
  const evolutionData = [
    { month: 'Jan', stock: 45 },
    { month: 'Fév', stock: 52 },
    { month: 'Mar', stock: 48 },
    { month: 'Avr', stock: 61 },
    { month: 'Mai', stock: 55 },
    { month: 'Juin', stock: products.reduce((sum, p) => sum + p.quantity, 0) },
  ];

  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#6366F1', '#EC4899', '#14B8A6'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Graphique en barres - Quantités par produit */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4">Quantités en stock</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={quantityData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="quantity" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Graphique camembert - Répartition par catégorie */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4">Répartition par catégorie</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Graphique linéaire - Évolution du stock */}
      <div className="chart-container lg:col-span-2">
        <h3 className="text-lg font-semibold mb-4">Évolution du stock total (simulée)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={evolutionData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="stock" 
              stroke="#10B981" 
              strokeWidth={3}
              dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, stroke: '#10B981', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
