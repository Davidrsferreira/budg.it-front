import { DecimalPipe, DatePipe } from '@angular/common';
import { Component, inject, computed, signal } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { IncomeForm } from './income-form/income-form';

import { Income } from './models/income';
import { IncomeDeleteDialog } from './income-delete-dialog/income-delete-dialog';
import { IncomesStore } from './services/incomes.store';
import { AccountsStore } from '../accounts/services/accounts.store';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-incomes',
  imports: [
    DecimalPipe,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
    DatePipe,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
  ],
  templateUrl: './incomes.html',
  styleUrl: './incomes.css',
})
export class Incomes {
  private readonly dialog = inject(MatDialog);
  readonly incomesStore = inject(IncomesStore);
  readonly accountsStore = inject(AccountsStore);
  readonly selectedCategory = signal<string>('');
  readonly startDate = signal<string>('');
  readonly endDate = signal<string>('');
  readonly categories = ['Salário', 'Freelance', 'Investimentos', 'Outros'] as const;

  readonly filteredIncomes = computed(() => {
    const incomes = this.incomesStore.incomes();

    const category = this.selectedCategory();
    const startDate = this.startDate();
    const endDate = this.endDate();

    return incomes.filter((income) => {
      if (category && income.category !== category) {
        return false;
      }

      if (startDate && income.date < startDate) {
        return false;
      }

      if (endDate && income.date > endDate) {
        return false;
      }

      return true;
    });
  });

  readonly filteredTotal = computed(() =>
    this.filteredIncomes().reduce((total, income) => total + income.amount, 0),
  );

  onCreateIncome(): void {
    const dialogRef = this.dialog.open(IncomeForm, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((income) => {
      if (!income) {
        return;
      }

      this.incomesStore.add(income);
    });
  }

  onEditIncome(income: Income): void {
    const dialogRef = this.dialog.open(IncomeForm, {
      width: '500px',
      data: income,
    });

    dialogRef.afterClosed().subscribe((updatedIncome) => {
      if (!updatedIncome) {
        return;
      }

      this.incomesStore.update(income.id, updatedIncome);
    });
  }

  onDeleteIncome(income: Income): void {
    const dialogRef = this.dialog.open(IncomeDeleteDialog, {
      width: '400px',
      data: income,
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) {
        return;
      }

      this.incomesStore.remove(income.id);
    });
  }

  getAccountName(accountId: number): string {
    return this.accountsStore.findById(accountId)?.name ?? 'Conta não encontrada';
  }

  clearFilters(): void {
    this.selectedCategory.set('');
    this.startDate.set('');
    this.endDate.set('');
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
}
