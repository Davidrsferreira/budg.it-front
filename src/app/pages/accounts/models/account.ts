export type AccountType = 'checking' | 'savings' | 'cash';

export interface Account {
  id: number;
  name: string;
  institution: string;
  type: AccountType;
  balance: number;
}
