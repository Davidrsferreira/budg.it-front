import { Injectable, signal } from '@angular/core';

import { Account } from '../models/account';

@Injectable({
  providedIn: 'root',
})
export class AccountsStore {
  readonly accounts = signal<Account[]>([
    {
      id: 1,
      name: 'Conta principal',
      bank: 'Nubank',
    },
    {
      id: 2,
      name: 'Conta do dia a dia',
      bank: 'Itaú',
    },
    {
      id: 3,
      name: 'Conta secundária',
      bank: 'Banco do Brasil',
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
