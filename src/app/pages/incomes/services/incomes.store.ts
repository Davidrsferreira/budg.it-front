import { Injectable, signal } from '@angular/core';

import { Income } from '../models/income';

@Injectable({
  providedIn: 'root',
})
export class IncomesStore {
  readonly incomes = signal<Income[]>([
    {
      id: 1,
      description: 'Salário',
      amount: 8000,
      date: '2026-09-05',
      accountId: 1,
      category: 'Salário',
    },
    {
      id: 2,
      description: 'Freelance',
      amount: 1500,
      date: '2026-09-10',
      accountId: 1,
      category: 'Freelance',
    },
  ]);

  add(income: Omit<Income, 'id'>): void {
    this.incomes.update((incomes) => [
      ...incomes,
      {
        id: this.getNextId(incomes),
        ...income,
      },
    ]);
  }

  update(id: number, income: Omit<Income, 'id'>): void {
    this.incomes.update((incomes) =>
      incomes.map((item) => (item.id === id ? { id, ...income } : item)),
    );
  }

  remove(id: number): void {
    this.incomes.update((incomes) => incomes.filter((income) => income.id !== id));
  }

  private getNextId(incomes: Income[]): number {
    if (incomes.length === 0) {
      return 1;
    }

    return Math.max(...incomes.map((income) => income.id)) + 1;
  }
}
