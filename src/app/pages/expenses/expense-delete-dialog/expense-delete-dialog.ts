import { Component, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { Expense } from '../models/expense';

@Component({
  selector: 'app-expense-delete-dialog',
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './expense-delete-dialog.html',
  styleUrl: './expense-delete-dialog.css',
})
export class ExpenseDeleteDialog {
  readonly expense = inject<Expense>(MAT_DIALOG_DATA);

  private readonly dialogRef = inject(MatDialogRef<ExpenseDeleteDialog>);

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
