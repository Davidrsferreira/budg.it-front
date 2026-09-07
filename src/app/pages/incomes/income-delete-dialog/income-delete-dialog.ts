import { Component, inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { MatButtonModule } from '@angular/material/button';

import { Income } from '../models/income';

@Component({
  selector: 'app-income-delete-dialog',
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './income-delete-dialog.html',
  styleUrl: './income-delete-dialog.css',
})
export class IncomeDeleteDialog {
  readonly income = inject<Income>(MAT_DIALOG_DATA);

  private readonly dialogRef = inject(MatDialogRef<IncomeDeleteDialog>);

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
