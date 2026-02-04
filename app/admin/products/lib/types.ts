export type UnitType = 'Litre' | 'Kg' | 'Unit' | 'Pack' | 'Box' | 'Roll' | 'Hour' | 'SqFt';

export interface Category {
  id: string
  name: string
  description: string
  color: string
  itemCount: number
  createdAt?: string
  updatedAt?: string
}

export interface InventoryLog {
  id: string;
  timestamp: string;
  type: 'IN' | 'OUT' | 'ADJUST';
  quantity: number;
  reason: string;
  user: string;
}

export interface ProductItem {
  id: string
  name: string
  sku: string
  description: string
  type: 'PRODUCT' | 'SERVICE'
  price: number
  cost: number
  unit: UnitType
  stock: number
  minStock: number
  categoryId: string
  categoryName: string
  status: 'ACTIVE' | 'ARCHIVED' | 'OUT_OF_STOCK'
  imageUrl?: string
  createdAt?: string
  updatedAt?: string
  lastUpdated: string
  history?: InventoryLog[]
}