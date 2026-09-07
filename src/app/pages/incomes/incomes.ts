import { DecimalPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { IncomeForm } from './income-form/income-form';

import { Income } from './models/income';
import { IncomeDeleteDialog } from './income-delete-dialog/income-delete-dialog';
import { IncomesStore } from './services/incomes.store';
import { AccountsStore } from '../accounts/services/accounts.store';

@Component({
  selector: 'app-incomes',
  imports: [DecimalPipe, MatButtonModule, MatCardModule, MatIconModule, MatDialogModule, DatePipe],
  templateUrl: './incomes.html',
  styleUrl: './incomes.css',
})
export class Incomes {
  private readonly dialog = inject(MatDialog);

  readonly incomesStore = inject(IncomesStore);

  readonly accountsStore = inject(AccountsStore);

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
}
