import { Location, Product, InventoryItem, Order, User } from '@/types';

function hoursAgo(h: number): Date {
  return new Date(Date.now() - h * 3600000);
}
function minsAgo(m: number): Date {
  return new Date(Date.now() - m * 60000);
}

export const LOCATIONS: Location[] = [
  { id: 'loc-1', name: 'Mumbai Warehouse', type: 'warehouse', city: 'Mumbai' },
  { id: 'loc-2', name: 'Delhi Store', type: 'store', city: 'Delhi' },
  { id: 'loc-3', name: 'Online Store', type: 'online', city: 'Pan India' },
];

export const PRODUCTS: Product[] = [
  { id: 'p-1', name: 'White Air Force 1', sku: 'NK-AF1-WHT', category: 'Footwear' },
  { id: 'p-2', name: 'Black Puma Hoodie', sku: 'PM-HD-BLK', category: 'Apparel' },
  { id: 'p-3', name: 'Blue Denim Jacket', sku: 'LV-DJ-BLU', category: 'Apparel' },
  { id: 'p-4', name: 'Red Running Shorts', sku: 'AD-RS-RED', category: 'Apparel' },
  { id: 'p-5', name: 'Grey Joggers', sku: 'NK-JG-GRY', category: 'Bottomwear' },
  { id: 'p-6', name: 'Black Leather Belt', sku: 'GU-BL-BLK', category: 'Accessories' },
  { id: 'p-7', name: 'White Polo Shirt', sku: 'RL-PS-WHT', category: 'Apparel' },
  { id: 'p-8', name: 'Navy Chinos', sku: 'ZR-CH-NVY', category: 'Bottomwear' },
];

export const INVENTORY: InventoryItem[] = [
  { productId: 'p-1', locationId: 'loc-1', quantity: 142, threshold: 20, lastUpdated: hoursAgo(2) },
  { productId: 'p-1', locationId: 'loc-2', quantity: 12, threshold: 20, lastUpdated: hoursAgo(1) },
  { productId: 'p-1', locationId: 'loc-3', quantity: 89, threshold: 20, lastUpdated: hoursAgo(3) },
  { productId: 'p-2', locationId: 'loc-1', quantity: 67, threshold: 15, lastUpdated: hoursAgo(4) },
  { productId: 'p-2', locationId: 'loc-2', quantity: 34, threshold: 15, lastUpdated: hoursAgo(5) },
  { productId: 'p-2', locationId: 'loc-3', quantity: 8, threshold: 15, lastUpdated: hoursAgo(1) },
  { productId: 'p-3', locationId: 'loc-1', quantity: 23, threshold: 10, lastUpdated: hoursAgo(6) },
  { productId: 'p-3', locationId: 'loc-2', quantity: 5, threshold: 10, lastUpdated: hoursAgo(2) },
  { productId: 'p-3', locationId: 'loc-3', quantity: 78, threshold: 10, lastUpdated: hoursAgo(7) },
  { productId: 'p-4', locationId: 'loc-1', quantity: 190, threshold: 25, lastUpdated: hoursAgo(3) },
  { productId: 'p-4', locationId: 'loc-2', quantity: 45, threshold: 25, lastUpdated: hoursAgo(8) },
  { productId: 'p-4', locationId: 'loc-3', quantity: 22, threshold: 25, lastUpdated: hoursAgo(4) },
  { productId: 'p-5', locationId: 'loc-1', quantity: 3, threshold: 20, lastUpdated: hoursAgo(1) },
  { productId: 'p-5', locationId: 'loc-2', quantity: 61, threshold: 20, lastUpdated: hoursAgo(9) },
  { productId: 'p-5', locationId: 'loc-3', quantity: 18, threshold: 20, lastUpdated: hoursAgo(2) },
  { productId: 'p-6', locationId: 'loc-1', quantity: 88, threshold: 10, lastUpdated: hoursAgo(5) },
  { productId: 'p-6', locationId: 'loc-2', quantity: 7, threshold: 10, lastUpdated: hoursAgo(3) },
  { productId: 'p-6', locationId: 'loc-3', quantity: 55, threshold: 10, lastUpdated: hoursAgo(10) },
  { productId: 'p-7', locationId: 'loc-1', quantity: 110, threshold: 20, lastUpdated: hoursAgo(4) },
  { productId: 'p-7', locationId: 'loc-2', quantity: 29, threshold: 20, lastUpdated: hoursAgo(6) },
  { productId: 'p-7', locationId: 'loc-3', quantity: 44, threshold: 20, lastUpdated: hoursAgo(11) },
  { productId: 'p-8', locationId: 'loc-1', quantity: 16, threshold: 20, lastUpdated: hoursAgo(2) },
  { productId: 'p-8', locationId: 'loc-2', quantity: 72, threshold: 20, lastUpdated: hoursAgo(7) },
  { productId: 'p-8', locationId: 'loc-3', quantity: 33, threshold: 20, lastUpdated: hoursAgo(3) },
];

export const ORDERS: Order[] = [
  { id: 'ord-001', productId: 'p-1', locationId: 'loc-2', type: 'sale', quantity: 3, source: 'manual', note: 'Walk-in customer', timestamp: minsAgo(5) },
  { id: 'ord-002', productId: 'p-5', locationId: 'loc-1', type: 'restock', quantity: 50, source: 'ai', note: 'AI auto-restock triggered', timestamp: minsAgo(12) },
  { id: 'ord-003', productId: 'p-3', locationId: 'loc-2', type: 'sale', quantity: 2, source: 'manual', note: 'Online order fulfillment', timestamp: minsAgo(25) },
  { id: 'ord-004', productId: 'p-2', locationId: 'loc-3', type: 'restock', quantity: 30, source: 'manual', note: 'Weekly restock', timestamp: minsAgo(45) },
  { id: 'ord-005', productId: 'p-6', locationId: 'loc-2', type: 'transfer', quantity: 15, source: 'ai', note: 'Transfer from Mumbai warehouse', timestamp: hoursAgo(1) },
  { id: 'ord-006', productId: 'p-4', locationId: 'loc-1', type: 'sale', quantity: 8, source: 'manual', note: 'Bulk order', timestamp: hoursAgo(2) },
  { id: 'ord-007', productId: 'p-7', locationId: 'loc-3', type: 'sale', quantity: 5, source: 'manual', note: 'Website checkout', timestamp: hoursAgo(3) },
  { id: 'ord-008', productId: 'p-1', locationId: 'loc-1', type: 'restock', quantity: 100, source: 'manual', note: 'New shipment arrived', timestamp: hoursAgo(4) },
  { id: 'ord-009', productId: 'p-8', locationId: 'loc-1', type: 'transfer', quantity: 20, source: 'ai', note: 'Redistributing to Delhi', timestamp: hoursAgo(5) },
  { id: 'ord-010', productId: 'p-3', locationId: 'loc-3', type: 'sale', quantity: 1, source: 'manual', note: 'Express delivery', timestamp: hoursAgo(6) },
  { id: 'ord-011', productId: 'p-5', locationId: 'loc-2', type: 'sale', quantity: 4, source: 'manual', note: 'Store purchase', timestamp: hoursAgo(8) },
  { id: 'ord-012', productId: 'p-2', locationId: 'loc-1', type: 'restock', quantity: 25, source: 'ai', note: 'Predicted demand spike', timestamp: hoursAgo(10) },
  { id: 'ord-013', productId: 'p-4', locationId: 'loc-3', type: 'transfer', quantity: 10, source: 'manual', note: 'Moving to online store', timestamp: hoursAgo(14) },
  { id: 'ord-014', productId: 'p-6', locationId: 'loc-1', type: 'sale', quantity: 6, source: 'manual', note: 'Corporate gifting order', timestamp: hoursAgo(18) },
  { id: 'ord-015', productId: 'p-7', locationId: 'loc-2', type: 'restock', quantity: 40, source: 'ai', note: 'Auto-restock: below threshold', timestamp: hoursAgo(22) },
];

export const CURRENT_USER: User = {
  id: 'u-1',
  name: 'Arjun Mehta',
  email: 'arjun@storesync.in',
  role: 'Store Manager',
};
