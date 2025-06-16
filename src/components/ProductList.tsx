
import { useState } from 'react';
import { Product } from '@/types/stock';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Search, Plus } from 'lucide-react';

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export function ProductList({ products, onEdit, onDelete, onAdd }: ProductListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = [...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStockStatus = (product: Product) => {
    if (product.quantity === 0) {
      return { label: 'Rupture', variant: 'destructive' as const, className: 'bg-blue-900 text-white border-blue-700' };
    } else if (product.quantity <= product.minQuantity) {
      return { label: 'Stock faible', variant: 'secondary' as const, className: 'bg-blue-800 text-white border-blue-600' };
    } else {
      return { label: 'En stock', variant: 'default' as const, className: 'bg-blue-600 text-white border-blue-500' };
    }
  };

  return (
    <div className="modern-card">
      {/* Barre de recherche et filtres */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 p-6 border-b border-blue-500/20">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-5 w-5" />
          <Input
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 bg-black/50 border-blue-500/30 text-white placeholder-blue-400 focus:border-blue-400 focus:ring-blue-400"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-3 border border-blue-500/30 rounded-lg bg-black/50 text-white focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none"
        >
          <option value="">Toutes les catégories</option>
          {categories.map(category => (
            <option key={category} value={category} className="bg-black text-white">
              {category}
            </option>
          ))}
        </select>
        <Button 
          onClick={onAdd} 
          className="modern-button flex items-center gap-2 hover:scale-105 transition-all duration-300"
        >
          <Plus className="h-5 w-5" />
          Ajouter Produit
        </Button>
      </div>

      {/* Tableau des produits */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-blue-500/20">
              <th className="text-left p-6 font-semibold text-blue-200">Produit</th>
              <th className="text-left p-6 font-semibold text-blue-200">Catégorie</th>
              <th className="text-left p-6 font-semibold text-blue-200">Quantité</th>
              <th className="text-left p-6 font-semibold text-blue-200">Prix</th>
              <th className="text-left p-6 font-semibold text-blue-200">Statut</th>
              <th className="text-left p-6 font-semibold text-blue-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product, index) => {
              const status = getStockStatus(product);
              return (
                <tr 
                  key={product.id} 
                  className="border-b border-blue-500/10 hover:bg-blue-500/5 transition-all duration-300 hover-lift"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <td className="p-6">
                    <div>
                      <div className="font-semibold text-white text-lg">{product.name}</div>
                      {product.description && (
                        <div className="text-sm text-blue-300/80 mt-1">
                          {product.description}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="px-3 py-1 bg-blue-900/50 text-blue-200 rounded-lg text-sm font-medium border border-blue-700/50">
                      {product.category}
                    </span>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col">
                      <span className={`font-bold text-lg ${
                        product.quantity === 0 ? 'text-blue-300' : 
                        product.quantity <= product.minQuantity ? 'text-blue-400' : 
                        'text-white'
                      }`}>
                        {product.quantity}
                      </span>
                      <span className="text-blue-400 text-sm">
                        min: {product.minQuantity}
                      </span>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="font-semibold text-white text-lg">
                      {product.price.toLocaleString('fr-FR')} €
                    </span>
                  </td>
                  <td className="p-6">
                    <Badge className={status.className}>
                      {status.label}
                    </Badge>
                  </td>
                  <td className="p-6">
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(product)}
                        className="h-10 w-10 p-0 border-blue-500/30 hover:bg-blue-500/20 hover:border-blue-400 transition-all duration-300"
                      >
                        <Edit className="h-4 w-4 text-blue-400" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(product.id)}
                        className="h-10 w-10 p-0 border-blue-500/30 hover:bg-blue-800/50 hover:border-blue-600 transition-all duration-300"
                      >
                        <Trash2 className="h-4 w-4 text-blue-400" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Message si aucun produit */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-16">
          <div className="text-blue-300 text-lg mb-4">
            {searchTerm || selectedCategory ? 
              'Aucun produit ne correspond à vos critères de recherche.' :
              'Aucun produit dans le stock.'
            }
          </div>
          {!searchTerm && !selectedCategory && (
            <Button onClick={onAdd} className="modern-button">
              <Plus className="h-5 w-5 mr-2" />
              Ajouter votre premier produit
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
