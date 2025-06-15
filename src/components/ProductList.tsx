
import { useState } from 'react';
import { Product } from '@/types/stock';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
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
      return { label: 'Rupture', variant: 'destructive' as const };
    } else if (product.quantity <= product.minQuantity) {
      return { label: 'Stock faible', variant: 'secondary' as const };
    } else {
      return { label: 'En stock', variant: 'default' as const };
    }
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-input rounded-md bg-background"
        >
          <option value="">Toutes les catégories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <Button onClick={onAdd} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Ajouter
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4 font-medium">Produit</th>
              <th className="text-left p-4 font-medium">Catégorie</th>
              <th className="text-left p-4 font-medium">Quantité</th>
              <th className="text-left p-4 font-medium">Prix</th>
              <th className="text-left p-4 font-medium">Statut</th>
              <th className="text-left p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => {
              const status = getStockStatus(product);
              return (
                <tr key={product.id} className="border-b hover:bg-muted/50 transition-colors">
                  <td className="p-4">
                    <div>
                      <div className="font-medium">{product.name}</div>
                      {product.description && (
                        <div className="text-sm text-muted-foreground">
                          {product.description}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-sm">{product.category}</td>
                  <td className="p-4">
                    <span className={`font-medium ${
                      product.quantity === 0 ? 'text-red-600' : 
                      product.quantity <= product.minQuantity ? 'text-orange-600' : 
                      'text-green-600'
                    }`}>
                      {product.quantity}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      {' '}/ {product.minQuantity} min
                    </span>
                  </td>
                  <td className="p-4 font-medium">
                    {product.price.toLocaleString('fr-FR')} €
                  </td>
                  <td className="p-4">
                    <Badge variant={status.variant}>
                      {status.label}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(product)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(product.id)}
                        className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          {searchTerm || selectedCategory ? 
            'Aucun produit ne correspond à vos critères de recherche.' :
            'Aucun produit dans le stock.'
          }
        </div>
      )}
    </Card>
  );
}
