import { StoreItem } from './store-item.interface';

export interface Store {
  PartitionKey: string;
  RowKey: number;
  Timestamp: Date;
  ETag: string;
  name: string;
  items: StoreItem[];
}
