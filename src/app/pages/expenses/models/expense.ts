export type PaymentMethod = 'debit' | 'credit';

export interface Expense {
  id: number;
  description: string;
  amount: number;
  date: string;
  paymentMethod: PaymentMethod;
  accountId: number | null;
  cardId: number | null;
  installments: number;
  installmentAmount: number;
  category: string;
}
