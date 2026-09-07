import { DecimalPipe, DatePipe } from '@angular/common';
import { Component, inject, signal, computed } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { ExpenseDeleteDialog } from './expense-delete-dialog/expense-delete-dialog';
import { ExpenseForm } from './expense-form/expense-form';
import { Expense } from './models/expense';
import { ExpensesStore } from './services/expenses.store';
import { AccountsStore } from '../accounts/services/accounts.store';

@Component({
  selector: 'app-expenses',
  imports: [
    DecimalPipe,
    DatePipe,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
  ],
  templateUrl: './expenses.html',
  styleUrl: './expenses.css',
})
export class Expenses {
  private readonly dialog = inject(MatDialog);
  readonly expensesStore = inject(ExpensesStore);
  readonly accountsStore = inject(AccountsStore);
  readonly selectedCategory = signal<string>('');
  readonly startDate = signal<string>('');
  readonly endDate = signal<string>('');

  readonly categories = [
    'Moradia',
    'Alimentação',
    'Transporte',
    'Lazer',
    'Saúde',
    'Educação',
    'Outros',
  ] as const;

  readonly filteredExpenses = computed(() => {
    const expenses = this.expensesStore.expenses();

    const category = this.selectedCategory();
    const startDate = this.startDate();
    const endDate = this.endDate();

    return expenses.filter((expense) => {
      if (category && expense.category !== category) {
        return false;
      }

      if (startDate && expense.date < startDate) {
        return false;
      }

      if (endDate && expense.date > endDate) {
        return false;
      }

      return true;
    });
  });

  readonly filteredTotal = computed(() =>
    this.filteredExpenses().reduce((total, expense) => total + expense.amount, 0),
  );

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

  toDate(date: string): Date | null {
    if (!date) {
      return null;
    }

    const [year, month, day] = date.split('-').map(Number);

    return new Date(year, month - 1, day);
  }

  onStartDateChange(date: Date | null): void {
    this.startDate.set(this.toIsoDate(date));
  }

  onEndDateChange(date: Date | null): void {
    this.endDate.set(this.toIsoDate(date));
  }

  private toIsoDate(date: Date | null): string {
    if (!date) {
      return '';
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  clearFilters(): void {
    this.selectedCategory.set('');
    this.startDate.set('');
    this.endDate.set('');
  }
}
