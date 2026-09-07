import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { Account } from '../models/account';

@Component({
  selector: 'app-account-delete-dialog',
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './account-delete-dialog.html',
  styleUrl: './account-delete-dialog.css',
})
export class AccountDeleteDialog {
  readonly account = inject<Account>(MAT_DIALOG_DATA);

  private readonly dialogRef = inject(MatDialogRef<AccountDeleteDialog>);

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
