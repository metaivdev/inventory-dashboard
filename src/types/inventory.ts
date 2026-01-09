export interface InventoryItem {
  item_id: string;
  name: string;
  item_name: string;
  unit: string;
  status: string;
  source: string;
  is_combo_product: boolean;
  is_linked_with_zohocrm: boolean;
  description: string;
  brand: string;
  manufacturer: string;
  rate: number;
  tax_id: string;
  tax_name: string;
  tax_percentage: number;
  purchase_account_id: string;
  purchase_account_name: string;
  account_id: string;
  account_name: string;
  purchase_description: string;
  purchase_rate: number;
  can_be_sold: boolean;
  can_be_purchased: boolean;
  track_inventory: boolean;
  item_type: string;
  product_type: string;
  stock_on_hand: number;
  has_attachment: boolean;
  is_returnable: boolean;
  available_stock: number;
  actual_available_stock: number;
  sku: string;
  upc: string;
  ean: string;
  isbn: string;
  part_number: string;
  reorder_level: string;
  image_name: string;
  image_type: string;
  image_document_id: string;
  created_time: string;
  last_modified_time: string;
  weight_unit: string;
  dimension_unit: string;
  tags: Array<{
    tag_option_id: string;
    is_tag_mandatory: boolean;
    tag_name: string;
    tag_id: string;
    tag_option_name: string;
  }>;
  group_id?: string;
  group_name?: string;
}

export interface CompositeItem {
  composite_item_id: string;
  name: string;
  unit: string;
  status: string;
  source: string;
  is_linked_with_zohocrm: boolean;
  description: string;
  brand: string;
  manufacturer: string;
  rate: number;
  tax_id: string;
  tax_name: string;
  tax_percentage: number;
  purchase_description: string;
  purchase_rate: number;
  is_combo_product: boolean;
  assembly_type: string;
  combo_type: string;
  can_be_sold: boolean;
  can_be_purchased: boolean;
  track_inventory: boolean;
  item_type: string;
  is_returnable: boolean;
  stock_on_hand: number;
  available_stock: number;
  actual_available_stock: number;
  track_serial_number: boolean;
  sku: string;
  upc: string;
  ean: string;
  isbn: string;
  part_number: string;
  reorder_level: string;
  image_name: string;
  image_type: string;
  image_document_id: string;
  purchase_account_id: string;
  purchase_account_name: string;
  account_id: string;
  account_name: string;
  weight_unit: string;
  dimension_unit: string;
  created_time: string;
  last_modified_time: string;
}

export interface ItemsResponse {
  ok: boolean;
  items: InventoryItem[];
}

export interface CompositeItemsResponse {
  ok: boolean;
  compositeItems: CompositeItem[];
}

export interface TransferOrder {
  transfer_order_id: string;
  transfer_order_number: string;
  date: string;
  description: string;
  created_time: string;
  last_modified_time: string;
  created_by_id: string;
  created_by_name: string;
  last_modified_by_id: string;
  last_modified_by_name: string;
  quantity_transfer: number;
  quantity_transferred: number;
  from_location_id: string;
  from_location_name: string;
  to_location_id: string;
  to_location_name: string;
  status: string;
}

export interface TransferOrdersResponse {
  ok: boolean;
  transferOrders: TransferOrder[];
}

export interface ItemLocation {
  location_id: string;
  location_name: string;
  is_primary: boolean;
  is_item_mapped: boolean;
  location_stock_on_hand: number;
  location_available_stock: number;
  location_actual_available_stock: number;
  location_committed_stock: number;
  location_actual_committed_stock: number;
  location_available_for_sale_stock: number;
  location_actual_available_for_sale_stock: number;
}

export interface ItemWithStock {
  _id: string;
  item_id: string;
  name: string;
  sku: string;
  unit: string | null;
  stock_on_hand: number;
  available_stock: number;
  locations: ItemLocation[];
}

export interface ItemsWithStockResponse {
  count: number;
  items: ItemWithStock[];
}
