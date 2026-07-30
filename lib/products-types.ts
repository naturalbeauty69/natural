export const PRODUCT_CATEGORIES = [
  "Casmara", "Lotus Professional", "Paese", "The Purest", "Farmona", "Homecare product", "Others",
] as const;

export type ProductCategory = typeof PRODUCT_CATEGORIES[number];

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  price: number;
  discount_price: number | null;
  stock_quantity: number;
  suitable_for: string | null;
  ingredients: string | null;
  description: string | null;
  image_url: string | null;
  gallery_urls: string[];
  is_active: boolean;
  is_featured: boolean;
  display_order: number;
}

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export function getStockStatus(qty: number): StockStatus {
  if (qty <= 0) return "out_of_stock";
  if (qty <= 10) return "low_stock";
  return "in_stock";
}

export const ORDER_STATUSES = ["pending", "confirmed", "packed", "shipped", "delivered", "cancelled"] as const;
export type OrderStatus = typeof ORDER_STATUSES[number];

export interface OrderItem {
  product_id: string | null;
  product_name: string;
  unit_price: number;
  quantity: number;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  phone: string;
  email: string | null;
  address: string;
  city: string;
  notes: string | null;
  total_price: number;
  status: OrderStatus;
  created_at: string;
  items?: OrderItem[];
}

// Cart line item (client-side only, localStorage-persisted)
export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number; // effective price (discount price if set, else regular)
  image: string | null;
  quantity: number;
  maxQuantity: number; // clamp to stock
}
