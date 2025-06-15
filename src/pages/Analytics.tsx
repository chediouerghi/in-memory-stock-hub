
import { useStock } from '@/hooks/useStock';
import { InteractiveCharts } from '@/components/InteractiveCharts';
import { StatsCards } from '@/components/StatsCards';
import { Layout } from '@/components/Layout';
import { BarChart3 } from 'lucide-react';

const Analytics = () => {
  const { products, stats } = useStock();

  return (
    <Layout>
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-lg">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Analytics Avancées</h1>
            <p className="text-gray-400">Analyse détaillée de votre stock</p>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Aperçu Général</h2>
          <StatsCards stats={stats} />
        </div>

        {/* Graphiques interactifs */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Visualisations Dynamiques</h2>
          <InteractiveCharts products={products} />
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;
