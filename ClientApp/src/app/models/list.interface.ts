import { ListItem } from './list-item.interface';

export interface List {
  PartitionKey: string;
  RowKey: number;
  Timestamp: Date;
  ETag: string;
  name: string;
  categories: { id: number; name: string; items: ListItem[] }[];
  items: ListItem[];
}
