import { computed, inject, Injectable } from '@angular/core';

import { AccountsStore } from './accounts.store';

const MOCK_BALANCES = new Map<number, number>([
  [1, 8500],
  [2, 3200],
  [3, 750],
]);

@Injectable({
  providedIn: 'root',
})
export class AccountBalanceService {
  private readonly accountsStore = inject(AccountsStore);

  readonly balances = computed(() => {
    return new Map(
      this.accountsStore.accounts().map((account) => [account.id, MOCK_BALANCES.get(account.id) ?? 0]),
    );
  });
}
