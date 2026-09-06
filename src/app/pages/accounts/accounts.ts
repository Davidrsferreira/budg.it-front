import { DecimalPipe } from '@angular/common';
import { Component, inject, signal, computed } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { AccountForm } from './account-form/account-form';
import { AccountDeleteDialog } from './account-delete-dialog/account-delete-dialog';
import { Account } from './models/account';
@Component({
  imports: [DecimalPipe, MatCardModule, MatIconModule, MatChipsModule, MatButtonModule],
  selector: 'app-accounts',
  styleUrl: './accounts.css',
  templateUrl: './accounts.html',
})
export class Accounts {
  private readonly dialog = inject(MatDialog);

  readonly accounts = signal<Account[]>([
    {
      id: 1,
      name: 'Conta Corrente',
      institution: 'Banco Principal',
      type: 'checking',
      balance: 8500,
    },
    {
      id: 2,
      name: 'Poupança',
      institution: 'Banco Principal',
      type: 'savings',
      balance: 3200,
    },
    {
      id: 3,
      name: 'Carteira',
      institution: 'Dinheiro físico',
      type: 'cash',
      balance: 750,
    },
  ]);

  readonly totalBalance = computed(() =>
    this.accounts().reduce((total, account) => total + account.balance, 0),
  );

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

      this.accounts.update((accounts) => [
        ...accounts,
        {
          id: this.getNextAccountId(accounts),
          ...account,
        },
      ]);
    });
  }

  private getNextAccountId(accounts: Account[]): number {
    if (accounts.length === 0) {
      return 1;
    }

    return Math.max(...accounts.map((account) => account.id)) + 1;
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

      this.accounts.update((accounts) =>
        accounts.map((item) =>
          item.id === account.id
            ? {
                id: account.id,
                ...updatedAccount,
              }
            : item,
        ),
      );
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

      this.accounts.update((accounts) => accounts.filter((item) => item.id !== account.id));
    });
  }
}
