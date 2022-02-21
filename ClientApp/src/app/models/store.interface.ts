import { StoreItem } from './store-item.interface';

export interface Store {
  PartitionKey: string;
  RowKey: number;
  Timestamp: Date;
  ETag: string;
  name: string;
  categories: { id: number; name: string; items: StoreItem[] }[];
  items: StoreItem[];
}
