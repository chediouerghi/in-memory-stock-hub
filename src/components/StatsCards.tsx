
import { StockStats } from '@/types/stock';
import { Package, TrendingUp, AlertTriangle, XCircle } from 'lucide-react';

interface StatsCardsProps {
  stats: StockStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'Total Produits',
      value: stats.totalProducts,
      icon: Package,
      gradient: 'from-blue-500 to-cyan-500',
      shadowColor: 'shadow-blue-500/20',
    },
    {
      title: 'Valeur Totale',
      value: `${stats.totalValue.toLocaleString('fr-FR')} €`,
      icon: TrendingUp,
      gradient: 'from-emerald-500 to-teal-500',
      shadowColor: 'shadow-emerald-500/20',
    },
    {
      title: 'Stock Faible',
      value: stats.lowStockItems,
      icon: AlertTriangle,
      gradient: 'from-orange-500 to-amber-500',
      shadowColor: 'shadow-orange-500/20',
    },
    {
      title: 'Rupture Stock',
      value: stats.outOfStockItems,
      icon: XCircle,
      gradient: 'from-red-500 to-rose-500',
      shadowColor: 'shadow-red-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div 
            key={card.title} 
            className={`group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 shadow-xl ${card.shadowColor} hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-fade-in`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Effet de brillance au survol */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
            
            <div className="relative flex items-center justify-between">
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                  {card.title}
                </p>
                <p className="text-3xl font-bold text-white group-hover:scale-110 transition-transform duration-300">
                  {card.value}
                </p>
              </div>
              <div className={`p-4 rounded-2xl bg-gradient-to-r ${card.gradient} shadow-lg group-hover:rotate-12 transition-transform duration-300`}>
                <Icon className="h-8 w-8 text-white" />
              </div>
            </div>
            
            {/* Indicateur de progression */}
            <div className="mt-4 h-1 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${card.gradient} rounded-full transition-all duration-1000 ease-out`}
                style={{ 
                  width: index === 0 ? '75%' : index === 1 ? '90%' : index === 2 ? '45%' : '20%',
                  animationDelay: `${index * 0.2}s`
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
