import { computed, inject, Injectable } from '@angular/core';

import { AccountsStore } from './accounts.store';
import { IncomesStore } from '../../incomes/services/incomes.store';
import { ExpensesStore } from '../../expenses/services/expenses.store';

@Injectable({
  providedIn: 'root',
})
export class AccountBalanceService {
  private readonly accountsStore = inject(AccountsStore);
  private readonly incomesStore = inject(IncomesStore);
  private readonly expensesStore = inject(ExpensesStore);

  readonly balances = computed(() => {
    const incomes = this.incomesStore.incomes();
    const expenses = this.expensesStore.expenses();

    return new Map(
      this.accountsStore.accounts().map((account) => {
        const incomeTotal = incomes
          .filter((income) => income.accountId === account.id)
          .reduce((total, income) => total + income.amount, 0);

        const expenseTotal = expenses
          .filter((expense) => expense.accountId === account.id)
          .reduce((total, expense) => total + expense.amount, 0);

        const balance = account.balance + incomeTotal - expenseTotal;

        return [account.id, balance];
      }),
    );
  });
}
