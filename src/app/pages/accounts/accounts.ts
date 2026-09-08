import { DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { AccountForm } from './account-form/account-form';
import { AccountDeleteDialog } from './account-delete-dialog/account-delete-dialog';
import { Account } from './models/account';
import { AccountsStore } from './services/accounts.store';
import { AccountBalanceService } from './services/account-balance.service';
@Component({
  imports: [DecimalPipe, MatCardModule, MatIconModule, MatChipsModule, MatButtonModule],
  selector: 'app-accounts',
  styleUrl: './accounts.css',
  templateUrl: './accounts.html',
})
export class Accounts {
  private readonly dialog = inject(MatDialog);

  readonly accountsStore = inject(AccountsStore);
  readonly accountBalanceService = inject(AccountBalanceService);

  getAccountTypeLabel(type: Account['type']): string {
    switch (type) {
      case 'checking':
        return 'Conta corrente';

      case 'savings':
        return 'Poupança';

      case 'cash':
        return 'Dinheiro';
    }
  }

  onCreateAccount(): void {
    const dialogRef = this.dialog.open(AccountForm, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((account) => {
      if (!account) {
        return;
      }

      this.accountsStore.add(account);
    });
  }

  onEditAccount(account: Account): void {
    const dialogRef = this.dialog.open(AccountForm, {
      width: '500px',
      data: account,
    });

    dialogRef.afterClosed().subscribe((updatedAccount) => {
      if (!updatedAccount) {
        return;
      }

      this.accountsStore.update(account.id, updatedAccount);
    });
  }

  onDeleteAccount(account: Account): void {
    const dialogRef = this.dialog.open(AccountDeleteDialog, {
      width: '400px',
      data: account,
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) {
        return;
      }

      this.accountsStore.remove(account.id);
    });
  }
}
