import { Bank } from '../../accounts/models/account';

export interface Card {
  id: number;
  name: string;
  bank: Bank;
  limit: number;
  closingDay: number;
  dueDay: number;
}
