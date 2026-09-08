import { DecimalPipe, DatePipe } from '@angular/common';
import { Component, inject, signal, computed } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';

import { ExpenseDeleteDialog } from './expense-delete-dialog/expense-delete-dialog';
import { ExpenseForm } from './expense-form/expense-form';
import { Expense } from './models/expense';
import { ExpensesStore } from './services/expenses.store';
import { AccountsStore } from '../accounts/services/accounts.store';
import { CardsStore } from '../cards/services/cards.store';

@Component({
  selector: 'app-expenses',
  providers: [
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: { dateInput: 'MM/yyyy' },
        display: {
          dateInput: 'MM/yyyy',
          monthYearLabel: 'MMM yyyy',
          dateA11yLabel: 'MMMM yyyy',
          monthYearA11yLabel: 'MMMM yyyy',
        },
      },
    },
  ],
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
    MatExpansionModule,
    MatTableModule,
  ],
  templateUrl: './expenses.html',
  styleUrl: './expenses.css',
})
export class Expenses {
  private readonly dialog = inject(MatDialog);
  readonly expensesStore = inject(ExpensesStore);
  readonly accountsStore = inject(AccountsStore);
  readonly cardsStore = inject(CardsStore);
  readonly selectedCategory = signal<string>('');
  readonly selectedMonth = signal<string>(this.toIsoMonth(new Date()));
  readonly displayedColumns = ['categoryIcon', 'description', 'amount', 'date', 'account', 'actions'];

  readonly categories = [
    'Moradia',
    'Alimentação',
    'Transporte',
    'Lazer',
    'Saúde',
    'Educação',
    'Outros',
  ] as const;

  private readonly categoryIcons: Record<string, string> = {
    Moradia: 'home',
    Alimentação: 'restaurant',
    Transporte: 'directions_car',
    Lazer: 'celebration',
    Saúde: 'health_and_safety',
    Educação: 'school',
    Outros: 'category',
  };

  readonly filteredExpenses = computed(() => {
    const expenses = this.expensesStore.expenses();

    const category = this.selectedCategory();
    const month = this.selectedMonth();

    return expenses.filter((expense) => {
      if (category && expense.category !== category) {
        return false;
      }

      if (month && !expense.date.startsWith(month)) {
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

  getPaymentTarget(expense: Expense): string {
    if (expense.paymentMethod === 'credit') {
      return this.cardsStore.findById(expense.cardId ?? 0)?.name ?? 'Cartão não encontrado';
    }

    return this.accountsStore.findById(expense.accountId ?? 0)?.name ?? 'Conta não encontrada';
  }

  getCategoryIcon(category: string): string {
    return this.categoryIcons[category] ?? 'category';
  }

  toDate(month: string): Date | null {
    if (!month) {
      return null;
    }

    const [year, monthNumber] = month.split('-').map(Number);

    return new Date(year, monthNumber - 1, 1);
  }

  onYearSelected(date: Date): void {
    const [, month] = this.selectedMonth().split('-');
    this.selectedMonth.set(`${date.getFullYear()}-${month}`);
  }

  onMonthSelected(date: Date, datepicker: MatDatepicker<Date>): void {
    this.selectedMonth.set(this.toIsoMonth(date));
    datepicker.close();
  }

  clearFilters(): void {
    this.selectedCategory.set('');
    this.selectedMonth.set(this.toIsoMonth(new Date()));
  }

  private toIsoMonth(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');

    return `${year}-${month}`;
  }
}
