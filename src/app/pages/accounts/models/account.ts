export type Bank = 'Nubank' | 'Itaú' | 'Banco do Brasil' | 'Inter' | 'Btg Pactual';

export interface Account {
  id: number;
  name: string;
  bank: Bank;
}
