
import { useState } from 'react';
import { useStock } from '@/hooks/useStock';
import { ProductList } from '@/components/ProductList';
import { ProductForm } from '@/components/ProductForm';
import { Layout } from '@/components/Layout';
import { Product } from '@/types/stock';
import { Button } from '@/components/ui/button';
import { Plus, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Products = () => {
  const { products, stats, addProduct, updateProduct, deleteProduct } = useStock();
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

  return (
    <Layout>
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Gestion des Produits</h1>
              <p className="text-gray-400">{products.length} produits au total</p>
            </div>
          </div>
          
          <Button
            onClick={handleAddProduct}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un produit
          </Button>
        </div>

        {/* Liste des produits */}
        <ProductList
          products={products}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
          onAdd={handleAddProduct}
        />

        {/* Formulaire modal */}
        <ProductForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
          product={editingProduct}
          categories={stats.categories}
        />
      </div>
    </Layout>
  );
};

export default Products;
