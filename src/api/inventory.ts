import type {
  ItemsResponse,
  CompositeItemsResponse,
  TransferOrdersResponse,
  ItemsWithStockResponse,
} from '../types/inventory';

const BASE_URL = 'https://campaigns.createyourmeta-iv.com/inventory/store-count';

export async function fetchItems(): Promise<ItemsResponse> {
  const response = await fetch(`${BASE_URL}/items`);
  if (!response.ok) {
    throw new Error('Failed to fetch items');
  }
  return response.json();
}

export async function fetchCompositeItems(): Promise<CompositeItemsResponse> {
  const response = await fetch(`${BASE_URL}/composite-items`);
  if (!response.ok) {
    throw new Error('Failed to fetch composite items');
  }
  return response.json();
}

export async function fetchTransferOrders(): Promise<TransferOrdersResponse> {
  const response = await fetch(`${BASE_URL}/transfer-orders`);
  if (!response.ok) {
    throw new Error('Failed to fetch transfer orders');
  }
  return response.json();
}

export async function fetchItemsWithStock(): Promise<ItemsWithStockResponse> {
  const response = await fetch(`${BASE_URL}/items-with-stock`);
  if (!response.ok) {
    throw new Error('Failed to fetch items with stock');
  }
  return response.json();
}
