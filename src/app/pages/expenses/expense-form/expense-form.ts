import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { CurrencyDirective } from '../../../shared/directives/currency/currency.directive';
import { AccountsStore } from '../../accounts/services/accounts.store';
import { Expense } from '../models/expense';

@Component({
  selector: 'app-expense-form',
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    CurrencyDirective,
  ],
  templateUrl: './expense-form.html',
  styleUrl: './expense-form.css',
})
export class ExpenseForm {
  private readonly formBuilder = inject(FormBuilder);

  private readonly dialogRef = inject(MatDialogRef<ExpenseForm>);

  readonly accountsStore = inject(AccountsStore);

  readonly expense = inject<Expense | null>(MAT_DIALOG_DATA, {
    optional: true,
  });

  readonly form = this.formBuilder.nonNullable.group({
    description: [this.expense?.description ?? '', Validators.required],
    amount: [this.expense?.amount ?? 0, [Validators.required, Validators.min(0.01)]],
    date: [this.expense?.date ?? this.getToday(), Validators.required],
    accountId: [this.expense?.accountId ?? null, Validators.required],
    category: [this.expense?.category ?? '', Validators.required],
  });

  get isEditMode(): boolean {
    return this.expense !== null;
  }

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
}
