
import { useState, useEffect } from 'react';
import { Product } from '@/types/stock';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> | Product) => void;
  product?: Product;
  categories: string[];
}

export function ProductForm({ isOpen, onClose, onSubmit, product, categories }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: 0,
    minQuantity: 0,
    price: 0,
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        category: product.category,
        quantity: product.quantity,
        minQuantity: product.minQuantity,
        price: product.price,
        description: product.description || '',
      });
    } else {
      setFormData({
        name: '',
        category: '',
        quantity: 0,
        minQuantity: 0,
        price: 0,
        description: '',
      });
    }
    setErrors({});
  }, [product, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est obligatoire';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'La catégorie est obligatoire';
    }

    if (formData.quantity < 0) {
      newErrors.quantity = 'La quantité ne peut pas être négative';
    }

    if (formData.minQuantity < 0) {
      newErrors.minQuantity = 'La quantité minimale ne peut pas être négative';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Le prix doit être supérieur à 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (product) {
      onSubmit({
        ...product,
        ...formData,
      });
    } else {
      onSubmit(formData);
    }
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-black/95 border border-blue-500/30 backdrop-blur-xl">
        <DialogHeader className="border-b border-blue-500/20 pb-4">
          <DialogTitle className="text-2xl font-bold text-white text-glow">
            {product ? 'Modifier le produit' : 'Ajouter un produit'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div>
            <Label htmlFor="name" className="text-blue-200 font-semibold">Nom du produit</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`mt-2 bg-black/50 border-blue-500/30 text-white placeholder-blue-400 focus:border-blue-400 focus:ring-blue-400 ${
                errors.name ? 'border-blue-300' : ''
              }`}
              placeholder="Entrez le nom du produit"
            />
            {errors.name && <p className="text-sm text-blue-300 mt-1">{errors.name}</p>}
          </div>

          <div>
            <Label htmlFor="category" className="text-blue-200 font-semibold">Catégorie</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              list="categories"
              className={`mt-2 bg-black/50 border-blue-500/30 text-white placeholder-blue-400 focus:border-blue-400 focus:ring-blue-400 ${
                errors.category ? 'border-blue-300' : ''
              }`}
              placeholder="Sélectionnez ou créez une catégorie"
            />
            <datalist id="categories">
              {categories.map((cat) => (
                <option key={cat} value={cat} />
              ))}
            </datalist>
            {errors.category && <p className="text-sm text-blue-300 mt-1">{errors.category}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantity" className="text-blue-200 font-semibold">Quantité</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                className={`mt-2 bg-black/50 border-blue-500/30 text-white placeholder-blue-400 focus:border-blue-400 focus:ring-blue-400 ${
                  errors.quantity ? 'border-blue-300' : ''
                }`}
              />
              {errors.quantity && <p className="text-sm text-blue-300 mt-1">{errors.quantity}</p>}
            </div>

            <div>
              <Label htmlFor="minQuantity" className="text-blue-200 font-semibold">Quantité minimale</Label>
              <Input
                id="minQuantity"
                type="number"
                min="0"
                value={formData.minQuantity}
                onChange={(e) => setFormData({ ...formData, minQuantity: Number(e.target.value) })}
                className={`mt-2 bg-black/50 border-blue-500/30 text-white placeholder-blue-400 focus:border-blue-400 focus:ring-blue-400 ${
                  errors.minQuantity ? 'border-blue-300' : ''
                }`}
              />
              {errors.minQuantity && <p className="text-sm text-blue-300 mt-1">{errors.minQuantity}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="price" className="text-blue-200 font-semibold">Prix (€)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              className={`mt-2 bg-black/50 border-blue-500/30 text-white placeholder-blue-400 focus:border-blue-400 focus:ring-blue-400 ${
                errors.price ? 'border-blue-300' : ''
              }`}
              placeholder="0.00"
            />
            {errors.price && <p className="text-sm text-blue-300 mt-1">{errors.price}</p>}
          </div>

          <div>
            <Label htmlFor="description" className="text-blue-200 font-semibold">Description (optionnel)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="mt-2 bg-black/50 border-blue-500/30 text-white placeholder-blue-400 focus:border-blue-400 focus:ring-blue-400 resize-none"
              placeholder="Description du produit..."
            />
          </div>

          <div className="flex gap-4 pt-6 border-t border-blue-500/20">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              className="flex-1 border-blue-500/30 text-blue-200 hover:bg-blue-500/10 hover:border-blue-400"
            >
              Annuler
            </Button>
            <Button type="submit" className="flex-1 modern-button">
              {product ? 'Modifier' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
