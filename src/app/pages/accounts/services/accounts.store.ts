import { Injectable, signal } from '@angular/core';

import { Account } from '../models/account';

@Injectable({
  providedIn: 'root',
})
export class AccountsStore {
  readonly accounts = signal<Account[]>([
    {
      id: 1,
      name: 'Conta Corrente',
      institution: 'Banco Principal',
      type: 'checking',
      balance: 8500,
    },
    {
      id: 2,
      name: 'Poupança',
      institution: 'Banco Principal',
      type: 'savings',
      balance: 3200,
    },
    {
      id: 3,
      name: 'Carteira',
      institution: 'Dinheiro físico',
      type: 'cash',
      balance: 750,
    },
  ]);

  add(account: Omit<Account, 'id'>): void {
    this.accounts.update((accounts) => [
      ...accounts,
      {
        id: this.getNextId(accounts),
        ...account,
      },
    ]);
  }

  update(id: number, account: Omit<Account, 'id'>): void {
    this.accounts.update((accounts) =>
      accounts.map((item) =>
        item.id === id
          ? {
              id,
              ...account,
            }
          : item,
      ),
    );
  }

  remove(id: number): void {
    this.accounts.update((accounts) => accounts.filter((account) => account.id !== id));
  }

  findById(id: number): Account | undefined {
    return this.accounts().find((account) => account.id === id);
  }

  private getNextId(accounts: Account[]): number {
    if (accounts.length === 0) {
      return 1;
    }

    return Math.max(...accounts.map((account) => account.id)) + 1;
  }
}
