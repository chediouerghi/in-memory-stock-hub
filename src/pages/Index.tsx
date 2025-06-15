
import { useState } from 'react';
import { useStock } from '@/hooks/useStock';
import { StatsCards } from '@/components/StatsCards';
import { ProductList } from '@/components/ProductList';
import { ProductForm } from '@/components/ProductForm';
import { StockCharts } from '@/components/StockCharts';
import { Product } from '@/types/stock';
import { Button } from '@/components/ui/button';
import { RefreshCw, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <TrendingUp className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">StockHub</h1>
                <p className="text-sm text-muted-foreground">Gestion de stock moderne</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleResetStock}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Réinitialiser
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Statistiques */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Aperçu du stock</h2>
            <StatsCards stats={stats} />
          </section>

          {/* Graphiques */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Analyses</h2>
            <StockCharts products={products} />
          </section>

          {/* Liste des produits */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Produits</h2>
            <ProductList
              products={products}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
              onAdd={handleAddProduct}
            />
          </section>
        </div>
      </main>

      {/* Formulaire modal */}
      <ProductForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        product={editingProduct}
        categories={stats.categories}
      />
    </div>
  );
};

export default Index;
