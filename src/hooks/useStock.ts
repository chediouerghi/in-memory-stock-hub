
import { useReducer, useMemo } from 'react';
import { Product, StockAction, StockStats } from '@/types/stock';

const initialProducts: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    category: 'Électronique',
    quantity: 25,
    minQuantity: 10,
    price: 1199,
    description: 'Smartphone Apple dernière génération',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'MacBook Pro 14"',
    category: 'Informatique',
    quantity: 8,
    minQuantity: 5,
    price: 2499,
    description: 'Ordinateur portable professionnel',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: '3',
    name: 'AirPods Pro',
    category: 'Audio',
    quantity: 3,
    minQuantity: 15,
    price: 279,
    description: 'Écouteurs sans fil avec réduction de bruit',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08'),
  },
  {
    id: '4',
    name: 'iPad Air',
    category: 'Tablettes',
    quantity: 0,
    minQuantity: 8,
    price: 699,
    description: 'Tablette tactile performante',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
  },
  {
    id: '5',
    name: 'Apple Watch Series 9',
    category: 'Montres connectées',
    quantity: 15,
    minQuantity: 10,
    price: 449,
    description: 'Montre connectée avec ECG',
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
  },
];

function stockReducer(state: Product[], action: StockAction): Product[] {
  switch (action.type) {
    case 'ADD_PRODUCT':
      const newProduct: Product = {
        ...action.payload,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return [...state, newProduct];

    case 'UPDATE_PRODUCT':
      return state.map(product => 
        product.id === action.payload.id 
          ? { ...action.payload, updatedAt: new Date() }
          : product
      );

    case 'DELETE_PRODUCT':
      return state.filter(product => product.id !== action.payload);

    case 'RESET_STOCK':
      return initialProducts;

    default:
      return state;
  }
}

export function useStock() {
  const [products, dispatch] = useReducer(stockReducer, initialProducts);

  const stats: StockStats = useMemo(() => {
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, product) => sum + (product.quantity * product.price), 0);
    const lowStockItems = products.filter(product => product.quantity > 0 && product.quantity <= product.minQuantity).length;
    const outOfStockItems = products.filter(product => product.quantity === 0).length;
    const categories = [...new Set(products.map(product => product.category))];

    return {
      totalProducts,
      totalValue,
      lowStockItems,
      outOfStockItems,
      categories,
    };
  }, [products]);

  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    dispatch({ type: 'ADD_PRODUCT', payload: productData });
  };

  const updateProduct = (product: Product) => {
    dispatch({ type: 'UPDATE_PRODUCT', payload: product });
  };

  const deleteProduct = (id: string) => {
    dispatch({ type: 'DELETE_PRODUCT', payload: id });
  };

  const resetStock = () => {
    dispatch({ type: 'RESET_STOCK' });
  };

  return {
    products,
    stats,
    addProduct,
    updateProduct,
    deleteProduct,
    resetStock,
  };
}
