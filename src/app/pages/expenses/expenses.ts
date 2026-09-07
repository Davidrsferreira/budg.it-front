import { DecimalPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { ExpenseDeleteDialog } from './expense-delete-dialog/expense-delete-dialog';
import { ExpenseForm } from './expense-form/expense-form';
import { Expense } from './models/expense';
import { ExpensesStore } from './services/expenses.store';
import { AccountsStore } from '../accounts/services/accounts.store';

@Component({
  selector: 'app-expenses',
  imports: [DecimalPipe, MatButtonModule, MatCardModule, MatDialogModule, MatIconModule, DatePipe],
  templateUrl: './expenses.html',
  styleUrl: './expenses.css',
})
export class Expenses {
  private readonly dialog = inject(MatDialog);

  readonly expensesStore = inject(ExpensesStore);

  readonly accountsStore = inject(AccountsStore);

  onCreateExpense(): void {
    const dialogRef = this.dialog.open(ExpenseForm, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((expense) => {
      if (!expense) {
        return;
      }

      this.expensesStore.add(expense);
    });
  }

  onEditExpense(expense: Expense): void {
    const dialogRef = this.dialog.open(ExpenseForm, {
      width: '500px',
      data: expense,
    });

    dialogRef.afterClosed().subscribe((updatedExpense) => {
      if (!updatedExpense) {
        return;
      }

      this.expensesStore.update(expense.id, updatedExpense);
    });
  }

  onDeleteExpense(expense: Expense): void {
    const dialogRef = this.dialog.open(ExpenseDeleteDialog, {
      width: '400px',
      data: expense,
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) {
        return;
      }

      this.expensesStore.remove(expense.id);
    });
  }

  getAccountName(accountId: number): string {
    return this.accountsStore.findById(accountId)?.name ?? 'Conta não encontrada';
  }
}
