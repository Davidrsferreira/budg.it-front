import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { ExpenseDeleteDialog } from './expense-delete-dialog/expense-delete-dialog';
import { ExpenseForm } from './expense-form/expense-form';
import { Expense } from './models/expense';

@Component({
  selector: 'app-expenses',
  imports: [DecimalPipe, MatButtonModule, MatCardModule, MatDialogModule, MatIconModule],
  templateUrl: './expenses.html',
  styleUrl: './expenses.css',
})
export class Expenses {
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

  private readonly dialog = inject(MatDialog);

  onCreateExpense(): void {
    const dialogRef = this.dialog.open(ExpenseForm, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((expense) => {
      if (!expense) {
        return;
      }

      this.expenses.update((expenses) => [
        ...expenses,
        {
          id: this.getNextExpenseId(expenses),
          ...expense,
        },
      ]);
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

      this.expenses.update((expenses) =>
        expenses.map((item) =>
          item.id === expense.id
            ? {
                id: expense.id,
                ...updatedExpense,
              }
            : item,
        ),
      );
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

      this.expenses.update((expenses) => expenses.filter((item) => item.id !== expense.id));
    });
  }

  private getNextExpenseId(expenses: Expense[]): number {
    if (expenses.length === 0) {
      return 1;
    }

    return Math.max(...expenses.map((expense) => expense.id)) + 1;
  }
}
