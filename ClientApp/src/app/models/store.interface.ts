import { StoreItem } from './store-item.interface';

export interface Store {
  storeId: number;
  name: string;
  items: StoreItem[];
}
