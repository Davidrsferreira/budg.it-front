import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { Card } from '../models/card';
import { CurrencyDirective } from '../../../shared/directives/currency/currency.directive';

@Component({
  selector: 'app-card-form',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    CurrencyDirective,
  ],
  templateUrl: './card-form.html',
  styleUrl: './card-form.css',
})
export class CardForm {
  private readonly formBuilder = inject(FormBuilder);

  private readonly dialogRef = inject(MatDialogRef<CardForm>);

  readonly card = inject<Card | undefined>(MAT_DIALOG_DATA, { optional: true });

  readonly form = this.formBuilder.nonNullable.group({
    name: [this.card?.name ?? '', Validators.required],
    institution: [this.card?.institution ?? '', Validators.required],
    limit: [this.card?.limit ?? 0, [Validators.required, Validators.min(0.01)]],
    closingDay: [
      this.card?.closingDay ?? 1,
      [Validators.required, Validators.min(1), Validators.max(31)],
    ],
    dueDay: [this.card?.dueDay ?? 10, [Validators.required, Validators.min(1), Validators.max(31)]],
  });

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.dialogRef.close(this.form.getRawValue());
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
