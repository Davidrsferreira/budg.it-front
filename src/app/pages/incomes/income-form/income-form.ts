import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { CurrencyDirective } from '../../../shared/directives/currency/currency.directive';
import { Income } from '../models/income';

@Component({
  selector: 'app-income-form',
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    CurrencyDirective,
  ],
  templateUrl: './income-form.html',
  styleUrl: './income-form.css',
})
export class IncomeForm {
  readonly income = inject<Income | null>(MAT_DIALOG_DATA, {
    optional: true,
  });

  private readonly formBuilder = inject(FormBuilder);

  private readonly dialogRef = inject(MatDialogRef<IncomeForm>);

  readonly form = this.formBuilder.nonNullable.group({
    description: [this.income?.description ?? '', Validators.required],
    amount: [this.income?.amount ?? 0, [Validators.required, Validators.min(0.01)]],
    date: [this.income?.date ?? this.getToday(), Validators.required],
    accountId: [this.income?.accountId ?? 1, Validators.required],
    category: [this.income?.category ?? '', Validators.required],
  });

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.dialogRef.close(this.form.getRawValue());
  }

  private getToday(): string {
    return new Date().toISOString().split('T')[0];
  }

  get isEditMode(): boolean {
    return this.income !== null;
  }
}
