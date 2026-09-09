import { DecimalPipe, DatePipe } from '@angular/common';
import { Component, inject, computed, signal } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { IncomeForm } from './income-form/income-form';

import { Income } from './models/income';
import { IncomeDeleteDialog } from './income-delete-dialog/income-delete-dialog';
import { IncomesStore } from './services/incomes.store';
import { AccountsStore } from '../accounts/services/accounts.store';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-incomes',
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
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
    DatePipe,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatTableModule,
  ],
  templateUrl: './incomes.html',
  styleUrl: './incomes.css',
})
export class Incomes {
  private readonly dialog = inject(MatDialog);
  readonly incomesStore = inject(IncomesStore);
  readonly accountsStore = inject(AccountsStore);
  readonly selectedCategory = signal<string>('');
  readonly selectedMonth = signal<string>(this.toIsoMonth(new Date()));
  readonly categories = ['Salário', 'Freelance', 'Investimentos', 'Outros'] as const;
  readonly displayedColumns = ['categoryIcon', 'description', 'amount', 'date', 'account', 'actions'];

  private readonly categoryIcons: Record<string, string> = {
    Salário: 'work',
    Freelance: 'handyman',
    Investimentos: 'trending_up',
    Outros: 'category',
  };

  readonly filteredIncomes = computed(() => {
    const incomes = this.incomesStore.incomes();

    const category = this.selectedCategory();
    const month = this.selectedMonth();

    return incomes.filter((income) => {
      if (category && income.category !== category) {
        return false;
      }

      if (month && !income.date.startsWith(month)) {
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

  getCategoryIcon(category: string): string {
    return this.categoryIcons[category] ?? 'category';
  }

  clearFilters(): void {
    this.selectedCategory.set('');
    this.selectedMonth.set(this.toIsoMonth(new Date()));
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

  private toIsoMonth(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');

    return `${year}-${month}`;
  }
}
