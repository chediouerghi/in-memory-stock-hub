import { useState } from 'react';
import { ProductList } from '@/components/ProductList';
import { ProductForm } from '@/components/ProductForm';
import { Product } from '@/types/stock';

// Données de démonstration
const initialProducts: Product[] = [
  {
    id: '1',
    name: 'MacBook Pro 14"',
    category: 'Électronique',
    quantity: 25,
    minQuantity: 5,
    price: 2499,
    description: 'Ordinateur portable haute performance',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'iPhone 15 Pro',
    category: 'Électronique',
    quantity: 3,
    minQuantity: 10,
    price: 1229,
    description: 'Smartphone dernière génération',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '3',
    name: 'Chaise de Bureau',
    category: 'Mobilier',
    quantity: 0,
    minQuantity: 2,
    price: 299,
    description: 'Chaise ergonomique pour bureau',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-25'),
  },
  {
    id: '4',
    name: 'T-shirt Premium',
    category: 'Vêtements',
    quantity: 45,
    minQuantity: 15,
    price: 29,
    description: 'T-shirt en coton bio',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-18'),
  },
];

export default function Products() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();

  const categories = [...new Set(products.map(p => p.category))];

  const handleAddProduct = () => {
    setEditingProduct(undefined);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleSubmitProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> | Product) => {
    if ('id' in productData) {
      // Modification
      setProducts(products.map(p => 
        p.id === productData.id 
          ? { ...productData, updatedAt: new Date() }
          : p
      ));
    } else {
      // Ajout
      const newProduct: Product = {
        ...productData,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setProducts([...products, newProduct]);
    }
    setIsFormOpen(false);
  };

  return (
    <div className="min-h-screen dark-gradient p-8">
      <div className="max-w-7xl mx-auto">
        {/* En-tête moderne */}
        <div className="mb-12 text-center">
          <h1 className="modern-heading mb-4">Gestion des Produits</h1>
          <p className="modern-subheading">
            Gérez votre inventaire avec style et efficacité
          </p>
          
          {/* Effet de lueur décoratif */}
          <div className="relative mt-8">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="stats-card text-center">
            <div className="text-3xl font-bold text-white mb-2">{products.length}</div>
            <div className="text-blue-300">Total Produits</div>
          </div>
          <div className="stats-card text-center">
            <div className="text-3xl font-bold text-white mb-2">
              {products.filter(p => p.quantity <= p.minQuantity).length}
            </div>
            <div className="text-blue-300">Stock Faible</div>
          </div>
          <div className="stats-card text-center">
            <div className="text-3xl font-bold text-white mb-2">
              {products.filter(p => p.quantity === 0).length}
            </div>
            <div className="text-blue-300">Rupture</div>
          </div>
          <div className="stats-card text-center">
            <div className="text-3xl font-bold text-white mb-2">{categories.length}</div>
            <div className="text-blue-300">Catégories</div>
          </div>
        </div>

        {/* Liste des produits */}
        <ProductList
          products={products}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
          onAdd={handleAddProduct}
        />

        {/* Formulaire d'ajout/modification */}
        <ProductForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleSubmitProduct}
          product={editingProduct}
          categories={categories}
        />
      </div>
    </div>
  );
}
