import { useStock } from '@/hooks/useStock';
import { Layout } from '@/components/Layout';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';

const Trends = () => {
  const { products, stats } = useStock();

  // Analyse des tendances
  const lowStockProducts = products.filter(p => p.quantity > 0 && p.quantity <= p.minQuantity);
  const outOfStockProducts = products.filter(p => p.quantity === 0);
  const healthyStockProducts = products.filter(p => p.quantity > p.minQuantity);
  const topValueProducts = products.sort((a, b) => (b.quantity * b.price) - (a.quantity * a.price)).slice(0, 5);

  const trends = [
    {
      title: "Stock Critique",
      count: lowStockProducts.length,
      icon: AlertTriangle,
      color: "text-orange-400",
      bgColor: "bg-orange-500/20",
      products: lowStockProducts
    },
    {
      title: "Rupture de Stock",
      count: outOfStockProducts.length,
      icon: TrendingDown,
      color: "text-red-400",
      bgColor: "bg-red-500/20",
      products: outOfStockProducts
    },
    {
      title: "Stock Sain",
      count: healthyStockProducts.length,
      icon: CheckCircle,
      color: "text-green-400",
      bgColor: "bg-green-500/20",
      products: healthyStockProducts
    }
  ];

  return (
    <Layout>
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Tendances & Alertes</h1>
            <p className="text-gray-400">Surveillance en temps réel de votre inventaire</p>
          </div>
        </div>

        {/* Cartes de tendances */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trends.map((trend) => {
            const Icon = trend.icon;
            return (
              <div key={trend.title} className={`${trend.bgColor} rounded-2xl border border-gray-700/50 p-6`}>
                <div className="flex items-center gap-3 mb-4">
                  <Icon className={`h-8 w-8 ${trend.color}`} />
                  <div>
                    <h3 className="text-lg font-semibold text-white">{trend.title}</h3>
                    <p className={`text-2xl font-bold ${trend.color}`}>{trend.count}</p>
                  </div>
                </div>
                
                {trend.products.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-300">Produits concernés :</h4>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {trend.products.slice(0, 3).map((product) => (
                        <div key={product.id} className="text-xs text-gray-400 bg-gray-800/50 rounded p-2">
                          <span className="font-medium text-white">{product.name}</span>
                          <br />
                          <span>Stock: {product.quantity} / Min: {product.minQuantity}</span>
                        </div>
                      ))}
                      {trend.products.length > 3 && (
                        <p className="text-xs text-gray-500">+{trend.products.length - 3} autres...</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Top produits par valeur */}
        <div className="chart-container">
          <h2 className="text-xl font-semibold text-white mb-4">Top 5 - Produits par Valeur</h2>
          <div className="space-y-3">
            {topValueProducts.map((product, index) => {
              const value = product.quantity * product.price;
              const maxValue = topValueProducts[0] ? topValueProducts[0].quantity * topValueProducts[0].price : 1;
              const percentage = (value / maxValue) * 100;
              
              return (
                <div key={product.id} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-blue-400">#{index + 1}</span>
                      <div>
                        <h3 className="font-medium text-white">{product.name}</h3>
                        <p className="text-sm text-gray-400">{product.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-400">{value.toLocaleString('fr-FR')} €</p>
                      <p className="text-sm text-gray-400">{product.quantity} × {product.price}€</p>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Trends;
