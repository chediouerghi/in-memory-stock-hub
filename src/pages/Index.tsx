
import { useState } from 'react';
import { useStock } from '@/hooks/useStock';
import { StatsCards } from '@/components/StatsCards';
import { ProductList } from '@/components/ProductList';
import { ProductForm } from '@/components/ProductForm';
import { InteractiveCharts } from '@/components/InteractiveCharts';
import { AppSidebar } from '@/components/AppSidebar';
import { Product } from '@/types/stock';
import { Button } from '@/components/ui/button';
import { RefreshCw, TrendingUp, Menu } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  SidebarProvider, 
  SidebarTrigger, 
  SidebarInset 
} from '@/components/ui/sidebar';

const Index = () => {
  const { products, stats, addProduct, updateProduct, deleteProduct, resetStock } = useStock();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const { toast } = useToast();

  const handleAddProduct = () => {
    setEditingProduct(undefined);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDeleteProduct = (id: string) => {
    const product = products.find(p => p.id === id);
    if (product && window.confirm(`Êtes-vous sûr de vouloir supprimer "${product.name}" ?`)) {
      deleteProduct(id);
      toast({
        title: "Produit supprimé",
        description: `"${product.name}" a été supprimé du stock.`,
      });
    }
  };

  const handleFormSubmit = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> | Product) => {
    if (editingProduct) {
      updateProduct(productData as Product);
      toast({
        title: "Produit modifié",
        description: `"${productData.name}" a été mis à jour.`,
      });
    } else {
      addProduct(productData as Omit<Product, 'id' | 'createdAt' | 'updatedAt'>);
      toast({
        title: "Produit ajouté",
        description: `"${productData.name}" a été ajouté au stock.`,
      });
    }
  };

  const handleResetStock = () => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser tout le stock ?')) {
      resetStock();
      toast({
        title: "Stock réinitialisé",
        description: "Le stock a été remis à l'état initial.",
      });
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex">
        <AppSidebar />
        
        <SidebarInset className="flex-1">
          {/* Header */}
          <header className="sticky top-0 z-10 border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm">
            <div className="flex h-16 items-center gap-4 px-6">
              <SidebarTrigger className="text-gray-300 hover:text-white" />
              
              <div className="flex items-center gap-3 flex-1">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Dashboard Analytics</h1>
                  <p className="text-sm text-gray-400">Gestion de stock intelligente</p>
                </div>
              </div>
              
              <Button
                variant="outline"
                onClick={handleResetStock}
                className="border-gray-700 bg-gray-800/50 text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Réinitialiser
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 space-y-8">
            {/* Statistiques */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
                <h2 className="text-2xl font-bold text-white">Aperçu du stock</h2>
              </div>
              <StatsCards stats={stats} />
            </section>

            {/* Graphiques interactifs */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-gradient-to-b from-emerald-500 to-cyan-500 rounded-full" />
                <h2 className="text-2xl font-bold text-white">Analyses Avancées</h2>
              </div>
              <InteractiveCharts products={products} />
            </section>

            {/* Liste des produits */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-red-500 rounded-full" />
                <h2 className="text-2xl font-bold text-white">Inventaire</h2>
              </div>
              <ProductList
                products={products}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
                onAdd={handleAddProduct}
              />
            </section>
          </main>
        </SidebarInset>
      </div>

      {/* Formulaire modal */}
      <ProductForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        product={editingProduct}
        categories={stats.categories}
      />
    </SidebarProvider>
  );
};

export default Index;
