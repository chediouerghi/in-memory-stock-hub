
export interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  minQuantity: number;
  price: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StockStats {
  totalProducts: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  categories: string[];
}

export type StockAction = 
  | { type: 'ADD_PRODUCT'; payload: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'RESET_STOCK' };
