import { DecimalPipe } from '@angular/common';
import { Component, computed, signal, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { IncomeForm } from './income-form/income-form';

import { Income } from './models/income';
import { IncomeDeleteDialog } from './income-delete-dialog/income-delete-dialog';

@Component({
  selector: 'app-incomes',
  imports: [DecimalPipe, MatButtonModule, MatCardModule, MatIconModule, MatDialogModule],
  templateUrl: './incomes.html',
  styleUrl: './incomes.css',
})
export class Incomes {
  private readonly dialog = inject(MatDialog);

  readonly incomes = signal<Income[]>([
    {
      id: 1,
      description: 'Salário',
      amount: 8000,
      date: '2026-09-05',
      accountId: 1,
      category: 'Salário',
    },
    {
      id: 2,
      description: 'Freelance',
      amount: 1500,
      date: '2026-09-10',
      accountId: 1,
      category: 'Freelance',
    },
  ]);

  readonly totalIncome = computed(() =>
    this.incomes().reduce((total, income) => total + income.amount, 0),
  );

  onCreateIncome(): void {
    const dialogRef = this.dialog.open(IncomeForm, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((income) => {
      if (!income) {
        return;
      }

      this.incomes.update((incomes) => [
        ...incomes,
        {
          id: this.getNextIncomeId(incomes),
          ...income,
        },
      ]);
    });
  }

  private getNextIncomeId(incomes: Income[]): number {
    if (incomes.length === 0) {
      return 1;
    }

    return Math.max(...incomes.map((income) => income.id)) + 1;
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

      this.incomes.update((incomes) =>
        incomes.map((item) =>
          item.id === income.id
            ? {
                id: income.id,
                ...updatedIncome,
              }
            : item,
        ),
      );
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

      this.incomes.update((incomes) => incomes.filter((item) => item.id !== income.id));
    });
  }
}
