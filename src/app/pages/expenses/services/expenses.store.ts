import { computed, Injectable, signal } from '@angular/core';

import { Expense } from '../models/expense';

@Injectable({
  providedIn: 'root',
})
export class ExpensesStore {
  readonly expenses = signal<Expense[]>([
    {
      id: 1,
      description: 'Aluguel',
      amount: 2000,
      date: '2026-09-05',
      accountId: 1,
      category: 'Moradia',
    },
    {
      id: 2,
      description: 'Supermercado',
      amount: 850,
      date: '2026-09-06',
      accountId: 1,
      category: 'Alimentação',
    },
    {
      id: 3,
      description: 'Internet',
      amount: 120,
      date: '2026-09-07',
      accountId: 1,
      category: 'Moradia',
    },
  ]);

  readonly totalExpenses = computed(() =>
    this.expenses().reduce((total, expense) => total + expense.amount, 0),
  );

  add(expense: Omit<Expense, 'id'>): void {
    this.expenses.update((expenses) => [
      ...expenses,
      {
        id: this.getNextId(expenses),
        ...expense,
      },
    ]);
  }

  update(id: number, expense: Omit<Expense, 'id'>): void {
    this.expenses.update((expenses) =>
      expenses.map((item) => (item.id === id ? { id, ...expense } : item)),
    );
  }

  remove(id: number): void {
    this.expenses.update((expenses) => expenses.filter((expense) => expense.id !== id));
  }

  private getNextId(expenses: Expense[]): number {
    if (expenses.length === 0) {
      return 1;
    }

    return Math.max(...expenses.map((expense) => expense.id)) + 1;
  }
}
