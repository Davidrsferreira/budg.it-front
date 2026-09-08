import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { Card } from '../models/card';

@Component({
  selector: 'app-card-delete-dialog',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './card-delete-dialog.html',
  styleUrl: './card-delete-dialog.css',
})
export class CardDeleteDialog {
  private readonly dialogRef = inject(MatDialogRef<CardDeleteDialog>);

  readonly card = inject<Card>(MAT_DIALOG_DATA);

  cancel(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.dialogRef.close(true);
  }
}
