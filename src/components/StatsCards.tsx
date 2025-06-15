
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
      gradient: 'from-blue-600 to-blue-800',
      shadowColor: 'shadow-blue-500/25',
      bgGlow: 'bg-blue-500/10',
    },
    {
      title: 'Valeur Totale',
      value: `${stats.totalValue.toLocaleString('fr-FR')} €`,
      icon: TrendingUp,
      gradient: 'from-blue-500 to-blue-700',
      shadowColor: 'shadow-blue-400/25',
      bgGlow: 'bg-blue-400/10',
    },
    {
      title: 'Stock Faible',
      value: stats.lowStockItems,
      icon: AlertTriangle,
      gradient: 'from-blue-400 to-blue-600',
      shadowColor: 'shadow-blue-300/25',
      bgGlow: 'bg-blue-300/10',
    },
    {
      title: 'Rupture Stock',
      value: stats.outOfStockItems,
      icon: XCircle,
      gradient: 'from-blue-700 to-blue-900',
      shadowColor: 'shadow-blue-600/25',
      bgGlow: 'bg-blue-600/10',
    },
  ];

  return (
    <div className="modern-grid mb-12">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div 
            key={card.title} 
            className={`group relative modern-card hover-lift transition-all duration-500 ${card.shadowColor}`}
            style={{ animationDelay: `${index * 0.15}s` }}
          >
            {/* Effet de brillance au survol */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
            
            {/* Lueur de fond */}
            <div className={`absolute inset-0 ${card.bgGlow} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            
            <div className="relative p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-blue-200/80 uppercase tracking-wider">
                    {card.title}
                  </p>
                  <p className="text-4xl font-bold text-white group-hover:scale-110 transition-transform duration-300">
                    {card.value}
                  </p>
                </div>
                
                <div className={`relative p-4 rounded-2xl bg-gradient-to-br ${card.gradient} shadow-xl group-hover:rotate-12 group-hover:scale-110 transition-all duration-300`}>
                  <Icon className="h-8 w-8 text-white" />
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity duration-300`} />
                </div>
              </div>
              
              {/* Barre de progression moderne */}
              <div className="relative">
                <div className="h-2 bg-black/50 rounded-full overflow-hidden border border-blue-500/20">
                  <div 
                    className={`h-full bg-gradient-to-r ${card.gradient} rounded-full transition-all duration-1000 ease-out relative`}
                    style={{ 
                      width: index === 0 ? '85%' : index === 1 ? '95%' : index === 2 ? '60%' : '30%',
                      animationDelay: `${index * 0.3}s`
                    }}
                  >
                    {/* Effet de brillance sur la barre */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-slide-glow"></div>
                  </div>
                </div>
                
                {/* Pourcentage */}
                <div className="flex justify-end mt-2">
                  <span className="text-xs text-blue-300/70 font-medium">
                    {index === 0 ? '85%' : index === 1 ? '95%' : index === 2 ? '60%' : '30%'}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Bordure animée */}
            <div className="absolute inset-0 rounded-2xl border-animate opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
        );
      })}
    </div>
  );
}
